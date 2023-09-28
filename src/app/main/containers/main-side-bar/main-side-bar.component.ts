import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { LogoutComponent } from '../logout/logout.component';

@Component({
  selector: 'app-main-side-bar',
  templateUrl: './main-side-bar.component.html',
  styleUrls: ['./main-side-bar.component.scss']
})
export class MainSideBarComponent implements OnInit {
  isVisible = false;
  constructor(private router: Router, private route: ActivatedRoute,
    private modal: NzModalService) { 
    this.checkWidth();
  }
  sidebarExpanded = true;
  toggleSidebar() {
    this.sidebarExpanded = !this.sidebarExpanded;
  }
  isWorkOrderActive() {
    const currentRoute = this.router.url;
    return currentRoute.includes('/createorders') || currentRoute.includes('/allorder') || currentRoute.includes('/orde-details') || currentRoute.includes('/updateorders');
  }
  isCmActive(){
    const currentRoute = this.router.url;
    return currentRoute.includes('/cm-setup');
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

  showConfirm(): void {
    //window.location.replace('https://portals-dx-fe-dev.azurewebsites.net/login');
  //  const modal = this.modal.create<LogoutComponent>({
  //    nzContent: LogoutComponent,
  //    nzFooter: null
  //  });
  //  modal.afterClose.subscribe(res => {
  //    if (res) {
  //    }
    //  });
    this.redirectUserAccordingToEnv();
  }
  redirectUserAccordingToEnv() {
    let host = window.location.host;
    //STAGING
    if (host.indexOf('creditmanagementstage.azurewebsites.net') >= 0) {
      window.location.href = 'https://dx-portalsstage.azurewebsites.net'
    }
    //TEST
    else if (host.indexOf('creditmanagementtest.azurewebsites.net') >= 0) {
      window.location.href = 'https://dx-portalstest.azurewebsites.net';
    }
    //DEV
    else if (host.indexOf('cm-dx-fe-dev.azurewebsites.net') >= 0) {
      window.location.href = 'https://portals-dx-fe-dev.azurewebsites.net/';
    }
    //LOCAL
    else if (host.indexOf('localhost:4200') >= 0) {
      // I AM USING PORTAL ON PORT 4201 SO THAT'S' WHY I REDIRECTED HERE
      window.location.href = 'http://localhost:4201';
    }
  }
}
