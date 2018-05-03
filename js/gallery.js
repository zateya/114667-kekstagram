'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500; // ms

  var picturesList = document.querySelector('.pictures');
  var picturesFragment = document.createDocumentFragment();

  var imgFilters = document.querySelector('.img-filters');
  var filtersForm = imgFilters.querySelector('.img-filters__form');

  var pictures = [];
  var filteredPictures = [];
  var activeFilter = null;

  var filtersFragments = document.createDocumentFragment();

  // Установка активного фильтра
  var setActiveFilter = function (selected) {
    if (activeFilter !== null) {
      activeFilter.classList.remove('img-filters__button--active');
    }

    selected.classList.add('img-filters__button--active');
    activeFilter = selected;
  };

  // Создание фильтра
  var createFilter = function (purpose, text) {
    var filter = document.createElement('button');
    filter.type = 'button';
    filter.classList.add('img-filters__button');
    filter.id = '#filter-' + purpose;
    filter.textContent = text;

    return filter;
  };

  // Вывод фильтров
  filtersForm.innerHTML = '';
  var recomendedFilter = createFilter('recommended', 'Рекомендуемые');
  filtersFragments.appendChild(recomendedFilter);
  setActiveFilter(recomendedFilter);

  var popularFilter = createFilter('popular', 'Популярные');
  filtersFragments.appendChild(popularFilter);

  var discussedFilter = createFilter('discussed', 'Обсуждаемые');
  filtersFragments.appendChild(discussedFilter);

  var randomFilter = createFilter('random', 'Случайные');
  filtersFragments.appendChild(randomFilter);

  filtersForm.appendChild(filtersFragments);

  var filters = filtersForm.querySelectorAll('.img-filters__button');

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

      switch (targetFilter) {
        case recomendedFilter:
          filteredPictures = pictures;
          break;
        case popularFilter:
          filteredPictures = sortByLikes(pictures);
          break;
        case discussedFilter:
          filteredPictures = sortByComments(pictures);
          break;
        case randomFilter:
          filteredPictures = sortByRandom(pictures);
          break;
        default:
          filteredPictures = pictures;
      }

      window.debounce(renderPictures, DEBOUNCE_INTERVAL);
    }
  };

  // Добавление события клика на фильтры
  [].forEach.call(filters, function (filter) {
    filter.addEventListener('click', onFilterClick);
  });

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
    imgFilters.classList.remove('img-filters--inactive');
  };

  window.backend.load(onLoad, window.backend.showLoadError);
})();
