from random import sample
import random

distancias=[[0,101,42,76,24,38,89,110],
            [101,0,107,39,77,69,92,33],
            [42,107,0,72,52,38,97,116],
            [76,39,72,0,86,38,131,44],
            [24,77,52,86,0,48,65,86],
            [38,69,38,38,48,0,93,78],
            [89,92,97,131,65,93,0,125],
            [110,33,116,44,86,78,125,0]]

pasajeros=[[0,9,6,10,4,54,21,51],
           [28,0,16,44,4,41,4,24],
           [26,51,0,50,14,56,16,1],
           [39,14,12,0,25,40,52,8],
           [19,55,60,42,0,37,32,37],
           [6,10,59,36,60,0,18,10],
           [35,37,25,5,32,9,0,3],
           [43,4,27,17,6,42,9,0]]

poblacion_pasajeros = 0
for i in range(len(pasajeros)):
    for j in range(len(pasajeros)):
        poblacion_pasajeros+=pasajeros[i][j]
print("Total Pasajeros: ", poblacion_pasajeros)

ListaLineas = []
ListaPasajeros = []
ListaDistancia = []
cant_avenidas = len(distancias)
cant_lineas = int(cant_avenidas/2)
total_general_distancia = 0
ListaFitness = []
indice_mayor = 0

def Generar():
    ListaLineas = []    
    for i in range(cant_lineas):
        ListaLineas.append(sample([x for x in range(0,8)],cant_avenidas))    
    return ListaLineas

ListaLineas = Generar()

def Fitness(ListaLineas):
    lista_fitness =[]
    fitness = 0
    lista_distancias = []
    lista_pasajeros = []    
    total_general_distancia = 0    
    for i in range(cant_lineas):
        total_distancia = 0
        total_pasajeros = 0
        for j in range(0, cant_avenidas, 2):
            total_distancia += distancias[ListaLineas[i][j]][ListaLineas[i][j+1]]
            total_pasajeros += pasajeros[ListaLineas[i][j]][ListaLineas[i][j+1]]            
            total_general_distancia += total_distancia
        lista_distancias.append(total_distancia)
        lista_pasajeros.append(total_pasajeros)
    print("...Calculando Distancias y Pesos...")    
    print("Lista Distancias, Lista Pasajeros, Total General Distancia")        
    print(lista_distancias, lista_pasajeros, total_general_distancia)
    

    ## CALCULAR FITNESS
    print("total_pasajeros:",  poblacion_pasajeros)    
    for i in range(cant_lineas):
        print("distancias:", lista_distancias[i])
        print("pasajeros:",  lista_pasajeros[i])         
        print("fitness: ", (lista_pasajeros[i]/poblacion_pasajeros + (1-(lista_distancias[i]/total_general_distancia))))
        print("")
        fitness = (lista_pasajeros[i]/poblacion_pasajeros + (1-(lista_distancias[i]/total_general_distancia)))
        lista_fitness.append(fitness)
    
    return lista_fitness

ListaFitness = Fitness(ListaLineas)

print(ListaLineas)
print("...........")


def Seleccion(ListaLineas, ListaFitness):    
    mayor = -1
    indice_mayor = 0
    menor = 999
    indice_menor = 0
    for i in range(cant_lineas):        
        if (menor > ListaFitness[i]):
            menor = ListaFitness[i]
            indice_menor = i

        if (mayor < ListaFitness[i]):
            mayor = ListaFitness[i]
            indice_mayor = i        
    
    
    ListaLineas[indice_menor], ListaFitness[indice_menor] = ListaLineas[indice_mayor], ListaFitness[indice_mayor]
    
    return ListaLineas, ListaFitness


ListaLineas, ListaFitness = Seleccion(ListaLineas, ListaFitness)
print("...........")
print(ListaLineas)
print("...........")
print(ListaFitness)

def Ordenar(ListaLineas, ListaFitness): #se que se puede ordenar de mejor manera pero tengo sueño
    for i in range(cant_lineas):
        for j in range(cant_lineas-1):
            if (ListaFitness[j] < ListaFitness[j+1]):
                aux = ListaLineas[j]
                ListaLineas[j] = ListaLineas[j+1]
                ListaLineas[j+1] = aux
    ListaFitness.sort(reverse=True)

    return ListaLineas, ListaFitness

ListaLineas, ListaFitness = Ordenar(ListaLineas, ListaFitness)

print("Cruce")
def Cruce(ListaLineas):
    aux = []
    aux2 = []
    corte_aux = []
    corte_aux2 = []
    corte = random.randint(1, cant_avenidas-1)
    for i in range(1, cant_lineas-1, 1):
        aux = ListaLineas[i][corte:]
        aux2 = ListaLineas[i+1][corte:]
        corte_aux = ListaLineas[i][:corte]
        corte_aux2 = ListaLineas[i+1][:corte]
        suma1 = corte_aux2 + aux
        suma2 = corte_aux + aux2
        ListaLineas[i] = suma2
        ListaLineas[i+1] = suma1
    print("El número Random para corte es: ", corte)
    return ListaLineas 

ListaLineas = Cruce(ListaLineas)
ListaFitness = Fitness(ListaLineas)
ListaLineas, ListaFitness = Ordenar(ListaLineas, ListaFitness)
print(ListaLineas)
print(ListaFitness)

print("Mutacion")
def Mutacion(ListaLineas):
    aux = 0     
    for i in range(1, cant_lineas):
        index = (sample([x for x in range(0,8)],2))           
        aux = ListaLineas[i][index[0]]
        ListaLineas[i][index[0]] = ListaLineas[i][index[1]]
        ListaLineas[i][index[1]] = aux
        print(index)
        index = []
    return ListaLineas
ListaLineas = Mutacion(ListaLineas)
ListaFitness = Fitness(ListaLineas)

ListaLineas, ListaFitness = Ordenar(ListaLineas, ListaFitness)
print("FIN DE UNA GENERACION - LINEAS: ", ListaLineas)
print("FIN DE UNA GENERACION - FITNESS: ",ListaFitness)

# LUEGO DE ESTO PODEMOS CONSERVAR A LOS DOS MAS FUERTES O REEMPLAZAR AL 50% MAS DEBIL CON LINEAS ALEATORIAS #
# SE REPITE EL PROCESO CON LA NUEVA GENERACION # 


