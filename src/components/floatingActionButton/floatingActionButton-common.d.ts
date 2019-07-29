import { View } from 'tns-core-modules/ui/core/view';
import { ImageAsset } from 'tns-core-modules/image-asset/image-asset';
import { ImageSource } from 'tns-core-modules/image-source';
import { Property } from 'tns-core-modules/ui/core/properties';
export declare abstract class FloatingActionButtonBase extends View {
    constructor();
    elevation: number;
    fabSize: string;
    imageSource: ImageSource;
    icon: string | ImageSource;
    isLoading: boolean;
    _createImageSourceFromSrc(value: string | ImageSource | ImageAsset): void;
    measure(widthMeasureSpec: number, heightMeasureSpec: number): void;
    onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void;
}
export declare const fabSizeProperty: Property<FloatingActionButtonBase, "normal" | "mini">;
export declare const imageSourceProperty: Property<FloatingActionButtonBase, ImageSource>;
export declare const iconProperty: Property<FloatingActionButtonBase, any>;
export declare const isLoadingProperty: Property<FloatingActionButtonBase, boolean>;
