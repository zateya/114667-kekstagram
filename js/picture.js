'use strict';

(function () {
  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture__link');

  // Отрисовка одной фотографии
  window.picture.render = function (picture) {
    var pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__stat--likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__stat--comments').textContent = picture.comments.length;

    return pictureElement;
  };
})();
