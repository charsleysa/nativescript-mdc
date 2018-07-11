import * as application from 'tns-core-modules/application/application';
import { Color } from 'tns-core-modules/color/color';
import {
    CardCommon,
    backgroundColorProperty,
    backgroundInternalProperty,
    elevationProperty,
    radiusProperty,
    rippleProperty,
    strokeColorProperty,
    strokeWidthProperty
} from './card-common';

const CardView = (android.support.v7.widget as any).CardView;

export class Card extends CardCommon {
    private _androidViewId: number;

    get android(): any {
        return this.nativeView;
    }

    public createNativeView() {
        return new CardView(this._context);
    }

    public initNativeView() {
        this._androidViewId = android.view.View.generateViewId();
        this.nativeView.setId(this._androidViewId);
    }

    [backgroundColorProperty.setNative](value: Color) {
        try {
            this.nativeView.setCardBackgroundColor(value !== undefined ? value.android : new Color('#FFFFFF').android);
        } catch (error) {
            // do nothing, catch bad color value
            console.log('nativescript-mdc --- invalid background-color value ', error);
        }
    }

    [backgroundInternalProperty.setNative](value: any) {
        if (value) {
            try {
                this.nativeView.setCardBackgroundColor(
                    new Color(value.color !== undefined ? value.color + '' : '#FFFFFF').android
                );
            } catch (error) {
                // do nothing, catch bad color value
                console.log('nativescript-mdc --- invalid background-color value:', error);
            }
        }
    }

    [elevationProperty.setNative](value: number) {
        this.nativeView.setCardElevation(value);
    }

    [radiusProperty.setNative](value: number) {
        this.nativeView.setRadius(value);
    }

    [rippleProperty.setNative](value: boolean) {
        if (!value) {
            this.nativeView.setClickable(false);
        } else {
            const attr = java.lang.Class.forName('android.support.v7.appcompat.R$attr');
            const field = attr.getField('selectableItemBackground');

            if (field) {
                const resId = field.getInt(null);

                const attrs = Array.create('int', 1);
                attrs[0] = resId;
                const activity = application.android.foregroundActivity;
                const typedValue = activity.obtainStyledAttributes(attrs);
                const selectedItemDrawable = typedValue.getDrawable(0);

                this.nativeView.setForeground(selectedItemDrawable);
                this.nativeView.setClickable(true);
            }
        }
    }

    [strokeColorProperty.setNative](value: Color) {
        this.nativeView.setStrokeColor(value !== undefined ? value.android : new Color('#FFFFFF').android);
    }

    [strokeWidthProperty.setNative](value: number) {
        this.nativeView.setStrokeWidth(value);
    }
}
