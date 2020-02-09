import { MyLogService } from './service/mylog.service';
import { CookBookService } from './service/cook-book.service';
import { HxlproxyService } from './service/hxlproxy.service';
import { AnalyticsService } from './service/analytics.service';
import { NgModule, ModuleWithProviders } from '@angular/core';
import {BsModalService, ModalModule} from 'ngx-bootstrap/modal';
import { SimpleModalComponent } from './component/simple-modal.component';
import {HttpClientModule} from '@angular/common/http';
import {ComponentLoaderFactory, PositioningService} from 'ngx-bootstrap';

@NgModule({
  imports: [
    HttpClientModule,
    {
        ngModule: ModalModule,
        providers: [BsModalService, ComponentLoaderFactory, PositioningService]
    }
  ],
  declarations: [SimpleModalComponent],
  providers: [HxlproxyService, CookBookService, AnalyticsService, MyLogService],
  exports: [
    SimpleModalComponent
  ]
})
export class SimpleModule {}
