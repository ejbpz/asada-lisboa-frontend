import { DocumentTypeIcon } from './document-type-icon';

describe('DocumentTypeIcon', () => {
  let service: DocumentTypeIcon;

  beforeEach(() => {
    service = new DocumentTypeIcon();
  });

  it('should return txt icon', () => {
    expect(service.documentIcon('file.txt')).toBe('assets/icons/txt-icon.svg');
  });

  it('should return csv icon', () => {
    expect(service.documentIcon('data.csv')).toBe('assets/icons/csv-icon.svg');
  });

  it('should return pdf icon', () => {
    expect(service.documentIcon('document.pdf')).toBe('assets/icons/pdf-icon.svg');
  });

  it('should return docx icon', () => {
    expect(service.documentIcon('word.docx')).toBe('assets/icons/docx-icon.svg');
  });

  it('should return doc icon as docx', () => {
    expect(service.documentIcon('word.doc')).toBe('assets/icons/docx-icon.svg');
  });

  it('should return xlsx icon', () => {
    expect(service.documentIcon('sheet.xlsx')).toBe('assets/icons/xlsx-icon.svg');
  });

  it('should return xls icon as xlsx', () => {
    expect(service.documentIcon('sheet.xls')).toBe('assets/icons/xlsx-icon.svg');
  });

  it('should return zip icon', () => {
    expect(service.documentIcon('archive.zip')).toBe('assets/icons/zip-icon.svg');
  });

  it('should return default icon when extension is unknown', () => {
    expect(service.documentIcon('file.unknown')).toBe('assets/icons/document-icon.svg');
  });

  it('should return default icon when fileName is undefined', () => {
    expect(service.documentIcon(undefined)).toBe('assets/icons/document-icon.svg');
  });

  it('should return default icon when fileName is null', () => {
    expect(service.documentIcon(null)).toBe('assets/icons/document-icon.svg');
  });

  it('should handle filenames with multiple dots', () => {
    expect(service.documentIcon('report.final.v1.pdf')).toBe('assets/icons/pdf-icon.svg');
  });

  it('should return default icon when no extension exists', () => {
    expect(service.documentIcon('filename')).toBe('assets/icons/document-icon.svg');
  });
});
