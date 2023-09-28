import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-message-modal',
  templateUrl: './message-modal.component.html',
  styleUrls: ['./message-modal.component.scss']
})
export class MessageModalComponent implements OnInit {
  @Input() type: string;
  @Input() message;
  @Input() routeName: any;
  @Input() autoCloseDelay: number = 0; // Default to 0, meaning no auto close
  isArray: boolean;

  constructor(public _activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    if (Array.isArray(this.message)) this.isArray = true;
    if(this.type == 'success'){
      setTimeout(() => {
        this._activeModal.close();
      }, 3000); // Convert seconds to milliseconds
    }
  }
}
