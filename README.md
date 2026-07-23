Clínica Dental Universitaria Anáhuac
Documentación Técnica Completa del Sistema
Xalapa, Veracruz · 2026
Este documento explica, en lenguaje sencillo, cómo está construida cada parte del sistema de control de la clínica dental. 
 1. ¿Qué es este sistema y cómo funciona?
Imagina que tienes una libreta enorme donde anotas todo lo que pasa en la clínica: quién es cada paciente, qué tratamiento recibe, qué alumno lo atiende, cuándo llegó, cuánto pagó... Esta aplicación es exactamente eso, pero en la computadora: una libreta digital organizada en módulos (secciones), donde cada sección se encarga de una tarea específica.
Lo especial de este sistema es que NO necesita internet para funcionar, ni un servidor costoso, ni una empresa que te cobre por guardar los datos. Todo se guarda directamente en el navegador de la computadora donde lo usas, usando una tecnología del navegador llamada localStorage (que explicaremos más adelante con detalle).
1.1 ¿De qué está hecho el sistema?
El sistema está compuesto por archivos de texto con extensión .html. Cada módulo es un archivo independiente. Puedes abrirlos con cualquier navegador web (Chrome, Safari, Edge) sin instalar nada. Los tres lenguajes que usan estos archivos son:
•	HTML — Define la estructura: dónde está el botón, dónde está la lista, dónde está el formulario. Es como el esqueleto del cuerpo.
•	CSS — Define el diseño visual: de qué color es el botón, qué tamaño tiene la letra, cuánto espacio hay entre los elementos. Es como la ropa que lleva el esqueleto.
•	JavaScript — Define el comportamiento: qué pasa cuando haces clic en el botón, cómo se guarda un registro, cómo se filtra la lista. Es como los músculos y el cerebro del cuerpo.
Los tres lenguajes viven dentro del mismo archivo .html, separados en secciones. El HTML va en el cuerpo del archivo, el CSS va entre etiquetas <style>...</style>, y el JavaScript va entre etiquetas <script>...</script>.
1.2 ¿Dónde se guardan los datos?
Cuando guardas un alumno nuevo, o registras un paciente, los datos NO viajan a ningún servidor de internet. En su lugar, el navegador los guarda en su propia memoria interna, llamada localStorage.
Piensa en localStorage como un cajón de madera dentro de la misma computadora. Cuando cierras el navegador, el cajón no desaparece: sigue ahí con todos los datos la próxima vez que abres la aplicación. Esto es posible porque localStorage persiste entre sesiones (no es una memoria temporal).
La única limitación es que ese cajón es local: solo existe en ESA computadora, en ESE navegador. Si abres la aplicación en otra computadora, verás el sistema vacío, porque el cajón de esa computadora está en blanco. Por eso en el futuro se planea migrar a Azure (la nube de Microsoft), para que todos compartan el mismo cajón.


1.3 Módulos del sistema
Módulo (archivo)	Para qué sirve
index.html	Menú principal — la pantalla de inicio con accesos a todo
control-clinica-dental.html	Expedientes clínicos completos de cada paciente
banco-pacientes.html	Lista de espera de pacientes y su asignación a alumnos
alumnos.html	Directorio de todos los alumnos con datos y foto
maestros.html	Directorio de todos los maestros con datos y especialidad
pagos-visitas.html	Registro de citas, asistencias y pagos por paciente
prestamos.html	Control de equipos prestados y devueltos
justificantes.html	Emisión e impresión de justificantes médicos y recetas
receta-medica.html	Recetas médicas con firma digital del doctor
consentimientos.html	Cartas de consentimiento informado con firma
estadisticas.html	Gráficas y métricas que consolidan todos los módulos
materias.html	Catálogo de clínicas/especialidades usado en toda la app
asistencia.html	Registro de entrada y salida de maestros y personal
ceye.html	Control de esterilización de instrumental odontológico
auth.js	Configuración de login con cuentas Microsoft (Azure)
 2. localStorage — El cajón donde se guardan los datos
Antes de entrar al código de cada módulo, necesitamos entender muy bien cómo funciona localStorage, porque es la base de TODO el sistema. Sin localStorage, cada vez que cerraras el navegador todos los datos desaparecerían.
2.1 ¿Qué es localStorage?
El navegador web (Chrome, Safari, Edge) tiene un espacio de almacenamiento privado para cada sitio web que visitas. Ese espacio es localStorage. Funciona como un diccionario gigante: guardas información usando una "llave" (un nombre) y un "valor" (el contenido). Puedes guardar hasta aproximadamente 5 MB de texto por dominio.
Un ejemplo sencillo de cómo funciona el diccionario:
// Guardar un valor:
localStorage.setItem('mi_nombre', 'Juan García');

// Recuperar ese valor más tarde:
const nombre = localStorage.getItem('mi_nombre');
console.log(nombre);  // muestra: 'Juan García'

// Eliminar un valor:
localStorage.removeItem('mi_nombre');

// Ver todo lo que hay guardado: abre Chrome → F12 → Application → Local Storage
El problema es que localStorage solo acepta texto (strings). Los datos de la aplicación son objetos con muchos campos (nombre, teléfono, fecha, etc.), no texto simple. Para resolver esto, el sistema convierte los objetos a formato JSON antes de guardarlos.
2.2 ¿Qué es JSON?
JSON (JavaScript Object Notation) es una forma de escribir objetos de datos como texto. Es como escribir una ficha de paciente en papel, pero siguiendo unas reglas muy estrictas para que la computadora pueda leerla de vuelta.
Por ejemplo, un alumno en JavaScript es un objeto así:
// Objeto JavaScript (en memoria de la computadora):
const alumno = {
  id:      'AL-M3K2AB',
  nombre:  'Juan García López',
  semestre: '3°',
  correo:  'juan.garcia@anahuac.mx',
  activo:  true
};
Cuando se guarda en localStorage, ese objeto se convierte a texto JSON así:
// Texto JSON (lo que realmente se guarda en localStorage):
{"id":"AL-M3K2AB","nombre":"Juan García López","semestre":"3°",
"correo":"juan.garcia@anahuac.mx","activo":true}
Las reglas del formato JSON son: las llaves de texto van entre comillas dobles, los textos van entre comillas dobles, los números sin comillas, true/false sin comillas, y los objetos van entre llaves {}. Si alguna regla se rompe, JSON.parse dará error y el sistema no podrá leer los datos.
2.3 Las dos funciones de conversión: stringify y parse
// JSON.stringify convierte objeto → texto (para guardar):
const alumno = { nombre: "Juan", semestre: "3°" };
const texto  = JSON.stringify(alumno);
// texto vale: '{"nombre":"Juan","semestre":"3°"}'

