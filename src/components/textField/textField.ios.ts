import { placeholderColorProperty } from 'tns-core-modules/ui/editable-text-base/editable-text-base';
import { Color } from 'tns-core-modules/color';
import { Background } from 'tns-core-modules/ui/styling/background';
import { screen } from 'tns-core-modules/platform/platform';
import {
    backgroundColorProperty,
    borderTopColorProperty,
    borderTopLeftRadiusProperty,
    borderTopRightRadiusProperty,
    borderBottomLeftRadiusProperty,
    borderBottomRightRadiusProperty,
    Length
} from 'tns-core-modules/ui/core/view';

import { getColor } from '../core/ios/utils';
import { themer, getColorWithDefaultAlpha } from '../core/core';
import { TextFieldBase, errorColorProperty, errorProperty, floatingColorProperty, floatingProperty, helperProperty, maxLengthProperty } from './textField-common';

declare module '@nativescript/core/ui/text-field/text-field' {
    interface TextField {
        _updateAttributedPlaceholder();
    }
}

class MDCTextInputControllerOutlinedImpl extends MDCTextInputControllerOutlined {
    private _owner: WeakRef<TextField>;
    public static initWithOwner(owner: WeakRef<TextField>): MDCTextInputControllerOutlinedImpl {
        const handler = <MDCTextInputControllerOutlinedImpl>MDCTextInputControllerOutlinedImpl.new();
        handler._owner = owner;
        return handler;
    }
    textInsets(defaultValue) {
        let result = super.textInsets(defaultValue);
        const owner = this._owner ? this._owner.get() : null;
        if (owner) {
            result = owner._getTextInsetsForBounds(result);
        }
        return result;
    }
}
class MDCTextInputControllerFilledImpl extends MDCTextInputControllerFilled {
    private _owner: WeakRef<TextField>;
    public static initWithOwner(owner: WeakRef<TextField>): MDCTextInputControllerFilledImpl {
        const handler = <MDCTextInputControllerFilledImpl>MDCTextInputControllerFilledImpl.new();
        handler._owner = owner;
        return handler;
    }
    textInsets(defaultValue) {
        let result = super.textInsets(defaultValue);
        const owner = this._owner ? this._owner.get() : null;
        if (owner) {
            result = owner._getTextInsetsForBounds(result);
        }
        return result;
    }
}

export class TextField extends TextFieldBase {
    nativeViewProtected: MDCTextField;
    private _controller: MDCTextInputControllerFilled | MDCTextInputControllerOutlined;

    get ios(): MDCTextField {
        return this.nativeViewProtected;
    }

    public createNativeView() {
        const view = MDCTextField.new();
        const owner = new WeakRef(this);
        this._controller = (this.variant === 'outlined')
            ? MDCTextInputControllerOutlinedImpl.initWithOwner(owner)
            : MDCTextInputControllerFilledImpl.initWithOwner(owner);
        this._controller.textInput = view;
        view.textInsetsMode = MDCTextInputTextInsetsMode.IfContent;

        this._controller.applyThemeWithScheme(themer.appScheme);

        return view;
    }

    public _getTextInsetsForBounds(insets: UIEdgeInsets): UIEdgeInsets {
        const scale = screen.mainScreen.scale;

        insets.left += (this.effectiveBorderLeftWidth + this.effectivePaddingLeft) / scale;
        insets.top += (this.effectiveBorderTopWidth + this.effectivePaddingTop) / scale;
        insets.right += (this.effectivePaddingRight + this.effectiveBorderRightWidth) / scale;
        insets.bottom += (this.effectivePaddingBottom + this.effectiveBorderBottomWidth) / scale;

        return insets;
    }

    public clearFocus() {
        this.dismissSoftInput();
    }

    public requestFocus() {
        this.focus();
    }

    // TODO: check why i was checking for isFirstResponder
    // with it the blur event is not fired anymore

    // public dismissSoftInput() {
    //     if (this.nativeViewProtected.isFirstResponder) {
    //         super.dismissSoftInput();
    //     }
    // }

