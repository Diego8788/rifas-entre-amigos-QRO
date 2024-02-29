import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue, update } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";


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

function bloquearSeleccionBoletos() {
  const contenedorBoletosEnReservas = document.getElementById('contenedorBoletosEnReservas');
  contenedorBoletosEnReservas.style.pointerEvents = 'none';
}

function desbloquearSeleccionBoletos() {
  const contenedorBoletosEnReservas = document.getElementById('contenedorBoletosEnReservas');
  contenedorBoletosEnReservas.style.pointerEvents = 'auto';
}

function mostrarVentanaEmergente(numero, tipo, boletos, oportunidades) {
  bloquearSeleccionBoletos();

  const fondoObscuro = document.createElement('div');
  fondoObscuro.className = 'fondo-obscuro';
  fondoObscuro.addEventListener('click', () => {
    desbloquearSeleccionBoletos();
    cerrarVentanaEmergente(ventanaEmergente, fondoObscuro);
  });

  const ventanaEmergente = document.createElement('div');
  ventanaEmergente.className = 'ventana-emergente';

  const mensajeBienvenida = document.createElement('p');
  mensajeBienvenida.textContent = `Selecciona el nuevo estado para el boleto [ ${numero} ]`;

  // Verificar si se proporcionó la información de boletos
  if (boletos && boletos.length > 0) {
    mensajeBienvenida.textContent += ` con oportunidades: ${boletos.join(', ')}`;
  }

  // Verificar si se proporcionó la información de oportunidades
  if (oportunidades && oportunidades.length > 0) {
    mensajeBienvenida.textContent += ` y oportunidades: ${oportunidades.join(', ')}`;
  }

  ventanaEmergente.appendChild(mensajeBienvenida);

  const contenedorBotones = document.createElement('div');
  contenedorBotones.className = 'fila-botones';

  const botonDisponible = crearBoton('Disponible', () => {
    actualizarEstado(numero, tipo, 'disponible');
    cerrarVentanaEmergente(ventanaEmergente, fondoObscuro);
  });
  botonDisponible.style.backgroundColor = '#007BFF';
  contenedorBotones.appendChild(botonDisponible);

  const botonpagado = crearBoton('pagado', () => {
    actualizarEstado(numero, tipo, 'pagado');
    cerrarVentanaEmergente(ventanaEmergente, fondoObscuro);
  });
  botonpagado.style.backgroundColor = '#00ff00';
  contenedorBotones.appendChild(botonpagado);

  const botonCancelar = crearBoton('Cancelar', () => {
    desbloquearSeleccionBoletos();
    cerrarVentanaEmergente(ventanaEmergente, fondoObscuro);
  });
  botonCancelar.style.backgroundColor = '#d9534f';
  contenedorBotones.appendChild(botonCancelar);

  ventanaEmergente.appendChild(contenedorBotones);
  document.body.appendChild(fondoObscuro);
  document.body.appendChild(ventanaEmergente);
}

function crearBoton(texto, onClick) {
  const boton = document.createElement('button');
  boton.textContent = texto;
  boton.addEventListener('click', onClick);
  return boton;
}
function actualizarEstado(numero, tipo, nuevoEstado) {
  const refPathBoletos = `boletos/${numero}`;
  const refPathOportunidades404 = `oportunidades404`;

  const boletosRef = ref(database, refPathBoletos);
  const oportunidades404Ref = ref(database, refPathOportunidades404);

  // Obtener el estado actual de la oportunidad en "oportunidades404"
  onValue(oportunidades404Ref, (snapshot) => {
    if (snapshot.exists()) {
      const oportunidades404 = snapshot.val();

      // Obtener las oportunidades asociadas al boleto
      onValue(boletosRef, (boletosSnapshot) => {
        if (boletosSnapshot.exists()) {
          const boleto = boletosSnapshot.val();
          const oportunidadesBoleto = boleto.oportunidades || [];

          // Verificar si hay oportunidades asociadas al boleto en "oportunidades404"
          const oportunidadesAActualizar = oportunidadesBoleto.filter((oportunidadNumero) => oportunidades404[oportunidadNumero]);
          if (oportunidadesAActualizar.length > 0) {
            // Actualizar el estado del boleto en "boletos"
            const boletosUpdateData = {};
            boletosUpdateData['estado'] = nuevoEstado;

            update(boletosRef, boletosUpdateData)
              .then(() => {
                console.log(`Boleto ${numero} en "boletos" - Estado actualizado a ${nuevoEstado}`);
              })
              .catch((error) => {
                console.error('Error al actualizar el estado en "boletos":', error);
              });

            // Actualizar el estado de las oportunidades en "oportunidades404"
            const oportunidadesUpdateData = {};
            oportunidadesAActualizar.forEach((oportunidadNumero) => {
              oportunidadesUpdateData[`/${oportunidadNumero}/estado`] = nuevoEstado;
            });

            update(oportunidades404Ref, oportunidadesUpdateData)
              .then(() => {
                console.log(`Estado de las oportunidades asociadas actualizado a ${nuevoEstado}`);
              })
              .catch((error) => {
                console.error('Error al actualizar el estado de las oportunidades en "oportunidades404":', error);
              });
          } else {
            console.log(`No hay oportunidades asociadas al boleto ${numero} en "oportunidades404". No se realizaron cambios.`);
          }
        }
      });
    } else {
      console.log(`No hay datos en "oportunidades404". No se realizaron cambios.`);
    }
  });
}




