const inputLimite = document.getElementById("limite");
const inputTexto = document.getElementById("texto");
const inputPalabra = document.getElementById("palabra");
const botonGenerar = document.getElementById("generar");
const salida = document.getElementById("salida");

// Limites máximos
inputLimite.setAttribute("max", 1000000);
inputTexto.setAttribute("maxlength", 2000); // aprox 10 líneas

// Crear un Worker desde función
function crearWorker(fn) {
  const blob = new Blob(["onmessage = " + fn.toString()], { type: "application/javascript" });
  const url = URL.createObjectURL(blob);
  return new Worker(url);
}

// Criba de Eratóstenes para números primos
function workerPrimos(e) {
  const limite = e.data;
  const esPrimo = new Array(limite + 1).fill(true);
  esPrimo[0] = esPrimo[1] = false;

  for (let i = 2; i * i <= limite; i++) {
    if (esPrimo[i]) {
      for (let j = i * i; j <= limite; j += i) {
        esPrimo[j] = false;
      }
    }
  }

  const primos = [];
  for (let i = 2; i <= limite; i++) {
    if (esPrimo[i]) primos.push(i);
  }

  postMessage(primos.join(", "));
}

// Búsqueda binaria en array ordenado
function busquedaBinaria(arr, objetivo) {
  let inicio = 0, fin = arr.length - 1;
  objetivo = objetivo.toLowerCase();

  while (inicio <= fin) {
    const medio = Math.floor((inicio + fin) / 2);
    const valor = arr[medio].toLowerCase();
    if (valor === objetivo) return medio;
    else if (valor < objetivo) inicio = medio + 1;
    else fin = medio - 1;
  }
  return -1;
}

// Evento click
botonGenerar.addEventListener("click", () => {
  salida.textContent = "Calculando...\n";

  const limite = parseInt(inputLimite.value);
  if(isNaN(limite) || limite <= 1){
    salida.textContent = "Ingresa un número válido mayor que 1.";
    return;
  }

  // Crear worker de primos
  const wPrimos = crearWorker(workerPrimos);

  wPrimos.onmessage = (e) => salida.textContent += `Primos hasta ${limite}: ${e.data}\n`;

  wPrimos.postMessage(limite);

  // Buscar palabra en el párrafo
  const texto = inputTexto.value.trim();
  const palabra = inputPalabra.value.trim();

  if (palabra && texto) {
    const palabrasArray = texto.split(/\W+/).filter(p => p).sort((a,b) => a.localeCompare(b, 'es', {sensitivity: 'base'}));

    const indice = busquedaBinaria(palabrasArray, palabra);
    if (indice !== -1) {
      const regex = new RegExp(`\\b${palabra}\\b`, 'gi');
      const coincidencias = texto.match(regex) || [];
      salida.textContent += `✅ La palabra "${palabra}" aparece ${coincidencias.length} vez/veces en el párrafo.\n`;
    } else {
      salida.textContent += `❌ La palabra "${palabra}" NO está en el párrafo.\n`;
    }
  } else {
    salida.textContent += 'No se ingresó texto o palabra para buscar.\n';
  }
});
