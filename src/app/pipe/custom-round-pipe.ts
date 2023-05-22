import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'customRound' })
export class CustomRoundPipe implements PipeTransform {
  transform(value: number, precision: number): number {
    return customRound(value, precision);
  }
}
function customRound(value: number, precision: number): number {
    const factor = Math.pow(10, precision);
    return Math.round(value * factor) / factor;
  }