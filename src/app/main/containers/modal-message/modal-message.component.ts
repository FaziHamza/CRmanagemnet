import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-modal-message',
  templateUrl: './modal-message.component.html',
  styleUrls: ['./modal-message.component.scss'],
})
export class ModalMessageComponent implements OnInit {
  @Input() name;
  @Input() type: string;
  @Input() message: string;
  @Input() messageError: any;
  @Input() routeName: any;
  @Output() loadPageData = new EventEmitter<string>();

  @Input() errors;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal
  ) {}
  ngOnInit(): void {
    if (this.type) {
    }
    if (this.type && this.type == 'success') {
      console.log(this.type);
      setTimeout(() => {
        this.router.navigateByUrl(this.routeName);
        this.toLoadData();
        this.modalService.dismissAll();
      }, 5000);
    } else if (this.type && this.type == 'error') {
      console.log(this.type);
      // setTimeout(() => {
      //   this.modalService.dismissAll();
      // }, 4000);
    }
  }

  toLoadData() {
    this.loadPageData.emit();
  }
}
