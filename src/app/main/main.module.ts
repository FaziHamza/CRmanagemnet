import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { MainLayoutComponent } from './containers/main-layout/main-layout.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { MainRoutingModule } from './main-routing.module';
import { MainHeaderComponent } from './containers/main-header/main-header.component';
import { MainSideBarComponent } from './containers/main-side-bar/main-side-bar.component';
import { CMSetupComponent } from './pages/main-page/cmsetup/cmsetup.component';
import { EnvService } from '../shared/services/envoirment.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PromissoryNoteComponent } from './pages/promissory-note/promissory-note.component';
import { WorkordersComponent } from './pages/workorders/workorders.component';
import { NgZorroAntdModule } from '../zorro-module/ng-zorro-antd.module';
import { LogoutComponent } from './containers/logout/logout.component';
import { CustomRoundPipe } from '../pipe/custom-round-pipe';
import { RoundPipe } from '../pipe/round-pipe';
import { CreateRequestComponent } from './pages/create-request/create-request.component';
import { CreditAccountComponent } from './pages/credit-account/credit-account.component';
import { TestComponent } from './pages/test/test.component';
import { NgChartsModule } from 'ng2-charts';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { NumberDirective } from '../directive/numbers-only.directive';
import { DigitDirective } from '../directive/digit-only.directive';
import { ProfileComponent } from './containers/profile/profile.component';
import { ModalMessageComponent } from './containers/modal-message/modal-message.component';
import { PDFViewComponent } from './pages/pdfview/pdfview.component';
import { WorkOrderRequestComponent } from './pages/workorders/work-order-request/work-order-request.component';
import { ConfirmPopupComponent } from './pages/common/confirm-popup/confirm-popup.component';
import { WorkOrderRescheduleComponent } from './pages/work-order-reschedule/work-order-reschedule.component';
import { WorkOrderTransferComponent } from './pages/work-order-transfer/work-order-transfer.component';

@NgModule({
  imports: [CommonModule, MainRoutingModule, FormsModule, ReactiveFormsModule,
    NgChartsModule, 
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(http, './assets/i18n/', '.json');
        },
        deps: [HttpClient]
      }
    }),
    NgZorroAntdModule],
  declarations: [MainLayoutComponent, MainPageComponent, MainHeaderComponent, MainSideBarComponent, CMSetupComponent, PromissoryNoteComponent,
    WorkordersComponent, LogoutComponent,NumberDirective
    ,DigitDirective
    , CustomRoundPipe, RoundPipe, CreateRequestComponent, CreditAccountComponent, TestComponent, ProfileComponent, ModalMessageComponent, PDFViewComponent, WorkOrderRequestComponent, ConfirmPopupComponent, WorkOrderRescheduleComponent, WorkOrderTransferComponent],
  providers: [
    DecimalPipe, DatePipe
  ]
})
export class MainModule { }