function mostrarInformacionReservada(tipo, terminoBusqueda = '') {
  const refPath = tipo === 'boletos' ? 'boletos' : 'oportunidades'; 
  const contenedorNumeros = document.getElementById(`contenedor${tipo === 'boletos' ? 'BoletosEnReservas' : 'OportunidadesNumeros'}`);
  const contenedorResumen = document.getElementById(`contenedor${tipo === 'boletos' ? 'CantidadBoletos' : 'CantidadOportunidades'}`);

  const boletosRef = ref(database, refPath);

  onValue(boletosRef, (snapshot) => {
    contenedorNumeros.innerHTML = '';
    let contadorReservados = 0;

    if (snapshot.exists()) {
      const boletos = snapshot.val();

      Object.keys(boletos).forEach((boleto) => {
        const estado = boletos[boleto].estado;
        const oportunidades = boletos[boleto].oportunidades;

        if (estado === 'reservado' && boleto.includes(terminoBusqueda)) {
          contadorReservados++;

          const numeroFormateado = ('00000' + boleto).slice(-5);

          const boton = crearBoton(numeroFormateado, () => mostrarVentanaEmergente(boleto, tipo, oportunidades));
          contenedorNumeros.appendChild(boton);
        }
      });
    }

    mostrarResumen(tipo, contadorReservados);
  });
}



function mostrarResumen(tipo, contadorReservados) {
  const contenedorResumen = document.getElementById(`contenedor${tipo === 'boletos' ? 'CantidadBoletos' : 'CantidadOportunidades'}`);
  contenedorResumen.textContent = `Total reservados: ${contadorReservados}`;
}


function mostrarResumenTotal() {
  const contenedorCantidadTotal = document.getElementById('contenedorCantidadTotal');

  const boletosRef = ref(database, 'boletos');
  const oportunidadesRef = ref(database, 'oportunidades404');

  onValue(boletosRef, (boletosSnapshot) => {
    onValue(oportunidadesRef, (oportunidadesSnapshot) => {
      const totalBoletos = boletosSnapshot.numChildren();
      const totalOportunidades = oportunidadesSnapshot.numChildren();

      console.log('Total Boletos:', totalBoletos);
      console.log('Total Oportunidades:', totalOportunidades);

      contenedorCantidadTotal.textContent = `TOTAL: BOLETOS: ${totalBoletos} / OPORTUNIDADES: ${totalOportunidades}`;
    });
  });
}


function cerrarVentanaEmergente(ventanaEmergente, fondoObscuro) {
  if (ventanaEmergente && fondoObscuro) {
    ventanaEmergente.remove();
    fondoObscuro.remove();
    desbloquearSeleccionBoletos();
  }
}


// Llamada a la función de búsqueda al hacer clic en el botón
document.getElementById('btnBuscar').addEventListener('click', function () {
  const terminoBusqueda = document.getElementById('inputBusqueda').value;

  // Llama a la nueva función de búsqueda con el término ingresado
  buscarNumerosReservadosNuevoContenedor('boletos', terminoBusqueda);

  // Limpia el campo de búsqueda después de realizar la búsqueda
  document.getElementById('inputBusqueda').value = '';
});


