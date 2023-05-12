import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/utility/services/common.service';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {

  constructor(public commonService:CommonService) { }

  ngOnInit(): void {
  }

}
