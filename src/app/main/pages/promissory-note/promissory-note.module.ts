import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';

import { SharedModule } from '../../../shared/shared.module';
import { PromissoryNoteRoutingModule } from './promissory-note-routing.module';
import { PromissoryNoteComponent } from './promissory-note.component';
import { NgZorroAntdModule } from 'src/app/zorro-module/ng-zorro-antd.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PromissoryNoteComponent,
  ],
  imports: [
    FormsModule, ReactiveFormsModule,
    CommonModule,
    PromissoryNoteRoutingModule,
    SharedModule,
    TranslateModule,
    NgZorroAntdModule,

  ],
  providers: [
    DecimalPipe, DatePipe
  ]
})
export class PromissoryNoteModule { }
