import { IsString, Length, IsNumber} from 'class-validator';

export namespace UserDTO {
    export class register {
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
}