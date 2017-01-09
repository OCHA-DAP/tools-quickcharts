import { Injectable } from '@angular/core';

declare let window;

@Injectable()
export class DomEventsService {

  constructor() { }

  public sendSavedEvent() {
    this.sendDomEventOnIframeParent('hxlPreviewSaved');
  }

  public sendDomEventOnIframeParent(eventName) {
    if (window.parent) {
      window.parent.document.body.dispatchEvent(new CustomEvent(eventName, {'detail': ''}));
    }
  }

}
