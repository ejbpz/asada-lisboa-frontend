export interface UserUpdateRequest {
  roleId: string;
  chargeId: string;
  firstName: string;
  firstLastName: string;
  secondLastName: string;
  phoneNumber: string | null;
}
