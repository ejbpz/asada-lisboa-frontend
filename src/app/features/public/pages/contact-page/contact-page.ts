import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContactForm } from '@public/components/contact-form/contact-form';
import { ContactBoard } from "@public/components/contact-board/contact-board";

@Component({
  selector: 'contact-page',
  imports: [ContactForm, ContactBoard],
  templateUrl: './contact-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'bg-base-100 flex justify-center items-center w-full h-full'
  }
})
export default class ContactPage {}
