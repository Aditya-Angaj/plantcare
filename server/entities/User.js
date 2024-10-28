import { EntitySchema } from 'typeorm';

export const User = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      primary: true,
      type: 'varchar',
      generated: 'uuid',
    },
    email: {
      type: 'varchar',
      unique: true,
    },
    password: {
      type: 'varchar',
    },
    createdAt: {
      type: 'timestamp',
      createDate: true,
    },
    updatedAt: {
      type: 'timestamp',
      updateDate: true,
    },
  },
  relations: {
    plants: {
      type: 'one-to-many',
      target: 'Plant',
      inverseSide: 'user',
      cascade: true,
    },
  },
  indices: [
    {
      name: 'IDX_USER_EMAIL',
      columns: ['email'],
      unique: true,
    },
  ],
});