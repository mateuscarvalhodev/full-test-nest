import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) { }

  @ApiOperation({ summary: 'Cria um novo cliente.' })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso.',
    schema: {
      example: {
        id: 1,
        name: 'Mateus',
        salary: 2000,
        enterprisePrice: 20000,
        userId: 1,
      }
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Cliente não encontrado',
    schema: {
      example: {
        statusCode: 400,
        message: "Cannot GET",
        error: "Not Found",
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente não encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: "Cliente não encontrado.",
        error: "Not Found",
      },
    },
  })
  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @ApiOperation({ summary: 'Buscas os clientes relacionados com o usuário atual.' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios',
    schema: {
      example: [{
        id: 1,
        name: 'Mateus',
        salary: 2000,
        enterprisePrice: 20000,
        userId: 1,
      }]
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Cliente não encontrado',
    schema: {
      example: {
        statusCode: 400,
        message: "Cannot GET",
        error: "Not Found",
      },
    },
  })
  @Get()
  findAll(@Query('userId', ParseIntPipe) query: number) {
    return this.clientsService.findAll(query);
  }

  @ApiOperation({ summary: 'Atualiza um cliente pelo ID.' })
  @ApiResponse({
    status: 200,
    description: 'Cliente atualizado com sucesso',
    schema: {
      example: {
        id: 1,
        name: 'Mateus',
        salary: 2000,
        enterprisePrice: 20000,
        userId: 1,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente não encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Cliente com ID 1 não encontrado',
        error: 'Not Found',
      },
    },
  })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(id, updateClientDto);
  }

  @ApiOperation({ summary: 'Adiciona o cliente a lista de selecionados ID.' })
  @Patch(':id/addToSelected')
  addToSelected(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.addToSelected(id);
  }

  @ApiOperation({ summary: 'Remove o cliente a lista de selecionados ID.' })
  @Patch(':id/removeFromSelected')
  removeFromSelected(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.removeFromSelected(id);
  }

  @ApiOperation({ summary: 'Deleta o cliente da base de dados.' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.remove(id);
  }
}
