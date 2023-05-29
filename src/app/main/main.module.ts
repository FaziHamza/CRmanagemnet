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
    , CustomRoundPipe, RoundPipe, CreateRequestComponent, CreditAccountComponent, TestComponent],
  providers: [
    DecimalPipe, DatePipe
  ]
})
export class MainModule { }

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
