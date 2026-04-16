import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'not-found-page',
  imports: [RouterLink],
  templateUrl: './not-found-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-screen h-screen flex justify-center items-center'
  }
})
export default class NotFoundPage {}
