import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterComponent } from './components/filter/filter.component';
import { FormsModule } from '@angular/forms';

const SHARED_COMPONENTS = [FilterComponent];

const SHARED_MODULES = [CommonModule, FormsModule];

@NgModule({
  declarations: [...SHARED_COMPONENTS],
  imports: [...SHARED_MODULES],
  exports: [...SHARED_COMPONENTS, ...SHARED_MODULES],
})
export class SharedModule {}
