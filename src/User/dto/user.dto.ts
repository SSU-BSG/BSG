import { IsString, Length, IsNumber} from 'class-validator';

export namespace UserDTO {
    export class Register {
        @IsString()
        userId : string;

        @IsString()
        @Length(4,20)
        password : string;
        
        @IsString()
        name : string;
        
        @IsNumber()
        age : number;
        
        @IsNumber()
        studentYear : number;
        
        @IsString()
        major : string;
        
        @IsString()
        gender : string;
    }

    export class LogIn {
        @IsString()
        userId : string;

        @IsString()
        @Length(4, 20)
        password : string;
    }

    export class ProfileResponse {
        id: number;
        userId: string;
        name: string;
        age: number;
        studentYear: number;
        major: string;
        gender: string;
        created_at: Date;
    }
}