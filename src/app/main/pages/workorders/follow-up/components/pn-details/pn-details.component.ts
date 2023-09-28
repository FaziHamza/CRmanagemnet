import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pn-details',
  templateUrl: './pn-details.component.html',
  styleUrls: ['./pn-details.component.scss']
})
export class PnDetailsComponent implements OnInit {
  @Input() data;
  details
  constructor(
    public _activeModal: NgbActiveModal,
    private sanitizer: DomSanitizer, private _datePipe: DatePipe,

) { }

  ngOnInit(): void {
    this.details = this.data['details'];
    console.log(this.data);
  }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  highlightDate(date) {
    let currentDate = new Date(this._datePipe.transform(new Date(), 'MMM d, y'));
    let pnDate = new Date(date);
    if (currentDate > pnDate)
      return '#DC3545'
    else if (currentDate < pnDate)
      return '#4E9AFF'
    else
      return '#2eb93e'
  }
}
