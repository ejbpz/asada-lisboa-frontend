import { ChangeDetectionStrategy, Component, input, inject, signal } from '@angular/core';
import { TitleCasePipe, UpperCasePipe, DatePipe } from '@angular/common';
import { NewMinimalResponse } from '@public/interfaces/new-minimal-response.interface';
import { DocumentMinimalResponse } from '@public/interfaces/document-minimal-response.interface';
import { ImageMinimalResponse } from '@public/interfaces/image-minimal-response.interface';
import { NewsApi } from '@core/services/news-api';
import {DocumentsApi} from '@core/services/documents-api';
import {GalleryApi} from '@core/services/gallery-api';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpParams } from '@angular/common/http';
import { GenerateContent } from "@shared/utils/generate-content";
import { DocumentTypeIcon } from '@shared/services/document-type-icon';
import { TitleSection } from "@public/components/title-section/title-section";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'admin-dashboard',
  imports: [TitleCasePipe, UpperCasePipe, DatePipe, TitleSection, RouterLink],
  templateUrl: './admin-dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex justify-center bg-[#cfd7e4] py-12.5 lg:py-25 px-4 lg:px-12'
  }
})
export class AdminDashboard {

 // Injection

  private documentService = inject(DocumentsApi);
  private newsService = inject(NewsApi);
  private imagesService = inject(GalleryApi);
  private documentType = inject(DocumentTypeIcon);
 
   // Init
   protected isLoading = signal<boolean>(false);
   protected generateContent = GenerateContent;


  // Input signal
   protected images = input<ImageMinimalResponse[] | undefined>();
 
   protected news = input<NewMinimalResponse[] | undefined>();
 
   protected documents = input<DocumentMinimalResponse[]  | undefined >(); 

    private params = new HttpParams().set('page', '0').set('size', '10');

  public newsD = toSignal(
    this.newsService.getAdminNews2(this.params), 
    { initialValue: [] as NewMinimalResponse[] }
  );

  public documentsD = toSignal(this.documentService.getAdmindocument2(this.params), 
    { initialValue: [] as DocumentMinimalResponse[] });
 
 public imagesD = toSignal(
  this.imagesService.getAdminImages2(this.params), 
  { initialValue: [] as ImageMinimalResponse[] }
);
   

   // Template methods
  protected iconType(filePath: string | undefined): string {
    return this.documentType.documentIcon(filePath);
  }

    // Template methods
  protected getImageClasses(index: number): string {
    const base = 'w-full h-auto sm:h-full object-cover rounded-lg shadow-md';

    switch (index) {
      case 0:
        return `${base} sm:col-start-1 sm:row-start-1`;
      case 1:
        return `${base} sm:col-start-1 sm:row-start-2`;
      case 2:
        return `${base} sm:col-start-2 sm:row-start-1 sm:row-span-2`;
      case 3:
        return `${base} sm:col-start-3 sm:row-start-1`;
      case 4:
        return `${base} sm:col-start-3 sm:row-start-2`;
      case 5:
        return `${base} sm:col-start-4 sm:row-start-1 sm:row-span-2`;
      default:
        return base;
    }
  }
 

// Default values
  protected title: string = 'contenido principal';
  protected subtitle: string = 'resumen de actividades recientes';
}
