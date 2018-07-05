var Mdc = require("nativescript-mdc").Mdc;
var mdc = new Mdc();

describe("greet function", function() {
    it("exists", function() {
        expect(mdc.greet).toBeDefined();
    });

    it("returns a string", function() {
        expect(mdc.greet()).toEqual("Hello, NS");
    });
});