import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-side-bar',
  templateUrl: './main-side-bar.component.html',
  styleUrls: ['./main-side-bar.component.scss']
})
export class MainSideBarComponent implements OnInit {

  constructor() { }
  sidebarExpanded = true; 
  toggleSidebar() {
    this.sidebarExpanded = !this.sidebarExpanded;
  }
  ngOnInit(): void {
  }

}
