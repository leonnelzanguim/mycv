import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const env = process.env.NODE_ENV || 'development';

    const type = this.configService.get<'sqlite' | 'postgres'>('DB_TYPE');
    const synchronize = this.getBoolean('SYNCHRONIZE');
    const autoLoadEntities = true;

    const common = { type, synchronize, autoLoadEntities };

    if (env === 'production') {
      return {
        ...common,
        type: 'postgres',
        host: this.configService.get('DB_HOST'),
        port: parseInt(this.configService.get<string>('DB_PORT') || '5432'),
        username: this.configService.get('DB_USERNAME'),
        password: this.configService.get('DB_PASSWORD'),
        database: this.configService.get('DB_NAME'),
        migrationsRun: this.getBoolean('MIGRATIONS_RUN'),
        migrations: ['dist/migrations/*.js'],
        // ssl: {
        //   rejectUnauthorized: this.getBoolean('SSL') ?? false,
        // },
      };
    }

    return {
      ...common,
      database: this.configService.get('DB_NAME'),
      migrationsRun: this.getBoolean('MIGRATIONS_RUN'),
    } as TypeOrmModuleOptions;
  }

  private getBoolean(key: string): boolean {
    return this.configService.get<string>(key)?.toLowerCase() === 'true';
  }
}
