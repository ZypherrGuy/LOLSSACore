export interface UserDTO {
  id: string;
  username: string;
  email: string;
  contactNumber?: string;
  isEmailVerified: boolean;
}