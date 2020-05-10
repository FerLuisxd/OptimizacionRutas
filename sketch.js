let start = false;
let buildings;
let test;
let fr = 500;
let brainLength = 100
let factor = 0.97
let fit = 100000
let maxLocated = 0
let ghosts = true
let maxVelocity = 20


let distancesMatrix
let passengerMatrix
let totalPassengers
let avenidesCount
let linesCount
let starto = true
let map;
let dx;
let dy;
let y;
let x;
let count;
let max;
let index_bestline;
let last_gen_lines;
let drawbestline = false;

class District {
  x;
  y;
  pos;

  constructor(x,y){
    this.pos = new createVector(x,y);
  }

  show(){
    fill(255,252,179);
    ellipse(this.pos.x, this.pos.y, 25,25);
  }
}

class Map {
  districts;
  bestLine; 


  constructor(districts_size){
    this.districts = new Array(districts_size);
  }

  drawLines(){
    for (let i = 0; i<this.districts.length; i++)
    {
      for (let j = i+1; j < this.districts.length; j++)
      {
        stroke('#d3d3d3 ');
        line(this.districts[i].pos.x, this.districts[i].pos.y, this.districts[j].pos.x, this.districts[j].pos.y)
      }
    }
  }

  drawDots(){
    for (let i = 0; i<this.districts.length; i++)
    {
      this.districts[i].show();
    }
  }

  setBest(last_gen_lines, index_bestline){    
    this.bestLine = new Array(this.districts.length);
    this.bestLine = last_gen_lines[index_bestline];    
    
  }

  drawBest(){   
    
    for (let i = 0; i<this.bestLine.pathArray.length-1; i++)
    {      
      stroke('red')      
      strokeWeight(4);
      line(this.districts[this.bestLine.pathArray[i]].pos.x, this.districts[this.bestLine.pathArray[i]].pos.y, this.districts[this.bestLine.pathArray[i+1]].pos.x, this.districts[this.bestLine.pathArray[i+1]].pos.y)
    }
  }

  show(){
    this.drawLines();
    this.drawDots();
  }

}


//Funcion para cargar infomacion previamente
function setup() {
    
  createCanvas(windowWidth*factor, windowHeight*factor);
  frameRate(fr);
  test = new Population(20,8)
  distancesMatrix = test.distancesMatrix
  passengerMatrix = test.passengerMatrix
  totalPassengers = test.totalPassengers
  this.map = new Map(distancesMatrix.length);
  dy = 250;
  dx = 350;
  y = 80;
  x = 0;
  count = 0;
  max = int(distancesMatrix.length/4);



  for(let i =0; i< this.map.districts.length; i++){    
    if (count <= max){
      x += dx;
      count += 1;     
    }
    else{
      y += dy;
      x = dx;
      count = 1;
    }
    this.map.districts[i] = new District(x,y);
   }

  
}

//Funcion para dibujar los componentes
function draw() {
  background(255);
  fill(255, 0, 0);
  
  if(start){

  //Condicional para realizar las actualizaciones correspondientes
    for (let i = 0; i < 10; i++) {

    last_gen_lines = test.lines;
    // Se selecciona 
    test.printData()      
    test.naturalSelection();
    // Mutamos los hijos
    test.mutateBabies();
    // Reestablecemos de la posicion de los fantasmas
    maxLocated = test.maxLocated
    index_bestline = test.bestLine;       
    }
    
    console.log("Mejor + Index of Gen #" + text.gen);
    console.log(last_gen_lines)
    console.log(index_bestline)
    start = false 
    drawbestline = true;
    this.map.setBest(last_gen_lines, index_bestline);
  }
  this.map.drawLines();
  if (drawbestline == true){
    this.map.drawBest();
  }
  this.map.drawDots();
  // test.update();
  // test.show();
  text("generation: " + test.gen, 20, 20);
  text("Last maxLocated: " + maxLocated + " out of " + totalPassengers, 20, 50);
  text("maxFitness: " + test.minStep, 20, 30);
  text("Fps: " + frameRate(), 20, 40);
}

//Funcion para dar click al mouse
function mouseClicked() {
//   test.minStep = 0;
  start =true;
}