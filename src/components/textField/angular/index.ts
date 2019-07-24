import { NgModule } from '@angular/core';
import { registerElement } from 'nativescript-angular/element-registry';

import { DIRECTIVES } from './directives';

@NgModule({
    imports: [],
    declarations: [DIRECTIVES],
    exports: [DIRECTIVES],
    providers: []
})
export class NativeScriptMDCTextFieldModule {}

registerElement('MDCTextField', () => require('../textField').TextField);
