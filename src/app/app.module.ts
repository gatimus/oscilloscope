import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialRootModule } from '@angular/material';

import { AppComponent } from './app.component';
import { RendererDirective } from './renderer.directive';
import { ControlModule } from './control/control.module';

@NgModule({
  declarations: [
    AppComponent,
    RendererDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialRootModule,
    ControlModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
