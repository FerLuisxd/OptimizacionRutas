class Line {

    // NEW 
    fitness = 0;    //El fitness del line
    isBest = false; //Variable para saber si el line es el mejor de la generacion
    dead = false;   //Variable para saber si el line esta terminado o no
    pathArray = []
    distance = 0
    passengers = 0

    //Constructor
    constructor(pathArray) {
        this.pathArray = pathArray
    }

    //Funcion para dibujar los lines
    show() {
      
    }

    //Funcion de movimiento del line
    move() {
        
    }

    //Funcion para actualizar. Si el line esta muerto, no se movera
    update() {
        this.move()
    }

    //Funcion que retorna un line hijo con la informacion del padre
    returnBaby() {
        let baby = new Line();
        baby.pathArray = [...this.pathArray]
        return baby;
    }
    mutate() {
        
    }
    calcFitness(){
        let fitnessMul = 1.0
        let knownCities = []
        this.distance = 0
        this.passengers = 0
        for (let i = 0; i < distancesMatrix.length-1; i++) {
            if(knownCities.includes(this.pathArray[i])){
                fitnessMul = fitnessMul * 0.85
                console.log('me repeti', i , knownCities)
            }
            else 
                knownCities.push(this.pathArray[i])
            this.distance += distancesMatrix[this.pathArray[i]][this.pathArray[i+1]]
            this.passengers += passengerMatrix[this.pathArray[i]][this.pathArray[i+1]]
        }
        this.fitness = (this.passengers/this.distance    * this.passengers/totalPassengers * 100)
    }
}