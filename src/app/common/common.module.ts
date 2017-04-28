import { NgModule } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap';
import { SimpleDropdownComponent } from './component/simple-dropdown/simple-dropdown.component';
import { CommonModule as CoreCommonModule } from '@angular/common';
import { NumberFormatPipe } from './pipe/number-format.pipe';

@NgModule({
  imports: [
    CoreCommonModule,
    BsDropdownModule.forRoot()
  ],
  declarations: [SimpleDropdownComponent, NumberFormatPipe],
  exports: [SimpleDropdownComponent, NumberFormatPipe]
})
export class CommonModule { }
