import  { Entity, Column, PrimaryGeneratedColumn, BaseEntity, BeforeInsert, CreateDateColumn, DeleteDateColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('user')
export class UserEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id : number;

    @Column({ unique: true })
    userId : string;

    @Column()
    password : string;

    @Column()
    name : string;

    @Column()
    age : number;
    
    @Column()
    studentYear : number;

    @Column()
    major : string;

    @Column()
    gender : string;

    @CreateDateColumn() 
    created_at : Date;

    @DeleteDateColumn()
    deleted_at : Date | null;

   @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

}