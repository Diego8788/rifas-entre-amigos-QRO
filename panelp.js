import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

    const firebaseConfig = {
        apiKey: "AIzaSyC7_FF9zCatiybPL7BBhtpt-cbKxQdvPHQ",
        authDomain: "loteria-prueba-ll.firebaseapp.com",
        databaseURL: "https://loteria-prueba-ll-default-rtdb.firebaseio.com",
        projectId: "loteria-prueba-ll",
        storageBucket: "loteria-prueba-ll.appspot.com",
        messagingSenderId: "266376757381",
        appId: "1:266376757381:web:47c0ec87c0aa3605e869ec"
    };

// Inicializa tu aplicación Firebase
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

// Obtener una referencia a la colección 'boletos'

try {
    const firebaseApp = initializeApp(firebaseConfig);
    const database = getDatabase(firebaseApp);

    // Obtener una referencia a la colección 'boletos'
    const boletosRef = ref(database, 'boletos');

    // Obtener una referencia al contenedor donde se mostrará la información del boleto
    const infoTextoBoleto = document.getElementById('infoTextoBoleto');

    function actualizarInfoBoleto(numeroBoleto, nombre, apellido, estado, estadoInformacionAdicional) {
        // Asigna los valores a los elementos del div
        document.getElementById('numeroBoleto').innerText = numeroBoleto;
        document.getElementById('nombre').innerText = nombre;
        document.getElementById('apellido').innerText = apellido;
        document.getElementById('estado').innerText = estado;
        document.getElementById('estadoInformacionAdicional').innerText = estadoInformacionAdicional;
    
        // Muestra el contenido del ticket solo si se encontró un boleto
    }
    

    // Oculta el div con la información del boleto al principio

    // Escucha el evento de clic en el botón de búsqueda
    document.getElementById('buscarBoton').addEventListener('click', function () {
        const numeroBoleto = document.getElementById('buscarInput').value.trim();
        buscarBoletos(numeroBoleto);
    });

    function buscarBoletos(numeroBoleto) {
        // Limpia el contenedor antes de agregar nuevos resultados
        document.getElementById('infoBoletos').innerHTML = '';
    
        // Escucha eventos de 'value' en la referencia 'boletosRef'
        onValue(boletosRef, (snapshot) => {
            try {
                // Obtiene los datos de la referencia
                const boletos = snapshot.val();
    
                // Verifica si el número de boleto existe en la base de datos
                if (boletos && boletos[numeroBoleto]) {
                    const boleto = boletos[numeroBoleto];
    
                    // Actualiza la información del boleto en la interfaz
                    actualizarInfoBoleto(
                        numeroBoleto,
                        boleto.informacionAdicional.nombre,
                        boleto.informacionAdicional.apellido,
                        boleto.estado,
                        boleto.informacionAdicional.estado
                    );
                } else {
                    // Si el número de boleto no existe, muestra un mensaje de error
                    document.getElementById('infoBoletos').innerHTML = '<p>No se encontraron resultados.</p>';
                    // Asegura que la tarjeta de información del boleto esté oculta
                    
                }
            } catch (error) {
                console.error("Error al procesar los datos de Firebase:", error);
            }
        });
    }

    // Llama a la función para mostrar los textos del boleto al principio
    actualizarInfoBoleto('', '', '', '','');
} catch (error) {
    console.error("Error al inicializar Firebase:", error);
}
