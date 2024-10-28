import { EntitySchema } from 'typeorm';

export const Plant = new EntitySchema({
  name: 'Plant',
  tableName: 'plants',
  columns: {
    id: {
      primary: true,
      type: 'varchar',
      generated: 'uuid',
    },
    userId: {
      type: 'varchar',
    },
    name: {
      type: 'varchar',
      length: 255,
    },
    species: {
      type: 'varchar',
      length: 255,
    },
    wateringFrequency: {
      type: 'int',
    },
    lastWatered: {
      type: 'timestamp',
    },
    health: {
      type: 'varchar',
      length: 50,
    },
    image: {
      type: 'varchar',
      length: 1000,
      nullable: true,
    },
    notes: {
      type: 'text',
      nullable: true,
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
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'userId',
        referencedColumnName: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  indices: [
    {
      name: 'IDX_PLANT_USER',
      columns: ['userId'],
    },
  ],
});