export interface ImageMinimalResponse {
  id: string,
  statusId: string,
  url: string,
  slug: string,
  title: string,
  fileName: string,
  filePath: string,
  description: string,

  categories: string[],
}
