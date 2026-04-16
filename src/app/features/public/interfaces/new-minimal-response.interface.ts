export interface NewMinimalResponse {
  id: string,
  statusId: string,
  lastEditionDate: Date,
  slug: string,
  title: string,
  fileName: string,
  filePath: string,
  imageUrl: string,
  description: string,

  categories: string[],
}
