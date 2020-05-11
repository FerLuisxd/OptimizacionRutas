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
  width
  id

  constructor(x,y,width,id){
    this.width = width
    this.id = id
    this.pos = new createVector(x,y);
  }

  show(){
    strokeWeight(2)
    fill(255,252,179);
    ellipse(this.pos.x, this.pos.y, 25);
    strokeWeight(4)
    text('ID:'+this.id,this.pos.x , this.pos.y)
  }
}

class Map {
  districts;
  bestLine; 
  distancesMatrix
  passengerMatrix

  constructor(districts_size,distancesMatrix,passengerMatrix){
    this.districts = new Array(districts_size);
    this.distancesMatrix = distancesMatrix
    this.passengerMatrix = passengerMatrix
  }

  drawLines(){
    for (let i = 0; i<this.districts.length; i++)
    {
      for (let j = i+1; j < this.districts.length; j++)
      {
        stroke('#d3d3d3 ');
        strokeWeight(0.3);
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
      let currentDistrict = this.bestLine.pathArray[i]      
      let nextDistrict = this.bestLine.pathArray[i+1]
      stroke('red')      
      let weight = this.passengerMatrix[currentDistrict][nextDistrict]/totalPassengers * 350
      strokeWeight(weight);
      line(this.districts[currentDistrict].pos.x, this.districts[currentDistrict].pos.y, this.districts[nextDistrict].pos.x, this.districts[nextDistrict].pos.y)

      let midX = (this.districts[currentDistrict].pos.x + this.districts[nextDistrict].pos.x)/2
      let midY = (this.districts[currentDistrict].pos.y + this.districts[nextDistrict].pos.y)/2
      stroke('black')
      strokeWeight(0.5)
      text('Distance:'+this.distancesMatrix[currentDistrict][nextDistrict],midX, midY)
      this.distancesMatrix
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
  test = new Population(20,12)
  distancesMatrix = test.distancesMatrix
  passengerMatrix = test.passengerMatrix
  totalPassengers = test.totalPassengers
  this.map = new Map(distancesMatrix.length,distancesMatrix,passengerMatrix);
  dy = windowHeight*factor/distancesMatrix.length*2;
  dx = windowWidth*factor/distancesMatrix.length*2;
  y = windowHeight*factor*0.3;
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
    this.map.districts[i] = new District(x,y,passengerMatrix[i][i]/totalPassengers,i);
   }

  
}

//Funcion para dibujar los componentes
function draw() {
  background(255);
  fill(255, 0, 0);
  
  if(start){

  //Condicional para realizar las actualizaciones correspondientes
    for (let i = 0; i < 2; i++) {

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
    console.log(this.map.bestLine.pathArray)
  }
  this.map.drawLines();
  if (drawbestline == true){
    this.map.drawBest();
  }
  this.map.drawDots();
  // test.update();
  // test.show();
  strokeWeight(4)
  text("generation: " + test.gen, 20, 15);
  text("maxFitness: " + test.minStep, 20, 30);
  text("Fps: " + frameRate(), 20, 45);
  text("Max passengers: " + maxLocated + " out of " + totalPassengers, 20, 60);
  text("Best line distance: " + test.bestDistance, 20, 75);
  if (drawbestline == true){
    text("Best Path [" + this.map.bestLine.pathArray + " ]", 20, 90 );
  }
  
}

//Funcion para dar click al mouse
function mouseClicked() {
//   test.minStep = 0;
  start =true;
}