import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }
  async create(createClientDto: CreateClientDto): Promise<Client> {
    const user = await this.userRepository.findOneBy({ id: createClientDto.userId })
    if (!user) {
      throw new NotFoundException('Não foi encontrado o usuario.')
    }
    const client = new Client();
    client.name = createClientDto.name;
    client.salary = createClientDto.salary;
    client.enterprisePrice = createClientDto.enterprisePrice;
    client.createdBy = user;
    return this.clientRepository.save(client);
  }

  async findAll(userId: number): Promise<Client[]> {
    const user = await this.userRepository.findOneBy({ id: userId })
    if (!user || !userId) {
      throw new NotFoundException('Não foi encontrado o usuario.')
    }
    return this.clientRepository.find({
      where: { createdBy: { id: userId } },
      relations: ['createdBy']
    });
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    const client = await this.clientRepository.findOneBy({ id })
    if (!client) {
      throw new NotFoundException(`O Cliente com o ID: ${id} não foi encontrado na nossa base de dados. `)
    }
    const updatedClient = this.clientRepository.merge(client, updateClientDto);
    return await this.clientRepository.save(updatedClient);
  }

  async addToSelected(id: number): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException(`O Cliente com o ID: ${id} não foi encontrado na nossa base de dados.`);
    }

    client.isSelected = true;

    return await this.clientRepository.save(client);
  }

  async removeFromSelected(id: number): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException(`O Cliente com o ID: ${id} não foi encontrado na nossa base de dados.`);
    }

    client.isSelected = false;

    return await this.clientRepository.save(client);
  }

  async remove(id: number): Promise<{ affected?: number | null }> {
    const client = await this.clientRepository.findOneBy({ id });
    if (!client) {
      throw new NotFoundException(`O Cliente com o ID: ${id} não foi encontrado na nossa base de dados. `)
    }
    return this.clientRepository.delete(id)
  }
}
