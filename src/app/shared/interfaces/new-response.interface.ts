export interface NewResponse {
  id: string,
  slug: string,
  title: string,
  description: string,
  publicationDate: Date,
  lastEditionDate: Date,

  imageUrl: string,
  fileName: string,
  filePath: string,

  statusId: string,
  statusName: string,
  categories: string[],
}
