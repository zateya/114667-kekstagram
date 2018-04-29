'use strict';

(function () {
  var picturesList = document.querySelector('.pictures');
  var picturesFragment = document.createDocumentFragment();

  // Отрисовка списка фотографий
  var onLoad = function (pictures) {
    pictures.forEach(function (item) {
      var element = window.picture.render(item);

      element.addEventListener('click', function () {
        window.preview.open(item);
      });

      picturesFragment.appendChild(element);
    });

    picturesList.appendChild(picturesFragment);
  };

  window.backend.load(onLoad, window.backend.showLoadError);
})();
