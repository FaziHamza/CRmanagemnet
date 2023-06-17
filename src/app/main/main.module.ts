import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { MainLayoutComponent } from './containers/main-layout/main-layout.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { MainRoutingModule } from './main-routing.module';
import { MainHeaderComponent } from './containers/main-header/main-header.component';
import { MainSideBarComponent } from './containers/main-side-bar/main-side-bar.component';
import { CMSetupComponent } from './pages/main-page/cmsetup/cmsetup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkordersComponent } from './pages/workorders/workorders.component';
import { NgZorroAntdModule } from '../zorro-module/ng-zorro-antd.module';
import { LogoutComponent } from './containers/logout/logout.component';
import { CreateRequestComponent } from './pages/create-request/create-request.component';
import { CreditAccountComponent } from './pages/credit-account/credit-account.component';
import { TestComponent } from './pages/test/test.component';
import { NgChartsModule } from 'ng2-charts';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { ProfileComponent } from './containers/profile/profile.component';
import { ModalMessageComponent } from './containers/modal-message/modal-message.component';
import { PDFViewComponent } from './pages/pdfview/pdfview.component';
import { WorkOrderRequestComponent } from './pages/workorders/work-order-request/work-order-request.component';
import { ConfirmPopupComponent } from './pages/common/confirm-popup/confirm-popup.component';
import { ErrorsComponent } from './pages/common/errors/errors.component';
import { RejectComponent } from './pages/common/reject/reject.component';
import { PromissoryListComponent } from './pages/workorders/promissory-list/promissory-list.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [CommonModule, MainRoutingModule, FormsModule, ReactiveFormsModule,
    NgChartsModule,
    SharedModule,
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
  declarations: [MainLayoutComponent, MainPageComponent, MainHeaderComponent, MainSideBarComponent,
    CMSetupComponent,
    WorkordersComponent, LogoutComponent, CreateRequestComponent, CreditAccountComponent,
    TestComponent, ProfileComponent, ModalMessageComponent, PDFViewComponent,
    WorkOrderRequestComponent, ConfirmPopupComponent, ErrorsComponent, RejectComponent, PromissoryListComponent],
  providers: [
    DecimalPipe, DatePipe
  ]
})
export class MainModule { }
