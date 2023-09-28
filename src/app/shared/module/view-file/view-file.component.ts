import { Component, Input, Sanitizer } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-view-file',
  templateUrl: './view-file.component.html',
  styleUrls: ['./view-file.component.scss']
})
export class ViewFileComponent {
  @Input() imageUploadedView: any;
  constructor(
    public activeModal: NgbActiveModal,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    console.log(this.imageUploadedView);
  }
  viewPdf(file) {
    let src = URL.createObjectURL(file);
    return this.sanitizer.bypassSecurityTrustResourceUrl(src)
  }
}
