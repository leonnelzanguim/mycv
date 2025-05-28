import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UserService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('should create a new user with a salted and hashed password', async () => {
    const user = await service.signup('leon@test.com', 'mypassword');

    expect(user).toBeDefined();
    expect(user.password).not.toEqual('mypassword'); // ✅ hashé
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: 'pass' } as User]);

    await expect(service.signup('test@test.com', 'fewifjew')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        { email: 'asdf@asdf.com', password: 'passowrd' } as User,
      ]);
    await expect(
      service.signin('laskdjf@alskdfj.com', 'passowrd'),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns a user if correct password is provided', async () => {
    const salt = 'xyz456';
    const hash = (await scrypt('mypassword', salt, 32)) as Buffer;
    const password = `${salt}.${hash.toString('hex')}`;

    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'me@test.com', password } as User]);

    const user = await service.signin('me@test.com', 'mypassword');
    expect(user).toBeDefined();
    expect(user.email).toEqual('me@test.com');
  });
});
