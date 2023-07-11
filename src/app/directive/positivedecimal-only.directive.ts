import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appPositiveDecimal]'
})
export class PositiveDecimalDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const selectionStart = input.selectionStart;

    // Remove any non-digit and non-decimal characters
    const cleanedValue = value.replace(/[^0-9.]/g, '');

    // Ensure the cleaned value is a valid decimal number
    const isValid = /^[+]?([0-9]+(?:[.][0-9]{0,3})?|\.[0-9]{0,3})$/.test(cleanedValue) && !cleanedValue.includes('-');
    if (!isValid) {
      // If the input is not valid, set the input value to an empty string
      if(input.value.includes('-'))
          input.value = '';
      else if(cleanedValue.includes('.'))
          input.value = parseFloat(cleanedValue).toFixed(3);
      else
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
