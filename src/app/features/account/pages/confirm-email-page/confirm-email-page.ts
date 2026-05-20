import { ActivatedRoute, RouterLink } from '@angular/router';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { map, of } from 'rxjs';
import { AccountApi } from '@core/services/account-api';
import { GetBackTitle } from "@shared/components/get-back-title/get-back-title";

@Component({
  selector: 'confirm-email-page',
  imports: [RouterLink, GetBackTitle],
  templateUrl: './confirm-email-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full h-full flex flex-col justify-center items-center'
  }
})
export default class ConfirmEmailPage {
  // Injection
  private accountApi = inject(AccountApi);

  // Get elements by params
  private validatonToken: Signal<{ email: string, token: string } | undefined> = toSignal(
    inject(ActivatedRoute).queryParams.pipe(
      map((param) => {
        const email = param['email'];
        const token = param['token'];

        if (!email || !token) return undefined;

        return { email, token };
      }),
    )
  );

  // Calling resource
  public readonly confirmEmailResource = rxResource({
    params: () => ({ validatonToken: this.validatonToken() }),
    stream: ({ params }) => {
      if(!params.validatonToken)
        return of(undefined);

      return this.accountApi.confirmEmail(params.validatonToken.email, params.validatonToken.token);
    }
  });
}
