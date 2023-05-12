import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/utility/services/common.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  constructor(private commonService:CommonService) { }

  ngOnInit() {
    this.commonService.breadcrumb = [
      { title: 'Promissory Notes', routeLink: '' },
      { title: 'Order ', routeLink: 'order' },
      { title: 'View ', routeLink: 'View' },
    ]
  }
 
}