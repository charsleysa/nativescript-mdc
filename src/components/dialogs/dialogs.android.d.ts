import { LoginResult, PromptResult } from 'tns-core-modules/ui/dialogs';
export declare function alert(arg: any): Promise<void>;
export declare class AlertDialog {
    private options;
    dialog: android.support.v7.app.AlertDialog;
    constructor(options: any);
    show(): void;
    hide(): void;
}
export declare function confirm(arg: any): Promise<boolean>;
export declare function prompt(arg: any): Promise<PromptResult>;
export declare function login(arg: any): Promise<LoginResult>;
export declare function action(arg: any): Promise<string>;
