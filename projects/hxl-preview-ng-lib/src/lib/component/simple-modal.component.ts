import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'hxl-simple-modal',
  templateUrl: './simple-modal.component.html',
  styleUrls: ['./simple-modal.component.less']
})
export class SimpleModalComponent implements OnInit {

  @Input()
  title: string;

  @ViewChild('staticModal')
  private staticModal: ModalDirective;

  constructor() { }

  ngOnInit() {
  }

  public show() {
    this.staticModal.show();
  }

  public hide() {
    this.staticModal.hide();
  }

}