function buscarBoletosReservadosNuevoContenedor(terminoBusqueda = '') {
  if (terminoBusqueda.trim() === '') {
    // Manejar el caso en el que no se proporciona un término de búsqueda
    return;
  }

  const contenedorResultadosBoletos = document.getElementById('contenedorResultadosBoletos'); // Nuevo contenedor para los resultados de boletos

  contenedorResultadosBoletos.innerHTML = ''; // Limpiar el contenedor de resultados

  // Buscar boletos
  const boletosRef = ref(database, 'boletos');
  onValue(boletosRef, (boletosSnapshot) => {
    let contadorReservados = 0;

    boletosSnapshot.forEach((boletosChildSnapshot) => {
      const numero = boletosChildSnapshot.key;
      const estadoNumero = boletosChildSnapshot.val().estado;

      if (estadoNumero === 'reservado' && numero.includes(terminoBusqueda)) {
        contadorReservados++;

        const numeroFormateado = ('00000' + numero).slice(-5);

        const boton = crearBoton(numeroFormateado, () => mostrarVentanaEmergente(numero, 'boletos'));
        contenedorResultadosBoletos.appendChild(boton); // Agregar botones al nuevo contenedor
      }
    });
  }, (error) => {
    console.error('Error al buscar boletos reservados:', error);
  });

  // Buscar oportunidades
  const oportunidadesRef = ref(database, 'oportunidades');
  onValue(oportunidadesRef, (oportunidadesSnapshot) => {
    let contadorOportunidades = 0;

    oportunidadesSnapshot.forEach((oportunidadesChildSnapshot) => {
      const numeroOportunidad = oportunidadesChildSnapshot.key;
      const estadoOportunidad = oportunidadesChildSnapshot.val().estado;

      if (estadoOportunidad === 'reservado' && numeroOportunidad.includes(terminoBusqueda)) {
        contadorOportunidades++;

        const numeroFormateado = ('00000' + numeroOportunidad).slice(-5);

        const boton = crearBoton(numeroFormateado, () => mostrarVentanaEmergente(numeroOportunidad, 'oportunidades'));
        contenedorResultadosBoletos.appendChild(boton); // Agregar botones al nuevo contenedor
      }
    });
  }, (error) => {
    console.error('Error al buscar oportunidades reservadas:', error);
  });
}



document.getElementById('btnBuscarBoletos').addEventListener('click', function () {
  const terminoBusqueda = document.getElementById('inputBusquedaBoletos').value;

  // Llama a la nueva función de búsqueda con el término ingresado
  buscarBoletosReservadosNuevoContenedor(terminoBusqueda);

  // Limpia el campo de búsqueda después de realizar la búsqueda
  document.getElementById('inputBusquedaBoletos').value = '';
});

mostrarInformacionReservada('boletos');

  //pagado
  
  //pagado
  
  function mostrarInformacionVendida(tipo) {
    const refPath = tipo === 'boletos' ? 'boletos' : 'oportunidades404';
    const contenedorNumeros = document.getElementById(`contenedor${tipo === 'boletos' ? 'Numerospagados' : 'OportunidadesNumerospagados'}`);
    const contenedorResumen = document.getElementById(`contenedor${tipo === 'boletos' ? 'CantidadBoletospagados' : 'CantidadOportunidadespagados'}`);
    
    const numerosRef = ref(database, refPath);
  
    onValue(numerosRef, (numerosSnapshot) => {
      contenedorNumeros.innerHTML = '';
  
      let contadorpagados = 0;
  
      numerosSnapshot.forEach((numerosChildSnapshot) => {
        const numero = numerosChildSnapshot.key;
        const estadoNumero = numerosChildSnapshot.val().estado;
  
        if (estadoNumero === 'pagado') {
          contadorpagados++;
  
          const numeroFormateado = ('00000' + numero).slice(-5);
  
          const boton = document.createElement('button');
          boton.textContent = numeroFormateado;
          boton.addEventListener('click', () => seleccionarBoleto(numero));
  
          contenedorNumeros.appendChild(boton);
        }
      });
  
      mostrarResumenpagados(tipo, contadorpagados);
    });
  }
  
  function mostrarResumenpagados(tipo, cantidadpagados) {
    const contenedorResumen = document.getElementById(`contenedor${tipo === 'boletos' ? 'CantidadBoletospagados' : 'CantidadOportunidadespagados'}`);
    contenedorResumen.textContent = `${tipo === 'boletos' ? 'BOLETOS' : 'OPORTUNIDADES'} PAGADOS: ${cantidadpagados}`;
  
    if (tipo === 'boletos') {
      mostrarResumenpagadoTotal();
    }
  }
  
  function mostrarResumenpagadoTotal() {
    const contenedorCantidadTotal = document.getElementById('contenedorCantidadTotalpagados');
  
    const boletosRef = ref(database, 'boletos');
    const oportunidadesRef = ref(database, 'oportunidades404');
  
    onValue(boletosRef, (boletosSnapshot) => {
      onValue(oportunidadesRef, (oportunidadesSnapshot) => {
        const totalBoletos = boletosSnapshot.numChildren();
        const totalOportunidades = oportunidadesSnapshot.numChildren();
  
        contenedorCantidadTotal.textContent = `TOTAL: BOLETOS: ${totalBoletos} / OPORTUNIDADES: ${totalOportunidades}`;
      });
    });
  }
  

  mostrarInformacionVendida('boletos');
  
  mostrarInformacionVendida('oportunidades404');

