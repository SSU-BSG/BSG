import  { Entity, Column, PrimaryGeneratedColumn, BaseEntity, BeforeInsert } from 'typeorm';
import bcrypt from 'bcrypt';

@Entity('user')
export class User extends BaseEntity {

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

    @BeforeInsert()
    async hashPassword() : Promise<void> {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password,saltRounds);
    }

}