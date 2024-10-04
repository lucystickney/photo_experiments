const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');


const settings = {
  dimensions: [ 2048, 2048 ],
  animate: true
};

let player1;
let player2;

let ball;
let speed = 15;
let glwidth;
let glheight;
let player1pts = 0;
let player2pts = 0;

const sketch = ({ width, height }) => {

  glwidth = width;
  glheight = height;
  ball = {
    pos: new Vector(glwidth/2, glheight/2),
    vel: new Vector(random.range(-1, 1) * speed, random.range(-1,1) * speed),
    radius: 50
  }

  const gridw = width * 0.8;  // width with the margin
  const gridh = width * 0.8;  // height with the margin

  const margx = (width - gridw) / 2;
  const margy = (width - gridh) / 2;

  // make paddles
  player1 = new Vector(margx, gridh/2 + margy);
  player2 = new Vector(gridw + margx, gridh/2 + margy);

  
  return ({ context, width, height, frame }) => { 
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);



    context.fillStyle = 'black';
    context.font = '100px Arial';
    context.textBaseline = 'bottom';
    //context.textAlign = 'left';
    context.fillText(player1pts, margx, margy);
    context.textAlign = 'right';
    context.fillText(player2pts, gridw + margx, margy);

    const cols = 50;
    const rows = 40;
    const numCells = cols * rows;

    

    const cellw = gridw / cols; // # columns
    const cellh = gridh / rows; // # rows
    

    // const margx = (width - gridw) / 2;
    // const margy = (width - gridh) / 2;
    // if (ball.pos.x + ball.radius < 0 || ball.pos.x - ball.radius > width) {
    //   newRound();
    // }


    // ball hits left side
    if (ball.pos.x - ball.radius < margx) {
      console.log("hitting side");
      if (ball.pos.y >= (player1.y - 200) & ball.pos.y <= (player1.y + 200)) {
        console.log("hitting player 1");
        ball.vel.x *= -1;
      } else {
        player2pts++;
        newRound();

      }
      
    }

    // ball hits right side
    if (ball.pos.x + ball.radius > (gridw + margx)) {
      console.log("hitting side");
      if (ball.pos.y >= (player2.y - 200) & ball.pos.y <= (player2.y + 200)) {
        console.log("hitting player 2");
        ball.vel.x *= -1;
      } else {
        player1pts++;
        newRound();
      }
    } 

    // if (ball.pos.x + ball.radius > (gridw + margx) || ball.pos.x - ball.radius < margx) {
    //   //console.log("hitting edge");
    //   ball.vel.x *= -1;
    // }
    if (ball.pos.y + ball.radius > (gridh + margy) || ball.pos.y - ball.radius < margy) {
      //console.log("hitting edge");
      ball.vel.y *= -1;
    }
    ball.pos.x += ball.vel.x;
    ball.pos.y += ball.vel.y;


    //make paddles
    // player1 = new Vector(margx, gridh/2 + margy);
    // player2 = new Vector(gridw + margx, gridh/2 + margy);

    // make player 1
    context.save();
      
    context.translate(player1.x, player1.y);
      
    context.rotate(Math.PI/2);

    context.lineWidth = 10;
    context.strokeStyle = 'black';
    context.beginPath();
    context.moveTo(-200, 0);
    context.lineTo(200, 0);
    
    context.stroke();
    context.restore();

    // make player 2
    context.save();
      
    context.translate(player2.x, player2.y);
      
    context.rotate(Math.PI/2);

    context.lineWidth = 10;
    context.strokeStyle = 'black';

    context.beginPath();
    context.moveTo(-200, 0);
    context.lineTo(200, 0);

    context.stroke();
    context.restore();



    for (let i = 0; i < numCells; i++) {
      const col = i % cols; // figure out which column we're on
      const row = Math.floor(i / cols); // which row we're on

      const x = col * cellw; // x coord of current cell
      const y = row * cellh; // y coord of current cell

      const w = cellw * 0.8;  // make cell slightly smaller
      const h = cellh * 0.8;

      const distance = ball.pos.getDistance(x + margx, y + margy);
      

      const n = random.noise3D(x, y, frame * 20, 0.001);
      const influence = 1/(distance * 0.09 + 1);
      //const influence = 1/(distance * .00001 + 1)
      const final_n = n * influence;


      const angle = n * ball.vel.y * Math.PI * 0.2;  // angle of the line
      //const scale = math.mapRange(final_n, -1, 1, 1, 30);
      const scale = 100 * influence + 1;

      context.save();
      
      context.translate(x, y);
      context.translate(margx, margy);
      context.translate(cellw * 0.5, cellh * 0.5);  // start in middle of cell

      context.rotate(angle);

      context.lineWidth = scale;
      context.strokeStyle = 'black';
      context.beginPath();
      context.moveTo(w * -0.5, 0);
      context.lineTo(w * 0.5, 0);

      context.stroke();
      context.restore();

    }

    
    context.fillStyle = 'black';
    context.beginPath();
    context.arc(ball.pos.x, ball.pos.y, ball.radius, 0, Math.PI * 2);
    context.fill();
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

const keyDown = (e) => {
  console.log(e.key);
  if (e.key == 'ArrowDown') {
    e.preventDefault();
    player2.y+=100;
    
  }
  if (e.key == 'ArrowUp') {
    e.preventDefault();
    player2.y-=100;
   
  }
  if (e.key == 'w') {
    player1.y-=100;
  }
  if (e.key == 's') {
    player1.y+=100;
  }
}

document.addEventListener('keydown', keyDown);

// const start = async () => {
//   manager = await canvasSketch(sketch, settings);
// };
// start();


const newRound = () => {

  const angle = random.range(0, Math.PI * 2);
  ball.pos.x = glwidth/2;
  ball.pos.y = glheight/2;
  ball.vel.x = Math.cos(angle) * speed;
  ball.vel.y = Math.sin(angle) * speed;
};