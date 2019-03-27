import { NgModule } from '@angular/core';
import { registerElement } from 'nativescript-angular/element-registry';

@NgModule()
export class NativeScriptMDCProgressModule {}

registerElement('MDCProgress', () => require('../progress').Progress);
