import { AuthIntercepter } from './utility/services/authIntercepter';
import { NgModule } from '@angular/core';
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
import { NZ_ICONS } from 'ng-zorro-antd/icon';

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
    ShareModule,
  ],
  declarations: [AppComponent, FormBaseComponent],
  bootstrap: [AppComponent],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    // { provide: NZ_ICONS, useValue: icons },
  ],
  // providers: [
  //   {
  //     provide: HTTP_INTERCEPTORS,
  //     useFactory: function (router: Router, env: EnvService) {
  //       return new AuthIntercepter(router, env);
  //     },
  //     multi: true,
  //     deps: [Router, EnvService],
  //   },
  // ]
})
export class AppModule { }
