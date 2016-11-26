import { Injectable, ComponentRef } from '@angular/core';
import { Overlay, OverlayState, OverlayRef, ComponentPortal } from '@angular/material';

import { ControlComponent } from './control.component';

@Injectable()
export class ControlService {

  private _overleyRef: OverlayRef;

  private _controlComponentRef: ComponentRef<ControlComponent>;

  public get controls(): ControlComponent { return this._controlComponentRef.instance; }

  constructor(private _overlay: Overlay) {
    this._overleyRef = this._createOverlayRef(this._overlay);
    this._controlComponentRef = this._createComponent(this._overleyRef);
  }

  private _createOverlayRef(overlay: Overlay): OverlayRef {
      let overlayState = new OverlayState();
      overlayState.positionStrategy = overlay.position()
          .global()
          .fixed()
          .bottom('0')
          .centerHorizontally();
      return overlay.create(overlayState);
  }

  private _createComponent(overlayRef: OverlayRef): ComponentRef<ControlComponent> {
      let portal: ComponentPortal<ControlComponent> = new ComponentPortal(ControlComponent);
      return overlayRef.attach(portal);
  }

}
