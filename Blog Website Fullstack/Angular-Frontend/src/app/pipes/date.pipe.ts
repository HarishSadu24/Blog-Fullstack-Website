import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';

@Pipe({
  name: 'date',
  standalone: true
})
export class DateToDistancePipe implements PipeTransform {

  transform(value: Date, ...args: unknown[]): unknown {
    let newValue = '';
    if (value)
      newValue = formatDistanceToNow(value , {addSuffix : true})
    return newValue;
  }

}
