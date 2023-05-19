import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';

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
    this.router.navigateByUrl('/');
  }
  close() {
    this.modal.closeAll();
  }
}
