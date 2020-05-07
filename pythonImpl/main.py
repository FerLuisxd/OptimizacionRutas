import random

#Volver random estas matrices
distancesMatrix=[[0,101,42,76,24,38,89,110],
            [101,0,107,39,77,69,92,33],
            [42,107,0,72,52,38,97,116],
            [76,39,72,0,86,38,131,44],
            [24,77,52,86,0,48,65,86],
            [38,69,38,38,48,0,93,78],
            [89,92,97,131,65,93,0,125],
            [110,33,116,44,86,78,125,0]]

passengerMatrix=[[0,9,6,10,4,54,21,51],
           [28,0,16,44,4,41,4,24],
           [26,51,0,50,14,56,16,1],
           [39,14,12,0,25,40,52,8],
           [19,55,60,42,0,37,32,37],
           [6,10,59,36,60,0,18,10],
           [35,37,25,5,32,9,0,3],
           [43,4,27,17,6,42,9,0]]


# Se calcula el maximo de ploblacion
passengersTotal = 0
for i in range(len(passengerMatrix)):
    for j in range(len(passengerMatrix)):
        passengersTotal+=passengerMatrix[i][j]
print("_____Metadata_____")
print("Total Pasajeros: ", passengersTotal)

linesArray = []
passengerArray = []
avenidesCount = len(distancesMatrix)
# Esto puede ser random o igual a avenides count
linesCount = int(avenidesCount/2)
totalFitness =  0
fitnessArray = []
bestIndex = 0

def Generar():
    linesArray = []    
    for i in range(linesCount):
        linesArray.append(random.sample([x for x in range(0,8)],avenidesCount))    
    return linesArray



def Fitness2(linesArray, totalFitness):
    fitnessArray = []
    fitness = 0
    distanceArrayAux = [] 
    passengerArrayAux = [] 
    #Calc generation
    for i in range(linesCount):
        distance=  0
        passengers = 0
        knownCities = []
        fitnessMul = 1.0
        # Sumamos la distancia y pasajeros
        for j in range(0, avenidesCount, 2):
            iIndex = linesArray[i][j]  # El primero
            jIndex = linesArray[i][j+1] # El segundo
            distance += distancesMatrix[iIndex][jIndex]
            passengers += passengerMatrix[iIndex][jIndex]
            if(iIndex in knownCities):
                fitnessMul = fitnessMul * 0.85
                print("me repeti", iIndex, knownCities)
            else:
                knownCities.append(iIndex)    
            if(jIndex in knownCities):
                fitnessMul = fitnessMul * 0.85
                print("me repeti", jIndex, knownCities)    
            else:
                knownCities.append(jIndex)          
        distanceArrayAux.append(distance)
        print("distancias:", distance)
        passengerArrayAux.append(passengers)
        print("pasajeros:",  passengers)         
        fitness = (passengers/distance    * passengers/passengersTotal * 100)
        totalFitness += fitness
        fitnessArray.append(fitness)   
        print("fitness: ", fitness)
    print("...Calculando Distancias y Pesos...")    
    print("Lista Distancias, Lista Pasajeros, Total General Distancia")        
    print(distanceArrayAux, passengerArrayAux)

    ## CALCULAR FITNESS
    print("passengersTotal:",  passengersTotal)    
    return fitnessArray, totalFitness



def SelectBest(fitnessArray,bestIndex):    
    mayor = -1
    for i in range(linesCount):        
        if (mayor < fitnessArray[i]):
            mayor = fitnessArray[i]
            bestIndex = i        
        
    return bestIndex

def selectParent(fitnessArray,max):
    rand =  random.uniform(0,max)
    sum = 0
    for i in range(linesCount):
        sum += fitnessArray[i]
        if(sum > rand):
            print('seleccionado', i,rand,max)
            return i

def Cruce2(linesArray,max,fitnessArray):
    aux = []
    aux2 = []
    corte_aux = []
    corte_aux2 = []
    corte = random.randint(0,int(avenidesCount*0.3))
    for i in range(1, linesCount):
        rand = selectParent(fitnessArray,max)
        aux2 = linesArray[rand][corte:]
        corte_aux = linesArray[i][:corte]
        suma2 = corte_aux + aux2
        linesArray[i] = suma2
    print("El número Random para corte es: ", corte)
    return linesArray 

def Mutacion(linesArray):
    aux = 0     
    for i in range(1, linesCount):
        index = (random.sample([x for x in range(0,8)],2))           
        aux = linesArray[i][index[0]]
        linesArray[i][index[0]] = linesArray[i][index[1]]
        linesArray[i][index[1]] = aux
        print(index)
        index = []
    return linesArray  

linesArray = Generar()
fitnessArray,totalFitness = Fitness2(linesArray, totalFitness)



print("totalFitness", totalFitness)


#linesArray, fitnessArray = Seleccion(linesArray, fitnessArray)
print("_______Lineas y fitness______")
print(linesArray)
print(fitnessArray)

bestIndex = SelectBest(fitnessArray,bestIndex)
nextGenFitnessArray = [0] * len(fitnessArray)
nextGenLinesArray = [0] * len(linesArray)


print("Cruce")
nextGenLinesArray = Cruce2(linesArray,totalFitness,fitnessArray)

print("___Cruzados____")
print(nextGenLinesArray)
print(nextGenFitnessArray)

print("Mutacion")

nextGenLinesArray = Mutacion(linesArray)
nextGenFitnessArray,totalFitness = Fitness2(linesArray,totalFitness)
nextGenFitnessArray[0]=  fitnessArray[bestIndex]
nextGenLinesArray[0] = linesArray[bestIndex].copy()

# linesArray, fitnessArray = Ordenar(linesArray, fitnessArray)
print("FIN DE UNA GENERACION - LINEAS: ", nextGenLinesArray)
print("FIN DE UNA GENERACION - FITNESS: ",nextGenFitnessArray)

# LUEGO DE ESTO PODEMOS CONSERVAR A LOS DOS MAS FUERTES O REEMPLAZAR AL 50% MAS DEBIL CON LINEAS ALEATORIAS #
# SE REPITE EL PROCESO CON LA NUEVA GENERACION # 


# GENERAR

# LOOP:
# CALCULAR
# SELECCIONAR MEJOR
# CLONAMOS ( REPRODUCIMOS)
# MUTAMOS
# GOTO LOOP