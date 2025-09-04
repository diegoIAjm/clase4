## Problemas
Al generar muchos números y buscar palabras en un párrafo largo, la página se volvía lenta o dejaba de responder, porque el navegador tenía que procesar todo al mismo tiempo.

## Solucion 
Para los números, usamos la criba de Eratóstenes, que permite encontrar los números primos de manera rápida sin revisar uno por uno. Además, lo pusimos dentro de Web Workers, así el cálculo se hace en segundo plano y la página sigue funcionando normalmente.

Para buscar palabras en el texto, usamos búsqueda binaria, que primero ordena las palabras y luego va revisando por mitades hasta encontrar la palabra o confirmar que no está. Esto hace que la búsqueda sea mucho más rápida que revisar palabra por palabra.