export interface ImageResponse {
  id: string;
  publicationDate: Date;
  url: string;
  slug: string;
  title: string;
  filePath: string;
  fileName: string;
  description: string;

  fileSize: number;

  statusId: string;
  statusName: string;
  categories: string[];
}
