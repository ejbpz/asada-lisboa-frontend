export interface DocumentResponse {
  id: string;
  slug: string;
  title: string;
  description: string;

  fileSize: string;
  fileName: string;
  filePath: string;
  documentTypeName: string;

  statusId: string;
  statusName: string;
  categories: string[];
  publicationdate: Date;
}
