import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';

import { DashboardComponent } from './dashboard.component';
import { NgZorroAntdModule } from '../../../zorro-module/ng-zorro-antd.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { PromissoryNoteCardComponent } from './promissory-note-card/promissory-note-card.component';
import { PromissoryNotesAgingReportComponent } from './promissory-notes-aging-report/promissory-notes-aging-report.component';
import { PromissoryNotesAgingChartComponent } from './promissory-notes-aging-chart/promissory-notes-aging-chart.component';
import { PromissoryNotesPaymentsChartComponent } from './promissory-notes-payments-chart/promissory-notes-payments-chart.component';
import { PromissoryNotesOrdersChartComponent } from './promissory-notes-orders-chart/promissory-notes-orders-chart.component';
import { PromissoryNotesMonthChartComponent } from './promissory-notes-month-chart/promissory-notes-month-chart.component';

@NgModule({
  declarations: [
    DashboardComponent,
    PromissoryNoteCardComponent,
    PromissoryNotesAgingReportComponent,
    PromissoryNotesAgingChartComponent,
    PromissoryNotesPaymentsChartComponent,
    PromissoryNotesOrdersChartComponent,
    PromissoryNotesMonthChartComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    DashboardRoutingModule,
    NgZorroAntdModule,
  ],
})
export class DashboardModule {}
