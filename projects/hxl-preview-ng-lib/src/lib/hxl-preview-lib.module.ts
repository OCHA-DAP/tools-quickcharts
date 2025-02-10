import { MyLogService } from './service/mylog.service';
import { CookBookService } from './service/cook-book.service';
import { HxlproxyService } from './service/hxlproxy.service';
import { AnalyticsService } from './service/analytics.service';
import { NgModule, ModuleWithProviders } from '@angular/core';
import {BsModalService, ModalModule} from 'ngx-bootstrap/modal';
import { SimpleModalComponent } from './component/simple-modal.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentLoaderFactory } from 'ngx-bootstrap/component-loader';
import { PositioningService } from 'ngx-bootstrap/positioning';

@NgModule({ declarations: [SimpleModalComponent],
    exports: [
        SimpleModalComponent
    ], imports: [{
            ngModule: ModalModule,
            providers: [BsModalService, ComponentLoaderFactory, PositioningService]
        }], providers: [HxlproxyService, CookBookService, AnalyticsService, MyLogService, provideHttpClient(withInterceptorsFromDi())] })
export class HxlPreviewLibModule {}
