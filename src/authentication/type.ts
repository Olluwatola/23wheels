export interface UserForm {
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  address: string; //
  password: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  address: string; //
  password: string;
  is_verified: boolean; //
  created_at: Date;
  updated_at: Date; //
  is_deleted: boolean;
  role: string;
}
