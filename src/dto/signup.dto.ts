import { IsString, MinLength, Matches, IsNotEmpty } from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty({message: 'user req'})
  username: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  // @IsString()
  // @Matches('password', { message: 'Password confirmation must match the password' })
  // confirmPassword: string;
}
