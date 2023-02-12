"use strict";
var FeuerwerkNamespace;
(function (FeuerwerkNamespace) {
    class Moveable {
        constructor(_position) {
            this.expendable = false;
            this.duration = 4;
            if (_position) {
                this.position = _position.copy();
            }
            else {
                this.position = new FeuerwerkNamespace.Vector(0, 0);
            }
        }
    }
    FeuerwerkNamespace.Moveable = Moveable;
})(FeuerwerkNamespace || (FeuerwerkNamespace = {}));
