import { JwtService } from 'src/app/shared/services/jwt.service';
import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/utility/services/common.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {
  getToken: any = '';
  constructor(public commonService:CommonService,private jwtService:JwtService,
    private route :Router) { }

  ngOnInit(): void {
    this.getToken = this.jwtService.getToken();
  }
  gotoSpareParts(){
    // const queryParams = { token: this.getToken };
    // const queryString = new URLSearchParams(queryParams).toString();
    // const url = `${environment.routerLink}/?${queryString}`;
    // window.open(url, '_blank');
  }
}
