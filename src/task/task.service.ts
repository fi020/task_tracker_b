import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskDto } from 'src/dto/task.dto';
import { UpdateTaskDto } from 'src/dto/update-task.dto';
import { Task } from 'src/schemas/task.schema';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async getTasks(userId: string): Promise<Task[]> {
    return this.taskModel.find({ userId }).exec();
  }

  async createTask(userId: string, createTaskDto: CreateTaskDto): Promise<Task> {
    const newTask = new this.taskModel({ ...createTaskDto, userId });
    return newTask.save();
  }



  // Update an existing task
  async updateTask(
    userId: string,
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    console.log("update serveice");
    console.log(taskId,userId);
    
    const task = await this.taskModel.findOne({ _id: taskId, userId });
    console.log(task);
    
    console.log("update serveice");
    if (!task) {
      throw new NotFoundException('Task not found > with the user id with in the token');
    }

    // Update the task and return it
    Object.assign(task, updateTaskDto);
    return task.save();
  }
  // // Delete a task
  // async deleteTask(userId: string, taskId: string): Promise<void> {
  //   const result = await this.taskModel.deleteOne({ _id: taskId, userId });

  //   if (result.deletedCount === 0) {
  //     throw new NotFoundException('Task not found');
  //   }
  //   // return {
  //   //   message: 'Task successfully deleted',
  //   //   // deletedCount: result.deletedCount, // Number of deleted documents
  //   //   // taskId: taskId, // Optionally, return the taskId as well
  //   // };
  // }

  async deleteTask(userId: string, taskId: string): Promise<any> {
    const result = await this.taskModel.deleteOne({ _id: taskId, userId });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Task not found');
    }

    // Return the deletion result
    return {
      message: 'Task successfully deleted',
      deletedCount: result.deletedCount, // Number of deleted documents
      taskId: taskId, // Optionally, return the taskId as well
    };
  }
}
