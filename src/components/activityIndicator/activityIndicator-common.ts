import { CSSType, layout, Property, booleanConverter, View } from 'tns-core-modules/ui/core/view';

@CSSType('MDCActivityIndicator')
export abstract class ActivityIndicatorBase extends View {
    public busy: boolean;

    public startAnimating() {
        this.busy = true;
    }
    public stopAnimating() {
        this.busy = false;
    }

    // public onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void {
    //     const width = layout.getMeasureSpecSize(widthMeasureSpec);
    //     const widthMode = layout.getMeasureSpecMode(widthMeasureSpec);

    //     const height = layout.getMeasureSpecSize(heightMeasureSpec);
    //     const heightMode = layout.getMeasureSpecMode(heightMeasureSpec);
    //     const finiteWidth: boolean = widthMode === layout.EXACTLY;
    //     const finiteHeight: boolean = heightMode === layout.EXACTLY;
    //     if (finiteWidth || finiteHeight) {
    //         let nativeWidth = finiteWidth ? width : height;
    //         let nativeHeight = finiteHeight ? height : width;
    //         nativeWidth = nativeHeight = Math.min(nativeWidth, nativeHeight);
    //         super.onMeasure(layout.makeMeasureSpec(nativeWidth, layout.EXACTLY), layout.makeMeasureSpec(nativeHeight, layout.EXACTLY));
    //     } else {
    //         super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    //     }
    // }
}

export const busyProperty = new Property<ActivityIndicatorBase, boolean>({
    name: 'busy',
    defaultValue: false,
    valueConverter: booleanConverter
});
busyProperty.register(ActivityIndicatorBase);
