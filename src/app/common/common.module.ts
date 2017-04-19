import { NgModule } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap';
import { SimpleDropdownComponent } from './component/simple-dropdown/simple-dropdown.component';
import { CommonModule as CoreCommonModule } from '@angular/common';

@NgModule({
  imports: [
    CoreCommonModule,
    BsDropdownModule.forRoot()
  ],
  declarations: [SimpleDropdownComponent],
  exports: [SimpleDropdownComponent]
})
export class CommonModule { }
