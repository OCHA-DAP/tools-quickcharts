"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var simple_modal_component_1 = require("./simple-modal.component");
var ngx_bootstrap_1 = require("ngx-bootstrap");
describe('SimpleModalComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [simple_modal_component_1.SimpleModalComponent],
            imports: [ngx_bootstrap_1.ModalModule.forRoot()]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(simple_modal_component_1.SimpleModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=simple-modal.component.spec.js.map