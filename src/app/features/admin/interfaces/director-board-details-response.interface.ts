import { RoleResponse } from "./role-response.interface";

export interface DirectorBoardDetailsResponse {
  id: string;
  email: string;
  charge: string;
  chargeId: string;
  firstName: string;
  roles: RoleResponse[]
  firstLastName: string;
  secondLastName: string;
  phoneNumber: string | null;
}
