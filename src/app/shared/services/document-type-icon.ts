import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocumentTypeIcon {
  // Methods
  public documentIcon(fileName: string | undefined | null): string {
    let extension = '';

    if(fileName) {
      const pathSplit: string[] = fileName.split('.');
      extension = pathSplit.reverse()[0];
    }

    switch(extension) {
      case 'txt':
        return 'assets/icons/txt-icon.svg';
      case 'csv':
        return 'assets/icons/csv-icon.svg';
      case 'pdf':
        return 'assets/icons/pdf-icon.svg';
      case 'docx':
        return 'assets/icons/docx-icon.svg';
      case 'xlsx':
        return 'assets/icons/xlsx-icon.svg';
      case 'zip':
        return 'assets/icons/zip-icon.svg';
      default:
        return 'assets/icons/document-icon.svg';
    }
  }
}
