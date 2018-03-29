import { NgModule } from '@angular/core';
import { BsDropdownModule, ModalModule } from 'ngx-bootstrap';
import { SimpleDropdownComponent } from './component/simple-dropdown/simple-dropdown.component';
import { CommonModule as CoreCommonModule } from '@angular/common';
import { NumberFormatPipe } from './pipe/number-format.pipe';
import { CheckboxSliderComponent } from './component/checkbox-slider/checkbox-slider.component';
// import { SimpleModalComponent } from './component/simple-modal/simple-modal.component';

@NgModule({
  imports: [
    CoreCommonModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [SimpleDropdownComponent, NumberFormatPipe, CheckboxSliderComponent],
  exports: [SimpleDropdownComponent, NumberFormatPipe, CheckboxSliderComponent]
})
export class CommonModule { }
