import { Observable } from 'tns-core-modules/data/observable';

export class HelloWorldModel extends Observable {
    public message: string;

    constructor() {
        super();
        this.message = 'hello';
    }

    loaded(args) {
        let bar = args.object;
        bar.on('tabSelected', (args) => {
            if (args.newIndex === 1) {
                alert('This item has selectable: false, and should be used to perform actions');
            }
            console.log('tab selected ' + args.newIndex);
        });
    }
}
