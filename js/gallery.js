'use strict';

(function () {

  var picturesList = document.querySelector('.pictures');
  var picturesFragment = document.createDocumentFragment();

  // Отрисовка списка фотографий
  var renderPictures = function (pictures) {
    pictures.forEach(function (item) {
      picturesFragment.appendChild(window.picture.render(item, window.preview.open));
    });

    picturesList.appendChild(picturesFragment);
  };

  // вывод фотографий на странице
  renderPictures(window.data);
})();
