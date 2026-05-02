export interface RegisterRequest {
  email: string;
  roleId: string;
  password: string;
  chargeId: string;
  firstName: string;
  firstLastName: string;
  secondLastName: string;
  confirmPassword: string;
  phoneNumber: string | null;
}
