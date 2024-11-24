class Vector2D {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }
  
  add(otherVector: Vector2D): Vector2D {
    return new Vector2D(this.x + otherVector.x, this.y + otherVector.y);
  }

  subtract(otherVector: Vector2D): Vector2D {
    return new Vector2D(this.x - otherVector.x, this.y - otherVector.y);
  }

  scalarMultiply(scalar: number): Vector2D {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  dotProduct(otherVector: Vector2D): number {
    return (this.x * otherVector.x) + (this.y * otherVector.y);
  }

  magnitude(): number {
    return Math.sqrt(this.dotProduct(this));
  }

  normalize(): Vector2D {
    const magnitude = this.magnitude();
    if (magnitude === 0) {
      throw new Error('Cannot normalize a zero vector.');
    }
    const coefficient: number = 1 / magnitude;
    return this.scalarMultiply(coefficient);
  }

  randomize(max: number = 1, min?: number): Vector2D {
    if (min === undefined) {
      min = -max;
    }
    const random_x: number = Math.floor(Math.random() * (max - min + 1) + min);
    const random_y: number = Math.floor(Math.random() * (max - min + 1) + min);

    return new Vector2D(random_x, random_y);
  }
}