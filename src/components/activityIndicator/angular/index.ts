import { NgModule } from '@angular/core';
import { registerElement } from 'nativescript-angular/element-registry';

@NgModule()
export class NativeScriptMDCActivityIndicatorModule {}

registerElement('MDCActivityIndicator', () => require('../activityIndicator').ActivityIndicator);
