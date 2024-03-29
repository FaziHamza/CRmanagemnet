import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
  constructor(private modal: NzModalService,private sanitizer: DomSanitizer,private activeModal : NgbActiveModal) { }

  ngOnInit(): void {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.file);
  }
  close() {
    this.modal.closeAll();
  }
  cancel(){
    this.activeModal.close();
  }
}
