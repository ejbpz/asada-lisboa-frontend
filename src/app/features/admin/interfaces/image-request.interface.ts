import { CategoriesRequest } from "@shared/interfaces/categories-request.interface";

export interface ImageRequest {
  title: string;
  statusId: string;
  description: string;
  file: File | undefined;
  categories: CategoriesRequest[];
}
