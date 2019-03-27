import { NgModule } from '@angular/core';
import { registerElement } from 'nativescript-angular/element-registry';

@NgModule()
export class NativeScriptMDCRippleModule {}

registerElement('MDCRipple', () => require('../ripple').Ripple);
