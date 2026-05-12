/**
 * Tipagem para o formulário de Cadastro do Exploraê
 * Sincronizado com o design 'Modern Navigator'
 */

export interface CadastroFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

export interface CadastroResponse {
  success: boolean;
  message?: string;
  token?: string;
}

export type CadastroErrorMap = Partial<Record<keyof CadastroFormData, string>>;
