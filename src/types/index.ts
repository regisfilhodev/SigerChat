export interface User {
  id?: number;
  name: string;
  email: string;
}

export interface Message {
  id?: number;
  content: string;
  sender: User;
  timestamp: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
} 