    public blur() {
        this.dismissSoftInput();
    }

    [floatingColorProperty.setNative](value: Color) {
        const color = value instanceof Color ? value.ios : value;
        this._controller.floatingPlaceholderActiveColor = color;
        // this._controller.inlinePlaceholderColor = color;
        this._updateAttributedPlaceholder();
    }
    [placeholderColorProperty.setNative](value: Color) {
        const color = value instanceof Color ? value.ios : value;
        this._controller.inlinePlaceholderColor = color;
        if (!this.floatingColor) {
            this._controller.floatingPlaceholderActiveColor = color;
        }
        this._updateAttributedPlaceholder();
    }
    [errorColorProperty.setNative](value: Color) {
        const color = value instanceof Color ? value.ios : value;
        this._controller.errorColor = color;
    }
    [helperProperty.setNative](value: string) {
        this._controller.helperText = value;
    }
    [maxLengthProperty.setNative](value: number) {
        this._controller.characterCountMax = value;
    }
    [floatingProperty.setNative](value: boolean) {
        this._controller.floatingEnabled = value;
    }
    [errorProperty.setNative](value: string) {
        this._controller.setErrorTextErrorAccessibilityValue(value, value);
    }

    [backgroundColorProperty.getDefault](): Color {
        if (this._controller instanceof MDCTextInputControllerFilled) {
            return getColor(this._controller.borderFillColor);
        } else {
            return getColor(this._controller.activeColor);
        }
    }

    [backgroundColorProperty.setNative](value: Color) {
        if (this._controller instanceof MDCTextInputControllerFilled) {
            this._controller.borderFillColor = getColorWithDefaultAlpha(value, 15).ios;
        } else {
            this._controller.activeColor = value.ios;
        }
    }

    [borderTopColorProperty.getDefault](): Color {
        if (this._controller instanceof MDCTextInputControllerFilled) {
            return getColor(this._controller.activeColor);
        } else {
            return getColor(this._controller.normalColor);
        }
    }

    [borderTopColorProperty.setNative](value: Color) {
        if (this._controller instanceof MDCTextInputControllerFilled) {
            this._controller.activeColor = value.ios;
        } else {
            this._controller.normalColor = getColorWithDefaultAlpha(value, 138).ios;
        }
    }

    [borderTopLeftRadiusProperty.getDefault](): Length {
        // Corner manipulation not yet supported in ios: https://github.com/material-components/material-components-ios/issues/2631
        return { unit: 'px', value: 0 };
    }

    [borderTopLeftRadiusProperty.setNative](value: Length) {
        // Corner manipulation not yet supported in ios: https://github.com/material-components/material-components-ios/issues/2631
    }

    [borderTopRightRadiusProperty.getDefault](): Length {
        // Corner manipulation not yet supported in ios: https://github.com/material-components/material-components-ios/issues/2631
        return { unit: 'px', value: 0 };
    }

    [borderTopRightRadiusProperty.setNative](value: Length) {
        // Corner manipulation not yet supported in ios: https://github.com/material-components/material-components-ios/issues/2631
    }

    [borderBottomLeftRadiusProperty.getDefault](): Length {
        // Corner manipulation not yet supported in ios: https://github.com/material-components/material-components-ios/issues/2631
        return { unit: 'px', value: 0 };
    }

    [borderBottomLeftRadiusProperty.setNative](value: Length) {
        // Corner manipulation not yet supported in ios: https://github.com/material-components/material-components-ios/issues/2631
    }

    [borderBottomRightRadiusProperty.getDefault](): Length {
        // Corner manipulation not yet supported in ios: https://github.com/material-components/material-components-ios/issues/2631
        return { unit: 'px', value: 0 };
    }

    [borderBottomRightRadiusProperty.setNative](value: Length) {
        // Corner manipulation not yet supported in ios: https://github.com/material-components/material-components-ios/issues/2631
    }

    _redrawNativeBackground(value: Background): void {
        return;
    }
}
