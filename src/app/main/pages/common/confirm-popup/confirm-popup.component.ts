import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-confirm-popup',
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.scss']
})
export class ConfirmPopupComponent implements OnInit {
  constructor(private modal: NzModalService) { }

  ngOnInit(): void {
  }
  logout() {
    this.modal.closeAll();
  }
  close() {
    this.modal.closeAll();
  }

}
