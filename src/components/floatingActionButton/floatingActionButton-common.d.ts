import { View } from 'tns-core-modules/ui/core/view';
import { ImageAsset } from 'tns-core-modules/image-asset/image-asset';
import { ImageSource } from 'tns-core-modules/image-source';
import { Property } from 'tns-core-modules/ui/core/properties';
export declare abstract class FloatingActionButtonBase extends View {
    constructor();
    elevation: number;
    fabSize: string;
    imageSource: ImageSource;
    src: string | ImageSource;
    isLoading: boolean;
    _createImageSourceFromSrc(value: string | ImageSource | ImageAsset): void;
}
export declare const fabSizeProperty: Property<FloatingActionButtonBase, "auto" | "normal" | "mini">;
export declare const imageSourceProperty: Property<FloatingActionButtonBase, ImageSource>;
export declare const srcProperty: Property<FloatingActionButtonBase, any>;
export declare const isLoadingProperty: Property<FloatingActionButtonBase, boolean>;
