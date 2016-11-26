import { Component, OnInit, EventEmitter } from '@angular/core';
import { MdButtonToggleChange } from '@angular/material';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent implements OnInit {

  public togglePlay: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  private _togglePlay({ source }: MdButtonToggleChange) {
    this.togglePlay.emit(source.checked);
  }

  public ngOnInit() {
  }


}
