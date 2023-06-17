import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';

import { SharedModule } from '../../../shared/shared.module';
import { NgZorroAntdModule } from 'src/app/zorro-module/ng-zorro-antd.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkOrderRescheduleComponent } from './work-order-reschedule.component';
import { WorkOrderRescheduleRoutingModule } from './work-order-reschedule-routing.module';

@NgModule({
  declarations: [
    WorkOrderRescheduleComponent,
  ],
  imports: [
    FormsModule, ReactiveFormsModule,
    TranslateModule,
    NgZorroAntdModule,
    CommonModule,
    WorkOrderRescheduleRoutingModule,
    SharedModule
  ],
  providers: [
    DecimalPipe, DatePipe
  ]
})
export class WorkOrderRescheduleModule { }
