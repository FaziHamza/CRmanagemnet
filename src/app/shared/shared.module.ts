import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EnvService } from './services/envoirment.service';
// import { JwtComponent } from './jwt/jwt.component';


const module = [
  CommonModule,
  RouterModule,HttpClientModule
]
@NgModule({
  declarations: [
  
    // JwtComponent
  ],
  imports: [
    ...module
  ],
  exports : [
  ],
  providers: [
    EnvService,
  ]
})
export class SharedModule { }
