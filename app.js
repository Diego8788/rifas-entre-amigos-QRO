import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {  getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC7_FF9zCatiybPL7BBhtpt-cbKxQdvPHQ",
  authDomain: "loteria-prueba-ll.firebaseapp.com",
  databaseURL: "https://loteria-prueba-ll-default-rtdb.firebaseio.com",
  projectId: "loteria-prueba-ll",
  storageBucket: "loteria-prueba-ll.appspot.com",
  messagingSenderId: "266376757381",
  appId: "1:266376757381:web:47c0ec87c0aa3605e869ec"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

const boletosSeleccionados = [];
let bloquearGeneracion = false; // Variable de control

function mostrarNumerosDisponibles() {
  
   const numerosRef = ref(database, 'boletos');
 
   onValue(numerosRef, (numerosSnapshot) => {
     const contenedorNumeros = document.getElementById('contenedorNumeros');
     contenedorNumeros.innerHTML = '';
 
     numerosSnapshot.forEach((numerosChildSnapshot) => {
       const numero = numerosChildSnapshot.key;
       const estadoNumero = numerosChildSnapshot.val().estado;
 
       if (estadoNumero === 'disponible') {
         const numeroFormateado = ('00000' + numero).slice(-5);
 
         const boton = document.createElement('button');
         boton.textContent = numeroFormateado;
         boton.addEventListener('click', () => seleccionarBoleto(numero));
 
         contenedorNumeros.appendChild(boton);
         boton.style.borderRadius = '10px';  // Puedes ajustar el valor según tus preferencias
        boton.style.fontFamily = 'Arial, sans-serif';  // Cambia la fuente según tus preferencias
        boton.style.fontWeight = 'bold';  // Ajusta el grosor de la fuente
        boton.style.fontSize = '16px';  // Puedes ajustar el tamaño de la fuente según tus preferencias
        boton.style.textTransform = 'uppercase';  // Cambia el texto a mayúsculas
       }
     });
     // Establecer el borde verde alrededor de todos los números
    contenedorNumeros.style.backgroundColor = '#70b578';  // Puedes ajustar el color según tus preferencias
    contenedorNumeros.style.border = '15px solid #008F39';
   });
 }
 
const contenedorNumeros = document.getElementById('contenedorNumeros');

contenedorNumeros.addEventListener('click', (event) => {
    const botonSeleccionado = event.target;

    if (botonSeleccionado.tagName === 'BUTTON') {
        cambiarColorSeleccionado(botonSeleccionado);
        mostrarNumeroArriba(botonSeleccionado.textContent);
    }
});

function mostrarNumeroArriba(numero) {
  // Implementa la lógica para mostrar el número arriba
  // Aquí puedes agregar la lógica para mostrar el número en algún lugar de tu interfaz de usuario
}


function cambiarColorSeleccionado(boton) {
  if (boton.classList.contains('seleccionado')) {
    boton.classList.remove('seleccionado');
    boton.style.backgroundColor = ''; 
  } else {
    boton.classList.add('seleccionado');
    boton.style.backgroundColor = '#008F39';
  }
}

function seleccionarBoleto(numeroSeleccionado) {
 
  const boletoExistente = boletosSeleccionados.find((boleto) => boleto.numero === numeroSeleccionado);

  if (boletoExistente) {
    const indice = boletosSeleccionados.findIndex((boleto) => boleto.numero === numeroSeleccionado);
    boletosSeleccionados.splice(indice, 1);

    mostrarNumerosAleatorios(boletosSeleccionados);
  } else {
    obtenerNumerosAleatorios((numerosAleatorios) => {
      const nuevoBoleto = { numero: numeroSeleccionado, oportunidades: numerosAleatorios };
      boletosSeleccionados.push(nuevoBoleto);
      mostrarNumerosAleatorios(boletosSeleccionados);
    });
  }
}


// Función para obtener números aleatorios
function obtenerNumerosAleatorios(callback) {
  
  // Realizar consulta a Firebase para obtener las oportunidades disponibles
  onValue(ref(database, 'oportunidades404'), (snapshot) => {
    const oportunidadesDisponibles = [];

    // Obtener las oportunidades disponibles
    snapshot.forEach((childSnapshot) => {
      const oportunidad = childSnapshot.val();
      if (oportunidad.estado === 'disponible') {
        oportunidadesDisponibles.push(childSnapshot.key);
      }
    });

    // Generar números aleatorios únicos dentro del rango de las oportunidades disponibles
    const numerosAleatorios = [];
    while (numerosAleatorios.length < 5 && oportunidadesDisponibles.length > 0) {
      const index = Math.floor(Math.random() * oportunidadesDisponibles.length);
      const numeroAleatorio = oportunidadesDisponibles[index];
      numerosAleatorios.push(numeroAleatorio);
      oportunidadesDisponibles.splice(index, 1); // Eliminar la oportunidad asignada de la lista de disponibles
    }

    callback(numerosAleatorios);
  });
}

let costoTotal = 0;

const precioUnitario = 10;

function mostrarNumerosAleatorios(boletos) {
  const contenedorOportunidadesSeleccionadas = document.getElementById('contenedorOportunidadesSeleccionadas');

  contenedorOportunidadesSeleccionadas.innerHTML = '';

  if (boletos.length > 0) {
    const encabezadoNumeroBoleto = document.createElement('h3');
    encabezadoNumeroBoleto.id = 'encabezadoNumeroBoleto';
    encabezadoNumeroBoleto.textContent = 'Oportunidades';

    contenedorOportunidadesSeleccionadas.style.display = 'flex';
    contenedorOportunidadesSeleccionadas.style.flexDirection = 'column';
    contenedorOportunidadesSeleccionadas.style.alignItems = 'center';

    contenedorOportunidadesSeleccionadas.appendChild(encabezadoNumeroBoleto);
  } else {
    contenedorOportunidadesSeleccionadas.style.display = 'none';
    return;
  }

  boletos.forEach((boleto) => {
    const numeroBoleto = boleto.numero;
    const oportunidades = boleto.oportunidades;

    const nuevoContenedorBoleto = document.createElement('div');
    nuevoContenedorBoleto.id = `boleto-${numeroBoleto}`;
    nuevoContenedorBoleto.className = 'boleto-container';
    nuevoContenedorBoleto.style.display = 'flex';
    nuevoContenedorBoleto.style.flexDirection = 'row';
    nuevoContenedorBoleto.style.alignItems = 'flex-start';

    const botonBoletoNegro = document.createElement('button');
    botonBoletoNegro.textContent = numeroBoleto;
    botonBoletoNegro.style.backgroundColor = '#000';
    botonBoletoNegro.style.color = '#fff';

    const contenidoOportunidades = document.createElement('p');
    contenidoOportunidades.textContent = `[${oportunidades.join(', ')}]`;
    contenidoOportunidades.style.margin = '0';
    contenidoOportunidades.style.fontSize = '14px';

    nuevoContenedorBoleto.appendChild(botonBoletoNegro);
    nuevoContenedorBoleto.appendChild(contenidoOportunidades);

    contenedorOportunidadesSeleccionadas.appendChild(nuevoContenedorBoleto);
  });

  // boletos seleccionados
  const cantidadBoletosSeleccionados = boletos.length;
  const contenedorCantidadBoletos = document.createElement('div');
  contenedorCantidadBoletos.id = 'contenedorCantidadBoletos';
  contenedorCantidadBoletos.textContent = `${cantidadBoletosSeleccionados} BOLETO SELECCIONADO `;
  contenedorOportunidadesSeleccionadas.appendChild(contenedorCantidadBoletos);

  // costo total
  costoTotal = cantidadBoletosSeleccionados * precioUnitario;
  const contenedorCostoTotal = document.createElement('div');
  contenedorCostoTotal.id = 'contenedorCostoTotal';
  contenedorCostoTotal.textContent = `Costo Total: $${costoTotal}`;
  contenedorOportunidadesSeleccionadas.appendChild(contenedorCostoTotal);

const botonReservar = document.createElement('button');
  botonReservar.id = 'botonReservar';
  botonReservar.textContent = 'Reservar';
  botonReservar.addEventListener('click', mostrarVentanaEmergente);
  bloquearGeneracion = true;
  // Establecer estilos CSS al botón
botonReservar.style.backgroundColor = '#008F39'; // Cambia el color de fondo del botón
botonReservar.style.color = 'white'; // Cambia el color del texto del botón
  //  botón Reservar
  if (boletos.length > 0) {
    contenedorOportunidadesSeleccionadas.appendChild(botonReservar);
  }
}
function bloquearSeleccionBoletos() {
  const contenedorNumeros = document.getElementById('contenedorNumeros');
  contenedorNumeros.style.pointerEvents = 'none';
}

function desbloquearSeleccionBoletos() {
  const contenedorNumeros = document.getElementById('contenedorNumeros');
  contenedorNumeros.style.pointerEvents = 'auto';
}


function mostrarVentanaEmergente() {
  cerrarVentanaEmergente();

  bloquearSeleccionBoletos();
  

  const fondoObscuro = document.createElement('div');
  fondoObscuro.className = 'fondo-obscuro';

  fondoObscuro.addEventListener('click', (event) => {
    if (event.target === fondoObscuro) {
      cerrarVentanaEmergente(ventanaEmergente, fondoObscuro);
    }
  });

  const ventanaEmergente = document.createElement('div');
  ventanaEmergente.className = 'ventana-emergente';

  const mensajeBienvenida = document.createElement('p');
  mensajeBienvenida.textContent = 'LLENA TUS DATOS Y DA CLICK EN APARTAR';

  const mensajeSeleccion = document.createElement('p');
  mensajeSeleccion.textContent = `${boletosSeleccionados.length} BOLETO SELECCIONADO`;

  const campoWhatsApp = document.createElement('input');
  campoWhatsApp.placeholder = 'NÚMERO WHATSAPP (10 dígitos)';
  campoWhatsApp.addEventListener('input', validarInformacion);

  const campoNombre = document.createElement('input');
  campoNombre.placeholder = 'NOMBRE(S)';
  campoNombre.addEventListener('input', validarInformacion);

  const campoApellido = document.createElement('input');
  campoApellido.placeholder = 'APELLIDOS';
  campoApellido.addEventListener('input', validarInformacion);

  const estadosMexico = [
    "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas",
    "Chihuahua", "Coahuila", "Colima", "Durango", "Guanajuato", "Guerrero", "Hidalgo",
    "Jalisco", "México", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca",
    "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora",
    "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"
];

const selectEstado = document.createElement('select');
selectEstado.id = 'selectEstado';

// Agrega opciones al select basadas en la lista de estados de México
estadosMexico.forEach(estado => {
    const option = document.createElement('option');
    option.value = estado;
    option.textContent = estado;
    selectEstado.appendChild(option);
});

  const mensajeadicional = document.createElement('h8');
  mensajeadicional.textContent = '¡Al finalizar serás redirigido a WhatsApp para enviar la información de tu boleto!';

  const botonEnviarReserva = document.createElement('button');
  botonEnviarReserva.textContent = 'RESERVAR BOLETOS';
  botonEnviarReserva.addEventListener('click', async () => {
      const numeroWhatsApp = campoWhatsApp.value;
      const nombre = campoNombre.value;
      const apellido = campoApellido.value;
      const estadoSeleccionado = selectEstado.value;
     

      if (numeroWhatsApp && /^\d+$/.test(numeroWhatsApp) && nombre && apellido && estadoSeleccionado) {
          const cantidadBoletos = boletosSeleccionados.length;
       
          try {
              await Promise.all(boletosSeleccionados.map(async (boleto) => {
                  const boletoNumero = boleto.numero;
                  const oportunidades = boleto.oportunidades;
  
                  // Actualizar el estado del boleto y sus oportunidades
                  await set(ref(database, `boletos/${boletoNumero}/estado`), 'reservado');
                  await set(ref(database, `boletos/${boletoNumero}/oportunidades`), oportunidades);
                  
                  // Guardar la información adicional del boleto en Firebase
                  await set(ref(database, `boletos/${boletoNumero}/informacionAdicional`), {
                      nombre: nombre,
                      apellido: apellido,
                      numero: numeroWhatsApp,
                      estado: estadoSeleccionado
                  });
  
                 
                  
              }));

        
        const mensaje = `Hola, Aparte boletos de la rifa!!
    RIFA ENTRE AMIGOS QUERÉTARO
       
    BOLETOS SELECCIONADOS (${cantidadBoletos} boletos):
        ${boletosSeleccionados.map(boleto => `*${boleto.numero}* (${boleto.oportunidades.join(', ')})`).join('\n')}
        
    Nombre: ${nombre} ${apellido}
      
        
    Enlace para ver las cuentas de pago \n
    https://rifaentreamigos-qro.000webhostapp.com/cuentas.html\n
    El siguiente paso es enviar foto del comprobante de pago por este medio:\n
    Costo Total: ${costoTotal} pesos MX
    Celular: ${numeroWhatsApp}`;  
        const urlWhatsApp = `https://wa.me/${4411302946}?text=${encodeURIComponent(mensaje)}`;
  
        const temporizador = document.createElement('p');
        temporizador.textContent = 'Redirigiendo';
        ventanaEmergente.appendChild(temporizador);
  
        setTimeout(() => {
          window.location.href = urlWhatsApp;
        }, 2000);
      } catch (error) {
        console.error("Error al reservar boletos:", error);
      }
    } else {
      alert('Por favor, ingrese un número de WhatsApp válido.');
    }
  });

  const botonCerrar = document.createElement('span');
botonCerrar.className = 'cerrar-ventana';
botonCerrar.innerHTML = 'X';
botonCerrar.addEventListener('click', () => {
  cerrarVentanaEmergente(ventanaEmergente, fondoObscuro);
});

  ventanaEmergente.appendChild(botonCerrar);
  ventanaEmergente.appendChild(mensajeBienvenida);
  ventanaEmergente.appendChild(mensajeSeleccion);
  ventanaEmergente.appendChild(campoWhatsApp);
  ventanaEmergente.appendChild(campoNombre);
  ventanaEmergente.appendChild(campoApellido);
  ventanaEmergente.appendChild(selectEstado);
  ventanaEmergente.appendChild(mensajeadicional);
  ventanaEmergente.appendChild(botonEnviarReserva);
  

  document.body.appendChild(fondoObscuro);
  document.body.appendChild(ventanaEmergente);

  function validarInformacion() {
    const numeroWhatsApp = campoWhatsApp.value;
    const nombre = campoNombre.value;
    const apellido = campoApellido.value;
    const estadoSeleccionado = selectEstado.value;

    // Verifica que todos los campos estén completos y el estado sea seleccionado
    const informacionCompleta = numeroWhatsApp && /^\d+$/.test(numeroWhatsApp) && nombre && apellido && estadoSeleccionado;

    // Habilita o deshabilita el botón de enviar dependiendo de si toda la información está completa
    botonEnviarReserva.disabled = !informacionCompleta;
}
}




function cerrarVentanaEmergente(ventanaEmergente, fondoObscuro) {
  if (ventanaEmergente && fondoObscuro) {
    ventanaEmergente.remove();
    fondoObscuro.remove();
    desbloquearSeleccionBoletos();
  }
}


mostrarNumerosDisponibles();





document.getElementById('btnMaquinaSuerte').addEventListener('click', function() {
  abrirVentanaEmergente(); 
});

function abrirVentanaEmergente() {
  bloquearSeleccionBoletos();

  // Crea un contenedor div para la ventana emergente
  var ventanaEmergente = document.createElement('div');
  ventanaEmergente.className = 'ventana-emergente';

   // Agrega una capa semitransparente para cubrir toda la página
   var fondoOscuro = document.createElement('div');
   fondoOscuro.className = 'fondo-oscuro';
   document.body.appendChild(fondoOscuro);
 // <option value="5">5</option>
            // <option value="10">10</option>
            // <option value="15">15</option>
            // <option value="20">20</option>
  // Contenido HTML de la ventana emergente
ventanaEmergente.innerHTML = `
<style>
#boletosGeneradosContainer ul {
  list-style-type: none;
  padding-left: 0;
}

.fondo-oscuro {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8); 
  z-index: 999; 
}

.boton-reservar {
  background-color: green;
  color: #ffffff;
  padding: 2vw 5vw; /* Utilizando unidades de viewport para hacerlo responsive */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 2vw; /* Tamaño de fuente también en unidades de viewport */
  text-align: center;
}

.boton-reservar:hover {
  background-color: darkgreen; /* Cambié el color en hover para mayor contraste */
}


</STYLE>
<div class="contenido-ventana" style= border: 2px solid #ccc; border-radius: 10px; background-color: #f0f0f0; max-width: 400px; margin: 0 auto;"><br><br>
    <h2 style="text-align: center; font-size: 24px; margin-bottom: 20px; color: #333;">Máquina de la Suerte</h2>
    <form id="formMaquinaSuerte">
        <label for="numBoletos" style="display: block; margin-bottom: 10px; color: #333;">Cantidad de Boletos:</label>
        <select id="numBoletos" style="width: 100%; padding: 10px; margin-bottom: 20px;">
            <option value="" selected disabled>Selecciona</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
        </select>
        <button id="generarBoletosBtn" type="button" disabled style="width: 100%; font-size: 15px; padding: 10px; background-color: #008F39; color: white; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 20px;">Generar Boletos</button>
        <div id="boletosGeneradosContainer" style="max-height: 150px; width: 300px; overflow-y: auto; border: 1px solid #ccc; padding: 10px; margin-bottom: 20px;"></div>
    </form>
    <button id="cerrarVentana" class="cerrar-ventana" style="width: 50px; padding: 5px; background-color: #dc3545; font-size: 15px; color: white; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 20px;">Cerrar</button>
    <div id="cargando" style="display: none; text-align: center;">
        <img src="https://i.ibb.co/WcZLKcF/777R.gif" alt="Cargando..." style="width: 200px; height: auto;">
    </div>
</div>
`;


document.body.appendChild(ventanaEmergente);

// Evento para cerrar la ventana emergente
document.getElementById('cerrarVentana').addEventListener('click', function() {
  // Eliminar la capa semitransparente al cerrar la ventana
    desbloquearSeleccionBoletos();
  document.body.removeChild(fondoOscuro);
  // Eliminar la ventana emergente
  document.body.removeChild(ventanaEmergente);
});

  document.getElementById('numBoletos').addEventListener('change', function() {
      var seleccion = document.getElementById('numBoletos').value;
      var botonGenerar = document.getElementById('generarBoletosBtn');

      if (seleccion === "") {
          // Si "Seleccionar" está seleccionado, deshabilita el botón de generar boleto
          botonGenerar.disabled = true;
      } else {
          // Si se selecciona un número, habilita el botón de generar boleto
          botonGenerar.disabled = false;
      }
  });


document.getElementById('generarBoletosBtn').addEventListener('click', function() {
  document.getElementById('boletosGeneradosContainer').innerHTML = '';

  var numBoletos = parseInt(document.getElementById('numBoletos').value, 10);
  mostrarCargando(); 

  setTimeout(function() {
      var contenedorResultado = document.getElementById('boletosGeneradosContainer');
      contenedorResultado.innerHTML = '';
      generarBoletosDesdeFirebase(numBoletos, contenedorResultado);
      ocultarCargando(); // Oculta el GIF de carga
  }, 7000); // Simula un tiempo de espera 

  });

  document.getElementById('cerrarVentana').addEventListener('click', function() {
      document.body.removeChild(ventanaEmergente);
        desbloquearSeleccionBoletos();
  });
}

function mostrarCargando() {
  document.getElementById('cargando').style.display = 'block';
}

function ocultarCargando() {
  document.getElementById('cargando').style.display = 'none';
}
var boletosGeneradosArray = [];
var oportunidadesArray = [];

function generarBoletosDesdeFirebase() {
  var numBoletos = parseInt(document.getElementById('numBoletos').value, 10);
  
  var contenedorResultado = document.getElementById('boletosGeneradosContainer');
  contenedorResultado.innerHTML = '';

  const boletosRef = ref(database, 'boletos');
  onValue(boletosRef, (snapshot) => {
    const data = snapshot.val();
    var boletosDisponibles = []; // Arreglo para almacenar los boletos disponibles

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const boleto = data[key];
        if (boleto.estado === "disponible") {
          boletosDisponibles.push(key); // Aquí agregamos la clave del boleto, que debería ser su número
        }
      }
    
    }

   // Crear el contenedor para la cantidad de boletos generados
const contenedorCantidadBoletos = document.createElement('div');
contenedorCantidadBoletos.id = 'contenedorCantidadBoletos';
contenedorResultado.appendChild(contenedorCantidadBoletos); // Agregar el contenedor al contenedorResultado

if (boletosDisponibles.length >= numBoletos) {
  boletosDisponibles = shuffleArray(boletosDisponibles);

  let totalBoletosGenerados = 0;
  for (let i = 0; i < numBoletos; i++) {
    var boletoGenerado = boletosDisponibles[i];
    boletosGeneradosArray.push(boletoGenerado); // Agregar el boleto generado al array
    contenedorResultado.innerHTML += `<p>${boletoGenerado}</p>`;
    obtenerYMostrarOportunidades(boletoGenerado, contenedorResultado);
    totalBoletosGenerados++; // Incrementar el contador de boletos generados
  }



  // Crear el botón de reserva
  const botonReservar = document.createElement('button');
  botonReservar.id = 'botonReservard';
  botonReservar.textContent = 'Reservar';
  botonReservar.addEventListener('click', function(event) {
      event.preventDefault(); // Prevenir que la página se recargue al hacer clic en el botón
      
      // Obtener los boletos generados
      const boletosGenerados = obtenerBoletosGenerados();
  
      // Obtener las oportunidades asociadas a los boletos
      const oportunidadesAsociadas = obtenerOportunidadesAsociadas();
  
      // Llamar a la función para enviar los boletos y oportunidades por WhatsApp
      mostrarFormularioReserva(totalBoletosGenerados,boletosGenerados, oportunidadesAsociadas);  });
  
  // Agregar el botón de reserva al contenedor
  contenedorResultado.appendChild(botonReservar);

  // Obtener el contenedor de la cantidad de boletos generados
  const contenedorCantidadBoletos = document.getElementById('contenedorCantidadBoletos');
  
  // Limpiar el contenido previo del contenedor
  contenedorCantidadBoletos.innerHTML = '';

  // Crear un elemento para mostrar la cantidad de boletos generados
  const contenedorCantidadBoletosTexto = document.createElement('div');
  contenedorCantidadBoletosTexto.textContent = 'Boletos generados: ' + totalBoletosGenerados;

  // Insertar el contenedor de cantidad de boletos generados en el contenedor deseado
  contenedorCantidadBoletos.appendChild(contenedorCantidadBoletosTexto);
} else {
  contenedorResultado.innerHTML = "<p>No hay suficientes boletos disponibles</p>";
}

  });
}


