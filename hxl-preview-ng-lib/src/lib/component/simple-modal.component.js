"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var SimpleModalComponent = /** @class */ (function () {
    function SimpleModalComponent() {
    }
    SimpleModalComponent.prototype.ngOnInit = function () {
    };
    SimpleModalComponent.prototype.show = function () {
        this.staticModal.show();
    };
    SimpleModalComponent.prototype.hide = function () {
        this.staticModal.hide();
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], SimpleModalComponent.prototype, "title", void 0);
    __decorate([
        core_1.ViewChild('staticModal'),
        __metadata("design:type", ngx_bootstrap_1.ModalDirective)
    ], SimpleModalComponent.prototype, "staticModal", void 0);
    SimpleModalComponent = __decorate([
        core_1.Component({
            selector: 'hxl-simple-modal',
            templateUrl: './simple-modal.component.html',
            styleUrls: ['./simple-modal.component.less']
        }),
        __metadata("design:paramtypes", [])
    ], SimpleModalComponent);
    return SimpleModalComponent;
}());
exports.SimpleModalComponent = SimpleModalComponent;
//# sourceMappingURL=simple-modal.component.js.map