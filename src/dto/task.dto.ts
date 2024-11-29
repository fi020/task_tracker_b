// src/dto/create-task.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString({message: 't pass '})
  title: string;

  @IsNotEmpty()
  @IsString({message: 't pass '})
  description: string;
}
