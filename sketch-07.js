const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 2048, 2048 ]
};

const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');
const url = "https://picsum.photos/id/20/3000/3000";
let imgW;
let imgH;

const sketch = (image) => {


  let cellW = 5;
  let cellH = 5;
  
  //imgW = image.Width;
  //console.log(imgW);
  //imgH = image.height;
  let cellsWidth = Math.floor(imgW/cellW);  // find how many cells per width
  let cellsHeight = Math.floor(imgH/cellH); // and height

  //let newImgW = Math.floor(imgW / cellW);
  //let newImgH = Math.floor(imgH / cellH);

  return ({ context, width, height }) => {
    typeCanvas.width = imgW;
    typeCanvas.height = imgH;
    //console.log(cellsWidth);
    typeContext.drawImage(image, 0, 0);
    //document.body.appendChild(typeCanvas);
  
    const imageData = typeContext.getImageData(0, 0, imgW, imgH);
    const pixels = imageData.data;
    //console.log(pixels);
    //context.fillStyle = 'white';
    //context.fillRect(0, 0, width, height);

    for (let i = 0; i < cellsHeight; i++) {
      for (let j = 0; j < cellsWidth; j++) {
        const colors = avgColor(j * cellW, i * cellH, cellW, cellH, pixels);
        //console.log(colors.red);
        //console.log(colors.blue);
        context.fillStyle = `rgba(${colors.red}, ${colors.green}, ${colors.blue}, ${colors.alpha})`;
        context.fillRect(i * cellH, j * cellW, cellH - 10, cellW - 10); // Draw a rectangle with the average color
      }
    }
  };
};



const loadMeSomeImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Handle CORS if needed
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(new Error(`Failed to load image: ${error.message}`));
    img.src = url;
  });
};


async function init() {

  try {
    const image = await loadMeSomeImage(url);
    imgW = image.width;
    //console.log(imgW);
    imgH = image.height;
    settings.dimensions = [imgW, imgH];
    canvasSketch(sketch(image), settings);
  } catch(error) {
    console.error('Error initializing canvas sketch:', error);
  }
  
}

function avgColor(x, y, len, height, pixels) {
  let red = 0;
  let green = 0;
  let blue = 0;
  let alpha = 0;
  let pixelCount = 0;

  for (i = x; i < len + x; i++) {
    for (j = y; j < height + y; j++) {
      let startIdx = (i * imgW + j) * 4;
      red+=pixels[startIdx];
      green+=pixels[startIdx+1];
      blue+=pixels[startIdx+2];
      alpha+=pixels[startIdx+3];
      pixelCount++;
    }
  }
  
  return {
    red: Math.floor(red/pixelCount),
    green: Math.floor(green/pixelCount),
    blue: Math.floor(blue/pixelCount),
    alpha: Math.floor(alpha/pixelCount)/255
  }
}


init();
