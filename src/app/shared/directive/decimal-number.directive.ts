//import { Directive, ElementRef, HostListener } from '@angular/core';

//@Directive({
//  selector: '[appDecimalNumber]'
//})
//export class DecimalNumberDirective {
//  private regex: RegExp = new RegExp(/^\d{0,8}\b\.?\d{0,2}$/g);
//  constructor(private el: ElementRef) {
//  }
//  @HostListener('keydown', ['$event'])
//  onKeyDown(event: KeyboardEvent) {
//    const current: string = this.el.nativeElement.value;
//    const next: string = current.concat(event.ke

//    if (next && !String(next).match(this.regex)) {
//      event.preventDefault();
//    }
//  }
//}
import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appDecimalNumber]'
})
export class DecimalNumberDirective {

  //private regex: RegExp = new RegExp(/^\d*\,?\d{0,2}$/g);
  //private regex: RegExp = new RegExp(/^\d{0,40}\b\.?\d{0,3}$/g);
  private regex: RegExp = new RegExp(/^\d*\.?\d{0,50}$/g);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
  constructor(private el: ElementRef) { }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
  @HostListener("blur")
  setInputFocusOut(): void {
    let value = +(this.el.nativeElement.value)
    if (value > 0) {
      this.el.nativeElement.value = value.toFixed(3);
    }
  }
}
