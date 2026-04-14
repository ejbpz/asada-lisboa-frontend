import { RouterLink } from "@angular/router";
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'main-page',
  imports: [UpperCasePipe , TitleCasePipe, RouterLink],
  templateUrl: './main-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'bg-base-100 block w-full h-full'
  }
})
export default class MainPage { }
