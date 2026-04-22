import { environment } from "@environments/environment.development";

export class GenerateContent {
  private static env = environment;

  static url(filePath: string | undefined): string {
    if(!filePath?.startsWith('/'))
      filePath = `/${filePath}`;

    return `${this.env.API_URL_CONTENT}${filePath ?? ''}`;
  }
}
