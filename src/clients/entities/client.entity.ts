import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30, nullable: false })
  name: string;

  @Column({ type: 'float', nullable: false })
  salary: number;

  @Column({ type: 'float', nullable: false })
  enterprisePrice: number;

  @Column({ type: 'boolean', nullable: false, default: false })
  isSelected: boolean;

  @ManyToOne(() => User, (user) => user.clients, { nullable: false })
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

}