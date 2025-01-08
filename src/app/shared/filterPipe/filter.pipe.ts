
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})

export class FilterPipe implements PipeTransform {

  transform(items: any[], status: string[]): any[] {
    if (!items || !status) return items;
    return items.filter(item => status.includes(item.status));
  }
}
