import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'rounded' })
export class RoundedPipe implements PipeTransform {
  transform(value: number, precision: number): string {
    var b = Math.floor(value * 1000) / 1000;
    let formattedValue = b.toFixed(precision);
    return formattedValue;
    // return customRound(value, precision);
  }
}
