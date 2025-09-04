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

// Criba para pares
function workerPares(e) {
  const limite = e.data;
  const pares = [];
  for (let i = 2; i <= limite; i += 2) {
    pares.push(i);
  }
  postMessage(pares.join(", "));
}

// Criba para impares
function workerImpares(e) {
  const limite = e.data;
  const impares = [];
  for (let i = 1; i <= limite; i += 2) {
    impares.push(i);
  }
  postMessage(impares.join(", "));
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
  if(isNaN(limite) || limite <= 0){
    salida.textContent = "Ingresa un número válido mayor que 0.";
    return;
  }

  // Crear workers
  const wPares = crearWorker(workerPares);
  const wImpares = crearWorker(workerImpares);

  wPares.onmessage = (e) => salida.textContent += `Pares: ${e.data}\n`;
  wImpares.onmessage = (e) => salida.textContent += `Impares: ${e.data}\n`;

  wPares.postMessage(limite);
  wImpares.postMessage(limite);

  // Buscar palabra en el párrafo
  const texto = inputTexto.value.trim();
  const palabra = inputPalabra.value.trim();

  if (palabra && texto) {
    // Convertir párrafo en array de palabras y ordenar
    const palabrasArray = texto.split(/\W+/).filter(p => p).sort((a,b) => a.localeCompare(b, 'es', {sensitivity: 'base'}));

    const indice = busquedaBinaria(palabrasArray, palabra);
    if (indice !== -1) {
      // Contar cuántas veces aparece la palabra
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
