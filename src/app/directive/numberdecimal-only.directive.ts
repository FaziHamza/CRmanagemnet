import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumberDecimal]'
})
export class NumberDecimalDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const selectionStart = input.selectionStart;

    // Remove any non-digit and non-decimal characters
    const cleanedValue = value.replace(/[^0-9.]/g, '');

    // Ensure the cleaned value is a valid decimal number and greater than zero
    const isValid = /^[+]?([1-9][0-9]*|[0-9]+(?:[.][0-9]*)?|\.[0-9]+)$/.test(cleanedValue);

    if (!isValid) {
      // If the input is not valid, set the input value to an empty string
      input.value = '';
    } else {
      // If the input is valid, update the element's value to the cleaned value
      input.value = cleanedValue;
    }

    // Adjust the cursor position if dot is added after a number
    if (cleanedValue.includes('.') && selectionStart === value.length) {
      input.setSelectionRange(value.length, value.length);
    }
  }
}
