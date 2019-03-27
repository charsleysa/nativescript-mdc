import { NgModule } from '@angular/core';
import { registerElement } from 'nativescript-angular/element-registry';

@NgModule()
export class NativeScriptMDCFloatingActionButtonModule {}

registerElement('MDCFloatingActionButton', () => require('../floatingactionbutton').FloatingActionButton);
