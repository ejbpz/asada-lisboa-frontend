import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GetBackTitle } from "@shared/components/get-back-title/get-back-title";
import {PublicDirectorsBoardSection} from "@public/components/ public-directors-board-section/ public-directors-board-section";

@Component({
  selector: 'app-director-board-page',
  imports: [PublicDirectorsBoardSection, GetBackTitle],
  templateUrl: './director-board-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DirectorBoardPage { }
