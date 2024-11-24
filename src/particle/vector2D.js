"use strict";
class Vector2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    add(otherVector) {
        return new Vector2D(this.x + otherVector.x, this.y + otherVector.y);
    }
    subtract(otherVector) {
        return new Vector2D(this.x - otherVector.x, this.y - otherVector.y);
    }
    scalarMultiply(scalar) {
        return new Vector2D(this.x * scalar, this.y * scalar);
    }
    dotProduct(otherVector) {
        return (this.x * otherVector.x) + (this.y * otherVector.y);
    }
    magnitude() {
        return Math.sqrt(this.dotProduct(this));
    }
    normalize() {
        const magnitude = this.magnitude();
        if (magnitude === 0) {
            throw new Error('Cannot normalize a zero vector.');
        }
        const coefficient = 1 / magnitude;
        return this.scalarMultiply(coefficient);
    }
    randomize(max = 1, min) {
        if (min === undefined) {
            min = -max;
        }
        const random_x = Math.floor(Math.random() * (max - min + 1) + min);
        const random_y = Math.floor(Math.random() * (max - min + 1) + min);
        return new Vector2D(random_x, random_y);
    }
}
