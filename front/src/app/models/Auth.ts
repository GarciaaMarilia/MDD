export interface LoginResponse {
  token: string;
  type: string;
  id: number;
  username: string;
}

export interface RegisterResponse {
  token: string;
  type: string;
  id: number;
  username: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}
