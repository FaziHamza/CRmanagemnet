import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { MessageModalComponent } from './message-modal/message-modal.component';
import { ViewFileComponent } from './view-file/view-file.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { TableAdvancedComponent } from './table-advanced/table-advanced.component';
import { NgZorroAntdModule } from 'src/app/zorro-module/ng-zorro-antd.module';

@NgModule({
  imports: [CommonModule,NgZorroAntdModule],
  declarations: [ConfirmationDialogComponent, MessageModalComponent, ViewFileComponent, NotFoundComponent, TableAdvancedComponent],
  exports: [ConfirmationDialogComponent, ViewFileComponent, MessageModalComponent, NotFoundComponent,TableAdvancedComponent],
  providers: [
  ],
})
export class ShareModule {
  constructor() {
    registerLocaleData(localeDe);
  }
}
