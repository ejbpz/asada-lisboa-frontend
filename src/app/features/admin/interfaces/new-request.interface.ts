import { CategoriesRequest } from "@shared/interfaces/categories-request.interface";

export interface NewRequest {
  title: string,
  statusId: string,
  description: string,
  file: File | undefined,
  categories: CategoriesRequest[],
}
