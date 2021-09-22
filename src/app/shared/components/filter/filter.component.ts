import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Filter } from 'src/app/interfaces/filter';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent {
  query = '';
  sort = '';
  icons = ['fas fa-sort-alpha-up', 'fas fa-sort-alpha-down'];
  orderState: { [key: string]: number } = {};

  @Input() orderOptions: OrderOption[] = [];

  @Output() filter = new EventEmitter<Filter>();

  constructor() {}

  get order() {
    if (this.sort) {
      if (this.orderState[this.sort] === 0) {
        return 'asc';
      } else if (this.orderState[this.sort] === 1) {
        return 'desc';
      }
    }
    return undefined;
  }

  toggleOrder(field: string) {
    let state = -1;
    this.sort = field;
    if (this.orderState[field] === 0) {
      state = 1;
    } else if (this.orderState[field] === 1) {
      state = -1;
      this.sort = '';
    } else {
      state = 0;
    }

    this.orderState = { [field]: state };
    const filter = { q: this.query, sort: this.sort, order: this.order };
    this.filter.emit(filter);
  }

  trackByIdx(idx: number) {
    return idx;
  }
}

interface OrderOption {
  field: string;
  label: string;
}