// JSON.parse convierte texto → objeto (para usar):
const texto2  = '{"nombre":"Juan","semestre":"3°"}';
const alumno2 = JSON.parse(texto2);
console.log(alumno2.nombre);   // muestra: Juan
console.log(alumno2.semestre); // muestra: 3°
Entonces el flujo completo para guardar un alumno es: objeto JavaScript → JSON.stringify → texto → localStorage.setItem. Y para leerlo: localStorage.getItem → texto → JSON.parse → objeto JavaScript.
2.4 Llaves de localStorage usadas en el sistema
Cada módulo usa su propia llave para guardar sus datos, así no se mezclan. La llave incluye "_v1" al final (versión 1) para que si en el futuro se cambia la estructura de datos, se pueda usar "_v2" sin perder los datos anteriores.
Módulo	Llave de localStorage	Qué guarda
Expedientes clínicos	clinica_dental_data_v1	Array de expedientes completos con fotos y firma
Alumnos	clinica_alumnos_v1	Array de alumnos con foto y datos académicos
Maestros	clinica_maestros_v1	Array de maestros con especialidad y cédula
Préstamos	clinica_prestamos_v1	Arrays de equipos y préstamos activos/devueltos
Banco de pacientes	clinica_banco_pacientes_v1	Array de pacientes en espera o asignados
Materias	clinica_materias_v1	Array de clínicas y especialidades disponibles
Coordinadores	clinica_coordinadores_v1	Array de emails de coordinadores (para auth.js)
2.5 Cómo ver los datos guardados en el navegador
Si quieres ver exactamente qué hay guardado en localStorage en cualquier momento, puedes hacerlo sin necesidad de código:
1. Abre la aplicación en Chrome
2. Presiona F12 (o clic derecho → "Inspeccionar")
3. Ve a la pestaña "Application" (Aplicación)
4. En el menú izquierdo busca "Local Storage"
5. Haz clic en el dominio (por ejemplo: https://calw3.github.io)
6. Verás todas las llaves y sus valores en formato JSON
 3. El patrón común — Cómo funciona cada módulo
Todos los módulos de la aplicación siguen exactamente la misma receta. Es como cocinar diferentes platillos pero siempre siguiendo los mismos pasos: calentar el sartén, agregar aceite, cocinar el ingrediente. La receta cambia los ingredientes pero no los pasos. Aquí los "ingredientes" son los datos (alumnos, pacientes, préstamos...) pero los "pasos" son siempre los mismos.
3.1 El objeto S — el cerebro del módulo
Al abrir cualquier módulo, lo primero que hace el código es crear un objeto llamado S (de "State", que en inglés significa "estado"). S es una caja que contiene TODO lo que el módulo necesita saber en cualquier momento: los datos guardados, qué registro se está editando, si el modo de selección múltiple está activo, etc.
Pensar en S como el escritorio de un empleado: encima de él tiene los documentos que está revisando (data), una nota pegada que dice qué archivo está editando (editId), y un sello de caucho para cuando trabaja en varios documentos a la vez (selMode y sel).
const S = {
  // Los datos de todos los registros, leídos de localStorage al abrir la página:
  data: loadData(),

  // ID del registro que se está editando en este momento.
  // null significa "no estoy editando nada" (se va a crear uno nuevo).
  // Si tiene un valor como "AL-M3K2AB", significa que estoy editando ESE alumno.
  editId: null,

  // ID del registro que se está viendo en el modal de detalles.
  verId: null,

  // ¿Está activo el modo de selección múltiple (para borrar varios a la vez)?
  selMode: false,

  // Conjunto de IDs de registros seleccionados (Set no permite duplicados).
  sel: new Set(),
};
3.2 loadData() — Leer los datos del cajón
Esta es la primera función que se ejecuta cuando abres un módulo. Su trabajo es abrir el cajón de localStorage, sacar los datos, convertirlos de texto JSON a objeto JavaScript, y devolverlos para que el módulo pueda usarlos.
Tiene una red de seguridad: el bloque try/catch. Si por alguna razón los datos están corruptos o el cajón está vacío, el bloque catch captura el error y devuelve un objeto vacío con arrays vacíos, en lugar de que el sistema se rompa.
const KEY = 'clinica_alumnos_v1';  // La llave del cajón de este módulo

function loadData() {
  try {
    // Paso 1: Abrir el cajón y sacar el contenido (texto):
    const raw = localStorage.getItem(KEY);

    // Paso 2: Si el cajón no está vacío, convertir el texto a objeto:
    if (raw) {
      return JSON.parse(raw);
    }
  } catch(e) {
    // Si algo sale mal (datos corruptos, etc.), no hacer nada — caerá al return de abajo
    console.error('Error al leer datos:', e);
  }

  // Si el cajón estaba vacío O hubo error: devolver estructura vacía por defecto
  // (así el módulo siempre tiene con qué trabajar)
  return { alumnos: [] };
}
3.3 saveData() — Guardar los datos en el cajón
Esta función hace lo opuesto a loadData: toma los datos que están en S.data (en la memoria de la computadora), los convierte de objeto a texto JSON, y los guarda en localStorage. Se llama cada vez que el usuario crea, edita o elimina un registro, para que los cambios no se pierdan.
function saveData() {
  // JSON.stringify convierte el objeto S.data a texto:
  const texto = JSON.stringify(S.data);

  // localStorage.setItem guarda ese texto en el cajón:
  localStorage.setItem(KEY, texto);

  // Eso es todo. Los datos ya están guardados y sobrevivirán
  // aunque cierres el navegador, apagues la computadora, o pase un mes.
}
Una cosa importante: saveData guarda TODO S.data de una sola vez, no solo el registro que cambió. Esto es más simple que guardar solo las diferencias, y con pocos registros (una clínica universitaria, no millones de usuarios) funciona perfectamente bien.
3.4 uid() — Crear identificadores únicos
Cada registro necesita un ID único para poder encontrarlo después, editarlo o borrarlo sin confundirlo con otro. El sistema genera estos IDs automáticamente usando una combinación del tiempo actual y números aleatorios.
Imagina que quieres hacer una etiqueta única para cada caja en un almacén. Una buena estrategia sería combinar la hora exacta en que etiquetaste la caja (que nunca se repite) con dos letras al azar. Eso es exactamente lo que hace uid().
function uid(prefijo) {
  // Date.now() devuelve los milisegundos desde el 1 de enero de 1970.
  // Por ejemplo: 1721500000000 (un número enorme y único en cada momento)
  const tiempo = Date.now().toString(36).toUpperCase();
  // .toString(36) convierte ese número a base 36 (letras + dígitos)
  // Ejemplo: 1721500000000 → "M3K2A"

  // Math.random() genera un número aleatorio entre 0 y 1
  // .toString(36).slice(2,4) toma 2 caracteres de ese número en base 36
  const aleatorio = Math.random().toString(36).slice(2,4).toUpperCase();
  // Ejemplo de aleatorio: "XB"

  return prefijo + '-' + tiempo + aleatorio;
  // Resultado final: 'AL-M3K2AXB'
}

// Ejemplos de IDs generados:
// uid('AL')  →  'AL-M3K2AXB'   (alumno)
// uid('BP')  →  'BP-N7X4CD1'   (banco de pacientes)
// uid('EX')  →  'EX-P1Q8EF2'   (expediente)
3.5 renderAll() — Redibujar la pantalla
Después de guardar un cambio, la pantalla necesita actualizarse para reflejar los nuevos datos. renderAll() hace exactamente eso: borra lo que hay en pantalla y lo vuelve a dibujar usando los datos actuales de S.data.
Es como borrar la pizarra y escribir todo de nuevo. Puede sonar ineficiente, pero para el volumen de datos de una clínica universitaria (decenas o pocos cientos de registros), es tan rápido que el usuario no nota ningún parpadeo.
function renderAll() {
  renderStats();   // Actualiza los contadores de arriba (total, activos, etc.)
  renderLista();   // Actualiza la lista de registros del centro de la pantalla
}

function renderStats() {
  const total = S.data.alumnos.length;
  document.getElementById('stats').innerHTML = `
    <div class="stat">
      <div class="stat-label">Total alumnos</div>
      <div class="stat-value">${total}</div>
    </div>
  `;
}

function renderLista() {
  // Toma cada alumno, lo convierte en HTML, y lo pone en la pantalla:
  const html = S.data.alumnos.map(a => `
    <div class="list-row" onclick="verAlumno('${a.id}')">
      <div class="row-title">${a.nombre}</div>
    </div>
  `).join('');
  document.getElementById('lista-alumnos').innerHTML = html || '<p>No hay registros.</p>';
}
3.6 El flujo completo: del clic a la pantalla
Veamos qué pasa exactamente desde que el usuario hace clic en "Guardar" hasta que ve el nuevo registro en la lista. Son 7 pasos que ocurren en menos de una décima de segundo:
PASO 1: El usuario hace clic en el botón "Guardar"
  → JavaScript detecta el clic con addEventListener("click", ...)

PASO 2: Se leen los valores del formulario
  → const nombre   = document.getElementById("f-nombre").value.trim();
  → const semestre = document.getElementById("f-semestre").value;

PASO 3: Se validan los datos (¿están vacíos? ¿son correctos?)
  → if (!nombre) { alert("El nombre es obligatorio"); return; }

PASO 4: Se crea el objeto del nuevo registro
  → const nuevoAlumno = { id: uid("AL"), nombre, semestre, ... };

PASO 5: Se agrega al array en memoria
  → S.data.alumnos.push(nuevoAlumno);

PASO 6: Se guarda en localStorage
  → saveData();

PASO 7: Se cierra el panel y se actualiza la pantalla
  → closePanel();
  → renderAll();
 4. HTML — La estructura de las páginas
HTML (HyperText Markup Language) es el lenguaje que define qué elementos existen en una página web y en qué orden aparecen. No tiene lógica (eso lo hace JavaScript) ni colores (eso lo hace CSS): solo define la estructura, como el esqueleto de un edificio.
HTML usa etiquetas: palabras entre signos < y > que le dicen al navegador qué tipo de contenido viene a continuación. La mayoría de las etiquetas tienen apertura <etiqueta> y cierre </etiqueta>.
4.1 Estructura base de cada archivo
Todos los archivos del sistema empiezan con la misma estructura base. Aunque parezca mucho texto, la mayoría lo escribes una vez y ya no lo tocas:
<!DOCTYPE html>
<!-- Le dice al navegador que este es un archivo HTML5 (el estándar actual) -->

<html lang="es">
<!-- <html> es la etiqueta raíz que envuelve todo el documento -->
<!-- lang="es" le dice al navegador que el contenido está en español -->

<head>
<!-- <head> contiene información SOBRE la página, no visible directamente -->

  <meta charset="UTF-8">
  <!-- Permite usar letras con acento (á, é, ñ) sin que aparezcan como símbolos raros -->

  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- Hace que la página se adapte correctamente a pantallas de celular o tablet -->

  <title>Base de Datos · Alumnos</title>
  <!-- El texto que aparece en la pestaña del navegador -->

  <style>
    /* Aquí va todo el CSS (estilos visuales) */
  </style>

</head>

<body>
<!-- <body> contiene todo lo que el usuario ve en pantalla -->

  <!-- Aquí va el HTML visible: encabezado, lista, formularios, botones... -->

  <script>
    // Aquí va todo el JavaScript (lógica y comportamiento)
  </script>

</body>
</html>
4.2 Etiquetas HTML más usadas en el sistema
Etiqueta	Para qué sirve	Ejemplo en el sistema
<div>	Contenedor genérico para agrupar elementos	Filas de la lista, tarjetas, paneles
<a href="...">	Enlace a otra página	Tarjetas del menú principal que abren módulos
<button>	Botón que el usuario puede pulsar	"+ Nuevo alumno", "Guardar", "Cancelar"
<input>	Campo de texto para que el usuario escriba	Nombre, teléfono, ID institucional
<select>	Lista desplegable de opciones	Selector de semestre, tipo de paciente
<label>	Etiqueta visible de un campo de formulario	"NOMBRE COMPLETO", "SEMESTRE"
<span>	Contenedor de texto en línea	Badges de estado, número de seleccionados
<svg>	Gráfico vectorial (íconos)	Todos los íconos de la interfaz (no son imágenes)
<canvas>	Lienzo para dibujar con JavaScript	Área de firma digital del paciente/doctor
<img>	Imagen	Foto del alumno o paciente (cargada en base64)
<form>	Agrupación lógica de campos de formulario	Formulario de nuevo alumno
<footer>	Pie de página	"Control interno · Clínica Dental..."
<header>	Encabezado de la página	Logo, título del módulo y botón "← Inicio"
4.3 Atributos importantes en el sistema
Las etiquetas HTML pueden tener atributos: información adicional dentro de la etiqueta de apertura. Los más usados en el sistema son:
<!-- id: identifica un elemento de forma única. JavaScript lo usa para encontrarlo: -->
<div id="lista-alumnos"></div>

<!-- class: etiqueta de estilo CSS. Un elemento puede tener varias clases: -->
<div class="list-row selected"></div>

<!-- onclick: JavaScript que se ejecuta al hacer clic en el elemento: -->
<div onclick="verAlumno('AL-M3K2AB')">Juan García</div>

<!-- style: CSS escrito directamente en el elemento (se usa para casos puntuales): -->
<span style="display:none;">Texto oculto</span>

<!-- placeholder: texto de ayuda dentro de un input cuando está vacío: -->
<input placeholder="Buscar alumno, ID...">

<!-- type: tipo de campo de formulario: -->
<input type="text">      <!-- campo de texto normal -->
<input type="file">      <!-- para subir archivos (fotos) -->
<input type="date">      <!-- selector de fecha con calendario -->
<input type="checkbox">  <!-- casilla de verificación -->
4.4 La estructura HTML de un módulo típico
Aunque cada módulo tiene su propio contenido, todos siguen la misma distribución visual. Esto hace que el usuario aprenda a usar uno y automáticamente sabe usar todos.
<body>
  <div class="wrap">
    <!-- ZONA 1: Encabezado con título y botón de regreso -->
    <header>
      <a class="back-btn" href="index.html">← Inicio</a>
      <div class="header-text">
        <p class="eyebrow">Clínica Dental Universitaria Anáhuac</p>
        <h1>Base de Datos · Alumnos</h1>
      </div>
    </header>

    <!-- ZONA 2: Tarjetas de estadísticas (contadores) -->
    <div class="stats" id="stats">
      <!-- JavaScript llena esto con los contadores actuales -->
    </div>

    <!-- ZONA 3: Barra de herramientas: búsqueda y botón nuevo -->
    <div class="toolbar">
      <input id="buscar" placeholder="Buscar...">
      <button class="btn-primary" id="btn-nuevo">+ Nuevo alumno</button>
    </div>

    <!-- ZONA 4: Lista de registros -->
    <div class="lista-wrap">
      <div id="lista-alumnos">
        <!-- JavaScript dibuja aquí las filas de alumnos -->
      </div>
    </div>
  </div>

  <!-- ZONA 5: Panel lateral (formulario de nuevo/editar) -->
  <div class="panel-overlay" id="overlay"></div>
  <div class="panel" id="panel">
    <div class="panel-head">
      <h3>Nuevo alumno</h3>
      <button onclick="closePanel()">✕</button>
    </div>
    <div class="panel-body">
      <!-- Campos del formulario -->
    </div>
  </div>

  <!-- ZONA 6: Modal de ver detalles -->
  <div class="modal-bg" id="modal-ver">
    <div class="modal">
      <!-- Detalles del alumno seleccionado -->
    </div>
  </div>
</body>
 5. CSS — El diseño visual del sistema
CSS (Cascading Style Sheets, hojas de estilo en cascada) es el lenguaje que controla cómo se ve cada elemento de la página: su color, su tamaño, su posición, sus bordes, sus animaciones. Sin CSS, la página sería texto negro sobre fondo blanco sin ningún formato, como un documento de Bloc de Notas.
Se llama "en cascada" porque los estilos fluyen de los elementos padre a los hijos. Si defines que el body tiene letra de tamaño 14px, todos los elementos dentro del body heredarán ese tamaño a menos que se especifique algo diferente.
5.1 Cómo funciona una regla CSS
Una regla CSS tiene dos partes: el selector (a quién le aplica) y las propiedades (qué aspecto tendrá). La sintaxis es siempre la misma:
selector {
  propiedad: valor;   /* cada línea termina con punto y coma */
  propiedad: valor;
}

/* Ejemplos reales del sistema: */

/* Aplica a TODOS los botones con clase "btn-primary" */
.btn-primary {
  background: var(--teal-600);  /* color de fondo: café */	
  color: #fff;                  /* color del texto: blanco */
  border: none;                 /* sin borde */
  border-radius: 8px;           /* esquinas redondeadas */
  height: 36px;                 /* altura fija */
  padding: 0 14px;              /* espacio interno: 0 arriba/abajo, 14px izq/der */
  font-weight: 600;             /* texto en seminegrita */
  cursor: pointer;              /* el cursor cambia a manita al pasar encima */
}

/* Aplica al botón SOLO cuando el ratón está encima */
.btn-primary:hover {
  background: var(--teal-800);  /* café más oscuro al hacer hover */
}
5.2 Variables CSS — El sistema de diseño
En lugar de escribir el mismo color (#C2570D) en 50 lugares diferentes del CSS, el sistema define variables en :root (el elemento raíz de la página). Así, si algún día se quiere cambiar el color principal, se cambia UNA sola línea y automáticamente cambia en toda la aplicación.
:root es como un diccionario de colores y valores guardado al inicio del CSS. Se accede a cada variable con la función var(--nombre-variable).
:root {
  /* ── PALETA DE COLORES PRINCIPAL (café/terracota) ── */

  --teal-50:  #FDEEE2;
  /* El color más claro. Se usa como fondo al pasar el ratón sobre una fila,
     y como fondo de los badges de semestre. Es un beige-naranja muy suave. */

  --teal-100: #F9D5B8;
  /* Un café más visible. Se usa como fondo de los encabezados de tabla. */

  --teal-600: #C2570D;
  /* El color más importante: café anaranjado brillante.
     Se usa en botones principales, bordes activos, links y el logo. */

  --teal-800: #8C3F09;
  /* Café oscuro. Se usa cuando el botón principal recibe hover (ratón encima).
     También en los títulos de sección dentro de los formularios. */

  --teal-900: #5C2906;
  /* El café más oscuro. Solo se usa en los títulos h1 de cada página. */

  /* ── COLORES DE ESTADO (para badges y alertas) ── */

  --red-50:    #FCEBEB;   /* Fondo rosa claro para zonas de peligro */
  --red-600:   #A32D2D;   /* Rojo oscuro para botones de eliminar */

  --amber-50:  #FAEEDA;   /* Fondo amarillo claro para estado "En espera" */
  --amber-600: #854F0B;   /* Ámbar oscuro para el texto del badge */

  --green-50:  #EAF3DE;   /* Fondo verde claro para estado "Disponible" */
  --green-800: #27500A;   /* Verde oscuro para el texto del badge */

  --blue-50:   #E6F1FB;   /* Fondo azul claro */
  --blue-800:  #0C447C;   /* Azul oscuro */

  /* ── FONDOS Y SUPERFICIES ── */

  --bg:        #F7F6F2;
  /* El color de fondo de TODA la página. Un beige muy suave, casi blanco,
     que es más cómodo para los ojos que el blanco puro. */

  --surface:   #FFFFFF;
  /* Blanco puro. Se usa como fondo de tarjetas, paneles, modales y listas,
     para que "floten" visualmente sobre el fondo beige. */

  --surface-1: #F1F0EA;
  /* Gris beige claro. Se usa como fondo de campos de solo lectura (readonly)
     y como fondo de los bloques de código en esta documentación. */

  /* ── TEXTOS ── */

  --text-primary:   #1F1F1D;
  /* Casi negro (no negro puro, que fatiga más la vista). Para texto principal. */

  --text-secondary: #5F5E5A;
  /* Gris medio. Para texto de apoyo: subtítulos de fila, etiquetas. */

  --text-muted:     #888780;
  /* Gris claro. Para texto desactivado, fechas, notas al pie. */

  /* ── BORDES Y FORMAS ── */

  --border: #E3E1D8;
  /* Color de los bordes de todos los elementos: tarjetas, inputs, líneas divisorias. */

  --radius: 8px;
  /* Radio de las esquinas redondeadas. Se aplica a inputs, badges y botones pequeños.
     Las tarjetas y los paneles usan 12px o 14px directamente. */
}
5.3 El reset global: * { box-sizing, margin, padding }
Los navegadores web tienen sus propios estilos por defecto que difieren entre Chrome, Firefox y Safari. Por ejemplo, un <h1> en Chrome tiene un margen superior diferente al de Firefox. Para que el diseño se vea igual en todos, el sistema empieza "reseteando" esos estilos predeterminados:
* {
  box-sizing: border-box;
  /* Por defecto, si un <div> mide 200px de ancho y le agregas 10px de padding,
     el resultado sería 220px (200 + 10 + 10). Con box-sizing: border-box,
     el padding se incluye DENTRO de los 200px. Mucho más predecible y fácil
     de calcular layouts. Es el estándar moderno. */

  margin: 0;
  /* Elimina todos los márgenes por defecto. Por ejemplo, <h1> tiene margin-top
     por defecto en el navegador. Con margin:0 empezamos desde cero. */

  padding: 0;
  /* Igual para el padding (espacio interno). */
}
5.4 Layout: cómo se posicionan los elementos
CSS ofrece varias formas de organizar elementos en pantalla. El sistema usa principalmente Flexbox y Grid, las dos herramientas modernas de layout.
Flexbox — para alinear elementos en una fila o columna
/* Flexbox se usa en el header, la barra de herramientas, las filas de la lista, etc. */

.toolbar {
  display: flex;              /* activa flexbox en este contenedor */
  justify-content: space-between; /* separa hijos: uno a la izquierda, otro a la derecha */
  align-items: center;        /* alinea hijos verticalmente al centro */
  gap: 8px;                   /* espacio entre los hijos */
}

/* Resultado visual:
   [Buscar alumno...] [Seleccionar]              [+ Nuevo alumno]
   ← lado izquierdo →                    ← lado derecho →       */

/* El panel lateral usa flex column para que su contenido se divida en 3 zonas */
.panel {
  display: flex;
  flex-direction: column;  /* los hijos se apilan VERTICALMENTE */
}
.panel-head  { flex-shrink: 0; }  /* el título NO se encoge */
.panel-body  { flex: 1; overflow-y: auto; }  /* el formulario ocupa el resto y hace scroll */
CSS Grid — para las tarjetas del menú principal
/* Grid se usa SOLO en el menú principal, para las 12 tarjetas de módulos */

.grid {
  display: grid;

  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  /* Esta línea hace la magia del diseño responsivo:
     - auto-fill: crea tantas columnas como quepan en el ancho disponible
     - minmax(280px, 1fr): cada columna mide mínimo 280px, máximo 1 fracción
     Resultado en pantalla grande (1200px): 3 columnas de 4 tarjetas cada una
     Resultado en tablet (768px): 2 columnas
     Resultado en celular (375px): 1 columna
     Todo sin escribir media queries! */

  gap: 14px;  /* espacio de 14px entre todas las tarjetas */
}
5.5 El panel lateral deslizante: animación con CSS
Cuando el usuario hace clic en "+ Nuevo alumno", aparece un panel desde la derecha con una animación suave. Esta animación NO usa JavaScript: solo CSS y la propiedad transition. Funciona así:
/* Estado CERRADO: el panel está escondido fuera de la pantalla a la derecha */
.panel {
  position: fixed;      /* fijo en pantalla, no se mueve con el scroll */
  top: 0;               /* pegado arriba */
  right: -100%;         /* está a la DERECHA del borde de la pantalla (invisible) */
  width: min(500px, 100vw);  /* 500px máximo, o todo el ancho si es celular */
  height: 100vh;        /* ocupa toda la altura de la pantalla */
  background: #fff;
  z-index: 50;          /* encima del resto del contenido */

  /* Esta línea crea la animación: cuando right cambie, que tarde 0.25 segundos */
  transition: right .25s ease;
}

/* Estado ABIERTO: JavaScript agrega la clase "open" al panel */
.panel.open {
  right: 0;  /* ahora está pegado al borde derecho de la pantalla — visible! */
}

/* La animación ocurre automáticamente porque:
   1. El panel empieza con right:-100% (invisible)
   2. JavaScript hace: panel.classList.add("open")
   3. CSS ve que right cambió a 0
   4. Como hay transition, el navegador anima el cambio en 0.25 segundos */

/* El fondo oscuro semitransparente detrás del panel: */
.panel-overlay {
  display: none;         /* invisible por defecto */
  position: fixed;
  inset: 0;              /* cubre TODA la pantalla (top+right+bottom+left = 0) */
  background: rgba(31,31,29, 0.35);  /* negro con 35% de opacidad */
  z-index: 40;           /* detrás del panel (z-index 50) pero encima del contenido */
}
.panel-overlay.open { display: block; }  /* se muestra cuando el panel abre */
El fondo oscuro sirve para dos cosas: visualmente, comunica al usuario que hay algo activo encima del contenido principal. Funcionalmente, si el usuario hace clic en ese fondo (fuera del panel), JavaScript cierra el panel, como si fuera una puerta.
5.6 Formularios: estilos de inputs y labels
Los campos de formulario por defecto en el navegador se ven muy genéricos y cambian de apariencia entre Chrome, Firefox y Safari. El sistema sobreescribe completamente esos estilos para que se vean consistentes en todos los navegadores:
/* La etiqueta encima del campo */
.field label {
  display: block;         /* ocupa toda la línea, el input va abajo */
  font-size: 11px;        /* letra pequeña */
  font-weight: 700;       /* negrita */
  color: var(--text-secondary);  /* gris medio */
  text-transform: uppercase;     /* CONVIERTE A MAYÚSCULAS automáticamente */
  letter-spacing: .04em;         /* separa ligeramente las letras (tracking) */
  margin-bottom: 5px;    /* espacio entre el label y el input */
}

/* El campo de texto */
.field input, .field select {
  width: 100%;            /* ocupa todo el ancho disponible */
  height: 36px;           /* altura fija para consistencia */
  border: 1px solid var(--border);  /* borde gris suave */
  border-radius: var(--radius);     /* esquinas redondeadas (8px) */
  padding: 0 10px;        /* espacio interior izquierda y derecha */
  font-size: 13px;
  font-family: inherit;   /* hereda la fuente del sistema (no usa la fea por defecto) */
  background: #fff;
  color: var(--text-primary);
}

/* Cuando el usuario hace clic en el campo (focus) */
.field input:focus, .field select:focus {
  outline: none;           /* elimina el borde azul/negro feo que pone el navegador */
  border-color: var(--teal-600);         /* borde café al enfocar */
  box-shadow: 0 0 0 2px var(--teal-50); /* halo suave color beige claro */
}

/* Campo de solo lectura (generado automáticamente, no editable) */
.field input[readonly] {
  background: var(--surface-1);  /* fondo gris para indicar que no se puede editar */
  color: var(--text-muted);      /* texto más claro */
}
5.7 Badges — pequeñas etiquetas de estado
Los badges son pequeñas pastillas de color que muestran el estado de un registro de un vistazo: si un paciente está "En espera" o "Asignado", si un módulo está "Disponible" o "Próximamente", qué semestre cursa un alumno. Son un elemento visual muy útil porque el usuario reconoce el estado sin leer.
/* Estilo base compartido por todos los badges */
.badge {
  display: inline-block;   /* se comporta como texto pero acepta padding */
  font-size: 11px;
  font-weight: 700;        /* negrita para que destaque */
  padding: 2px 8px;        /* espacio interno pequeño */
  border-radius: 5px;      /* esquinas muy redondeadas (casi píldora) */
  text-transform: uppercase;
  letter-spacing: .03em;
}

/* Badge verde — "Disponible", "Asignado" */
.badge-ready, .badge-asignado {
  background: var(--green-50);   /* fondo verde muy claro */
  color:      var(--green-800);  /* texto verde oscuro */
}

/* Badge ámbar — "En espera", "Pendiente" */
.badge-espera, .badge-pendiente {
  background: var(--amber-50);
  color:      var(--amber-600);
}

/* Badge rojo — alertas, errores */
.badge-error {
  background: var(--red-50);
  color:      var(--red-600);
}

/* Badge gris — "Próximamente", inactivo */
.badge-soon {
  background: var(--surface-1);
  color:      var(--text-muted);
}
5.8 Hover y transiciones — microinteracciones
Una microinteracción es un pequeño efecto visual que le dice al usuario que algo es interactivo. Por ejemplo, cuando pasas el ratón sobre una tarjeta del menú y esta sube ligeramente y cambia de borde. Estas animaciones suaves se consiguen con la propiedad transition:
/* Tarjeta del menú principal */
.card {
  /* ... otros estilos ... */
  transition: box-shadow .15s, border-color .15s, transform .1s;
  /* Cuando cambien box-shadow, border-color o transform,
     que la animación dure 0.15s (o 0.1s para transform). */
}

.card:hover {
  border-color: var(--teal-600);                     /* borde café visible */
  box-shadow: 0 4px 16px rgba(194, 87, 13, 0.10);   /* sombra suave café */
  transform: translateY(-1px);                        /* sube 1 píxel */
}

.card:active {
  transform: translateY(0);  /* al hacer clic, vuelve a su posición */
}

/* Fila de la lista de registros */
.list-row {
  transition: background .1s;
}
.list-row:hover {
  background: var(--teal-50);  /* fondo beige al pasar el ratón */
}
5.9 Tabla completa de clases CSS del sistema
Clase	Qué controla	Ejemplo de uso
.wrap	Contenedor centrado, max 980px de ancho	Envuelve todo el contenido de cada módulo
.grid	Grid responsivo auto-fill para tarjetas	Las 12 tarjetas de módulos en index.html
.card	Tarjeta interactiva con hover animado	Cada módulo en el menú principal
.btn-primary	Botón café sólido, acción principal	"+ Nuevo alumno", "Guardar registro"
.btn-secondary	Botón blanco con borde, acción secundaria	"Cancelar", "Seleccionar"
.btn-danger	Botón rojo para acciones destructivas	"Eliminar seleccionados"
.btn-icon	Botón cuadrado con solo un ícono SVG	Botón papelera junto a cada fila
.panel	Panel lateral deslizante desde la derecha	Formulario de nuevo/editar registro
.panel-overlay	Fondo oscuro semitransparente	Fondo cuando el panel está abierto
.field	Contenedor de campo (label + input)	Cada campo del formulario lateral
.grid-2	Grid de 2 columnas para campos del formulario	Campos semestre y generación juntos
.lista-wrap	Contenedor de la lista de registros	La lista de alumnos, pacientes, etc.
.list-row	Fila de un registro en la lista	Cada alumno, cada paciente en la lista
.avatar	Círculo con foto o inicial del nombre	Foto del alumno/paciente en la lista
.row-title	Nombre principal de la fila	Nombre del alumno en la lista
.row-sub	Texto secundario de la fila en gris	ID y correo bajo el nombre
.stats	Grid de tarjetas de contadores	Los números de arriba: total, activos...
.stat	Tarjeta individual de contador	Una tarjeta con un número grande
.toolbar	Barra con búsqueda y botón nuevo	La fila encima de la lista
.search-input	Campo de búsqueda en la barra	El input "Buscar alumno, ID..."
.sel-bar	Barra azul de selección múltiple	Aparece al activar modo selección
.modal-bg	Fondo del modal de detalles	Fondo cuando se ve un registro
.modal	Tarjeta del modal centrada en pantalla	La ventana de detalles del alumno
.section-title	Separador de sección en formulario	"DATOS ACADÉMICOS", "CONTACTO"
.foto-label	Área punteada para subir foto	El recuadro de imagen en el formulario
.empty-state	Mensaje cuando la lista está vacía	"No hay alumnos registrados."
#toast	Notificación flotante en la parte inferior	Mensajes de confirmación breves
.eyebrow	Texto pequeño en mayúsculas sobre el título	"CLÍNICA DENTAL UNIVERSITARIA ANÁHUAC"
.back-btn	Botón "← Inicio" para regresar al menú	El botón de regreso en cada módulo
 6. JavaScript — El comportamiento del sistema
JavaScript (JS) es el lenguaje de programación que corre dentro del navegador y le da vida a la página. Si HTML es el esqueleto y CSS es la ropa, JavaScript son los músculos y el cerebro: hace que los botones hagan cosas, guarda datos, filtra listas, valida formularios y actualiza la pantalla sin necesidad de recargar.
No es necesario instalar nada para correr JavaScript: todos los navegadores modernos lo interpretan automáticamente cuando encuentran código entre etiquetas <script>...</script>.
6.1 Variables: const y let
Una variable es una caja con nombre donde guardas un valor. En JavaScript moderno (ES2015+) se usan dos palabras para crear variables: const y let. Nunca se debe usar la palabra var (es antigua y tiene comportamientos confusos).
// const → para valores que NO van a cambiar durante toda la ejecución del módulo.
// Una vez asignado, no puedes reasignarlo. Si intentas hacerlo, el navegador
// lanzará un error inmediatamente.
const KEY = 'clinica_alumnos_v1';  // La llave siempre será esta
const MAX_FOTO = 2 * 1024 * 1024;  // 2 MB en bytes — límite de fotos

// let → para valores que SÍ pueden cambiar. Se usan para estado temporal.
let fotoDataUrl = null;  // null = sin foto. Cambia cuando el usuario elige una.
let timerToast = null;   // null = sin timer. Cambia cuando aparece el toast.

// var → NO usar. Tiene un problema llamado "hoisting" que puede causar bugs
// difíciles de encontrar. const y let son siempre la respuesta correcta.
6.2 Tipos de datos básicos
JavaScript maneja varios tipos de valores. Cada tipo tiene un comportamiento diferente y es importante saber cuál se usa en cada situación:
// STRING (texto) — se escribe entre comillas simples, dobles, o backticks:
const nombre  = 'Juan García';
const correo  = "juan@anahuac.mx";
const mensaje = `Hola ${nombre}`;    // backtick permite insertar variables

// NUMBER (número) — sin comillas:
const semestre = 3;
const monto = 250.50;

// BOOLEAN (verdadero/falso) — solo dos valores posibles:
const activo  = true;
const pagado  = false;

// NULL — ausencia intencional de valor:
const foto = null;   // el alumno no tiene foto todavía

// UNDEFINED — variable declarada pero sin valor asignado:
let resultado;
console.log(resultado);  // undefined

// ARRAY (lista ordenada) — se escribe entre corchetes:
const semestres = ['1°', '2°', '3°', '4°', '5°', '6°', '7°', '8°', '9°'];

// OBJECT (objeto, agrupación de datos) — se escribe entre llaves:
const alumno = { id: "AL-001", nombre: "Juan", semestre: "3°" };
6.3 Funciones
Una función es un bloque de código que puedes reutilizar cuantas veces quieras simplemente llamándola por su nombre. Es como una receta: la escribes una vez y la usas todas las veces que necesites.
// Forma 1: función declarada — existe en todo el archivo (incluso antes de la línea donde la declares)
function saludar(nombre) {
  return "Hola, " + nombre + "!";
}
console.log(saludar("Juan"));  // → "Hola, Juan!"

// Forma 2: función asignada a una variable (const) — solo existe de esa línea en adelante
const saludar2 = function(nombre) {
  return `Hola, ${nombre}!`;
};

// Forma 3: arrow function (función flecha) — la más usada en el sistema.
// Es más corta y tiene un comportamiento especial con "this" (no relevante aquí).
const saludar3 = (nombre) => `Hola, ${nombre}!`;

// Si la arrow function solo tiene un parámetro, los paréntesis son opcionales:
const doble = n => n * 2;
console.log(doble(5));  // → 10

// Si no devuelve nada (solo hace algo), no necesita return:
const mostrarToast = (mensaje) => {
  const toast = document.getElementById("toast");
  toast.textContent = mensaje;
  toast.style.display = "block";
};
6.4 Condicionales: if, else, operador ternario
Los condicionales permiten que el código tome decisiones: si pasa X, hace A; si no, hace B. Son como las instrucciones de un guardia de seguridad: "Si el visitante tiene identificación, déjalo pasar; si no, pídele que espere."
// if/else básico:
if (nombre === "") {
  alert("El nombre es obligatorio");
  return;   // detiene la función aquí, no sigue ejecutando
} else {
  guardarAlumno();
}

// if con múltiples condiciones:
if (rol === "coordinador") {
  mostrarTodoLosMódulos();
} else if (rol === "maestro") {
  mostrarMódulosDeDocente();
} else {
  mostrarMódulosDeAlumno();
}

// Operador ternario: condición ? si_true : si_false
// Útil para valores simples en una sola línea:
const estado = paciente.alumno ? "Asignado" : "En espera";
// Es exactamente igual a:
// if (paciente.alumno) { estado = "Asignado" } else { estado = "En espera" }

// En generación de HTML (muy usado en renderLista):
const html = `
  <div class="avatar">
    ${alumno.foto
      ? '<img src="' + alumno.foto + '">' 
      : alumno.nombre.charAt(0).toUpperCase()  // primera letra del nombre
    }
  </div>
`;
6.5 Métodos de Array — las herramientas de datos más usadas
Los arrays (listas) de JavaScript tienen métodos muy potentes que permiten filtrar, transformar y buscar datos sin necesidad de escribir bucles complicados. Estos son los que aparecen en todo el sistema:
.filter() — filtrar registros
// .filter() devuelve un NUEVO array con solo los elementos que cumplen la condición.
// El original no se modifica.

// Caso real: búsqueda de alumnos en la barra de búsqueda
const termino = "garcia";
const resultados = S.data.alumnos.filter(alumno =>
  alumno.nombre.toLowerCase().includes(termino.toLowerCase())
  // .toLowerCase() convierte a minúsculas para que la búsqueda no distinga mayúsculas
  // "García" y "garcia" ambos se convierten a "garcía" y coinciden
);

// Caso real: obtener solo los préstamos que no han sido devueltos
const activos = S.data.prestamos.filter(p => !p.devuelto);
// !p.devuelto significa "si devuelto es false" (! invierte el valor)
.find() — encontrar un registro por ID
// .find() devuelve el PRIMER elemento que cumple la condición, o undefined si no hay.
// Se usa constantemente para recuperar un registro a partir de su ID.

// Caso real: el usuario hace clic en una fila y quiero ver sus datos
function verAlumno(id) {
  // Buscar el alumno cuyo id coincide con el que se pasó:
  const alumno = S.data.alumnos.find(a => a.id === id);

  if (!alumno) return;  // si no existe (raro), no hacer nada

  // Mostrar sus datos en el modal:
  document.getElementById("modal-nombre").textContent = alumno.nombre;
  document.getElementById("modal-semestre").textContent = alumno.semestre;
}
.map() — transformar datos en HTML
// .map() devuelve un NUEVO array transformando cada elemento.
// Su uso más común en el sistema es convertir datos en HTML.

// Caso real: convertir la lista de alumnos en filas HTML
function renderLista() {
  const filas = S.data.alumnos.map(a => `
    <div class="list-row" onclick="verAlumno('${a.id}')">
      <div class="avatar">${a.nombre.charAt(0)}</div>
      <div class="row-info">
        <div class="row-title">${a.nombre}</div>
        <div class="row-sub">${a.idInstitucional}</div>
      </div>
      <span class="sem-badge">${a.semestre}</span>
    </div>
  `);

  // .join("") une todos los strings del array en uno solo, sin separador
  document.getElementById("lista-alumnos").innerHTML = filas.join("");
}
.sort() — ordenar registros
// .sort() ordena el array. CUIDADO: modifica el array original.
// Para ordenar texto con acentos correctamente se usa localeCompare:

// Ordena alumnos alfabéticamente (funciona con ñ, á, é, etc.):
S.data.alumnos.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

// Ordena por fecha (más reciente primero):
S.data.visitas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
// Restar dos fechas da la diferencia en milisegundos. Si b > a, el resultado
// es positivo y b queda antes que a (orden descendente).
.reduce() — calcular totales
// .reduce() recorre el array acumulando un valor. Útil para sumas y conteos.

// Caso real: calcular el total de pagos pendientes
const totalPendiente = S.data.visitas
  .filter(v => !v.pagado)           // primero filtra los no pagados
  .reduce((suma, visita) => {
    return suma + (visita.monto || 0);  // acumula el monto (0 si es null)
  }, 0);  // el 0 es el valor inicial de "suma"

// Paso a paso para [100, 250, 75]:
// Iteración 1: suma=0,   visita.monto=100  → devuelve 100
// Iteración 2: suma=100, visita.monto=250  → devuelve 350
// Iteración 3: suma=350, visita.monto=75   → devuelve 425
// Resultado final: 425
6.6 Manipulación del DOM
DOM significa Document Object Model. Es la representación interna que tiene el navegador del HTML de la página. JavaScript puede leer y modificar el DOM para cambiar lo que el usuario ve en pantalla sin recargar la página.
Imagina el DOM como un árbol familiar: el <html> es el abuelo, dentro tiene <head> y <body> que son los hijos, y dentro de <body> están todos los nietos (<div>, <button>, <input>...). JavaScript puede encontrar cualquier elemento en ese árbol, leer su contenido, cambiar su texto, sus colores, o agregar y quitar clases CSS.
// ─── OBTENER ELEMENTOS ───

// Por ID (el más común, devuelve un elemento):
const lista = document.getElementById("lista-alumnos");

// Por clase (devuelve una colección de todos los que tienen esa clase):
const filas = document.querySelectorAll(".list-row");

// El primero que coincida con el selector CSS:
const panel = document.querySelector(".panel");


// ─── LEER VALORES ───

// Leer el texto que el usuario escribió en un input:
const nombre = document.getElementById("f-nombre").value;

// Leer la opción elegida en un select:
const semestre = document.getElementById("f-semestre").value;


// ─── MODIFICAR EL CONTENIDO ───

// Cambiar el texto visible de un elemento:
document.getElementById("contador").textContent = "42 alumnos";

// Insertar HTML complejo (con etiquetas):
document.getElementById("lista-alumnos").innerHTML = `
  <div class="list-row">Juan García</div>
  <div class="list-row">María López</div>
`;


// ─── CAMBIAR ESTILOS ───

// Mostrar u ocultar un elemento:
documento.getElementById("panel").style.display = "block";  // mostrar
documento.getElementById("panel").style.display = "none";   // ocultar

// Agregar/quitar/alternar clases CSS (la forma más elegante):
panel.classList.add("open");     // agrega la clase → el panel se abre
panel.classList.remove("open");  // quita la clase → el panel se cierra
panel.classList.toggle("open");  // si tiene la clase la quita, si no la tiene la agrega
panel.classList.contains("open"); // devuelve true si tiene la clase
6.7 Eventos — responder a las acciones del usuario
Un evento es algo que ocurre en la página: el usuario hace clic en un botón, escribe en un campo, mueve el ratón, presiona una tecla, la página termina de cargar. Con addEventListener le dices al navegador: "cuando ocurra X, ejecuta Y".
// Sintaxis básica:
// elemento.addEventListener("tipo_de_evento", función_a_ejecutar);

// CLIC en un botón:
document.getElementById("btn-nuevo").addEventListener("click", () => {
  openPanel();  // abrir el formulario lateral
});

// ESCRITURA en un campo de búsqueda (se dispara en cada tecla):
document.getElementById("buscar").addEventListener("input", e => {
  // e es el objeto del evento. e.target es el elemento que disparó el evento.
  const termino = e.target.value;  // texto actual del input
  renderLista(termino);             // filtrar y redibujar la lista
});

// TECLA ENTER en un campo:
document.getElementById("inp-id").addEventListener("keydown", e => {
  if (e.key === "Enter") {  // solo si la tecla presionada fue Enter
    registrarAsistencia(e.target.value);
  }
});

// CAMBIO en un selector (select):
document.getElementById("filtro-semestre").addEventListener("change", e => {
  renderLista(null, e.target.value);  // filtrar por semestre
});

// CARGA de la página (cuando todo el HTML está listo):
window.addEventListener("DOMContentLoaded", () => {
  renderAll();  // dibujar la interfaz con los datos guardados
});

// O de forma equivalente, pero más corta:
window.onload = () => {
  renderAll();
};

// ANTES de imprimir (se usa en receta-medica.html):
window.addEventListener('beforeprint', () => {
  // preparar el documento para imprimir (agregar la copia)
});

// DESPUÉS de imprimir:
window.addEventListener('afterprint', () => {
  // limpiar los elementos temporales agregados para la impresión
});
6.8 Template literals — generar HTML dinámico
Una de las tareas más frecuentes en el sistema es generar HTML con datos dinámicos. Por ejemplo, para dibujar la fila de un alumno en la lista, el HTML necesita incluir el nombre real, el semestre real, el ID real. Los template literals (cadenas con backticks ` ) hacen esto muy legible:
// Sin template literals (concatenación clásica — difícil de leer y mantener):
var html = '<div class="list-row" onclick="verAlumno(\'' + a.id + '\')">' +
           '  <div class="row-title">' + a.nombre + '</div>' +
           '  <span class="sem-badge">' + a.semestre + '</span>' +
           '</div>';

// Con template literals (mucho más limpio y legible):
const html = `
  <div class="list-row" onclick="verAlumno('${a.id}')">
    <div class="row-title">${a.nombre}</div>
    <span class="sem-badge">${a.semestre}</span>
  </div>
`;

// Las expresiones dentro de ${} pueden ser cualquier código JavaScript:
const html2 = `
  <span class="badge ${a.activo ? "badge-asignado" : "badge-espera"}">
    ${a.activo ? "Asignado" : "En espera"}
  </span>
`;
6.9 async/await — esperar operaciones lentas
Algunas operaciones no son instantáneas: hacer una petición a internet, leer un archivo, esperar a que el usuario inicie sesión. JavaScript resuelve esto con "promesas" (Promises) y la sintaxis async/await.
Imagina que vas a un restaurante. El mesero anota tu pedido y se va a la cocina. Tú no te quedas parado esperando (eso "bloquearía" tu tiempo). Sigues sentado, charlando, y cuando el plato está listo, el mesero lo trae. async/await funciona igual: el navegador no se congela esperando; sigue respondiendo a clics y puede hacer otras cosas, y cuando el resultado llega, el código continúa desde donde se quedó.
// Una función async siempre devuelve una Promise.
// await solo puede usarse DENTRO de una función async.

// Ejemplo real de auth.js — esperar el login de Microsoft:
async function getOrLoginAccount() {

  // await pausa esta función hasta que initialize() termine:
  await msalInstance.initialize();

  // Revisar si ya hay una sesión guardada:
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    return accounts[0];  // ya hay sesión → devolvemos sin hacer nada más
  }

  // No hay sesión → abrir popup de login de Microsoft.
  // await pausa aquí hasta que el usuario inicia sesión (puede tardar 10 segundos):
  const result = await msalInstance.loginPopup({
    scopes: ["openid", "profile", "email"]
  });

  return result.account;
}

// Para llamarla, también se necesita await:
async function iniciarSistema() {
  try {
    const cuenta = await getOrLoginAccount();
    mostrarNombreUsuario(cuenta.name);
  } catch (error) {
    console.error("Error de login:", error);
    alert("No se pudo iniciar sesión. Intenta de nuevo.");
  }
}
6.10 Canvas API — dibujar y capturar firmas
El elemento <canvas> de HTML es como una hoja de papel en blanco dentro de la página web. JavaScript puede dibujar sobre él: líneas, formas, texto, imágenes. En el sistema se usa para capturar la firma digital del paciente o del médico: el usuario dibuja su firma con el ratón (o el dedo en tablet) y esa firma se guarda como imagen.
// 1. Obtener el canvas y su "contexto de dibujo" (el lápiz):
const canvas = document.getElementById("firma-canvas");
const ctx = canvas.getContext("2d");  // "2d" para dibujos en dos dimensiones

// 2. Configurar el lápiz:
ctx.strokeStyle = "#1F1F1D";  // color del trazo: casi negro
ctx.lineWidth   = 2;          // grosor del trazo: 2 píxeles
ctx.lineCap     = "round";    // extremos de línea redondeados (más natural)

// 3. Registrar los movimientos del ratón para dibujar:
let dibujando = false;

canvas.addEventListener("mousedown", e => {
  dibujando = true;          // el usuario presionó el botón del ratón
  ctx.beginPath();           // empezar un nuevo trazo
  ctx.moveTo(e.offsetX, e.offsetY);  // mover el lápiz a la posición del clic
});

canvas.addEventListener("mousemove", e => {
  if (!dibujando) return;    // si no está presionado el botón, no dibujar
  ctx.lineTo(e.offsetX, e.offsetY);  // línea hasta la posición actual del ratón
  ctx.stroke();              // dibujar la línea
});

canvas.addEventListener("mouseup", () => {
  dibujando = false;         // el usuario soltó el botón del ratón
});

// 4. Al guardar, convertir el dibujo a imagen PNG en formato base64:
const firmaDataUrl = canvas.toDataURL("image/png");
// Resultado: "data:image/png;base64,iVBORw0KGgoAAAANS..."
// Este texto largo representa la imagen y se guarda en localStorage junto con el expediente.
El sistema también soporta pantallas táctiles (tablet, celular) registrando eventos touch (touchstart, touchmove, touchend) además de los eventos de ratón.
6.11 FileReader — cargar fotos del usuario
Cuando el usuario elige una foto desde su computadora para el perfil de un alumno o paciente, el navegador no puede simplemente guardar la ruta del archivo (por ejemplo "C:/Fotos/Juan.jpg") porque esa ruta solo existe en esa computadora. La solución es convertir la imagen completa a texto base64 usando FileReader, y guardar ese texto en localStorage.
// 1. El usuario hace clic en el área de foto y elige un archivo:
<input type="file" id="inp-foto" accept="image/*" style="display:none">
<label for="inp-foto" class="foto-label">
  <!-- Al hacer clic aquí, se abre el explorador de archivos -->
</label>

// 2. Cuando el usuario elige el archivo, se dispara el evento "change":
document.getElementById("inp-foto").addEventListener("change", e => {
  const archivo = e.target.files[0];  // el archivo elegido
  if (!archivo) return;               // si canceló, no hacer nada

  // 3. Crear un FileReader (lector de archivos):
  const reader = new FileReader();

  // 4. Definir qué hacer cuando la lectura termine:
  reader.onload = () => {
    // reader.result contiene la imagen como texto base64:
    fotoDataUrl = reader.result;

    // Mostrar la foto en el formulario inmediatamente:
    const img = document.querySelector(".foto-label img");
    if (img) img.src = fotoDataUrl;
  };

  // 5. Iniciar la lectura en formato base64:
  reader.readAsDataURL(archivo);
});

// El resultado en reader.result se ve así (muy largo):
// "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCE..."
// Este texto, aunque largo, es solo texto y localStorage puede guardarlo.
6.12 Impresión en duplicado: cloneNode y beforeprint
Dos módulos necesitan imprimir documentos con dos copias en la misma hoja: una para el paciente y otra para el archivo de la clínica, separadas por una línea de tijeras. La técnica para lograr esto es diferente en cada módulo.
En justificantes.html — abrir ventana nueva
// Se abre una ventana emergente con SOLO el contenido del documento.
// La ventana no tiene toolbar ni barra de búsqueda, solo el documento.

window.onload = () => {
  const paginaOriginal = document.querySelector(".page");

  // 1. Crear la línea divisoria de tijeras:
  const separador = document.createElement("div");
  separador.className = "sep";
  separador.innerHTML = "✂ &nbsp; Copia para archivo — recortar y conservar &nbsp; ✂";

  // 2. cloneNode(true) hace una copia perfecta del elemento y TODOS sus hijos.
  //    true = clonar también los elementos hijos (false = solo el elemento padre)
  const copia = paginaOriginal.cloneNode(true);

  // 3. Agregar línea de firma a la copia:
  const firma = document.createElement("div");
  firma.innerHTML = `
    <div style="border-top:1px solid #333; margin-top:52px; padding-top:6px;">
      <p style="font-weight:700">Firma de recibido del paciente</p>
      <p style="margin-top:40px; border-top:1px solid #555">Nombre y firma</p>
    </div>
  `;
  copia.appendChild(firma);

  // 4. Agregar todo al documento e imprimir:
  document.body.appendChild(separador);
  document.body.appendChild(copia);
  window.print();  // abre el diálogo de impresión
};
En receta-medica.html — beforeprint y afterprint
// En este módulo el formulario y el documento están en la MISMA página.
// No se puede abrir ventana nueva, así que se usa beforeprint/afterprint.

let elementosTemporal = [];  // guardar referencia a los elementos temporales

window.addEventListener('beforeprint', () => {
  // Este evento se dispara justo ANTES de que el navegador abra el diálogo de impresión.

  // PROBLEMA: los <canvas> no se pueden clonar — la copia saldría en blanco.
  // SOLUCIÓN: convertir el canvas a imagen PNG primero.
  const canvas = document.getElementById("firma-canvas");
  const firmaPNG = canvas.toDataURL("image/png");  // imagen como texto base64

  // Clonar el cuerpo del documento:
  const copia = document.querySelector(".documento").cloneNode(true);

  // En el clon, reemplazar el canvas por la imagen PNG:
  const canvasEnClon = copia.querySelector("#firma-canvas");
  const img = document.createElement("img");
  img.src = firmaPNG;
  img.style.width = canvas.width + "px";
  img.style.height = canvas.height + "px";
  canvasEnClon.replaceWith(img);

  // Agregar separador y copia al documento:
  const separador = document.createElement("div");
  separador.className = "sep";
  separador.textContent = "✂  Copia para archivo  ✂";

  document.body.appendChild(separador);
  document.body.appendChild(copia);
  elementosTemporal = [separador, copia];  // guardar referencia para limpiar después
});

window.addEventListener('afterprint', () => {
  // Este evento se dispara justo DESPUÉS de que el usuario cierra el diálogo.
  // Limpiar los elementos temporales para que el formulario vuelva a la normalidad:
  elementosTemporal.forEach(el => el.remove());
  elementosTemporal = [];
});
6.13 Set — colección sin duplicados para selección múltiple
// Un Set es como un array, pero no permite valores repetidos.
// Se usa en el modo de selección múltiple (borrar varios registros a la vez).

// Crear un Set vacío:
S.sel = new Set();

// Agregar un ID cuando el usuario marca el checkbox:
S.sel.add("AL-M3K2AB");
S.sel.add("AL-N7X4CD");
S.sel.add("AL-M3K2AB");  // ya existe, NO se agrega de nuevo (sin duplicados)

// Ver cuántos hay seleccionados:
console.log(S.sel.size);  // → 2  (aunque se agregó "AL-M3K2AB" dos veces)

// Quitar un ID cuando el usuario desmarca el checkbox:
S.sel.delete("AL-M3K2AB");

// Saber si un ID está seleccionado (para marcar el checkbox correctamente):
const estaSeleccionado = S.sel.has("AL-N7X4CD");  // → true

// Al hacer clic en una fila en modo selección:
function toggleSeleccion(id) {
  if (S.sel.has(id)) {
    S.sel.delete(id);  // si ya estaba seleccionado, deseleccionar
  } else {
    S.sel.add(id);     // si no estaba, seleccionar
  }
  actualizarBarraDeSeleccion();
}

// Convertir el Set a array para filtrarlo y borrar los registros:
function eliminarSeleccionados() {
  const idsAEliminar = Array.from(S.sel);  // Set → Array
  S.data.alumnos = S.data.alumnos.filter(a => !idsAEliminar.includes(a.id));
  S.sel.clear();  // vaciar la selección
  saveData();
  renderAll();
}
6.14 setTimeout y clearTimeout — acciones con retardo
// setTimeout ejecuta una función después de un tiempo (en milisegundos).
// Se usa principalmente para el toast (notificación temporal).

function mostrarToast(mensaje) {
  const toast = document.getElementById("toast");
  toast.textContent = mensaje;
  toast.style.display = "block";  // mostrar el toast

  // clearTimeout cancela cualquier timer pendiente anterior.
  // Esto evita que el toast desaparezca prematuramente si se activa dos veces seguidas.
  clearTimeout(toast._timer);

  // Programar que desaparezca 2.5 segundos después:
  toast._timer = setTimeout(() => {
    toast.style.display = "none";  // ocultar el toast
  }, 2500);
  // 2500 milisegundos = 2.5 segundos
}

// Uso:
mostrarToast("Alumno guardado correctamente.");
 7. index.html — La pantalla de inicio
La pantalla de inicio es la más sencilla de todas: no guarda ni lee datos propios, solo muestra 12 tarjetas con accesos a cada módulo y la fecha actual del sistema. Tiene apenas 5 líneas de JavaScript.
Cada tarjeta es un enlace <a href="..."> que abre el módulo correspondiente. El color del ícono de cada tarjeta se controla con una clase CSS como color-coral, color-teal, color-amber, etc., que colorea solo el ícono sin afectar la tarjeta completa.
7.1 Las únicas 5 líneas de JavaScript
const meses = ['enero','febrero','marzo','abril','mayo','junio',
               'julio','agosto','septiembre','octubre','noviembre','diciembre'];

const hoy = new Date();  // objeto con la fecha y hora actuales

// Construir el texto de la fecha: "21 de julio de 2026"
document.getElementById("fecha-hoy").textContent =
  `${hoy.getDate()} de ${meses[hoy.getMonth()]} de ${hoy.getFullYear()}`;
// hoy.getDate()    → el día del mes (21)
// hoy.getMonth()   → el mes como número de 0 a 11 (6 = julio, porque empieza en 0)
// meses[6]         → "julio"  (accede al array por índice)
// hoy.getFullYear()→ el año completo (2026)
El índice del mes empieza en 0 (enero = 0, diciembre = 11) en JavaScript. Por eso se usa un array manual de nombres en español en lugar del nombre automático del mes, que además estaría en inglés.
 8. control-clinica-dental.html — Expedientes Clínicos
Es el módulo más importante y más complejo de la aplicación. Guarda el historial clínico completo de cada paciente: sus datos personales, antecedentes médicos, fotografía, firma digital y el alumno que lo atiende.
8.1 Qué datos guarda cada expediente
Campo	Tipo	Descripción detallada
id	String	Identificador único (EX-XXXXXX). Se genera automáticamente con uid().
nombre	String	Nombre completo del paciente tal como aparece en su identificación.
fecha_nacimiento	String	Fecha en formato AAAA-MM-DD. Se usa para calcular la edad automáticamente.
tipo_sangre	String	Tipo de sangre: A+, A-, B+, B-, AB+, AB-, O+, O-.
alergias	String	Texto libre con alergias conocidas del paciente.
antecedentes	String	Historial médico relevante: enfermedades previas, cirugías, medicamentos.
telefono	String	Número de teléfono de contacto.
correo	String	Correo electrónico del paciente.
foto	String	Imagen del paciente guardada como texto base64 (puede ser null si no hay foto).
firma	String	Firma digital del paciente guardada como PNG base64 (puede ser null).
alumno_asignado	String	Nombre del alumno que atiende al paciente.
especialidad	String	Clínica o especialidad del tratamiento.
fechaRegistro	String	Fecha y hora en que se creó el expediente.
8.2 Cómo se calcula la edad automáticamente
function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return "—";  // si no hay fecha, mostrar guion

  const hoy    = new Date();
  const nacido = new Date(fechaNacimiento);

  // Diferencia simple en años:
  let edad = hoy.getFullYear() - nacido.getFullYear();

  // Corrección: si todavía no ha llegado el cumpleaños este año,
  // restar 1 año porque todavía no ha cumplido esa edad.
  const yaCumplió =
    hoy.getMonth() > nacido.getMonth() ||
    (hoy.getMonth() === nacido.getMonth() && hoy.getDate() >= nacido.getDate());

  if (!yaCumplió) edad--;

  return edad + " años";
}

// Ejemplos:
// calcularEdad("2000-03-15") en julio 2026 → "26 años" (ya cumplió en marzo)
// calcularEdad("2000-09-20") en julio 2026 → "25 años" (aún no cumple en septiembre)
8.3 Firma digital — cómo se captura y guarda
La firma se captura en un <canvas> de 400x160 píxeles. El usuario dibuja con el ratón (o el dedo en pantallas táctiles). Para soportar pantallas táctiles, el módulo registra TANTO eventos de ratón COMO eventos touch:
// EVENTOS DE RATÓN (computadora):
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup",   endDraw);
canvas.addEventListener("mouseleave",endDraw);  // si el ratón sale del canvas

// EVENTOS TÁCTILES (tablet, celular):
canvas.addEventListener("touchstart", e => {
  e.preventDefault();  // evita que la página haga scroll mientras se firma
  const touch = e.touches[0];  // el primer dedo
  const rect  = canvas.getBoundingClientRect();
  // getBoundingClientRect da la posición del canvas en la pantalla
  startDraw({ offsetX: touch.clientX - rect.left,
              offsetY: touch.clientY - rect.top });
});

function startDraw(e) {
  dibujando = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
}

function draw(e) {
  if (!dibujando) return;
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
}

function endDraw() { dibujando = false; }

// Limpiar la firma (botón "Borrar firma"):
function limpiarFirma() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // clearRect(x, y, ancho, alto) borra un rectángulo del canvas
  // Aquí borra todo el canvas desde (0,0) hasta su tamaño completo
}

// Al guardar el expediente, la firma se convierte a imagen:
const firma = canvas.toDataURL("image/png");
// Si el canvas está vacío (sin firma), toDataURL igualmente devuelve una imagen
// en blanco, así que hay que verificar si el usuario realmente firmó.
 9. banco-pacientes.html — Lista de Espera
Este módulo gestiona la lista de pacientes que necesitan atención: quiénes están esperando ser asignados a un alumno, quiénes ya tienen alumno asignado, y de qué especialidad necesitan atención.
9.1 Estado dinámico del paciente
Un paciente puede estar en dos estados: "En espera" (aún no tiene alumno asignado) o "Asignado" (ya tiene un alumno que lo atenderá). El estado NO se guarda como un campo: se calcula dinámicamente en el momento de mostrar la lista:
// Al renderizar cada paciente, se calcula su estado en ese momento:
const estado = paciente.alumno ? "Asignado" : "En espera";

// El color del badge depende del estado:
const claseEstado = paciente.alumno ? "badge-asignado" : "badge-espera";

// En el HTML generado:
const html = `
  <span class="badge ${claseEstado}">${estado}</span>
`;

// Ventaja de calcular dinámicamente: si se asigna o desasigna un alumno,
// no hay que actualizar un campo "estado" por separado.
// Al llamar renderAll() después de guardar, el badge se actualiza solo.
9.2 Autocomplete de especialidades
Cuando el coordinador escribe en el campo "Especialidad", aparece una lista de sugerencias que se filtra mientras escribe. Las especialidades vienen del Catálogo de Materias si está configurado, o de una lista fija de 23 especialidades agrupadas por categoría:
function getEspecialidades() {
  // Primero intentar leer del catálogo de materias:
  const dataMaterias = localStorage.getItem('clinica_materias_v1');
  if (dataMaterias) {
    const materias = JSON.parse(dataMaterias).materias
      .filter(m => m.activa !== false);  // excluir las desactivadas
    if (materias.length > 0) return materias.map(m => m.nombre);
  }

  // Si no hay materias configuradas, usar la lista fija:
  return [
    'Clínica Integral I', 'Clínica Integral II', 'Clínica Integral III',
    'Endodoncia I', 'Endodoncia II', 'Periodoncia',
    'Ortodoncia', 'Prostodoncia', 'Cirugía Oral',
    'Imagenología', 'Patología Oral', 'Pediatría Dental',
    // ... 23 en total
  ];
}

// El autocomplete filtra mientras el usuario escribe:
campoespecialidad.addEventListener('input', e => {
  const termino = e.target.value.toLowerCase();
  const sugerencias = getEspecialidades()
    .filter(esp => esp.toLowerCase().includes(termino));
  mostrarSugerencias(sugerencias);
});
 10. alumnos.html — Base de Datos de Alumnos
Directorio completo de todos los alumnos de la clínica. Permite buscar por nombre o ID institucional, filtrar por semestre, y gestionar selección múltiple para borrar varios alumnos a la vez.
10.1 Modo selección múltiple
Cuando el coordinador quiere borrar varios alumnos a la vez (por ejemplo, una generación completa que egresó), activar el modo de selección múltiple es mucho más eficiente que borrarlos uno por uno:
// Estado inicial: selección desactivada
S.selMode = false;
S.sel = new Set();

// Al presionar el botón "Seleccionar":
document.getElementById('btn-sel').addEventListener('click', () => {
  S.selMode = !S.selMode;  // alternar el modo (activar/desactivar)
  S.sel.clear();           // vaciar la selección

  // Mostrar/ocultar la barra de acciones de selección:
  document.getElementById('sel-bar').classList.toggle('open', S.selMode);

  renderLista();  // redibujar con/sin checkboxes
});

// En renderLista, cuando selMode está activo, cada fila incluye un checkbox:
const checkboxHtml = S.selMode ? `
  <input type="checkbox"
         class="row-check"
         ${S.sel.has(a.id) ? "checked" : ""}
         onclick="event.stopPropagation(); toggleSel(event, '${a.id}')"
  >
` : "";
// event.stopPropagation() evita que el clic en el checkbox también abra los detalles

// Seleccionar/deseleccionar un alumno:
function toggleSel(e, id) {
  if (S.sel.has(id)) S.sel.delete(id);
  else S.sel.add(id);

  // Actualizar el contador "X seleccionados":
  document.getElementById('sel-count').textContent =
    `${S.sel.size} seleccionado${S.sel.size !== 1 ? "s" : ""}`;

  // Activar/desactivar el botón eliminar:
  document.getElementById('btn-del-sel').disabled = S.sel.size === 0;

  renderLista();
}
 11. pagos-visitas.html — Pagos y Visitas
Registra cada cita o visita de un paciente a la clínica, el procedimiento realizado, cuánto se cobró y si ya se pagó. Permite llevar un control de deudas pendientes y calcular cuánto ha generado la clínica en un periodo.
11.1 Cálculo de totales y pendientes
function calcularResumen() {
  const visitas = S.data.visitas;

  // Total de visitas registradas:
  const totalVisitas = visitas.length;

  // Suma de todos los pagos recibidos:
  const totalCobrado = visitas
    .filter(v => v.pagado)                      // solo las pagadas
    .reduce((suma, v) => suma + (v.monto || 0), 0);

  // Suma de los pagos pendientes:
  const totalPendiente = visitas
    .filter(v => !v.pagado)                     // solo las NO pagadas
    .reduce((suma, v) => suma + (v.monto || 0), 0);

  // Mostrar en las tarjetas de estadísticas:
  document.getElementById("stat-cobrado").textContent =
    "$" + totalCobrado.toLocaleString("es-MX");
  // toLocaleString("es-MX") formatea el número con comas: 1250 → "1,250"
}
 12. prestamos.html — Control de Préstamos
Controla la salida y devolución de equipos de la clínica. Tiene dos partes: el catálogo de equipos (qué equipos hay y cuántas unidades) y el registro de préstamos (quién tiene qué equipo y desde cuándo).
12.1 Verificar disponibilidad antes de prestar
Antes de registrar un nuevo préstamo, el sistema verifica que aún haya unidades disponibles del equipo solicitado. Si todas las unidades están prestadas, muestra un error y no permite el préstamo:
function verificarDisponibilidad(equipoId) {
  // Buscar el equipo en el catálogo:
  const equipo = S.data.equipos.find(e => e.id === equipoId);
  if (!equipo) return false;  // equipo no existe

  // Contar cuántas unidades están actualmente prestadas (no devueltas):
  const enPrestamo = S.data.prestamos.filter(p =>
    p.equipoId === equipoId &&  // del mismo equipo
    !p.devuelto                 // y que no han sido devueltos
  ).length;
  // .length al final de filter devuelve el número de resultados

  // Si todas las unidades están prestadas, devolver false:
  if (enPrestamo >= equipo.cantidad) {
    alert(`No hay unidades disponibles de "${equipo.nombre}".\n` +
          `Total: ${equipo.cantidad} | En préstamo: ${enPrestamo}`);
    return false;
  }

  return true;  // hay disponibilidad
}

// Uso al guardar un nuevo préstamo:
function guardarPrestamo() {
  const equipoId = document.getElementById("f-equipo").value;
  if (!verificarDisponibilidad(equipoId)) return;  // detener si no hay disponibilidad
  // ... continuar con el guardado normal
}
 13. estadisticas.html — Estadísticas Generales
Es el único módulo que lee datos de TODOS los demás módulos al mismo tiempo. En lugar de guardar datos propios, los consolida y presenta en gráficas y tablas resumen para que el coordinador pueda ver el panorama general de la clínica.
13.1 Cómo lee datos de todos los módulos
// Al cargar la página, se leen todos los módulos:
function cargarTodosLosDatos() {
  // Función auxiliar que lee y parsea con valor por defecto:
  function leer(clave, defecto) {
    try {
      const raw = localStorage.getItem(clave);
      return raw ? JSON.parse(raw) : defecto;
    } catch(e) { return defecto; }
  }

  const dataExpedientes = leer('clinica_dental_data_v1',    { expedientes: [] });
  const dataAlumnos     = leer('clinica_alumnos_v1',        { alumnos: [] });
  const dataMaestros    = leer('clinica_maestros_v1',        { maestros: [] });
  const dataPrestamos   = leer('clinica_prestamos_v1',      { equipos: [], prestamos: [] });
  const dataPacientes   = leer('clinica_banco_pacientes_v1',{ pacientes: [] });

  return {
    expedientes: dataExpedientes.expedientes,
    alumnos:     dataAlumnos.alumnos,
    maestros:    dataMaestros.maestros,
    equipos:     dataPrestamos.equipos,
    prestamos:   dataPrestamos.prestamos,
    pacientes:   dataPacientes.pacientes,
  };
}
13.2 Gráfica de barras horizontal — hecha solo con CSS
Las gráficas de "atención por mes" NO usan ninguna librería de gráficas (como Chart.js). Se construyen con HTML y CSS: cada barra es un <div> cuyo ancho se calcula como porcentaje del máximo valor del mes:
function renderGraficaMeses(expedientes) {
  // Agrupar expedientes por mes:
  const porMes = {};
  expedientes.forEach(exp => {
    const fecha = new Date(exp.fechaRegistro);
    const clave = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`;
    porMes[clave] = (porMes[clave] || 0) + 1;
  });

  // Encontrar el mes con más registros (para calcular el 100%):
  const maxValor = Math.max(...Object.values(porMes));

  // Generar HTML de las barras:
  const barras = Object.entries(porMes).map(([mes, cantidad]) => {
    const porcentaje = maxValor > 0 ? (cantidad / maxValor * 100).toFixed(1) : 0;
    return `
      <div class="bar-row">
        <span class="bar-label">${mes}</span>
        <div class="bar-track">
          <div class="bar-fill" style="width: ${porcentaje}%"></div>
        </div>
        <span class="bar-value">${cantidad}</span>
      </div>
    `;
  }).join("");

  document.getElementById("grafica-meses").innerHTML = barras;
}

