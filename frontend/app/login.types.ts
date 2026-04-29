export interface LoginForm {
  email: string;
  password: string;
}

export interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

export interface LoginResult {
  success: boolean;
  message?: string;
}
