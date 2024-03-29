import { Component, Input, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-confirm-popup',
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.scss']
})
export class ConfirmPopupComponent implements OnInit {
  @Input() message: string
  constructor(private modal: NzModalService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.close();
    }, 3000); // Convert seconds to milliseconds
  }
  logout() {
    this.modal.closeAll();
  }
  close() {
    this.modal.closeAll();
  }

}
