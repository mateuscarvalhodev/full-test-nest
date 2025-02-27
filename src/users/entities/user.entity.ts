import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
// Importe a entidade Client
import { Client } from "src/clients/entities/client.entity"

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30, unique: true })
  name: string;

  @OneToMany(() => Client, (client) => client.createdBy)
  clients: Client[];
}