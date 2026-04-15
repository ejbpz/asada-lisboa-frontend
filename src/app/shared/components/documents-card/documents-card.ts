import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'documents-card',
  imports: [RouterLink],
  templateUrl: './documents-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'card bg-base-100 w-full shadow-sm rounded-sm text-base-content'
  }
})
export class DocumentsCard { }
