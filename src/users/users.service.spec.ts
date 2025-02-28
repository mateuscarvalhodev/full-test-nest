import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('create', () => {
    it('should return existing user if user already exists', async () => {
      const createUserDto: CreateUserDto = { name: 'John Doe' };
      const existingUser = { id: 1, name: 'John Doe' } as User;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(existingUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(existingUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { name: 'John Doe' } });
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it('should create and return a new user if user does not exist', async () => {
      const createUserDto: CreateUserDto = { name: 'Jane Doe' };
      const newUser = { id: 2, name: 'Jane Doe' } as User;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(userRepository, 'save').mockResolvedValue(newUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(newUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { name: 'Jane Doe' } });
      expect(userRepository.save).toHaveBeenCalledWith({ name: 'Jane Doe' });
    });
  });
});