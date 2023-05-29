import { AuthIntercepter } from './utility/services/authIntercepter';
import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ToastNoAnimationModule, ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormBaseComponent } from './utility/shared-component/base-form/form-base.component';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { EnvService } from './shared/services/envoirment.service';
import { ShareModule } from './shared/module/share.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgZorroAntdModule } from './zorro-module/ng-zorro-antd.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { NZ_ICONS, NzIconModule } from 'ng-zorro-antd/icon';
import { DatePipe, DecimalPipe } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ApiService } from './shared/services/api.service';
import { AuthInterceptor } from './shared/services/interceptor';
import { SharedModule } from './shared/shared.module';
import { MainModule } from './main/main.module';
import { AuthGuard } from './utility/guards/auth.guard';
import { CustomRoundPipe } from './pipe/custom-round-pipe';
import { RoundPipe } from './pipe/round-pipe';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NgZorroAntdModule,
    NgbModalModule,
    ToastrModule.forRoot(),
    ToastNoAnimationModule.forRoot(),
    HttpClientModule,
    NgxUiLoaderModule,
    BrowserAnimationsModule,
    NgSelectModule,
    NzIconModule  ,
    NzInputModule,
    ShareModule,
    SharedModule,
    MainModule,
    DatePipe,
  ],
  declarations: [AppComponent, FormBaseComponent],
  bootstrap: [AppComponent],
  providers: [
    AuthGuard,
    { provide: NZ_I18N, useValue: en_US },
    DecimalPipe ,
    CustomRoundPipe,RoundPipe,
    ApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: function (router: Router, env:EnvService) {
        return new AuthInterceptor(router, env);
      },
      multi: true,
      deps: [Router,EnvService],
    }
    
    // { provide: NZ_ICONS, useValue: icons },
  ],
})
export class AppModule { }
