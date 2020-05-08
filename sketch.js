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
//Funcion para cargar informacion previamente
function setup() {
  createCanvas(windowWidth*factor, windowHeight*factor);
  frameRate(fr);
  test = new Population(50)
  distancesMatrix = test.distancesMatrix
  passengerMatrix = test.passengerMatrix
  totalPassengers = test.totalPassengers
}
//Funcion para dibujar los componentes
function draw() {
  background(255);
  fill(255, 0, 0);
  if(start){


  //Condicional para realizar las actualizaciones correspondientes
    for (let i = 0; i < 20; i++) {
    // Se selecciona 
    test.printData()
    test.naturalSelection();
    // Mutamos los hijos
    test.mutateBabies();
    // Reestablecemos de la posicion de los fantasmas
    maxLocated = test.maxLocated
    start = false
    }

  }
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