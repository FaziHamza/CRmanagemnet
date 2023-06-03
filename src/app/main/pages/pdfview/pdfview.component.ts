import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-pdfview',
  templateUrl: './pdfview.component.html',
  styleUrls: ['./pdfview.component.scss']
})
export class PDFViewComponent implements OnInit {
  @Input() file:any;
  @Input() data:any;
  safeUrl: any;
  constructor(private modal: NzModalService,private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.file);
  }
  close() {
    this.modal.closeAll();
  }
}