var oportunidadesArray = []; // Array para almacenar las oportunidades

function obtenerYMostrarOportunidades(numeroBoleto) {
  onValue(ref(database, 'oportunidades404'), (snapshot) => {
    const oportunidadesDisponibles = [];

    snapshot.forEach((childSnapshot) => {
      const oportunidad = childSnapshot.val();
      if (oportunidad.estado === 'disponible') {
        oportunidadesDisponibles.push(childSnapshot.key);
      }
    });

    const numerosAleatorios = [];
    while (numerosAleatorios.length < 5 && oportunidadesDisponibles.length > 0) {
      const index = Math.floor(Math.random() * oportunidadesDisponibles.length);
      const numeroAleatorio = oportunidadesDisponibles[index];
      numerosAleatorios.push(numeroAleatorio);
      oportunidadesDisponibles.splice(index, 1); // Eliminar la oportunidad asignada de la lista de disponibles
    }

    // Agregar las oportunidades al array
    oportunidadesArray.push({ boleto: numeroBoleto, oportunidades: numerosAleatorios });
  });
}

//ya me geenra, comente el resultado de las oportunidades, agrega a la lista= pendiente

  
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Intercambiar elementos
  }
  return array;
}
// Función para obtener los boletos generados
// Función para obtener los boletos generados
// function obtenerBoletosGenerados() {
//   const boletos = boletosGeneradosArray; // Utilizamos el array boletosGeneradosArray creado anteriormente
//   return boletos;
// }

