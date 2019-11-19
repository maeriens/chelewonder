chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.create({ 'url': 'http://w1131323.ferozo.com/wonderfood/Pedidos.aspx', 'selected': true });
});