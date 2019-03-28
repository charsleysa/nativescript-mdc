import { colorProperty, visibilityProperty, Visibility, Color } from 'tns-core-modules/ui/core/view';

import { ActivityIndicatorBase, busyProperty } from './activityIndicator-common';

export class ActivityIndicator extends ActivityIndicatorBase {
    nativeViewProtected: android.widget.ProgressBar;

    public createNativeView() {
        const progressBar =  new android.widget.ProgressBar(this._context);
        progressBar.setVisibility(android.view.View.INVISIBLE);
        progressBar.setIndeterminate(true);
        return progressBar;
    }

    [busyProperty.getDefault](): boolean {
        return false;
    }
    [busyProperty.setNative](value: boolean) {
        if (this.visibility === 'visible') {
            this.nativeViewProtected.setVisibility(value ? android.view.View.VISIBLE : android.view.View.INVISIBLE);
        }
    }

    [visibilityProperty.getDefault](): Visibility {
        return 'hidden';
    }
    [visibilityProperty.setNative](value: Visibility) {
        switch (value) {
            case 'visible':
                this.nativeViewProtected.setVisibility(this.busy ? android.view.View.VISIBLE : android.view.View.INVISIBLE);
                break;
            case 'hidden':
                this.nativeViewProtected.setVisibility(android.view.View.INVISIBLE);
                break;
            case 'collapse':
                this.nativeViewProtected.setVisibility(android.view.View.GONE);
                break;
            default:
                throw new Error(`Invalid visibility value: ${value}. Valid values are: "${'visible'}", "${'hidden'}", "${'collapse'}".`);
        }
    }

    [colorProperty.getDefault](): number {
        return -1;
    }
    [colorProperty.setNative](value: number | Color) {
        if (value instanceof Color) {
            this.nativeViewProtected.getIndeterminateDrawable().setColorFilter(value.android, android.graphics.PorterDuff.Mode.SRC_IN);
        } else {
            this.nativeViewProtected.getIndeterminateDrawable().clearColorFilter();
        }
    }
}