function obtenerBoletosGenerados() {
  // Asumiendo que boletosGeneradosArray ya contiene todos los boletos generados
  return boletosGeneradosArray;
}

// Función para obtener las oportunidaes generadas

function obtenerOportunidadesAsociadas() {
  const oportunidades = [];
  oportunidadesArray.forEach(item => {
    const oportunidadesBoleto = item.oportunidades;
    oportunidadesBoleto.forEach(oportunidad => {
      oportunidades.push(oportunidad);
    });
  });
  return oportunidades;
}



// Función para mostrar la ventana emergente con el formulario de reserva
function mostrarFormularioReserva(cantidadBoletosSeleccionados) {

  const formularioReserva = document.createElement('form');
  formularioReserva.id = 'formularioReserva';
   formularioReserva.style.display = 'flex';
    Object.assign(formularioReserva.style, {
        margin: '0px', 
        flexDirection: 'column',
    });




    
  // Campo para indicar que llene sus datos y haga clic en apartar
  const mensajeInicio = document.createElement('p');
  mensajeInicio.textContent = 'APARTA TUS BOLETOS';
mensajeInicio.style.width = '100%'; 
mensajeInicio.style.textAlign = 'center'; 
mensajeInicio.style.marginTop = '20px'; 
mensajeInicio.style.fontSize = '16px'; 
mensajeInicio.style.lineHeight = '1.5'; 
  formularioReserva.appendChild(mensajeInicio);
const mensajeBoletosGenerados = document.createElement('p');
mensajeBoletosGenerados.textContent = `${cantidadBoletosSeleccionados} BOLETO(S) GENERADO(S)`;
mensajeBoletosGenerados.style.width = '100%'; 
mensajeBoletosGenerados.style.textAlign = 'center'; 
mensajeBoletosGenerados.style.marginTop = '20px'; 
mensajeBoletosGenerados.style.fontSize = '16px'; 
mensajeBoletosGenerados.style.lineHeight = '1.5'; 
formularioReserva.appendChild(mensajeBoletosGenerados);


  const campoNombre = document.createElement('input');
  campoNombre.id = 'campoNombre';
  campoNombre.type = 'text';
  campoNombre.placeholder = 'Nombre';
  formularioReserva.appendChild(campoNombre);

  const campoApellido = document.createElement('input');
  campoApellido.id = 'campoApellido';
  campoApellido.type = 'text';
  campoApellido.placeholder = 'Apellido';
  formularioReserva.appendChild(campoApellido);

  const campoWhatsApp = document.createElement('input');
  campoWhatsApp.id = 'campoWhatsApp';
  campoWhatsApp.type = 'text';
  campoWhatsApp.placeholder = 'WhatsApp';
  formularioReserva.appendChild(campoWhatsApp);

  const selectEstado = document.createElement('select');
  selectEstado.id = 'selectEstado';
  const estadosMexico = [
    "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas",
    "Chihuahua", "Coahuila", "Colima", "Durango", "Guanajuato", "Guerrero", "Hidalgo",
    "Jalisco", "México", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca",
    "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora",
    "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"
  ];

  estadosMexico.forEach(estado => {
    const option = document.createElement('option');
    option.value = estado;
    option.textContent = estado;
    selectEstado.appendChild(option);
  });
  formularioReserva.appendChild(selectEstado);

  // Mensaje al final del formulario
  const mensajeFinal = document.createElement('p');
  mensajeFinal.textContent = '¡Al finalizar serás redirigido a WhatsApp para enviar la información de tu boleto!';
mensajeFinal.style.width = '100%'; 
mensajeFinal.style.textAlign = 'center';
mensajeFinal.style.marginTop = '20px'; 
mensajeFinal.style.fontSize = '16px';
mensajeFinal.style.lineHeight = '1.5'; 
  formularioReserva.appendChild(mensajeFinal);

  const botonEnviar = document.createElement('button');
  botonEnviar.textContent = 'Apartar';
  formularioReserva.appendChild(botonEnviar);

  
  const saltoDeLinea = document.createElement('br');
  formularioReserva.appendChild(saltoDeLinea);

    const botonCerrar = document.createElement('button');
    botonCerrar.className = 'boton-cerrar';
    botonCerrar.textContent = 'Cerrar';
    botonCerrar.addEventListener('click', function() {
        // Eliminar la ventana emergente y el fondo oscuro al hacer clic en el botón de cerrar
        document.body.removeChild(ventanaEmergente);
        document.body.removeChild(fondoOscuro);
    });
      botonCerrar.style.alignSelf = 'flex-end';
  botonCerrar.style.marginBottom = '10px';
  botonCerrar.style.background = 'red';
  botonCerrar.style.color = 'white';
  botonCerrar.style.border = 'none';
  botonCerrar.style.borderRadius = '5px';
  botonCerrar.style.padding = '5px 10px';
    formularioReserva.appendChild(botonCerrar);
    

  // Agregar evento de submit al formulario
  formularioReserva.addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe por defecto

    botonEnviar.disabled = true;
    botonEnviar.textContent = 'Procesando'; 
    
  const mensajeRedirigiendo = document.createElement('p');
  mensajeRedirigiendo.textContent = 'Redirigiendo';
  formularioReserva.appendChild(mensajeRedirigiendo);

    // Obtener los valores del formulario
    const nombre = campoNombre.value;
    const apellido = campoApellido.value;
    const whatsapp = campoWhatsApp.value;
    const estado = selectEstado.value;

    // Verificar que se hayan completado todos los campos del formulario
    if (nombre && apellido && whatsapp && estado) {
      // Obtener los boletos generados y las oportunidades asociadas
      const boletosGenerados = obtenerBoletosGenerados();
      const oportunidadesAsociadas = obtenerOportunidadesAsociadas();

      // Enviar los boletos, oportunidades y datos del formulario por WhatsApp
      enviarBoletosYOportunidadesPorWhatsApp(boletosGenerados, oportunidadesAsociadas, nombre, apellido, whatsapp, estado);
    } else {
      alert('Por favor, completa todos los campos del formulario.');
      botonEnviar.disabled = false;
    botonEnviar.textContent = 'Apartar';
    }
  });


  // Mostrar la ventana emergente con el formulario
  const ventanaEmergente = document.createElement('div');
  ventanaEmergente.className = 'ventana-emergente';
  ventanaEmergente.appendChild(formularioReserva);
  document.body.appendChild(ventanaEmergente);
}

