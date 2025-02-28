import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { logger } from '../config/winston.config';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const user = await this.userRepository.findOneBy({ id: createClientDto.userId });

    if (!user) {
      logger.error('Falha ao criar cliente', {
        context: 'ClientsService',
        error: 'Usuário não encontrado.',
        createClientDto,
      });
      throw new NotFoundException('Não foi encontrado o usuário.');
    }

    const client = new Client();
    client.name = createClientDto.name;
    client.salary = createClientDto.salary;
    client.enterprisePrice = createClientDto.enterprisePrice;
    client.createdBy = user;

    const savedClient = await this.clientRepository.save(client);

    logger.info('Cliente criado com sucesso', {
      context: 'ClientsService',
      clientId: savedClient.id,
      userId: user.id,
    });

    return savedClient;
  }

  async findAll(userId: number): Promise<Client[]> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user || !userId) {
      logger.error('Falha ao buscar clientes', {
        context: 'ClientsService',
        error: 'Usuário não encontrado.',
        userId,
      });
      throw new NotFoundException('Não foi encontrado o usuário.');
    }

    const clients = await this.clientRepository.find({
      where: { createdBy: { id: userId } },
      relations: ['createdBy'],
    });

    logger.info('Clientes encontrados com sucesso', {
      context: 'ClientsService',
      userId,
      totalClients: clients.length,
    });

    return clients;
  }

  async update(id: number, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.clientRepository.findOneBy({ id });

    if (!client) {
      logger.error('Falha ao atualizar cliente', {
        context: 'ClientsService',
        error: `Cliente com ID ${id} não encontrado.`,
        updateClientDto,
      });
      throw new NotFoundException(`O Cliente com o ID: ${id} não foi encontrado na nossa base de dados.`);
    }

    const updatedClient = this.clientRepository.merge(client, updateClientDto);
    console.log({ updatedClient, updateClientDto, client })
    const savedClient = await this.clientRepository.save(updatedClient);

    logger.info('Cliente atualizado com sucesso', {
      context: 'ClientsService',
      clientId: savedClient.id,
      updateData: updateClientDto,
    });

    return savedClient;
  }

  async addToSelected(id: number): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });

    if (!client) {
      logger.error('Falha ao adicionar cliente à lista de selecionados', {
        context: 'ClientsService',
        error: `Cliente com ID ${id} não encontrado.`,
      });
      throw new NotFoundException(`O Cliente com o ID: ${id} não foi encontrado na nossa base de dados.`);
    }

    client.isSelected = true;
    const savedClient = await this.clientRepository.save(client);

    logger.info('Cliente adicionado à lista de selecionados com sucesso', {
      context: 'ClientsService',
      clientId: savedClient.id,
    });

    return savedClient;
  }

  async removeFromSelected(id: number): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });

    if (!client) {
      logger.error('Falha ao remover cliente da lista de selecionados', {
        context: 'ClientsService',
        error: `Cliente com ID ${id} não encontrado.`,
      });
      throw new NotFoundException(`O Cliente com o ID: ${id} não foi encontrado na nossa base de dados.`);
    }

    client.isSelected = false;
    const savedClient = await this.clientRepository.save(client);

    logger.info('Cliente removido da lista de selecionados com sucesso', {
      context: 'ClientsService',
      clientId: savedClient.id,
    });

    return savedClient;
  }

  async remove(id: number): Promise<{ affected?: number | null }> {
    const client = await this.clientRepository.findOneBy({ id });

    if (!client) {
      logger.error('Falha ao remover cliente', {
        context: 'ClientsService',
        error: `Cliente com ID ${id} não encontrado.`,
      });
      throw new NotFoundException(`O Cliente com o ID: ${id} não foi encontrado na nossa base de dados.`);
    }

    const result = await this.clientRepository.delete(id);

    logger.info('Cliente removido com sucesso', {
      context: 'ClientsService',
      clientId: id,
      affectedRows: result.affected,
    });

    return result;
  }
}