/* El CSS de las barras: */
.bar-track {
  flex: 1;
  height: 20px;
  background: var(--surface-1);
  border-radius: 4px;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  background: var(--teal-600);
  border-radius: 4px;
  transition: width .4s ease;  /* animación suave al cargar */
}
 14. auth.js — Autenticación con Microsoft Azure
Este archivo configura el inicio de sesión con cuentas institucionales de Microsoft (como @anahuac.mx). Usa una librería llamada MSAL (Microsoft Authentication Library) que Microsoft proporciona gratuitamente. Cuando esté configurada, los usuarios podrán iniciar sesión con su cuenta universitaria en lugar de crear una cuenta nueva.
IMPORTANTE: Los valores de configuración (clientId, tenantId) actualmente tienen valores de ejemplo (XXXX-XXXX-...). Para activar el login real, hay que registrar la aplicación en el portal de Azure y reemplazar esos valores.
14.1 Configuración MSAL
// Estos dos IDs se obtienen del portal de Azure (portal.azure.com):
const AZURE_CLIENT_ID = 'XXXX-XXXX-XXXX-XXXX';  // ID de la aplicación registrada
const AZURE_TENANT_ID = 'XXXX-XXXX-XXXX-XXXX';  // ID del directorio de la universidad

const msalConfig = {
  auth: {
    clientId: AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${AZURE_TENANT_ID}`,
    // redirectUri: adónde redirige Microsoft después del login.
    // Se usa la URL actual de la página para que funcione tanto en localhost
    // como en GitHub Pages.
    redirectUri: window.location.origin + window.location.pathname,
  },
  cache: {
    cacheLocation: "localStorage",
    // Guardar la sesión en localStorage para que sobreviva al cerrar el navegador.
    // La alternativa es "sessionStorage" que se borra al cerrar la pestaña.
  }
};

const msalInstance = new msal.PublicClientApplication(msalConfig);
// PublicClientApplication es la clase principal de MSAL para aplicaciones
// que corren en el navegador (sin servidor).
14.2 Los tres roles del sistema
// El sistema tiene 3 roles con diferentes permisos:

// 1. coordinador — acceso total a todos los módulos
// 2. maestro     — acceso a módulos clínicos, no puede editar usuarios
// 3. alumno      — acceso limitado a sus propios pacientes

function getRol(email) {
  // Paso 1: Buscar en la lista de coordinadores (guardada en localStorage):
  const dataCoord = JSON.parse(localStorage.getItem('clinica_coordinadores_v1') || '{}');
  const coords = dataCoord.coordinadores || [];
  if (coords.some(c => c.correo.toLowerCase() === email.toLowerCase())) {
    return 'coordinador';
  }

  // Paso 2: Buscar en la lista de maestros:
  const dataMaestros = JSON.parse(localStorage.getItem('clinica_maestros_v1') || '{}');
  const maestros = dataMaestros.maestros || [];
  if (maestros.some(m => m.correo.toLowerCase() === email.toLowerCase())) {
    return 'maestro';
  }

  // Paso 3: Si no está en ninguna lista, es alumno:
  return 'alumno';
}
 15. Cómo se conectan todos los módulos entre sí
Aunque cada módulo es una página HTML independiente, comparten datos entre ellos a través de localStorage. Cuando el módulo A guarda algo en localStorage, el módulo B puede leerlo cuando se abre. Así es como fluye la información:
Módulo que escribe	Qué guarda	Módulo que lo lee	Para qué lo usa
Alumnos	Lista de nombres de alumnos	Banco de Pacientes	Autocompletar el campo "Alumno asignado"
Alumnos	Lista de nombres de alumnos	Expedientes	Autocompletar el alumno en el expediente
Maestros	Lista de correos de maestros	auth.js	Determinar quién tiene rol "maestro"
Catálogo de Materias	Lista de especialidades	Banco de Pacientes	Llenar el selector de especialidad
Catálogo de Materias	Lista de especialidades	Expedientes	Llenar el selector de clínica
Catálogo de Materias	Lista de especialidades	Justificantes	Llenar el selector de especialidad
Expedientes	Datos de pacientes	Consentimientos	Autocompletar nombre, edad y expediente
Expedientes	Datos de pacientes	Justificantes	Autocompletar datos del paciente
Todos los módulos	Sus propios datos	Estadísticas	Consolidar métricas generales de la clínica
Esta arquitectura tiene una ventaja: es simple y sin dependencias. Los módulos no se "llaman" entre sí directamente; simplemente leen del mismo cajón (localStorage). Si un módulo falla, los demás siguen funcionando.
La desventaja es que los datos no se sincronizan entre computadoras. Si el coordinador agrega un alumno en su computadora, esa información no aparece automáticamente en la tablet del maestro. Esta limitación se resuelve en la migración a Azure.
 16. Hosting en GitHub Pages — Cómo funciona la publicación
GitHub Pages es un servicio gratuito de GitHub que permite publicar páginas web estáticas (HTML, CSS, JavaScript sin servidor) directamente desde un repositorio. La aplicación está disponible en:
https://calw3.github.io/clinica-dental/
16.1 Qué es un repositorio Git
Git es un sistema de control de versiones: guarda cada cambio que se hace en los archivos, con fecha, hora y descripción. Es como un historial de versiones que permite volver atrás en el tiempo si algo sale mal. GitHub es el sitio web donde se almacenan esos repositorios en la nube.
El repositorio de la clínica está en github.com/Calw3/clinica-dental. Contiene todos los archivos HTML de la aplicación. GitHub Pages lee esos archivos y los publica como un sitio web accesible desde cualquier navegador.
16.2 Cómo actualizar el sitio cuando se cambia el código
Cuando se modifica algún archivo HTML (para agregar una función, corregir un error, cambiar un texto), hay que "subir" esos cambios al repositorio de GitHub. En 1-2 minutos, GitHub Pages actualiza el sitio automáticamente. Los pasos son:
# 1. Ir a la carpeta de los archivos (en la Terminal):
cd "/Users/carlos/Documents/HTML CONTROL CLINICA"

# 2. Marcar todos los archivos modificados para incluirlos en el envío:
git add .
# El punto (.) significa "todos los archivos en esta carpeta y subcarpetas"

# 3. Crear un "commit" (un punto de guardado con descripción):
git commit -m "Descripción del cambio que se hizo"
# La descripción debe ser clara para entender el cambio semanas después.
# Ejemplos buenos: "Agregar campo email a formulario de pacientes"
#                  "Corregir cálculo de edad en expedientes"
#                  "Actualizar lista de especialidades del catálogo"

# 4. Enviar los cambios a GitHub:
git push
# Los archivos viajan por internet al repositorio en GitHub.
# En 1-2 minutos el sitio web se actualiza automáticamente.
16.3 El archivo Sincronizar.command
Para no tener que abrir la Terminal y escribir esos 3 comandos cada vez, se creó el archivo Sincronizar.command en la carpeta del proyecto. Hacer doble clic en él desde el Finder ejecuta automáticamente los 3 comandos:
#!/bin/bash
# Los dos caracteres #! al inicio se llaman "shebang" y le dicen al sistema
# operativo qué programa debe ejecutar este script (en este caso bash, la terminal).

# Moverse a la carpeta del proyecto:
cd "/Users/carlos/Documents/HTML CONTROL CLINICA"

# Marcar todos los archivos modificados:
git add .

# Crear el commit con la fecha y hora actuales como descripción:
git commit -m "Actualización $(date '+%Y-%m-%d %H:%M')"
# $(date '+%Y-%m-%d %H:%M') ejecuta el comando date y pone su resultado en el mensaje.
# Ejemplo de resultado: "Actualización 2026-07-21 14:35"

# Enviar a GitHub:
git push

echo ""
echo "Sincronización completada. Cierra esta ventana."
16.4 Limitaciones del hosting actual
•	Los datos de localStorage solo existen en el navegador donde se usa la app. No se comparten entre computadoras.
•	Si alguien borra los datos del navegador (historial, cookies), los datos de la app desaparecen.
•	No hay autenticación real: cualquier persona que sepa la URL puede abrir la app.
•	No hay copia de seguridad automática: si se pierde el dispositivo, los datos se pierden.
 17. Plan de migración a Azure — Datos en la nube
Para que los datos sean accesibles desde cualquier computadora, se guarden de forma segura en la nube, y haya copias de seguridad automáticas, el sistema puede migrarse a Microsoft Azure. Esto requiere una cuenta personal de Azure (no la universitaria, que tiene restricciones) y un costo aproximado de $2-5 USD por mes.
17.1 Qué cambiaría con Azure
Característica	Hoy (localStorage)	Con Azure
Dónde se guardan los datos	En el navegador de la computadora	En servidores de Microsoft en la nube
Acceso desde otras computadoras	No (datos locales)	Sí (cualquier navegador, cualquier lugar)
Copia de seguridad	No automática	Automática, cada hora
Autenticación	No hay login	Login con cuenta @anahuac.mx
Roles y permisos	Sin restricciones	Coordinador, maestro, alumno con permisos diferentes
Capacidad de datos	~5 MB por módulo	Prácticamente ilimitada
Costo mensual	$0	~$2-5 USD/mes
17.2 Arquitectura propuesta
┌─────────────────────────────────┐
│  Navegador (Chrome, Safari...)  │
│  Los mismos archivos HTML/CSS   │
│  JavaScript cambia localStorage │
│  por llamadas fetch() a la API  │
└──────────────┬──────────────────┘
               │ peticiones HTTP (internet)
               ▼
┌─────────────────────────────────┐
│  Azure Functions (API REST)     │
│  Funciones JavaScript en la     │
│  nube que procesan las          │
│  peticiones: GET, POST, PUT,    │
│  DELETE de cada módulo          │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  Azure Cosmos DB                │
│  Base de datos NoSQL en la nube │
│  Guarda los datos en formato    │
│  JSON, igual que localStorage   │
└─────────────────────────────────┘
17.3 Fases del proyecto
Fase	Qué se hace	Duración estimada
Fase 1 — Base de datos	Crear Cosmos DB en Azure y diseñar las colecciones (una por módulo)	3-4 días
Fase 2 — API REST	Crear Azure Functions para cada módulo: GET (leer), POST (crear), PUT (editar), DELETE (borrar)	1 semana
Fase 3 — Migrar la app	Reemplazar localStorage.getItem/setItem por llamadas fetch() a la API de Azure	1 semana
Fase 4 — Autenticación	Activar auth.js con los IDs reales de Azure AD para login institucional	2-3 días
Fase 5 — Pruebas	Verificar que todo funciona con datos reales antes de sustituir el sistema anterior	3-5 días
17.4 Cómo cambia el código al migrar
El cambio más importante al migrar a Azure es reemplazar las operaciones de localStorage por llamadas fetch() a la API REST de Azure Functions. El resto de la lógica (validaciones, renderizado HTML, manejo del estado S) permanece exactamente igual:
// ─── HOY (con localStorage) ───
function loadData() {
  const raw = localStorage.getItem('clinica_alumnos_v1');
  return raw ? JSON.parse(raw) : { alumnos: [] };
}

function saveData() {
  localStorage.setItem('clinica_alumnos_v1', JSON.stringify(S.data));
}

// ─── CON AZURE (fetch a la API) ───
async function loadData() {
  // Petición GET a la Azure Function:
  const respuesta = await fetch("https://mi-api.azurewebsites.net/api/alumnos");
  const datos     = await respuesta.json();  // convertir respuesta a objeto JS
  return datos;
}

async function saveData(alumno) {
  // Petición POST para crear un nuevo alumno:
  await fetch("https://mi-api.azurewebsites.net/api/alumnos", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(alumno),  // enviar el alumno como JSON
  });
}
 18. Glosario de términos técnicos
Este glosario explica en lenguaje sencillo todos los términos técnicos que aparecen en este documento y en el código fuente de la aplicación.
Término	Explicación sencilla
localStorage	Un cajón de almacenamiento dentro del navegador donde la app guarda sus datos. Persiste aunque se cierre el navegador.
JSON	Formato de texto para representar datos estructurados. Es como escribir una ficha con reglas muy estrictas que la computadora puede leer.
base64	Método para convertir imágenes y archivos a texto puro. Permite guardar fotos en localStorage, que solo acepta texto.
DOM	La representación interna del HTML que JavaScript puede leer y modificar. Es como el árbol familiar de todos los elementos de la página.
canvas	Elemento HTML que actúa como una hoja de papel digital donde JavaScript puede dibujar. Se usa para las firmas digitales.
cloneNode(true)	Función que hace una copia exacta de un elemento HTML, incluyendo todos sus elementos hijos.
beforeprint / afterprint	Eventos del navegador que se disparan antes y después de abrir el diálogo de impresión.
fetch()	Función JavaScript para hacer peticiones HTTP a servidores en internet. Se usará en la migración a Azure.
async / await	Palabras clave para escribir código que espera respuestas lentas (como peticiones de internet) sin congelar la pantalla.
Promise	Un objeto que representa el resultado futuro de una operación asíncrona. async/await es azúcar sintáctico sobre Promises.
MSAL	Microsoft Authentication Library. Librería de Microsoft para implementar inicio de sesión con cuentas Azure AD.
Azure AD	Azure Active Directory. El servicio de Microsoft que gestiona las cuentas institucionales de la universidad (@anahuac.mx).
REST API	Interfaz de programación que permite comunicarse con un servidor usando peticiones HTTP estándar (GET, POST, PUT, DELETE).
Azure Functions	Pequeñas funciones de código que corren en los servidores de Microsoft bajo demanda, sin necesidad de un servidor permanente.
Cosmos DB	Base de datos de Microsoft Azure que guarda datos en formato JSON. Es la que se usará para guardar los datos en la nube.
GitHub Pages	Servicio gratuito de GitHub para publicar sitios web estáticos desde un repositorio Git.
Git	Sistema de control de versiones que guarda el historial de cambios de los archivos con fecha, hora y descripción.
commit	Un punto de guardado en Git con descripción del cambio. Es como un "Ctrl+S" pero con historial completo.
push	Enviar los commits del repositorio local al repositorio remoto en GitHub.
CSS Grid	Sistema de layout CSS para organizar elementos en filas y columnas. Se usa en el menú principal para las tarjetas de módulos.
Flexbox	Sistema de layout CSS para alinear elementos en una dirección (fila o columna). Se usa en casi todos los componentes.
media query	Regla CSS que aplica estilos diferentes según el tamaño de la pantalla. Permite el diseño responsivo.
responsive	Diseño que se adapta automáticamente a diferentes tamaños de pantalla: computadora, tablet, celular.
event listener	Función que "escucha" y responde a acciones del usuario (clic, teclado, scroll). Se registra con addEventListener.
template literal	Cadena de texto en JavaScript escrita con backticks (`) que permite insertar variables y expresiones con ${}.
Set	Colección de JavaScript que no permite valores duplicados. Se usa para la selección múltiple de registros.
CRUD	Create, Read, Update, Delete. Las cuatro operaciones básicas de cualquier sistema de gestión de datos.
shebang	Los caracteres #! al inicio de un script de terminal que indican qué programa lo ejecuta.
z-index	Propiedad CSS que controla qué elemento aparece encima de otro cuando se superponen.
transition	Propiedad CSS que crea animaciones suaves cuando cambia el valor de otra propiedad.
 — Fin del documento —
Clínica Dental Universitaria Anáhuac Xalapa · 2026
