const inputLimite = document.getElementById("limite");
const botonGenerar = document.getElementById("generar");
const salida = document.getElementById("salida");

function crearWorker(fn) {
  const blob = new Blob(["onmessage = " + fn.toString()], { type: "application/javascript" });
  const url = URL.createObjectURL(blob);
  return new Worker(url);
}

function workerPares(e) {
  const limite = e.data;
  let pares = [];
  let paresNum = 2;
  for (let i = 0; i < limite; i++) {
     pares.push(paresNum);
     paresNum +=2;
  }
  postMessage(pares.join(", "));
}

function workerImpares(e) {
  const limite = e.data;
  let impares = [];
  let imparesNum = 1;
  for (let i = 0; i < limite; i++) {
     impares.push(imparesNum);
     imparesNum += 2;
  }
  postMessage(impares.join(", "));
}

botonGenerar.addEventListener("click", () => {
  salida.textContent = "Calculando...\n";

  const limite = parseInt(inputLimite.value);
  const wPares = crearWorker(workerPares);
  const wImpares = crearWorker(workerImpares);

  wPares.onmessage = (e) => salida.textContent += `Pares: ${e.data}\n`;
  wImpares.onmessage = (e) => salida.textContent += `Impares: ${e.data}\n`;

  wPares.postMessage(limite);
  wImpares.postMessage(limite);
});
