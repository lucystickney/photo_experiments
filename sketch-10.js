const canvasSketch = require('canvas-sketch');
const Tweakpane = require('tweakpane');

const settings = {
  dimensions: [ 2048, 2048 ],
  animate: true
};

const params = {
  // cell size
  cellSizeW: 50,
  cellSizeH: 50,
  inGlyph: '0',
  outGlyph: 'T',
  // font + size
  fontSize: 50,
  font: 'serif',
  // glyphs
  backColor: {r: 156, g: 156, b: 155},
  inColor: {r: 81, g: 81, b: 214},
  outColor: {r: 0, g: 0, b: 10},
  // speed
}

const sketch = ({ context, width, height }) => {
  const cellSizeW = params.cellSizeW; // width of each cell
  const cellSizeH = params.cellSizeH; // height of each cell
  const wCells = width/cellSizeW; // number of cells in the width
  const hCells = height/cellSizeH;  // and height

  let circle = {
    pos: new Vector(width/2, height/2),
    radius: 10
  }
  return ({ context, width, height }) => {
    context.fillStyle = `rgb(${params.backColor.r}, ${params.backColor.g}, ${params.backColor.b})`;
    context.fillRect(0, 0, width, height);

    context.save();
    //context.fillStyle = 'blue';
    context.beginPath();
    context.arc(circle.pos.x, circle.pos.y, circle.radius, 0, Math.PI * 2);
    context.fill();
    context.restore();

    
    //context.fillStyle = 'black';
    context.font = params.fontSize+'px ' +params.font;
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    for (let i = 0; i < wCells; i++) {
      for (let j = 0; j < hCells; j++) {
        // check if cell is in circle
        if (context.isPointInPath(i * cellSizeW, j * cellSizeH)) {
          context.fillStyle = `rgb(${params.inColor.r}, ${params.inColor.g}, ${params.inColor.b})`;
          context.save();
          let influence = circle.pos.getDistance(i * cellSizeW, j * cellSizeH);
          //console.log(influence);
          context.translate(i * cellSizeW, j * cellSizeH);
          context.rotate(Math.PI/2 * influence);

          context.fillText(params.inGlyph, 0, 0);
          context.restore();
        } else {
          context.fillStyle = `rgb(${params.outColor.r}, ${params.outColor.g}, ${params.outColor.b})`;
          context.fillText(params.outGlyph, i * cellSizeW, j * cellSizeH);
        }
        // if it is, do one glyph
        // if not, do another glyph
      }
    }
    if (circle.radius >= (width/2 + 20)) {
      circle.radius/=5;
    } else {
      circle.radius+=2;
    }
    
  };
};
const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;
  folder = pane.addFolder({title: 'Circle'});
  folder.addInput(params, 'inGlyph');
  folder.addInput(params, 'outGlyph');
  folder.addInput(params, 'cellSizeW');
  folder.addInput(params, 'cellSizeH');
  folder.addInput(params, 'fontSize');
  folder.addInput(params, 'font');
  folder.addInput(params, 'backColor');
  folder.addInput(params, 'inColor');
  folder.addInput(params, 'outColor');

}
createPane();
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

