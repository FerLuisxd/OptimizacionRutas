class Population {
    lines; //Arreglo de lineas
    buildings; //Arreglo de obstaculos
    fitnessSum; //La suma total del fitness
    gen = 1; //El gen en el que nos encontramos actualmente
    bestLine = 0; //El mejor line de la anterior simulacion
    foods = 0; //La cantidad de comida que se colocara en el mapa
    minStep = 0; //
    ghosts; //Arreglo de fantasmas
    ghostV = 1; //Velocidad maxima de los fantasmas
    maxLocated = 0;

    distancesMatrix 
    passengerMatrix
    totalPassengers

    constructor(size) {
        this.lines = new Array(size); //Arreglo de lineas
        console.log(width, height)


        this.distancesMatrix = this.setupDistancesMatrix()
        this.passengerMatrix = this.setupPassengerMatrix()
        this.totalPassengers = this.setupPassengerTotal(this.passengerMatrix)
        let linesAux =  [[0, 7, 5, 4, 1, 3, 2, 6], [5, 6, 3, 2, 4, 7, 1, 0], [7, 1, 4, 0, 6, 2, 5, 3], [1, 5, 3, 2, 0, 7, 6, 4]]
        for (let i = 0; i < this.lines.length; i++) {
            //TODO AGREGAR RANDOM SAMPLE DE 0 A AVENIDESCOUNT
            this.lines[i] = new Line(linesAux[i]);
        }
       
    }

    setupDistancesMatrix() {
        let distancesMatrix = [
            [0, 101, 42, 76, 24, 38, 89, 110],
            [101, 0, 107, 39, 77, 69, 92, 33],
            [42, 107, 0, 72, 52, 38, 97, 116],
            [76, 39, 72, 0, 86, 38, 131, 44],
            [24, 77, 52, 86, 0, 48, 65, 86],
            [38, 69, 38, 38, 48, 0, 93, 78],
            [89, 92, 97, 131, 65, 93, 0, 125],
            [110, 33, 116, 44, 86, 78, 125, 0]
        ]
        return distancesMatrix
    }
    setupPassengerMatrix() {
        let passengerMatrix = [
            [0, 9, 6, 10, 4, 54, 21, 51],
            [28, 0, 16, 44, 4, 41, 4, 24],
            [26, 51, 0, 50, 14, 56, 16, 1],
            [39, 14, 12, 0, 25, 40, 52, 8],
            [19, 55, 60, 42, 0, 37, 32, 37],
            [6, 10, 59, 36, 60, 0, 18, 10],
            [35, 37, 25, 5, 32, 9, 0, 3],
            [43, 4, 27, 17, 6, 42, 9, 0]
        ]
        return passengerMatrix
    }
    setupPassengerTotal(passengerMatrix){
        let total = 0 
        for (let i = 0; i < passengerMatrix.length; i++) {
            for (let j = 0; j < passengerMatrix.length; j++) {
                total+= passengerMatrix[i][j]
            }
        }
        console.log('Total de pasajeros', total)
        return total
    }

    //Funcion con la cual se dibuja el escenario
    show() {
        //Se dibujan los lines
        for (let i = 1; i < this.lines.length; i++) {
            this.lines[i].show();
        }
        this.lines[0].show();
    }

    //Funcion de update en la cual se actualizan los lines y los fantasmas
    update() {
        for (let i = 0; i < this.lines.length; i++) {
            this.lines[i].update();
        }
    }

    //Funcion con la cual se comprueba si todos los lines ya han muerto
    allLinesDead() {
        // for (let i = 0; i < this.lines.length; i++) {
        //     if (!this.lines[i].dead)
        //         return false;
        // }
        return true;

    }

    //Funcion en la cual se realiza la seleccion para futuras generaciones 
    //basandonos en los resultados de la anteiror simulacion
    naturalSelection() {
        //Generamos un arreglo de nuevos lines
        let newLines = new Array(this.lines.length);
        //Calculamos el fitness total
        this.calculateFitnessSum();
        //Seteamos el mejor line de la generacion
        this.setBestLine();
        console.log('before',this.lines)
        //Colocamos el mejor line de la generacion en el nuevo arreglo
        newLines[0] = this.lines[this.bestLine].returnBaby();
        newLines[0].isBest = true;
        //Para cada line, vemos que padre es seleccionado 
        let corte = Math.random() * Number(this.distancesMatrix.length*0.3)
        console.log('corte', corte)
        for (let i = 1; i < newLines.length; i++) {
            let parent = this.selectParent().returnBaby();
            let aux2 = parent.pathArray.slice(corte,parent.pathArray.length)
            let corte_aux = this.lines[i].pathArray.splice(0,corte)
            let suma2 = corte_aux.concat(aux2)
            newLines[i] = new Line(suma2); //El padre retorna un line hijo con su herencia
        }
        //Reemplazamos los antiguos lines con los nuevos
        this.lines = [].concat(newLines)
        console.log(this.lines.length)
        //Pasamos a la siguiente generacion
        this.gen++;
    }

    //Calcular la suma total del fitness
    calculateFitnessSum() {
        this.fitnessSum = 0;
        for (let i = 0; i < this.lines.length; i++) {
            this.lines[i].calcFitness()
            this.fitnessSum += this.lines[i].fitness;
        }
    }

    printData(){

            console.log(this.lines)
        
    
    }

    //Funcion para calcular mediante probabilidad si un line debe tener hijos
    selectParent() {
        let rand = Math.random() * this.fitnessSum //Se genera un numero random que tiene como tope el total de fitess
        let runningSum = 0;
        for (let i = 0; i < this.lines.length; i++) {
            runningSum += this.lines[i].fitness;
            if (runningSum > rand) { //Si la suma es mayor al numero aleatorio, se selecciona el line como padre
                return this.lines[i];
            }
        }
        return null;
    }

    //Funcion para cambiar el arreglo de movimientos de un line hijo aleatoriamente
    mutateBabies() {
        for (let i = 1; i < this.lines.length; i++) {
            this.lines[i].mutate();
        }
    }

    //Funcion para seleccionar el mejor line de la generacion
    setBestLine() {
        let max = 0;
        let maxIndex = 0;
        for (let i = 0; i < this.lines.length; i++) {
            if (this.lines[i].fitness > max) {
                max = this.lines[i].fitness;
                maxIndex = i;
            }
        }
        //Se asigna a la variable global el index donde esta el mejor line
        this.bestLine = maxIndex;
        //Se asigna a la variable global el fitness del mejor line
        this.minStep = this.lines[this.bestLine].fitness;
        //Se asigna a la variable global el maximo de comida recolectada por el line
        this.maxLocated = this.lines[this.bestLine].passengers;
        console.log("step: ", this.minStep);
    }

}