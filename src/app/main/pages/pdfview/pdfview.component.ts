import { Component, Input, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-pdfview',
  templateUrl: './pdfview.component.html',
  styleUrls: ['./pdfview.component.scss']
})
export class PDFViewComponent implements OnInit {
  @Input() data:any;
  constructor(private modal: NzModalService) { }

  ngOnInit(): void {
  }
  close() {
    this.modal.closeAll();
  }
}
