import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.scss']
})
export class CreateRequestComponent implements OnInit {
  statusList: any[] = [];
  statusType = 0;
  constructor(private modal: NzModalService,) { }

  ngOnInit(): void {
    this.makeStatusList();
  }
  makeStatusList() {
    this.statusList = [
      {
        name: 'Reschedule PNs',
        id: 1,
      },
      {
        name: 'Transfer PNs',
        id: 2,
      }
    ]
  }
  cancelModal() {
    this.modal.closeAll();
  }
}
