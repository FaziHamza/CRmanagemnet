import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'round' })
export class RoundPipe implements PipeTransform {
  transform(value: number, precision: number): number {
    var b = Math.floor(value * 1000) / 1000;
    let formattedValue = b.toFixed(precision);
    return parseFloat(formattedValue);
    // return customRound(value, precision);
  }
}