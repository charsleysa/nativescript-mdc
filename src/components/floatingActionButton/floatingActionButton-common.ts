import { CSSType, View, traceEnabled, traceWrite, traceCategories, booleanConverter, layout } from 'tns-core-modules/ui/core/view';
import { ImageAsset } from 'tns-core-modules/image-asset/image-asset';
import { fromAsset, fromNativeSource, fromUrl, ImageSource } from 'tns-core-modules/image-source';
import { isDataURI, isFontIconURI, isFileOrResourcePath, RESOURCE_PREFIX } from 'tns-core-modules/utils/utils';
import { Property } from 'tns-core-modules/ui/core/properties';

import { cssProperty } from '../core/cssproperties';

@CSSType('MDCFloatingActionButton')
export abstract class FloatingActionButtonBase extends View {
    constructor() {
        super();
        // we need to set the default through css or user would not be able to overload it through css...
        this.style['css:margin'] = 16;
    }

    @cssProperty elevation: number;

    public fabSize: string;
    public imageSource: ImageSource;
    public icon: string | ImageSource;
    public isLoading: boolean;

    /**
     * @internal
     */
    public _createImageSourceFromSrc(value: string | ImageSource | ImageAsset): void {
        const originalValue = value;
        if (typeof value === 'string' || value instanceof String) {
            value = value.trim();
            this.imageSource = null;
            this['_url'] = value;

            this.isLoading = true;

            const source = new ImageSource();
            const imageLoaded = () => {
                let currentValue = this.icon;
                if (currentValue !== originalValue) {
                    return;
                }
                this.imageSource = source;
                this.isLoading = false;
            };

            if (isFontIconURI(value)) {
                const fontIconCode = value.split('//')[1];
                if (fontIconCode !== undefined) {
                    // support sync mode only
                    const font = this.style.fontInternal;
                    const color = this.style.color;
                    source.loadFromFontIconCode(fontIconCode, font, color);
                    imageLoaded();
                }
            } else if (isDataURI(value)) {
                const base64Data = value.split(',')[1];
                if (base64Data !== undefined) {
                    source.loadFromBase64(base64Data);
                    imageLoaded();
                }
            } else if (isFileOrResourcePath(value)) {
                if (value.indexOf(RESOURCE_PREFIX) === 0) {
                    const resPath = value.substr(RESOURCE_PREFIX.length);
                    source.loadFromResource(resPath);
                    imageLoaded();
                } else {
                    source.loadFromFile(value);
                    imageLoaded();
                }
            } else {
                this.imageSource = null;
                fromUrl(value).then((r) => {
                    if (this['_url'] === value) {
                        this.imageSource = r;
                        this.isLoading = false;
                    }
                }, err => {
                    // catch: Response content may not be converted to an Image
                    this.isLoading = false;
                    if (traceEnabled()) {
                        if (typeof err === 'object' && err.message) {
                            err = err.message;
                        }
                        traceWrite(err, traceCategories.Debug);
                    }
                });
            }
        } else if (value instanceof ImageSource) {
            // Support binding the imageSource trough the src property
            this.imageSource = value;
            this.isLoading = false;
        } else if (value instanceof ImageAsset) {
            fromAsset(value).then((result) => {
                this.imageSource = result;
                this.isLoading = false;
            });
        } else {
            this.imageSource = fromNativeSource(value);
            this.isLoading = false;
        }
    }

    public measure(widthMeasureSpec: number, heightMeasureSpec: number): void {
        console.log('measure');
        const unspecified = layout.makeMeasureSpec(0, layout.UNSPECIFIED);
        super.measure(unspecified, unspecified);
    }

    public onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void {
        console.log('onMeasure');
        const unspecified = layout.makeMeasureSpec(0, layout.UNSPECIFIED);
        super.onMeasure(unspecified, unspecified);
    }
}

export const fabSizeProperty = new Property<FloatingActionButtonBase, 'mini' | 'normal'>({ name: 'fabSize', defaultValue: 'normal' });
fabSizeProperty.register(FloatingActionButtonBase);

export const imageSourceProperty = new Property<FloatingActionButtonBase, ImageSource>({ name: 'imageSource' });
imageSourceProperty.register(FloatingActionButtonBase);

export const iconProperty = new Property<FloatingActionButtonBase, any>({ name: 'icon' });
iconProperty.register(FloatingActionButtonBase);

export const isLoadingProperty = new Property<FloatingActionButtonBase, boolean>({ name: 'isLoading', defaultValue: false, valueConverter: booleanConverter });
isLoadingProperty.register(FloatingActionButtonBase);
