import { Property, View } from 'tns-core-modules/ui/core/view';
export declare abstract class ActivityIndicatorBase extends View {
    busy: boolean;
    startAnimating(): void;
    stopAnimating(): void;
}
export declare const busyProperty: Property<ActivityIndicatorBase, boolean>;
