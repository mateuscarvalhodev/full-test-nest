import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,) { }
  async create(createUserDto: CreateUserDto): Promise<User> {
    const prevUser = await this.userRepository.findOne({ where: { name: createUserDto.name } })
    if (prevUser) {
      return prevUser
    }
    const user: User = new User()
    user.name = createUserDto.name
    return this.userRepository.save(user);
  }
}
