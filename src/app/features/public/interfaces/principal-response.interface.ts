import { DocumentMinimalResponse } from "./document-minimal-response.interface";
import { ImageMinimalResponse } from "./image-minimal-response.interface";
import { NewMinimalResponse } from "./new-minimal-response.interface";

export interface PrincipalRequest {
  news: NewMinimalResponse[] | undefined,
  images: ImageMinimalResponse[] | undefined,
  documents: DocumentMinimalResponse[] | undefined,
}
