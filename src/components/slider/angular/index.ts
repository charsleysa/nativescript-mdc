import { NgModule } from '@angular/core';
import { registerElement } from 'nativescript-angular/element-registry';

@NgModule()
export class NativeScriptMDCSliderModule {}

registerElement('MDCSlider', () => require('../slider').Slider);
