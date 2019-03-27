import { NgModule } from '@angular/core';
import { registerElement } from 'nativescript-angular/element-registry';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';

import { AppBarComponent, appBarMeta } from './appBar.component';
import { AppBarDirective } from './appBar.directive';

@NgModule({
    imports: [NativeScriptModule],
    declarations: [AppBarComponent, AppBarDirective],
    exports: [AppBarComponent, AppBarDirective],
    providers: []
})
export class NativeScriptMDCAppBarModule {}

registerElement('AppBar', () => require('../appbar').AppBar, appBarMeta);
