import { NgModule } from '@angular/core';
import { registerElement } from 'nativescript-angular/element-registry';

@NgModule()
export class NativeScriptMDCButtonModule {}

registerElement('MDCButton', () => require('../button').Button);
