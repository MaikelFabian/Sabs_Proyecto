import { Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity ()
export class gatos {
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    name:string;
    @Column()
    color:string;
    @Column()
    raza:string;
}