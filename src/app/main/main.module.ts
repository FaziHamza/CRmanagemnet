import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './containers/main-layout/main-layout.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { MainRoutingModule } from './main-routing.module';
import { MainHeaderComponent } from './containers/main-header/main-header.component';
import { MainSideBarComponent } from './containers/main-side-bar/main-side-bar.component';
import { CMSetupComponent } from './pages/main-page/cmsetup/cmsetup.component';
import { EnvService } from '../shared/services/envoirment.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PromissoryNoteComponent } from './pages/promissory-note/promissory-note.component';
import { PromissoryNoteOrderComponent } from './pages/promissory-note-order/promissory-note-order.component';
import { WorkordersComponent } from './pages/workorders/workorders.component';
import { NgZorroAntdModule } from '../zorro-module/ng-zorro-antd.module';
import { WorkOrderCreateComponent } from './pages/workorders/work-order-create/work-order-create.component';

@NgModule({
  imports: [CommonModule, MainRoutingModule,FormsModule,ReactiveFormsModule,
    NgZorroAntdModule,],
  declarations: [MainLayoutComponent, MainPageComponent, MainHeaderComponent, MainSideBarComponent, CMSetupComponent, PromissoryNoteComponent, PromissoryNoteOrderComponent,
    WorkOrderCreateComponent,WorkordersComponent],
  providers: [
    EnvService,
  ]
})
export class MainModule {}
