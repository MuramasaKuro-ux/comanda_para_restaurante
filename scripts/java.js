let mesaSeleccionada = null; // Para recordar qué mesa está activa

function mostrarSeccion(id, botonClicado) {
  // Ocultar todas las secciones
  document.getElementById('seccion-a').classList.remove('activa');
  document.getElementById('seccion-b').classList.remove('activa');
  document.getElementById('seccion-c').classList.remove('activa');

  // Mostrar la sección seleccionada
  document.getElementById('seccion-' + id).classList.add('activa');

  // Quitar estado activo a todos los botones
  const botones = document.querySelectorAll('.boton');
  botones.forEach(b => b.classList.remove('activo'));
  botonClicado.classList.add('activo');

  // Si estamos en la sección de mesas, mostrar la comanda de la mesa seleccionada
  if (id === 'b' && mesaSeleccionada !== null) {
    mostrarComandaMesa(mesaSeleccionada);
  } else if (id === 'b') {
    document.querySelector('.header-comanda').textContent = "Selecciona una mesa";
  }
}

function seleccionarMesa(numeroMesa) {
  mesaSeleccionada = numeroMesa;
  mostrarComandaMesa(numeroMesa);
}

function mostrarComandaMesa(numeroMesa) {
  const comanda = document.querySelector('.header-comanda');
  comanda.textContent = "Mesa " + numeroMesa;

  // Aquí deberías rellenar la lista de platillos guardados para esa mesa
  actualizarListaComanda(numeroMesa);
}


function elegirMesa(numeroMesa) {
  localStorage.setItem("mesaSeleccionada", numeroMesa);

  const comanda = document.querySelector('.header-comanda');
  comanda.innerHTML = `
    <span>Mesa ${numeroMesa} </span>
    <img src="/imagenes/ordenar-comida.png" alt="Ir al menú" class="icono-menu" onclick="irAlMenu()" style="cursor:pointer; height:24px;">
  `;

  mostrarComandaMesa(numeroMesa);
}


function mostrarComandaMesa(mesa) {
  const headerComanda = document.querySelector(".header-comanda");

  // Encabezado con botón ir al menú
  headerComanda.innerHTML = `
    <span>Mesa ${mesa} </span>
    <img src="/imagenes/ordenar-comida.png" alt="Ir al menú" class="icono-menu" onclick="irAlMenu()" style="cursor:pointer; height:24px;">
  `;

  const comandaGuardada = JSON.parse(localStorage.getItem(`comandaMesa_${mesa}`)) || [];

  if (comandaGuardada.length > 0) {
    comandaGuardada.forEach(item => {
      const p = document.createElement("p");
      p.textContent = `${item.nombre} - $${item.precio}`;
      headerComanda.appendChild(p);
    });

    // Mostrar total
    const total = comandaGuardada.reduce((acc, item) => acc + item.precio, 0);
    const totalP = document.createElement("p");
    totalP.innerHTML = `<strong>Total: $${total}</strong>`;
    headerComanda.appendChild(totalP);

    // Botón limpiar comanda
    const btnLimpiar = document.createElement("button");
    btnLimpiar.textContent = "🗑 Limpiar comanda";
    btnLimpiar.onclick = () => limpiarComandaMesa(mesa);
    headerComanda.appendChild(btnLimpiar);
  } else {
    const p = document.createElement("p");
    p.textContent = "Comanda vacía";
    headerComanda.appendChild(p);
  }
}

function limpiarComandaMesa(mesa) {
  const confirmar = confirm(`¿Seguro que quieres limpiar la comanda de la mesa ${mesa}?`);
  if (confirmar) {
    localStorage.removeItem(`comandaMesa_${mesa}`);
    mostrarComandaMesa(mesa);
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const mesaActual = localStorage.getItem("mesaSeleccionada");
  if (mesaActual) {
    mostrarComandaMesa(mesaActual);
  }
});




function irAlMenu() {
  window.location.href = "menú.html";
}


const mesa = localStorage.getItem("mesaSeleccionada");
console.log("Mesa seleccionada:", mesa);




function abrirMenu() {
  const menu = document.getElementById("menuLateral");
  if (menu.style.right === "0px") {
    menu.style.right = "-350px";
  } else {
    menu.style.right = "0px";
  }
}

function cerrarSesion() {
  const confirmar = confirm("¿Estás seguro que quieres cerrar sesión?");
  if (confirmar) {
    localStorage.clear();
    window.location.href = "index.html";
  }
}

const comanda = [];

function agregarAComanda(nombre, precio) {
  comanda.push({ nombre, precio });
  alert(`${nombre} agregado a la comanda.`);
}

