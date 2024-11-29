import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task, TaskSchema } from 'src/schemas/task.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]), // Register the schema
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService], // Export the service if needed in other modules
})
export class TaskModule {}
