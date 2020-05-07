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
print("Total Pasajeros: ", passengersTotal)

linesArray = []
passengerArray = []
distanceArray = []
avenidesCount = len(distancesMatrix)
# Esto puede ser random o igual a avenides count
linesCount = int(avenidesCount/2)
totalDistance = 0
totalFitness =  0
fitnessArray = []
bestIndex = 0

def Generar():
    linesArray = []    
    for i in range(linesCount):
        linesArray.append(random.sample([x for x in range(0,8)],avenidesCount))    
    return linesArray

linesArray = Generar()

def Fitness(ListaLineas):
    lista_fitness =[]
    fitness = 0
    lista_distancias = []
    lista_pasajeros = []    
    total_general_distancia = 0    
    for i in range(linesCount):
        total_distancia = 0
        total_pasajeros = 0
        for j in range(0, avenidesCount, 2):
            total_distancia += distancesMatrix[ListaLineas[i][j]][ListaLineas[i][j+1]]
            total_pasajeros += passengerMatrix[ListaLineas[i][j]][ListaLineas[i][j+1]]            
            total_general_distancia += total_distancia
        lista_distancias.append(total_distancia)
        lista_pasajeros.append(total_pasajeros)
    print("...Calculando Distancias y Pesos...")    
    print("Lista Distancias, Lista Pasajeros, Total General Distancia")        
    print(lista_distancias, lista_pasajeros, total_general_distancia)


    ## CALCULAR FITNESS
    print("total_pasajeros:",  passengersTotal)    
    for i in range(linesCount):
        print("distancias:", lista_distancias[i])
        print("pasajeros:",  lista_pasajeros[i])         
        fitness = (lista_pasajeros[i]/passengersTotal + (1-(lista_distancias[i]/total_general_distancia)))
        lista_fitness.append(fitness)
        print("fitness: ", fitness)
        print("")
    return lista_fitness

def Fitness2(linesArray, totalFitness):
    fitnessArray = []
    fitness = 0
    distanceArrayAux = [] 
    passengerArrayAux = [] 
    #Calc generation
    for i in range(linesCount):
        distance=  0
        passengers = 0
        # Sumamos la distancia y pasajeros
        for j in range(0, avenidesCount, 2):
            distance += distancesMatrix[linesArray[i][j]][linesArray[i][j+1]]
            passengers += passengerMatrix[linesArray[i][j]][linesArray[i][j+1]]            
        distanceArrayAux.append(distance)
        print("distancias:", distance)
        passengerArrayAux.append(passengers)
        print("pasajeros:",  passengers)         
        fitness = (passengers/distance    * passengers/passengersTotal)
        fitnessArray.append(fitness)   
        print("fitness: ", fitness)
    print("...Calculando Distancias y Pesos...")    
    print("Lista Distancias, Lista Pasajeros, Total General Distancia")        
    print(distanceArrayAux, passengerArrayAux)

    ## CALCULAR FITNESS
    print("passengersTotal:",  passengersTotal)    
    return fitnessArray, totalFitness


#fitnessArray,totalFitness = Fitness2(linesArray, totalFitness)
fitnessArray = Fitness(linesArray)

print(linesArray)
print("...........")     

def Seleccion2(linesArray, fitnessArray,bestIndex):    
    mayor = -1
    for i in range(linesCount):        
        if (mayor < fitnessArray[i]):
            mayor = fitnessArray[i]
            bestIndex = i        
        
    return linesArray, fitnessArray, bestIndex

def Seleccion(ListaLineas, ListaFitness):    
    mayor = -1
    indice_mayor = 0
    menor = 999
    indice_menor = 0
    for i in range(linesCount):        
        if (menor > ListaFitness[i]):
            menor = ListaFitness[i]
            indice_menor = i

        if (mayor < ListaFitness[i]):
            mayor = ListaFitness[i]
            indice_mayor = i        
    
    
    ListaLineas[indice_menor], ListaFitness[indice_menor] = ListaLineas[indice_mayor], ListaFitness[indice_mayor]
    
    return ListaLineas, ListaFitness


# linesArray, fitnessArray, bestIndex = Seleccion2(linesArray, fitnessArray,bestIndex)

linesArray, fitnessArray = Seleccion(linesArray, fitnessArray)
print("...........")
print('waaa', bestIndex)
print(linesArray)
print("...........")
print(fitnessArray)

def Ordenar(ListaLineas, ListaFitness): #se que se puede ordenar de mejor manera pero tengo sueño
    for i in range(linesCount):
        for j in range(linesCount-1):
            if (ListaFitness[j] < ListaFitness[j+1]):
                aux = ListaLineas[j]
                ListaLineas[j] = ListaLineas[j+1]
                ListaLineas[j+1] = aux
    ListaFitness.sort(reverse=True)

    return ListaLineas, ListaFitness

linesArray, fitnessArray = Ordenar(linesArray, fitnessArray)

print("waa",len(linesArray),avenidesCount)

print("Cruce")
def Cruce(linesArray):
    aux = []
    aux2 = []
    corte_aux = []
    corte_aux2 = []
    corte = random.randint(1, avenidesCount-1)
    for i in range(1, linesCount-1, 1):
        aux = linesArray[i][corte:]
        aux2 = linesArray[i+1][corte:]
        corte_aux = linesArray[i][:corte]
        corte_aux2 = linesArray[i+1][:corte]
        suma1 = corte_aux2 + aux
        suma2 = corte_aux + aux2
        linesArray[i] = suma2
        linesArray[i+1] = suma1
    print("El número Random para corte es: ", corte)
    return linesArray 

linesArray = Cruce(linesArray)
fitnessArray = Fitness(linesArray)
linesArray, fitnessArray = Ordenar(linesArray, fitnessArray)
print(linesArray)
print(fitnessArray)

print("Mutacion")
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
linesArray = Mutacion(linesArray)
fitnessArray = Fitness(linesArray)

linesArray, fitnessArray = Ordenar(linesArray, fitnessArray)
print("FIN DE UNA GENERACION - LINEAS: ", linesArray)
print("FIN DE UNA GENERACION - FITNESS: ",fitnessArray)

# LUEGO DE ESTO PODEMOS CONSERVAR A LOS DOS MAS FUERTES O REEMPLAZAR AL 50% MAS DEBIL CON LINEAS ALEATORIAS #
# SE REPITE EL PROCESO CON LA NUEVA GENERACION # 


