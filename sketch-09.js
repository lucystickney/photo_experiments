const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 2048, 2048 ],
  animate: true
};

const sketch = () => {
  let speed = 5;
  let person = {
    pos: new Vector(100, 100),
    vel: new Vector(1 * speed, 0),
  }
  return ({ context, width, height }) => {
    //context.fillStyle = 'white';
    //context.fillRect(0, 0, width, height);
    
    context.beginPath();
    context.moveTo(person.pos.x, person.pos.y);
    context.lineTo(person.pos.x + person.vel.x, person.pos.y + person.vel.y);
    context.lineWidth = 3;
    context.strokeStyle = "red";
    context.stroke();

    if (person.pos.x > width - 100) {
      person.vel.x = 0;
      person.vel.y = 1 * speed;
    }

    if (person.pos.y > height - 100) {
      person.vel.x = -1 * speed;
      person.vel.y = 0;
    }

    if (person.pos.x < 100) {
      person.vel.x = 0;
      person.vel.y = -1 * speed;
    }

    if (person.pos.y < 100) {
      person.vel.x = 1 * speed;
      person.vel.y = 0;
    }
    person.pos.x += person.vel.x;
    person.pos.y += person.vel.y;

  };

  
};

canvasSketch(sketch, settings);


class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  getDistance(x, y) {
    const dx = this.x - x;
    const dy = this.y - y;
    
    return Math.sqrt(dx * dx + dy * dy);
  }
  
}