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
    const modal = this.modal.create<LogoutComponent>({
      // nzTitle: 'Change Control Value',
      nzContent: LogoutComponent,
      // nzViewContainerRef: this.viewContainerRef,
      // nzOnOk: () => new Promise(resolve => setTimeout(resolve, 1000)),
      nzFooter: null
    });
    modal.afterClose.subscribe(res => {
      if (res) {
        // this.controls(value, data, obj, res);
      }
    });
  }
}
