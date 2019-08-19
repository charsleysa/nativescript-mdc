import { fromObject } from 'tns-core-modules/data/observable';
import { EventData, View } from 'tns-core-modules/ui/core/view';
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
let closeCallback;

export function onLoaded(args: EventData) {
    const stackLayout = args.object;
    stackLayout.on('shownInBottomSheet', (bottomSheetArgs: any) => {
        const context = bottomSheetArgs.context;
        closeCallback = bottomSheetArgs.closeCallback;
        const stackLayout = bottomSheetArgs.object;
        stackLayout.bindingContext = fromObject(context);
        console.log('onShownInBottomSheet');
    })
}

export function onTap(args: EventData) {
    const obj = args.object as View;
    const objId = obj.id;
    console.log('tapped in bottom sheet', objId);
    closeCallback(objId);
}
