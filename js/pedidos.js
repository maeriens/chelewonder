const dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
const fecha_lunes = document.getElementById('grdInfo_lblLunes2');
const alert = document.querySelector('.alert');
const txt = document.getElementById('lblPedidosdeHoy');
const hoy = new Date();

function textoBanner(comida, postre) {
  return `<div style="color: white; font-size: 1.8em; display: inline-block; font-family: 'Product Sans">
  Hoy te la das en la pera comiendo de almuerzo: ${comida.toUpperCase()}, de postre: ${postre.toUpperCase()}</div>
 <span style="margin-left: 1em" style=onclick="this.parentElement.style.display='none';">×</span>`
}

function textoComida(id, comida) {
  return `<div id='${id}' style='color: black; font-size: 1.5em; text-align:center;'>${comida.trim()}</div>`
}

if (fecha_lunes && hoy.getDate() - fecha_lunes.textContent < 5 && hoy.getDate() - fecha_lunes.textContent > 0) {
  dias.forEach(dia => {

    const almuerzo_container = document.querySelector(`#grdInfo_cmb${dia}_0`)
    const almuerzo_opcion = document.querySelector(`#grdInfo_cmb${dia}_0 option[selected]`).textContent;

    const postre_container = document.querySelector(`#grdInfo_cmb${dia}_1`)
    const postre_opcion = document.querySelector(`#grdInfo_cmb${dia}_1 option[selected]`).textContent;

    const almuerzo = almuerzo_opcion.split('-')[1];
    const postre = postre_opcion.split('-')[1];

    almuerzo_container.parentElement.innerHTML = textoComida('a_' + dia, almuerzo);
    postre_container.parentElement.innerHTML = textoComida('p_' + dia, postre);
    if (dias[hoy.getDay() - 1] === dia) {
      document.getElementById(`a_${dia}`).parentElement.style = 'background: lightblue;'
      document.getElementById(`p_${dia}`).parentElement.style = 'background: lightblue;'
    }
  })
}

if (alert && txt.textContent.includes('ALMUERZO')) {
  const dividido = txt.textContent.split('ALMUERZO')[1].split('y POSTRE');
  const almuerzo = dividido[0].replace(/[^a-zA-Z ]/g, "").trim();
  const postre = dividido[dividido.length - 1].replace(/[^a-zA-Z ]/g, "").trim();
  if (dividido.length === 3) postre = 'POSTRE ' + postre;
  alert.innerHTML = textoBanner(almuerzo, postre);
}

if (alert && hoy.getDay() === 5) {
  alert.innerHTML += `<div style="padding-top: 16px; font-size: 2.3em; font-family: 'Product Sans'">
                      Aunque siendo viernes, puede salir ese SHAWARMA, no?
                      </div>`;
}

const preferencias = document.getElementById('colPrefe')

if (preferencias) {
  preferencias.innerHTML += '<div style="color: black; font-size: 18px; margin: 15px 50px;">'
    + 'Fijate qué goma trae cada plato <a href="/wonderfood/Productos.aspx">acá</a></div>'
  // 
}



