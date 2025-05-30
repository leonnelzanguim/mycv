import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './users/entities/user.entity';
import { Report } from './reports/entities/report.entity';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

export default new DataSource({
  type: process.env.DB_TYPE as any,
  database: process.env.DB_NAME,
  entities: [User, Report],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
});
