import { LoginResult, PromptResult } from 'tns-core-modules/ui/dialogs';
declare module '@nativescript/core/ui/core/view/view' {
    interface View {
        _setupAsRootView(context: any): void;
        callLoaded(): void;
    }
}
export declare function alert(arg: any): Promise<void>;
export declare class AlertDialog {
    private options;
    dialog: androidx.appcompat.app.AlertDialog;
    constructor(options: any);
    show(): void;
    hide(): void;
}
export declare function confirm(arg: any): Promise<boolean>;
export declare function prompt(arg: any): Promise<PromptResult>;
export declare function login(arg: any): Promise<LoginResult>;
export declare function action(arg: any): Promise<string>;
