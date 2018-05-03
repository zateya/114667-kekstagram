'use strict';

(function () {
  var lastTimeout;

  window.debounce = function (action, interval) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(action, interval);
  };
})();
