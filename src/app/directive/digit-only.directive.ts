import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[digitsOnly]'
})
export class DigitDirective {

  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initialValue = this._el.nativeElement.value;
    const parsedValue = parseInt(initialValue, 10);

    if (isNaN(parsedValue) || parsedValue <= 0) {
      this._el.nativeElement.value = '';
    } else {
      this._el.nativeElement.value = parsedValue;
    }

    if (initialValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
