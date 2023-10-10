import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private modal: NzModalService, private router: Router) { }

  ngOnInit(): void {
  }
  logout() {
    localStorage.clear();
    this.modal.closeAll();
    if (environment.apiUrl2.includes('test')) {
      window.location.href = 'https://dx-portalstest.azurewebsites.net/main-menu';
    }
    else if (environment.apiUrl2.includes('dev')) {
      window.location.href = 'https://portals-dx-fe-dev.azurewebsites.net/main-menu';
    }
    else {
      window.location.href = 'https://dx-portalsstage.azurewebsites.net/main-menu';
    }
  }
  close() {
    this.modal.closeAll();
  }
}