async function enviarBoletosYOportunidadesPorWhatsApp(boletos, oportunidades, nombre, apellido, whatsapp, estado) {
  try {
    // Número de WhatsApp al que deseas enviar el mensaje (debes incluir el código de país)
    const numeroWhatsApp = '4411302946'; // Asegúrate de reemplazar esto con tu número de WhatsApp real, incluyendo el código de país.

    // Inicializamos el mensaje completo que vamos a enviar
    let mensajeCompleto = `¡Aquí están tus boletos y oportunidades!\n\n
    RIFA ENTRE AMIGOS QUERÉTARO`;

    // Prepara las promesas para las actualizaciones de la base de datos
    let promesasDeActualizacion = [];

    // Iteramos sobre cada boleto para agregar su información al mensaje completo y preparar las actualizaciones de la base de datos
    boletos.forEach((boletoNumero, index) => {
        const ops = oportunidades.slice(index * 5, (index + 1) * 5).join(', ');
        mensajeCompleto += `Boleto: ${boletoNumero}\nOportunidades: ${ops}\n\n`;

        // Añade aquí las operaciones de actualización de la base de datos para cada boleto
        promesasDeActualizacion.push(
            set(ref(database, `boletos/${boletoNumero}/estado`), 'reservado'),
            set(ref(database, `boletos/${boletoNumero}/informacionAdicional`), {
               
                nombre: nombre,
                apellido: apellido,
                whatsapp: whatsapp,
                estado: estado
            }),
          
            set(ref(database, `boletos/${boletoNumero}/oportunidades`), oportunidades.slice(index * 5, (index + 1) * 5))
        );
    });

    // Espera a que todas las operaciones de la base de datos se completen
    await Promise.all(promesasDeActualizacion);
mensajeCompleto += `Enlace para ver las cuentas de pago:\n\n`;
mensajeCompleto += `https://rifaentreamigos-qro.000webhostapp.com/cuentas.html\n\n`;
mensajeCompleto += `El siguiente paso es enviar foto del comprobante de pago por este medio:\n\n`;


    // Agregamos la información del usuario al final del mensaje
    mensajeCompleto += `Nombre: ${nombre}\nApellido: ${apellido}\nWhatsApp: ${whatsapp}\nEstado: ${estado}`;
    document.body.innerHTML += "<p>Redirigiendo</p>";
    // Preparamos la URL para enviar el mensaje a través de WhatsApp
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensajeCompleto)}`;
    setTimeout(() => {
      window.location.href = urlWhatsApp;
    }, 2000); // Esperar 2 segundos antes de redirigir a WhatsApp

  } catch (error) {
    console.error('Error al enviar boletos y oportunidades por WhatsApp:', error);
    alert('Ocurrió un error al enviar los boletos y oportunidades por WhatsApp. Por favor, intenta nuevamente.');
  }
}

