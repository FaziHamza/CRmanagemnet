import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appPreventMinus]',
})
export class PreventMinusDirective {
  constructor(private el: ElementRef) {}
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // console.log(event);
    // console.log(event.key);

    const initalValue = this.el.nativeElement.value;
    console.log(initalValue);
    // initalValue === 0 ||

    if (+initalValue === 0) {
      this.el.nativeElement.value = '';
    }

    if (
      (initalValue.length === 0 && event.key === '0') ||
      (+initalValue === 0 && initalValue.length === 1 && event.key === '0')
    ) {
      event.preventDefault();
    }

    if (event.code === 'Minus') {
      event.preventDefault();
    }
  }
}
