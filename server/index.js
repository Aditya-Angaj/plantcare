import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { DataSource } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from './entities/User.js';
import { Plant } from './entities/Plant.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'plantcare',
  synchronize: true,
  entities: [User, Plant],
  logging: true
});

const errorHandler = (err, req, res, next) => {
  console.error('Server error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Invalid authentication token' });
  }
  
  res.status(500).json({ error: 'An unexpected error occurred' });
};

const initializeDatabase = async () => {
  try {
    await dataSource.initialize();
    console.log('Database connection established');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

await initializeDatabase();

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Authentication token is required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    next(error);
  }
};

const validateAuthInput = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  next();
};

const userRepository = dataSource.getRepository(User);
const plantRepository = dataSource.getRepository(Plant);

app.post('/api/auth/register', validateAuthInput, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.save({
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({ 
      user: { id: user.id, email: user.email }, 
      token 
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/login', validateAuthInput, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({ 
      user: { id: user.id, email: user.email }, 
      token 
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/plants', authenticateToken, async (req, res, next) => {
  try {
    const plants = await plantRepository.find({
      where: { userId: req.user.id },
    });
    res.json(plants);
  } catch (error) {
    next(error);
  }
});

app.post('/api/plants', authenticateToken, async (req, res, next) => {
  try {
    const plant = await plantRepository.save({
      ...req.body,
      userId: req.user.id,
    });
    res.json(plant);
  } catch (error) {
    next(error);
  }
});

app.put('/api/plants/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const plant = await plantRepository.findOne({
      where: { id, userId: req.user.id },
    });

    if (!plant) {
      return res.status(404).json({ error: 'Plant not found' });
    }

    await plantRepository.update(id, req.body);
    const updatedPlant = await plantRepository.findOne({
      where: { id }
    });
    res.json(updatedPlant);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/plants/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await plantRepository.delete({
      id,
      userId: req.user.id,
    });

    if (result.affected === 0) {
      return res.status(404).json({ error: 'Plant not found' });
    }

    res.json({ message: 'Plant deleted successfully' });
  } catch (error) {
    next(error);
  }
});

if (process.env.NODE_ENV === 'production') {
  const distPath = join(__dirname, '../dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
}

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});