function abrirComanda() {
  const overlay = document.getElementById("overlay");
  const panel = document.getElementById("comanda-panel");
  const lista = document.getElementById("comanda-lista");
  const totalDiv = document.getElementById("comanda-total");

  lista.innerHTML = "";
  let total = 0;
  comanda.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "comanda-item";
    itemDiv.innerHTML = `
      <span>${item.nombre} - $${item.precio}</span>
      <button onclick="eliminarDeComanda(${index})">❌</button>
    `;
    lista.appendChild(itemDiv);
    total += item.precio;
  });
  totalDiv.textContent = `Total: $${total}`;

  overlay.style.display = "flex";
  setTimeout(() => panel.classList.add("abierta"), 10);
}

function cerrarComanda() {
  const overlay = document.getElementById("overlay");
  const panel = document.getElementById("comanda-panel");
  panel.classList.remove("abierta");
  setTimeout(() => overlay.style.display = "none", 300);
}

function eliminarDeComanda(index) {
  comanda.splice(index, 1);
  abrirComanda();
}

function confirmarComanda() {
  if (comanda.length === 0) {
    alert("La comanda está vacía.");
    return;
  }

  const mesaActual = localStorage.getItem("mesaSeleccionada");
  if (!mesaActual) {
    alert("No hay mesa seleccionada.");
    return;
  }

  // Unir lo que había con lo nuevo
  const comandaGuardada = JSON.parse(localStorage.getItem(`comandaMesa_${mesaActual}`)) || [];
  const nuevaComanda = [...comandaGuardada, ...comanda];
  localStorage.setItem(`comandaMesa_${mesaActual}`, JSON.stringify(nuevaComanda));

  alert(`Comanda de mesa ${mesaActual} actualizada.`);
  comanda.length = 0;
  cerrarComanda();
}


document.addEventListener("DOMContentLoaded", () => {
  // Suponiendo que tienes una variable mesaId definida en la página
  // Ejemplo: const mesaId = 3;  // Esto deberías obtenerlo dinámicamente
  const mesaId = localStorage.getItem("mesaSeleccionada") || 1; 

  const comandaGuardada = JSON.parse(localStorage.getItem(`comandaConfirmada_${mesaId}`)) || [];
  const headerComanda = document.querySelector(".header-comanda");

  if (comandaGuardada.length > 0) {
    headerComanda.innerHTML = "<h3>🧾 Comanda</h3>";
    comandaGuardada.forEach(item => {
      const p = document.createElement("p");
      p.textContent = `${item.nombre} - $${item.precio}`;
      headerComanda.appendChild(p);
    });

    // Mostrar total
    const total = comandaGuardada.reduce((acc, item) => acc + item.precio, 0);
    const totalP = document.createElement("p");
    totalP.innerHTML = `<strong>Total: $${total}</strong>`;
    headerComanda.appendChild(totalP);
  } else {
    headerComanda.textContent = "Comanda vacía";
  }
});




  function showSection(id) {
  const sections = document.querySelectorAll('.menu-section');
  sections.forEach(sec => sec.style.display = 'none');
  
  document.getElementById(id).style.display = 'flex';

  const botones = document.querySelectorAll('.menu-tabs button');
  botones.forEach(btn => btn.classList.remove('activo'));

  const botonActivo = Array.from(botones).find(btn => btn.textContent.toLowerCase() === id);
  if (botonActivo) botonActivo.classList.add('activo');
}

function buscarAlimentos() {
  const filtro = document.getElementById("buscador").value.toLowerCase();
  const visibleSection = document.querySelector('.menu-section:not([style*="display: none"])');
  const cards = visibleSection.querySelectorAll(".food-card");
  cards.forEach(card => {
    const nombre = card.innerText.toLowerCase();
    card.style.display = nombre.includes(filtro) ? "block" : "none";
  });
}

let platilloActual = {};

// Cambia la cantidad en el input (botones + y -)
function cambiarCantidad(btn, delta) {
  const input = btn.parentNode.querySelector('input[type="number"]');
  let valor = parseInt(input.value);
  valor += delta;
  if (valor < 1) valor = 1;
  input.value = valor;
}

// Agrega a la comanda la cantidad seleccionada
function agregarAComandaConCantidad(nombre, precio, btn) {
  const input = btn.parentNode.querySelector('input[type="number"]');
  const cantidad = parseInt(input.value);

  for (let i = 0; i < cantidad; i++) {
    comanda.push({ nombre, precio });
  }

  alert(`${cantidad} x ${nombre} agregado${cantidad > 1 ? 's' : ''} a la comanda.`);
  input.value = 1;

}
