import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GetBackTitle } from "@shared/components/get-back-title/get-back-title";
import { ReceiptsForm } from "@public/components/receipts-form/receipts-form";

@Component({
  selector: 'receipts-page',
  imports: [GetBackTitle, ReceiptsForm],
  templateUrl: './receipts-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ReceiptsPage { }
