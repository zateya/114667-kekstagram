'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500; // ms

  var picturesList = document.querySelector('.pictures');
  var picturesFragment = document.createDocumentFragment();

  var filtersBlock = document.querySelector('.img-filters');
  var filters = document.querySelectorAll('.img-filters__button');
  var activeFilter = null;

  var pictures = [];
  var filteredPictures = [];

  // Установка активного фильтра
  var setActiveFilter = function (selected) {
    if (activeFilter !== null) {
      activeFilter.classList.remove('img-filters__button--active');
    }

    selected.classList.add('img-filters__button--active');
    activeFilter = selected;
  };

  // Сортировка по лайкам
  var sortByLikes = function (arr) {
    return arr.slice().sort(function (first, second) {
      return second.likes - first.likes;
    });
  };

  // Сортировка по количеству комментариев
  var sortByComments = function (arr) {
    return arr.slice().sort(function (first, second) {
      return second.comments.length - first.comments.length;
    });
  };

  // Случайная сортировка
  var sortByRandom = function (arr) {
    return arr.slice().sort(function () {
      return Math.random() - 0.5;
    });
  };

  // Функция клика по фильтру
  var onFilterClick = function (evt) {
    var targetFilter = evt.target;

    if (activeFilter !== targetFilter) {
      setActiveFilter(targetFilter);

      var filtersMap = {
        '#filter-recommended': pictures,
        '#filter-popular': sortByLikes(pictures),
        '#filter-discussed': sortByComments(pictures),
        '#filter-random': sortByRandom(pictures),
        'default': pictures
      };

      filteredPictures = filtersMap[targetFilter.id] || filtersMap['default'];

      window.debounce(renderPictures, DEBOUNCE_INTERVAL);
    }
  };

  // Удаление фото в разметке
  var removePictures = function () {
    var removingPictures = picturesList.querySelectorAll('.picture__link');
    [].forEach.call(removingPictures, function (removingPicture) {
      removingPicture.remove();
    });
  };

  // Вывод списка фотографий
  var renderPictures = function () {
    removePictures();

    filteredPictures.forEach(function (item) {
      var element = window.picture.render(item);

      element.addEventListener('click', function (evt) {
        evt.preventDefault();
        window.preview.open(item);
      });

      picturesFragment.appendChild(element);
    });

    picturesList.appendChild(picturesFragment);
  };

  // Отрисовка списка фотографий
  var onLoad = function (data) {
    pictures = data;
    filteredPictures = pictures;
    renderPictures();
    filtersBlock.classList.remove('img-filters--inactive');

    // Добавление события клика на фильтры
    [].forEach.call(filters, function (filter) {
      filter.addEventListener('click', onFilterClick);
    });

    activeFilter = filters[0];
  };

  window.backend.load(onLoad, window.backend.showError);
})();
