import { Observable } from 'tns-core-modules/data/observable';

export class HelloWorldModel extends Observable {
    public message: string;
    public items = ['blah'];

    constructor() {
        super();
        this.message = 'hello';
    }
}
