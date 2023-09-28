import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EnvService } from './services/envoirment.service';
import { CustomRoundPipe } from 'src/app/pipe/custom-round-pipe';
import { NumberDirective } from 'src/app/directive/numbers-only.directive';
import { DigitDirective } from 'src/app/directive/digit-only.directive';
import { MaxCharactersDirective } from 'src/app/directive/max-characters.directive';
import { PositiveDecimalDirective } from 'src/app/directive/positivedecimal-only.directive';
import { NumberDecimalDirective } from 'src/app/directive/numberdecimal-only.directive';
import { RoundPipe } from 'src/app/pipe/round-pipe';
import { RoundedPipe } from 'src/app/pipe/rounded-pipe';
import { NgbModule, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { DecimalNumberDirective } from '../directive/decimal-number.directive';

// const module = [
//   CommonModule,
//   RouterModule,HttpClientModule
// ]
@NgModule({
  declarations: [
    CustomRoundPipe,NumberDirective,DigitDirective,MaxCharactersDirective,PositiveDecimalDirective,
    NumberDecimalDirective, RoundPipe, RoundedPipe, DecimalNumberDirective
    // JwtComponent
  ],
  imports: [
    // ...module
    BsDropdownModule.forRoot(),
    NgbModule,
    NgSelectModule,
  ],
  exports: [
    NgbPagination, BsDropdownModule, NgSelectModule, DecimalNumberDirective,
    CustomRoundPipe,NumberDirective,DigitDirective,MaxCharactersDirective,PositiveDecimalDirective,
    NumberDecimalDirective,RoundPipe,RoundedPipe
  ],
  providers: [
    EnvService,
  ]
})
export class SharedModule { }
