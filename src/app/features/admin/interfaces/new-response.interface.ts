export interface NewResponse {
  id: string;
  slug: string;
  title: string;
  imageurl: string;
  filename: string;
  filepath: string;
  statusname: string;
  description: string;
  categories: string[];
  publicationdate: Date;
  lasteditiondate: Date;
}
