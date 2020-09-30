import { NgModule } from '@angular/core';
import { SimpleDropdownComponent } from './component/simple-dropdown/simple-dropdown.component';
import { CommonModule as CoreCommonModule } from '@angular/common';
import { NumberFormatPipe } from './pipe/number-format.pipe';
import { CheckboxSliderComponent } from './component/checkbox-slider/checkbox-slider.component';
import { CheckboxSliderOnlyComponent } from './component/checkbox-slider/checkbox-slider-only.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
// import { SimpleModalComponent } from './component/simple-modal/simple-modal.component';

@NgModule({
  imports: [
    CoreCommonModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [SimpleDropdownComponent, NumberFormatPipe, CheckboxSliderComponent, CheckboxSliderOnlyComponent],
  exports: [SimpleDropdownComponent, NumberFormatPipe, CheckboxSliderComponent, CheckboxSliderOnlyComponent]
})
export class CommonModule { }
