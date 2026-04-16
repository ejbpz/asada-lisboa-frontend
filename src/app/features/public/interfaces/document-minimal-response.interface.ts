export interface DocumentMinimalResponse {
  id: string,
  statusId: string,
  url: string,
  slug: string,
  title: string,
  fileName: string,
  filePath: string,
  description: string,
  documentTypeName: string,

  categories: string[],
}
