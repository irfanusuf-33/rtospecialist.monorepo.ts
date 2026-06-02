// Data Transfer Objects for API requests
import { User } from '../entities/user.entity';

// Create user request body
export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
}

// Update user request body (all optional)
export interface UpdateUserDto {
  email?: string;
  name?: string;
  password?: string;
}

// Login request
export interface LoginDto {
  email: string;
  password: string;
}