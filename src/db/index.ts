import Database from 'better-sqlite3';
import { User } from '../types/User';
import { Plant } from '../types/Plant';

const db = new Database('plantcare.db');

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS plants (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    name TEXT NOT NULL,
    species TEXT NOT NULL,
    wateringFrequency INTEGER NOT NULL,
    lastWatered TEXT NOT NULL,
    health TEXT NOT NULL,
    image TEXT,
    notes TEXT,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`);

export const userDb = {
  create: db.prepare(`
    INSERT INTO users (id, email, password)
    VALUES (?, ?, ?)
  `),

  findByEmail: db.prepare(`
    SELECT * FROM users WHERE email = ?
  `),

  findById: db.prepare(`
    SELECT * FROM users WHERE id = ?
  `)
};

export const plantDb = {
  create: db.prepare(`
    INSERT INTO plants (id, userId, name, species, wateringFrequency, lastWatered, health, image, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),

  update: db.prepare(`
    UPDATE plants
    SET name = ?, species = ?, wateringFrequency = ?, lastWatered = ?, health = ?, image = ?, notes = ?
    WHERE id = ? AND userId = ?
  `),

  delete: db.prepare(`
    DELETE FROM plants WHERE id = ? AND userId = ?
  `),

  getAllByUserId: db.prepare(`
    SELECT * FROM plants WHERE userId = ?
  `),

  getById: db.prepare(`
    SELECT * FROM plants WHERE id = ? AND userId = ?
  `)
};

export function createUser(email: string, password: string): User {
  const id = crypto.randomUUID();
  userDb.create.run(id, email, password);
  return { id, email };
}

export function findUserByEmail(email: string): User | null {
  const user = userDb.findByEmail.get(email);
  return user ? { id: user.id, email: user.email } : null;
}

export function validateUser(email: string, password: string): User | null {
  const user = userDb.findByEmail.get(email);
  if (user && user.password === password) {
    return { id: user.id, email: user.email };
  }
  return null;
}

export function getUserPlants(userId: string): Plant[] {
  return plantDb.getAllByUserId.all(userId);
}

export function createPlant(userId: string, plant: Omit<Plant, 'id'>): Plant {
  const id = crypto.randomUUID();
  const newPlant = { id, ...plant };
  plantDb.create.run(
    id,
    userId,
    plant.name,
    plant.species,
    plant.wateringFrequency,
    plant.lastWatered,
    plant.health,
    plant.image || null,
    plant.notes || null
  );
  return newPlant;
}

export function updatePlant(userId: string, plant: Plant): boolean {
  const result = plantDb.update.run(
    plant.name,
    plant.species,
    plant.wateringFrequency,
    plant.lastWatered,
    plant.health,
    plant.image || null,
    plant.notes || null,
    plant.id,
    userId
  );
  return result.changes > 0;
}

export function deletePlant(userId: string, plantId: string): boolean {
  const result = plantDb.delete.run(plantId, userId);
  return result.changes > 0;
}