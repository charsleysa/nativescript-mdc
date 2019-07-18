/// <reference path="./node_modules/tns-platform-declarations/ios.d.ts" />
/// <reference path="./node_modules/tns-platform-declarations/android-26.d.ts" />
/// <reference path="./typings/mdc.ios.d.ts" />

import { Color } from "tns-core-modules/color/color";
import { Page } from "tns-core-modules/ui/page/page";

declare module 'tns-core-modules/ui/dialogs' {
    function isDialogOptions(arg): boolean;
    function getTextFieldColor(): Color;
    function getLabelColor(): Color;
    function getButtonColors(): { color: Color; backgroundColor: Color };
    function getCurrentPage(): Page;
    const STRING: string;
    const PROMPT: string;
    const CONFIRM: string;
    const ALERT: string;
    const LOGIN: string;
    const OK: string;
    const CANCEL: string;
}
