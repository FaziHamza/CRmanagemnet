import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'customRound' })
export class CustomRoundPipe implements PipeTransform {
  transform(value: number, precision: number): number {
    var b = Math.floor(value * 1000) / 1000;
    let formattedValue = b.toFixed(precision);
    return parseFloat(formattedValue);
    // return customRound(value, precision);
  }
}
function customRound(value: number, precision: number): number {
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
}