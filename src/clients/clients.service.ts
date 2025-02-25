import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class ClientsService {
  constructor(@InjectRepository(Client) private readonly clientRepository: Repository<Client>,) { }
  create(createClientDto: CreateClientDto): Promise<Client> {
    const client: Client = new Client()
    client.name = createClientDto.name;
    client.enterprisePrice = createClientDto.enterprisePrice;
    client.salary = createClientDto.salary;
    return this.clientRepository.save(client);
  }

  findAll(): Promise<Client[]> {
    return this.clientRepository.find();
  }

  async findOne(id: number): Promise<Client | null> {
    const client = await this.clientRepository.findOneBy({ id });
    if (!client) {
      throw new NotFoundException(`O Cliente com o ID: ${id} não foi encontrado na nossa base de dados. `)
    }
    return client
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
