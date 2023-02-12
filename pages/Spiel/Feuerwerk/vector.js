"use strict";
var FeuerwerkNamespace;
(function (FeuerwerkNamespace) {
    class Vector {
        constructor(_x, _y) {
            this.x = _x;
            this.y = _y;
        }
        set(_x, _y) {
            this.x = _x;
            this.y = _y;
        }
        copy() {
            return new Vector(this.x, this.y);
        }
    }
    FeuerwerkNamespace.Vector = Vector;
})(FeuerwerkNamespace || (FeuerwerkNamespace = {}));
