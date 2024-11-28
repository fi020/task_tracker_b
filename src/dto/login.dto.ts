// login.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({message: 'enter user '})
  username: string;

  @IsString()
  @IsNotEmpty({message: 'enter pass '})
  password: string;
}
