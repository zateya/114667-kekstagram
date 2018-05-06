'use strict';

(function () {
  var SERVER_URL = 'https://js.dump.academy/kekstagram';
  var OK_STATUS = 200;
  var TIMEOUT = 10000;

  var messageBlock = null;

  var setupRequest = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === OK_STATUS) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT; // 10s

    return xhr;
  };

  // функция нажатия Esc при возникновении ошибки
  var onErrorMessageEscPress = function (evt) {
    window.util.ifEscEventDoAction(evt, function () {
      document.body.removeChild(messageBlock);

      document.removeEventListener('keydown', onErrorMessageEscPress);
    });
  };

  var createErrorMessage = function (errorText) {
    messageBlock = document.createElement('div');
    messageBlock.classList.add('error-message');
    messageBlock.textContent = errorText + '\r\n' + 'нажмите клавишу Escape для продолжения';
    document.body.appendChild(messageBlock);

    document.addEventListener('keydown', onErrorMessageEscPress);
  };

  window.backend = {
    load: function (onLoad, onError) {
      var xhr = setupRequest(onLoad, onError);

      xhr.open('GET', SERVER_URL + '/data');
      xhr.send();
    },
    upload: function (data, onLoad, onError) {
      var xhr = setupRequest(onLoad, onError);

      xhr.open('POST', SERVER_URL);
      xhr.send(data);
    },
    showError: function (message) {
      createErrorMessage(message);
    }
  };

})();
