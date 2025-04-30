"use strict";
class Vector2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    add(other_vector) {
        return new Vector2D(this.x + other_vector.x, this.y + other_vector.y);
    }
    subtract(other_vector) {
        return new Vector2D(this.x - other_vector.x, this.y - other_vector.y);
    }
    scalarMultiply(scalar) {
        return new Vector2D(this.x * scalar, this.y * scalar);
    }
    dotProduct(other_vector) {
        return (this.x * other_vector.x) + (this.y * other_vector.y);
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
    clone() {
        return new Vector2D(this.x, this.y);
    }
    equals(other_vector) {
        return this.x === other_vector.x && this.y === other_vector.y;
    }
    static randomize_int(max = 1, min) {
        if (min === undefined) {
            min = -max;
        }
        const random_x = Math.floor(Math.random() * (max - min + 1) + min);
        const random_y = Math.floor(Math.random() * (max - min + 1) + min);
        return new Vector2D(random_x, random_y);
    }
    static randomize_float(max = 1, min) {
        if (min === undefined) {
            min = -max;
        }
        const random_x = Math.random() * (max - min) + min;
        const random_y = Math.random() * (max - min) + min;
        return new Vector2D(random_x, random_y);
    }
}
