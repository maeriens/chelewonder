const dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
const fecha_lunes = document.getElementById('grdInfo_lblLunes2');
const alert = document.querySelector('.alert');
const txt = document.getElementById('lblPedidosdeHoy');
const hoy = new Date();
const isCurrentWeek = (fecha_lunes && hoy.getDate() - fecha_lunes.textContent < 5 && hoy.getDate() - fecha_lunes.textContent >= 0);

function textoBanner(comida, postre) {
  return `<div style="color: white; font-size: 1.8em; display: inline-block; font-family: 'Product Sans">
  Hoy te la das en la pera comiendo de almuerzo: ${comida.toUpperCase()}, de postre: ${postre.toUpperCase()}</div>
 <span style="margin-left: 1em" style=onclick="this.parentElement.style.display='none';">×</span>`
}

function textoComida(id, comida) {
  return `<div id='${id}' style='color: black; font-size: 1.5em; text-align:center;'>${comida.trim()}</div>`
}

function textoComidaYDesc(id, comida, descripcion) {
  return `<div id="${id}" style="color: black; font-size: 1.2em; text-align:center;">`
    + `<div style="text-decoration: underline; font-weight: 800;">${comida.trim()}</div>`
    + `<div>${descripcion.trim()}</div>`
    + '</div>';
}


const traerProductos = async () => {
  const results = await fetch('http://w1131323.ferozo.com/wonderfood/Productos.aspx');
  const textResult = await results.text();
  return textResult;
};

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

console.log(chrome.runtime.getURL('logo.png'));
document.querySelector('.logo-main').firstElementChild.setAttribute('src', chrome.runtime.getURL('logo.png'));

// Aqui traemos el detalle de cada menu, y mostramos para cada día, el detalle de la opción seleccionada.
// Tambien agregamos un listener para que si cambia la opción elegida, se actualice el detalle
traerProductos().then(detalleProductos => {
  const getDetalleProducto = (productId) => {
    const regex = new RegExp(`<td>${productId} .*?td><td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td>.*?<\/tr>`);
    const parsedResult = detalleProductos.replace(/\r?\n|\r/g, '').match(regex);
    if (parsedResult) {
      const [match, nombre, grupo, subgrupo, habilitado, descripcion] = parsedResult;
      return { nombre, grupo, subgrupo, habilitado, descripcion };
    }

    return null;
  };

  const generarDetalleProducto = (detalle) => {
    if (detalle) {
      return `<div style="text-decoration: underline;">${detalle.nombre.trim()}</div>`
        + `<div>${detalle.descripcion.trim()}</div>`;
    }

    return '<div>No encontrado</div>';
  }
  // `#grdInfo_cmb${dia}_0`
  const embellecerVista = (dia) => {
    const almuerzoSelector = `#grdInfo_cmb${dia}_0`;
    const postreSelector = `#grdInfo_cmb${dia}_0`;
    const idDestinoAlmuerzo = `a_${dia}`;
    const idDestinoPostre = `p_${dia}`;

    const almuerzo_container = document.querySelector(almuerzoSelector)
    const almuerzo_opcion = document.querySelector(`${almuerzoSelector} option[selected]`).value;
    const detalleAlmuerzo = getDetalleProducto(almuerzo_opcion.trim());

    const postre_container = document.querySelector(`#grdInfo_cmb${dia}_1`)
    const postre_opcion = document.querySelector(`#grdInfo_cmb${dia}_1 option[selected]`).textContent;
    const postre = postre_opcion.split('-')[1];
  
    if (isCurrentWeek) {
      almuerzo_container.parentElement.innerHTML = textoComidaYDesc(idDestinoAlmuerzo, detalleAlmuerzo.nombre, detalleAlmuerzo.descripcion);
      postre_container.parentElement.innerHTML = textoComida(idDestinoPostre, postre);
      if (dias[hoy.getDay() - 1] === dia) {
        document.getElementById(idDestinoAlmuerzo).parentElement.style = 'background: lightblue;'
        document.getElementById(idDestinoPostre).parentElement.style = 'background: lightblue;'
      }
    } else {
      if (almuerzo_container.disabled) {
        almuerzo_container.setAttribute('style', 'display: none');
      } else {
        // Sin el timeout no funca, asi que ¯\_(ツ)_/¯
        setTimeout(() => {
          document.querySelector(almuerzoSelector).addEventListener('change', (event) => {
            const nuevaOpcion = event.target.value;
            const detalleAlmuerzo = getDetalleProducto(nuevaOpcion.trim());
            const detalle = generarDetalleProducto(detalleAlmuerzo);
            document.getElementById(idDestinoAlmuerzo).innerHTML = detalle;
          });
        }, 100);
      }
      almuerzo_container.parentElement.setAttribute('style', 'vertical-align: top');
      const detalle = generarDetalleProducto(detalleAlmuerzo);
      almuerzo_container.parentElement.innerHTML += `<div id="${idDestinoAlmuerzo}">${detalle}</div>`;
    }
  };

  dias.forEach(dia => {
    embellecerVista(dia);
  });
}).catch((e) => {
  console.error(e);
  // Dejo esto como fallback
  if (isCurrentWeek) {
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
});

