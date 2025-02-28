import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

describe('ClientsController', () => {
  let controller: ClientsController;
  let service: ClientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        {
          provide: ClientsService,
          useValue: {
            create: jest.fn().mockImplementation((dto) => ({ id: 1, ...dto })),
            findAll: jest.fn().mockResolvedValue([]),
            update: jest.fn().mockImplementation((id, dto) => ({ id, ...dto })),
            addToSelected: jest.fn().mockResolvedValue({ success: true }),
            removeFromSelected: jest.fn().mockResolvedValue({ success: true }),
            remove: jest.fn().mockResolvedValue({ success: true }),
          },
        },
      ],
    }).compile();

    controller = module.get<ClientsController>(ClientsController);
    service = module.get<ClientsService>(ClientsService);
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um cliente e retornar os dados', async () => {
      const dto: CreateClientDto = { name: 'Mateus', salary: 2000, enterprisePrice: 20000, userId: 1 };
      expect(await controller.create(dto)).toEqual({ id: 1, ...dto });
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('deve retornar uma lista de clientes', async () => {
      expect(await controller.findAll(1)).toEqual([]);
      expect(service.findAll).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('deve atualizar um cliente e retornar os dados atualizados', async () => {
      const dto: UpdateClientDto = { name: 'Atualizado' };
      expect(await controller.update(1, dto)).toEqual({ id: 1, ...dto });
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('addToSelected', () => {
    it('deve adicionar um cliente à lista de selecionados', async () => {
      expect(await controller.addToSelected(1)).toEqual({ success: true });
      expect(service.addToSelected).toHaveBeenCalledWith(1);
    });
  });

  describe('removeFromSelected', () => {
    it('deve remover um cliente da lista de selecionados', async () => {
      expect(await controller.removeFromSelected(1)).toEqual({ success: true });
      expect(service.removeFromSelected).toHaveBeenCalledWith(1);
    });
  });

  describe('remove', () => {
    it('deve remover um cliente da base de dados', async () => {
      expect(await controller.remove(1)).toEqual({ success: true });
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
