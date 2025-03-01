/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Client } from './entities/client.entity';
import { User } from '../users/entities/user.entity';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { NotFoundException } from '@nestjs/common';

describe('ClientsService', () => {
  let service: ClientsService;
  let clientRepository: Repository<Client>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: getRepositoryToken(Client),
          useValue: {
            findOneBy: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            merge: jest.fn((client, updateClientDto) => ({ ...client, ...updateClientDto })),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    clientRepository = module.get<Repository<Client>>(getRepositoryToken(Client));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(clientRepository).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a client successfully', async () => {
      const createClientDto: CreateClientDto = {
        name: 'John Doe',
        salary: 5000,
        enterprisePrice: 10000,
        userId: 1,
      };

      const user = { id: 1, name: 'Admin' } as User;
      const savedClient = {
        id: 1,
        ...createClientDto,
        createdBy: user,
        isSelected: false,
      } as Client;

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(clientRepository, 'save').mockResolvedValue(savedClient);

      const result = await service.create(createClientDto);
      expect(result).toEqual(savedClient);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(clientRepository.save).toHaveBeenCalledWith({
        name: 'John Doe',
        salary: 5000,
        enterprisePrice: 10000,
        createdBy: user,
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      const createClientDto: CreateClientDto = {
        name: 'John Doe',
        salary: 5000,
        enterprisePrice: 10000,
        userId: 1,
      };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.create(createClientDto)).rejects.toThrow(NotFoundException);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('findAll', () => {
    it('should return clients for a given user', async () => {
      const userId = 1;
      const user = { id: 1, name: 'Admin' } as User;
      const clients = [
        { id: 1, name: 'John Doe', createdBy: user, isSelected: false },
        { id: 2, name: 'Jane Doe', createdBy: user, isSelected: false },
      ] as Client[];

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(clientRepository, 'find').mockResolvedValue(clients);

      const result = await service.findAll(userId);

      expect(result).toEqual(clients);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
      expect(clientRepository.find).toHaveBeenCalledWith({
        where: { createdBy: { id: userId } },
        relations: ['createdBy'],
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = 1;

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.findAll(userId)).rejects.toThrow(NotFoundException);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
    });
  });

  describe('update', () => {
    it('should update a client successfully', async () => {
      const clientId = 1;
      const updateClientDto: UpdateClientDto = { name: 'Updated Name' };
      const existingClient = { id: 1, name: 'John Doe', isSelected: false } as Client;
      const updatedClient = { ...existingClient, ...updateClientDto } as Client;

      console.log()

      jest.spyOn(clientRepository, 'findOneBy').mockResolvedValue(existingClient);
      jest.spyOn(clientRepository, 'save').mockResolvedValue(updatedClient);

      const result = await service.update(clientId, updateClientDto);

      expect(result).toEqual(updatedClient);
      expect(clientRepository.findOneBy).toHaveBeenCalledWith({ id: clientId });
      expect(clientRepository.save).toHaveBeenCalledWith(updatedClient);
    });

    it('should throw NotFoundException if client is not found', async () => {
      const clientId = 1;
      const updateClientDto: UpdateClientDto = { name: 'Updated Name' };

      jest.spyOn(clientRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.update(clientId, updateClientDto)).rejects.toThrow(NotFoundException);
      expect(clientRepository.findOneBy).toHaveBeenCalledWith({ id: clientId });
    });
  });

  describe('addToSelected', () => {
    it('should add a client to the selected list', async () => {
      const clientId = 1;
      const client = { id: 1, name: 'John Doe', isSelected: false } as Client;
      const updatedClient = { ...client, isSelected: true } as Client;

      jest.spyOn(clientRepository, 'findOne').mockResolvedValue(client);
      jest.spyOn(clientRepository, 'save').mockResolvedValue(updatedClient);

      const result = await service.addToSelected(clientId);

      expect(result).toEqual(updatedClient);
      expect(clientRepository.findOne).toHaveBeenCalledWith({ where: { id: clientId } });
      expect(clientRepository.save).toHaveBeenCalledWith(updatedClient);
    });

    it('should throw NotFoundException if client is not found', async () => {
      const clientId = 1;

      jest.spyOn(clientRepository, 'findOne').mockResolvedValue(null);

      await expect(service.addToSelected(clientId)).rejects.toThrow(NotFoundException);
      expect(clientRepository.findOne).toHaveBeenCalledWith({ where: { id: clientId } });
    });
  });

  describe('removeFromSelected', () => {
    it('should remove a client from the selected list', async () => {
      const clientId = 1;
      const client = { id: 1, name: 'John Doe', isSelected: true } as Client;
      const updatedClient = { ...client, isSelected: false } as Client;

      jest.spyOn(clientRepository, 'findOne').mockResolvedValue(client);
      jest.spyOn(clientRepository, 'save').mockResolvedValue(updatedClient);

      const result = await service.removeFromSelected(clientId);

      expect(result).toEqual(updatedClient);
      expect(clientRepository.findOne).toHaveBeenCalledWith({ where: { id: clientId } });
      expect(clientRepository.save).toHaveBeenCalledWith(updatedClient);
    });

    it('should throw NotFoundException if client is not found', async () => {
      const clientId = 1;

      jest.spyOn(clientRepository, 'findOne').mockResolvedValue(null);

      await expect(service.removeFromSelected(clientId)).rejects.toThrow(NotFoundException);
      expect(clientRepository.findOne).toHaveBeenCalledWith({ where: { id: clientId } });
    });
  });

  describe('remove', () => {
    it('should delete a client successfully', async () => {
      const clientId = 1;
      const client = { id: 1, name: 'John Doe', isSelected: false } as Client;

      jest.spyOn(clientRepository, 'findOneBy').mockResolvedValue(client);
      jest.spyOn(clientRepository, 'delete').mockResolvedValue({
        affected: 1,
      } as DeleteResult);

      const result = await service.remove(clientId);
      expect(result).toEqual({ affected: 1 });
      expect(clientRepository.findOneBy).toHaveBeenCalledWith({ id: clientId });
      expect(clientRepository.delete).toHaveBeenCalledWith(clientId);
    });

    it('should throw NotFoundException if client is not found', async () => {
      const clientId = 1;

      jest.spyOn(clientRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.remove(clientId)).rejects.toThrow(NotFoundException);
      expect(clientRepository.findOneBy).toHaveBeenCalledWith({ id: clientId });
    });
  });
});