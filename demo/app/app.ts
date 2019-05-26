import './bundle-config';
import * as application from 'tns-core-modules/application';
import * as mdc from 'nativescript-mdc';
console.log(mdc);
mdc.install();
application.run({ moduleName: "main-page" });
