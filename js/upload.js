'use strict';

(function () {
  // загрузка файлов
  window.upload = function (file, filetypes, cb) {
    if (file) {
      var fileName = file.name.toLowerCase();

      var matches = filetypes.some(function (item) {
        return fileName.endsWith(item);
      });

      if (matches && typeof cb === 'function') {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          cb(reader);
        });
        reader.readAsDataURL(file);
      }
    }
  };
})();
