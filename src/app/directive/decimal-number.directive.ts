import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDecimalNumber]'
})
export class DecimalNumberDirective {

  // Allow decimal numbers
  private regex: RegExp = new RegExp(/^\d{0,8}\b\.?\d{0,2}$/g);

  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  // private specialKeys: Array<string> = [ 'Tab', 'End', 'Home', 'Control', 'ArrowRight', 'ArrowLeft', 'Delete'];

  constructor(private el: ElementRef) {
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    // if (this.specialKeys.indexOf(event.key) !== -1) {
    //   return;
    // }
    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);

    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }

}
