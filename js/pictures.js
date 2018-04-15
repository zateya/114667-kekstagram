'use strict';

var ESC_KEYCODE = 27;
var SCALE_MAX = 100;

var picturesTestData = {
  minIndex: 1,
  maxIndex: 25,

  descriptions: [
    'Тестим новую камеру!',
    'Затусили с друзьями на море',
    'Как же круто тут кормят',
    'Отдыхаем...',
    'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
    'Вот это тачка!'
  ],

  likeParam: {
    minValue: 15,
    maxValue: 200
  },

  commentParam: {
    minIndex: 1,
    maxIndex: 2,

    phrases: [
      'Всё отлично!',
      'В целом всё неплохо. Но не всё.',
      'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
      'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
      'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
      'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
    ]
  },

  getPictureComments: function (commentsCount) {
    var arr = [];

    for (var i = 0; i < commentsCount; i++) {
      arr.push(getRandomArrayElement(this.commentParam.phrases));
    }

    return arr;
  },

  getPicture: function (num) {
    return {
      url: 'photos/' + (num + this.minIndex) + '.jpg',
      likes: getRandomFromRange(this.likeParam.minValue, this.likeParam.maxValue),
      comments: this.getPictureComments(getRandomFromRange(this.commentParam.minIndex, this.commentParam.maxIndex)),
      description: getRandomArrayElement(this.descriptions)
    };
  },

  getPictures: function () {
    var pictures = [];
    var picturesNumber = this.maxIndex - this.minIndex + 1;

    for (var i = 0; i < picturesNumber; i++) {
      pictures.push(this.getPicture(i));
    }

    return pictures;
  }
};

var avatarData = {
  minIndex: 1,
  maxIndex: 6
};

var filterNameToRange = {
  chrome: {
    min: 0,
    max: 1
  },
  sepia: {
    min: 0,
    max: 1
  },
  marvin: {
    min: 0,
    max: 100
  },
  phobos: {
    min: 0,
    max: 3
  },
  heat: {
    min: 1,
    max: 3
  }
};

var pictureTemplate = document.querySelector('#picture').content.querySelector('a');
var picturesList = document.querySelector('.pictures');
var bigPicture = document.querySelector('.big-picture');
var bigPictureClose = bigPicture.querySelector('.big-picture__cancel');
var socialCommentCount = document.querySelector('.social__comment-count');
var socialCommentLoader = document.querySelector('.social__comment-loadmore');
var picturesFragment = document.createDocumentFragment();

var uploadInput = document.querySelector('#upload-file');
var uploadOverlay = document.querySelector('.img-upload__overlay');
var uploadClose = uploadOverlay.querySelector('.img-upload__cancel');
var uploadImage = document.querySelector('.img-upload__preview');

var pinScale = uploadOverlay.querySelector('.scale__pin');
var scaleInput = uploadOverlay.querySelector('.scale__value');
var effectFilters = document.querySelectorAll('.effects__radio');
var activeFilter = uploadOverlay.querySelector('.effects__radio[checked]');

var isEscEvent = function (evt, action) {
  if (evt.keyCode === ESC_KEYCODE) {
    action();
  }
};

var getRandomInt = function (num) {
  return Math.round(Math.random() * num);
};

// Получение случайного элемента массива
var getRandomArrayElement = function (arr) {
  return arr[getRandomInt(arr.length - 1)];
};

// Получение случайного значения из диапазона
var getRandomFromRange = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

