"use strict";
exports.__esModule = true;
var Vector = /** @class */ (function () {
    function Vector(rowCounter, width, height, radius) {
        this.x = this.generateRandomNumber(width, radius);
        this.y = this.generateRandomNumber(height, radius);
        this.id = rowCounter;
    }
    Vector.prototype.generateRandomNumber = function (value, radius) {
        return Math.floor(Math.random() * (value - (radius * 4))) + (radius * 2);
    };
    return Vector;
}());
exports.Vector = Vector;
