## Problemas
Al momento de generar tantos números pares e impares en la busqueda hacia que la página tardara en responder asi mismo buscando una palabra en un parrafo grande 

## Solucion 
Para los números, se uso criba que nos permite generar pares e impares de manera eficiente sin revisar cada número individualmente. Al usarla dentro de Web Workers, el cálculo se realiza en segundo plano y la página sigue respondiendo normalmente.

Para la busqueda de palabras, usamos busqueda binaria que nos permite ordenar las palabras del texto y luego revisar la mitad en cada paso hasta encontrar o confirmar que no esta, esto hace que la busqueda sea más rápida