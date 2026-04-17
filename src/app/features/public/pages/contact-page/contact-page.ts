import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContactForm } from '@public/components/contact-form/contact-form';
import { ContactBoard } from "@public/components/contact-board/contact-board";
import { GetBackTitle } from "@shared/components/get-back-title/get-back-title";

@Component({
  selector: 'contact-page',
  imports: [ContactForm, ContactBoard, GetBackTitle],
  templateUrl: './contact-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'bg-base-100 flex flex-col justify-center items-center w-full h-full'
  }
})
export default class ContactPage {}
