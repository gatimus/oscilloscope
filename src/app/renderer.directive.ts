import { Directive, Input, AfterViewInit, ElementRef } from '@angular/core';
import { WebGLRenderer } from 'three';

@Directive({
  selector: '[renderer]'
})
export class RendererDirective implements AfterViewInit {

  private _element: HTMLElement;

  @Input()
  public renderer: WebGLRenderer;

  constructor(elementRef: ElementRef) {
    this._element = elementRef.nativeElement;
  }

  public ngAfterViewInit() {
    this._element.appendChild(this.renderer.domElement);
  }

}
