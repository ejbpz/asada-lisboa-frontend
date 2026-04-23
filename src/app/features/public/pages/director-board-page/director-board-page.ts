import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GetBackTitle } from "@shared/components/get-back-title/get-back-title";
import {DirectorsList} from "@public/components/directors-list/directors-list";

@Component({
  selector: 'app-director-board-page',
  imports: [DirectorsList, GetBackTitle],
  templateUrl: './director-board-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DirectorBoardPage { }
