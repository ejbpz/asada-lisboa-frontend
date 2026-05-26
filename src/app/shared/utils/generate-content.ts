import { environment } from "@environments/environment.development";

export class GenerateContent {
  private static env = environment;

  static url(filePath: string | undefined): string {
    if (!filePath)
      return '';

    filePath = filePath.trim();

    filePath = filePath.replace(/\/+$/, '');

    if (!filePath.startsWith('/'))
      filePath = `/${filePath}`;

    return `${this.env.API_URL_CONTENT}${filePath}`;
  }
}
