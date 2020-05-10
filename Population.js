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
    distanceLength

    constructor(size, distanceLength) {
        this.lines = new Array(size); //Arreglo de lineas
        console.log(width, height)
        this.distanceLength = distanceLength

        this.distancesMatrix = this.setupDistancesMatrix()
        this.passengerMatrix = this.setupPassengerMatrix()
        this.totalPassengers = this.setupPassengerTotal(this.passengerMatrix)
        for (let i = 0; i < this.lines.length; i++) {
            let arr = [];
            while(arr.length < this.distancesMatrix.length){
                var r = Math.floor(Math.random() * this.distancesMatrix.length);
                if(arr.indexOf(r) === -1) arr.push(r);
            }
            //TODO AGREGAR RANDOM SAMPLE DE 0 A AVENIDESCOUNT
            this.lines[i] = new Line(arr);
            arr = undefined
        }
        console.log(this.lines)
       
    }

    setupDistancesMatrix() {
        let array = new Array(this.distanceLength)
        for (let i = 0; i < array.length; i++) {
            array[i] = new Array(this.distanceLength)
            for (let j = 0; j < array[i].length; j++) {
                if(i == j) array[i][j] = 0
                else array[i][j] = Math.floor(Math.random() * 251) + 50;  
            }
        }

        for (let i = 0; i < array.length; i++) {
            for (let j = i + 1; j < array.length; j++) {
                array[j][i] = array[i][j]
            }
        }
        
        console.log(array)
        return array
    }
    setupPassengerMatrix() {
        let array = new Array(this.distanceLength)
        for (let i = 0; i < array.length; i++) {
            array[i] = new Array(this.distanceLength)
            for (let j = 0; j < array[i].length; j++) {
                if(i == j) array[i][j] = 0
                array[i][j] = Math.floor(Math.random() * 150) + 80;
            }
        }        

        console.log(array)
        return array
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
        try {
             //Generamos un arreglo de nuevos lines
        let newLines = new Array(this.lines.length);
        //Calculamos el fitness total
        this.calculateFitnessSum();
        //Seteamos el mejor line de la generacion
        this.setBestLine();
        //Colocamos el mejor line de la generacion en el nuevo arreglo
        newLines[0] = this.lines[this.bestLine].returnBaby();
        newLines[0].isBest = true;
        //Para cada line, vemos que padre es seleccionado 
        let corte = Math.floor(Math.random() * this.distancesMatrix.length*0.3)
    
        for (let i = 1; i < newLines.length; i++) {
            let parent = this.selectParent().returnBaby();
            // let aux2 = parent.pathArray.slice(corte,parent.pathArray.length)
            // let corte_aux = this.lines[i].returnBaby().pathArray.slice(0,corte)
            // let suma2 = corte_aux.concat(aux2)
            let suma2 = parent.pathArray
            newLines[i] = new Line(suma2); //El padre retorna un line hijo con su herencia
        }
        //Reemplazamos los antiguos lines con los nuevos
        this.lines = [].concat(newLines)
        //console.log(this.lines.length)
        //Pasamos a la siguiente generacion
        this.gen++;
        } catch (error) {
            console.log('error',error)
        }
       
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
    }

    returnLines(){
        return this.lines;
    }

}