// Database entity / core domain model    test

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;  // Hashed password in DB
  createdAt: Date;
  updatedAt: Date;
}

// For API responses (excluding sensitive data)
export interface UserResponse {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}