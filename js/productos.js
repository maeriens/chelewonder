const span = document.createElement('span');
span.innerText = 'No aprietes enter acá que se caga todo, usa CMD+F o CTRL+F'

document.querySelector('#Contenedor').prepend(span)

document.getElementById('cshero-header').innerHTML += `<div
 style='font-size: 20px; text-align: center;'>
 <a style='color:white' href='/wonderfood/Pedidos.aspx'>VOLVE A VER TU VIANDA WACHIN</a>
 </div>`;

 document.querySelector('.logo-main').firstElementChild.setAttribute('src', chrome.runtime.getURL('logo.png'));
