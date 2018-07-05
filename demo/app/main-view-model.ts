import { Observable } from 'tns-core-modules/data/observable';
import { Mdc } from 'nativescript-mdc';

export class HelloWorldModel extends Observable {
  public message: string;
  private mdc: Mdc;

  constructor() {
    super();

    this.mdc = new Mdc();
    this.message = this.mdc.message;
  }
}
