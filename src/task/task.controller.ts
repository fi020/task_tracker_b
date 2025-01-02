import { Controller, Get, Post, Body, Request, UseGuards, Delete, Param, Put, Patch } from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Adjust path
import { CreateTaskDto } from 'src/dto/task.dto';
import { UpdateTaskDto } from 'src/dto/update-task.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async getTasks(@Request() req) {
    const userId = req.user.userId;
    return this.taskService.getTasks(userId);
  }

  @Post()
  async createTask(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    const userId = req.user.userId;
    console.log("task ctrl post",req.user);
    console.log("task ctrl post",createTaskDto);
    
    return this.taskService.createTask(userId, createTaskDto);
  }
    // Update an existing task
    @Patch(':taskId')
    async updateTask(
      @Request() req,
      @Param('taskId') taskId: string,
      @Body() updateTaskDto: UpdateTaskDto,
    ) {
      console.log("update ctrl");
      
      const userId = req.user.userId;
      console.log("update ctrl");
      return this.taskService.updateTask(userId, taskId, updateTaskDto);
    }

  @Delete(':taskId')
  async deleteTask(@Request() req, @Param('taskId') taskId: string) {
    const userId = req.user.userId;
    return this.taskService.deleteTask(userId, taskId);
  }
}
