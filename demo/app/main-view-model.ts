import { Observable, EventData } from 'tns-core-modules/data/observable';
import { View } from 'tns-core-modules/ui/core/view';

export class HelloWorldModel extends Observable {
    public message: string;
    public items = ['blah'];

    constructor() {
        super();
        this.message = 'hello';
    }

    public openBottomSheet(args: EventData) {
        console.log('opening bottom sheet');
        const obj = args.object as View;
        obj.showBottomSheet('bottomSheet/bottomSheet-fragment', {
            context: {},
            closeCallback: (objId) => {
                alert(`BottomSheet closed by ${objId}`);
            }
        });
    }
}
