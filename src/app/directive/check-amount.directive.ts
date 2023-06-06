import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCheckAmount]',
})
export class CheckAmountDirective {
  constructor(private el: ElementRef) {}
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // console.log(event);
    // console.log(event.key);

    const initalValue = this.el.nativeElement.value;
    // initalValue === 0 ||

    // if (+initalValue === 0) {
    //   this.el.nativeElement.value = '';
    // }
    const val = initalValue;
    const val2 = +initalValue;

    console.log(val);
    console.log(+val2);
    console.log(event.key );

    // initalValue === '0' ||
    // (initalValue === '00' &&
    if (
      val === '0' &&
      event.key === '0'
      // (+initalValue === 0 && initalValue.length === 1 && event.key === '0')
    ) {
      event.preventDefault();
    }

    if (event.code === 'Minus') {
      event.preventDefault();
    }
  }
}
