"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mylog_service_1 = require("./service/mylog.service");
var cook_book_service_1 = require("./service/cook-book.service");
var hxlproxy_service_1 = require("./service/hxlproxy.service");
var analytics_service_1 = require("./service/analytics.service");
var core_1 = require("@angular/core");
var modal_1 = require("ngx-bootstrap/modal");
var simple_modal_component_1 = require("./component/simple-modal.component");
var http_1 = require("@angular/common/http");
var SimpleModule = /** @class */ (function () {
    function SimpleModule() {
    }
    SimpleModule = __decorate([
        core_1.NgModule({
            imports: [
                http_1.HttpClientModule,
                modal_1.ModalModule
            ],
            declarations: [simple_modal_component_1.SimpleModalComponent],
            providers: [hxlproxy_service_1.HxlproxyService, cook_book_service_1.CookBookService, analytics_service_1.AnalyticsService, mylog_service_1.MyLogService],
            exports: [
                simple_modal_component_1.SimpleModalComponent
            ]
        })
    ], SimpleModule);
    return SimpleModule;
}());
exports.SimpleModule = SimpleModule;
//# sourceMappingURL=simple.module.js.map