// Удаление дочерних нод
var removeChildNodes = function (element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

// Определение функции перемешивания массива
var setRandomArraySort = function () {
  return Math.random() - 0.5;
};

// Перемешивание массива
var shuffleArray = function (arr) {
  return arr.sort(setRandomArraySort);
};

// Отрисовка одной фотографии
var renderPicture = function (picture) {
  var pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = picture.url;
  pictureElement.querySelector('.picture__stat--likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__stat--comments').textContent = picture.comments.length;

  pictureElement.addEventListener('click', function () {
    openBigPicture(picture);
  });

  return pictureElement;
};

// Отрисовка списка фотографий
var renderPictures = function (pictures) {
  pictures.forEach(function (picture) {
    picturesFragment.appendChild(renderPicture(picture));
  });

  picturesList.appendChild(picturesFragment);
};

// Вывод одного комментария
var renderComment = function (commentText) {
  var comment = document.createElement('li');
  comment.classList.add('social__comment', 'social__comment--text');
  var commentAvatar = '<img class="social__picture" src="img/avatar-'
                      + getRandomFromRange(avatarData.minIndex, avatarData.maxIndex)
                      + '.svg" alt="Аватар комментатора фотографии" width="35" height="35">';
  comment.insertAdjacentHTML('afterbegin', commentAvatar + commentText);

  return comment;
};

// Вывод списка комментариев
var renderComments = function (comments) {
  var commentsList = document.querySelector('.social__comments');
  var commentsFragment = document.createDocumentFragment();

  removeChildNodes(commentsList);

  comments.forEach(function (comment) {
    commentsFragment.appendChild(renderComment(comment));
  });

  commentsList.appendChild(commentsFragment);

  return commentsList;
};

// Наполнение данными окна с увеличенной фотографией
var renderBigPicture = function (pictureData) {
  bigPicture.querySelector('.big-picture__img > img').src = pictureData.url;
  bigPicture.querySelector('.likes-count').textContent = pictureData.likes;
  bigPicture.querySelector('.comments-count').textContent = pictureData.comments.length;

  renderComments(pictureData.comments);
};

var onBigPictureKeyDown = function (evt) {
  isEscEvent(evt, closeBigPicture);
};

var openBigPicture = function (pictureData) {
  renderBigPicture(pictureData);
  bigPicture.classList.remove('hidden');
  document.addEventListener('keydown', onBigPictureKeyDown);
};

var closeBigPicture = function () {
  bigPicture.classList.add('hidden');
  document.removeEventListener('keydown', onBigPictureKeyDown);
};

bigPictureClose.addEventListener('click', function () {
  closeBigPicture();
});

var onUploadKeydown = function (evt) {
  isEscEvent(evt, closeUpload);
};

var openUpload = function () {
  uploadOverlay.classList.remove('hidden');
  document.addEventListener('keydown', onUploadKeydown);
};

var closeUpload = function () {
  uploadOverlay.classList.add('hidden');
  document.removeEventListener('keydown', onUploadKeydown);
  uploadInput.value = '';
};

uploadInput.addEventListener('change', function () {
  openUpload();
});

uploadClose.addEventListener('click', function () {
  closeUpload();
});

var getEffectValue = function (effectName, rangeValue) {
  return (filterNameToRange[effectName].max - filterNameToRange[effectName].min) / SCALE_MAX * rangeValue + filterNameToRange[effectName].min;
};

var getFilterStyles = function (effectName, effectValue) {
  var effectToFilterStyles = {
    chrome: 'filter: grayscale(' + effectValue + ');',
    sepia: 'filter: sepia(' + effectValue + ');',
    marvin: 'filter: invert(' + effectValue + '%);',
    phobos: 'filter: blur(' + effectValue + 'px);',
    heat: 'filter: brightness(' + effectValue + ');'
  };

  return effectToFilterStyles[effectName];
};

var setImageStyle = function () {
  var filterName = activeFilter.value;
  var filterValue = getEffectValue(activeFilter.value, scaleInput.value);
  uploadImage.style = getFilterStyles(filterName, filterValue);
};

var setFiltersEvents = function () {
  [].forEach.call(effectFilters, function (effectFilter) {
    effectFilter.addEventListener('click', function (evt) {
      if (evt.target.value === 'none') {
        uploadImage.style = '';
      } else {
        activeFilter = evt.target;
        setImageStyle();
      }
    });
  });
};

pinScale.addEventListener('mouseup', function () {
  setImageStyle();
});

// получение данных со списком фотографий
var data = picturesTestData.getPictures();

// перемешивание исходного массива данных
var shuffledData = shuffleArray(data.slice());

// вывод фотографий на странице
renderPictures(shuffledData);

// Скрытие количества комментариев в окне с увеличенной фотографией
socialCommentCount.classList.add('visually-hidden');

// Скрытие загрузчика комментариев в окне с увеличенной фотографией
socialCommentLoader.classList.add('visually-hidden');

// Добавляет события на фильтры
setFiltersEvents();
