import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';

import { ControlComponent } from './control.component';
import { ControlService } from './control.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  declarations: [ControlComponent],
  entryComponents: [ControlComponent],
  providers: [ControlService]
})
export class ControlModule { }
