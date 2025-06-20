class Vector2D {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }
  
  add(other_vector: Vector2D): Vector2D {
    return new Vector2D(this.x + other_vector.x, this.y + other_vector.y);
  }

  subtract(other_vector: Vector2D): Vector2D {
    return new Vector2D(this.x - other_vector.x, this.y - other_vector.y);
  }

  scalarMultiply(scalar: number): Vector2D {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  dotProduct(other_vector: Vector2D): number {
    return (this.x * other_vector.x) + (this.y * other_vector.y);
  }

  // Limited cross product: assumes that z vectors are perfectly
  // perpendicular to xy vectors
  crossProduct(other_vector: number): Vector2D;
  crossProduct(other_vector: Vector2D): number;
  crossProduct(other_vector: Vector2D | number): number | Vector2D {
    if (typeof other_vector === 'number')  // If pointing at z direction only
      return new Vector2D(this.y * other_vector, -1 * this.x * other_vector);  
    return this.x * other_vector.y - this.y * other_vector.x;  
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

  clone(): Vector2D {
    return new Vector2D(this.x, this.y);
  }

  equals(other_vector: Vector2D | { x: number, y: number }): boolean {
    return this.x === other_vector.x && this.y === other_vector.y;
  }

  static randomize_int(max: number = 1, min?: number): Vector2D {
    if (min === undefined) {
      min = -max;
    }
    const random_x: number = Math.floor(Math.random() * (max - min + 1) + min);
    const random_y: number = Math.floor(Math.random() * (max - min + 1) + min);

    return new Vector2D(random_x, random_y);
  }

  static randomize_float(max: number = 1, min?: number): Vector2D {
    if (min === undefined) {
      min = -max;
    }
    const random_x: number = Math.random() * (max - min) + min;
    const random_y: number = Math.random() * (max - min) + min;

    return new Vector2D(random_x, random_y);
  }
}