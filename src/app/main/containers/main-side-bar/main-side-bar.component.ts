import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-main-side-bar',
  templateUrl: './main-side-bar.component.html',
  styleUrls: ['./main-side-bar.component.scss']
})
export class MainSideBarComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { 
    this.checkWidth();
  }
  sidebarExpanded = true;
  toggleSidebar() {
    this.sidebarExpanded = !this.sidebarExpanded;
  }
  isWorkOrderActive() {
    const currentRoute = this.router.url;
    return currentRoute.includes('/createorders') || currentRoute.includes('/allorder');
  }
  ngOnInit(): void {
    this.checkWidth();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkWidth();
  }

  private checkWidth(): void {
    if (window.innerWidth < 760) {
      this.sidebarExpanded = false;
    }else{
      this.sidebarExpanded = true
    }
  }
}
