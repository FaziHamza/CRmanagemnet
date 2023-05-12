import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';

@NgModule({
  imports: [CommonModule],
  declarations: [ ConfirmationDialogComponent],
  exports: [ConfirmationDialogComponent,],
  providers: [
  ],
})
export class ShareModule {
  constructor() {
    registerLocaleData(localeDe);
  }
}
