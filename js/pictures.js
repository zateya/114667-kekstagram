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

var ResizeParam = {
  MIN: 25,
  MAX: 100,
  STEP: 25
};

var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture__link');
var picturesList = document.querySelector('.pictures');
var bigPicture = document.querySelector('.big-picture');
var bigPictureClose = bigPicture.querySelector('.big-picture__cancel');
var socialCommentCount = document.querySelector('.social__comment-count');
var socialCommentLoader = document.querySelector('.social__comment-loadmore');
var picturesFragment = document.createDocumentFragment();

var uploadForm = document.querySelector('.img-upload__form');
var uploadField = uploadForm.querySelector('#upload-file');
var uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
var uploadClose = uploadForm.querySelector('.img-upload__cancel');
var uploadImage = uploadForm.querySelector('.img-upload__preview');
var uploadScale = uploadForm.querySelector('.img-upload__scale');

var hashtagsField = uploadForm.querySelector('.text__hashtags');
var commentField = uploadForm.querySelector('.text__description');
var uploadSubmit = uploadForm.querySelector('.img-upload__submit');

var pinScale = uploadForm.querySelector('.scale__pin');
var scaleInput = uploadForm.querySelector('.scale__value');
var effectFilters = uploadForm.querySelectorAll('.effects__radio');
var originalFilter = uploadForm.querySelector('#effect-none');

var resize = uploadForm.querySelector('.img-upload__resize');
var resizeMinus = resize.querySelector('.resize__control--minus');
var resizePlus = resize.querySelector('.resize__control--plus');
var resizeField = resize.querySelector('.resize__control--value');
var currentResizeValue = null;
var activeFilter = null;

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

// Нажатие клавиши Esc при открытии большой фотографии
var onBigPictureKeyDown = function (evt) {
  isEscEvent(evt, closeBigPicture);
};

// Открытие большой фотографии
var openBigPicture = function (pictureData) {
  renderBigPicture(pictureData);
  bigPicture.classList.remove('hidden');
  document.addEventListener('keydown', onBigPictureKeyDown);
};

// Закрытие большой фотографии
var closeBigPicture = function () {
  bigPicture.classList.add('hidden');
  uploadForm.reset();
  document.removeEventListener('keydown', onBigPictureKeyDown);
};

// Клик по кнопке Закрыть в окне с большой фотографией
bigPictureClose.addEventListener('click', function () {
  closeBigPicture();
});

// Нажатие клавиши Esc в окне с загрузкой фотографии
var onUploadKeydown = function (evt) {
  if (evt.target !== hashtagsField && evt.target !== commentField) {
    isEscEvent(evt, closeUpload);
  }
};

// Установка уровня эффекта по умолчанию
var setScaleDefaultState = function () {
  scaleInput.value = SCALE_MAX;
};

// Сброс фильтров
var resetFilters = function () {
  originalFilter.checked = true;
  currentResizeValue = ResizeParam.MAX;
  uploadImage.style = '';
  setScaleDefaultState();
};

// Открытие окна с загрузкой фотографии
var openUpload = function () {
  uploadOverlay.classList.remove('hidden');
  originalFilter.checked = true;
  activeFilter = originalFilter;
  setResizeValue(ResizeParam.MAX);
  resetFilters();
  document.addEventListener('keydown', onUploadKeydown);
};

// Закрытие окна с загрузкой фотографии
var closeUpload = function () {
  uploadOverlay.classList.add('hidden');
  document.removeEventListener('keydown', onUploadKeydown);
  uploadField.value = '';
};

// Событие изменения загруженной фотографии
uploadField.addEventListener('change', function () {
  openUpload();
});

// Событие клика по кнопке Закрыть в окне с загрузкой фотографии
uploadClose.addEventListener('click', function () {
  closeUpload();
});

var setResizeValue = function (value) {
  resizeField.value = value + '%';
};

var getResizeStyle = function (value) {
  return 'transform: scale(' + value / 100 + ')';
};

// Получение уровня эффекта
var getEffectVolume = function (effectName, rangeValue) {
  return (filterNameToRange[effectName].max - filterNameToRange[effectName].min) / SCALE_MAX * rangeValue + filterNameToRange[effectName].min;
};

// Получение стилей эффекта
var getFilterStyles = function (effectName, effectValue) {
  var effectToFilterStyles = {
    chrome: 'filter: grayscale(' + effectValue + ');',
    sepia: 'filter: sepia(' + effectValue + ');',
    marvin: 'filter: invert(' + effectValue + '%);',
    phobos: 'filter: blur(' + effectValue + 'px);',
    heat: 'filter: brightness(' + effectValue + ');',
    none: 'filter: ' + effectValue,
    defaultEffect: 'filter: none'
  };

  return effectToFilterStyles[effectName] || effectToFilterStyles['defaultEffect'];
};

// Применение стилей к загруженной фотографии
var setImageStyle = function () {
  var filterName = activeFilter.value;
  setResizeValue(currentResizeValue);
  var filterValue = (activeFilter !== originalFilter) ? getEffectVolume(activeFilter.value, scaleInput.value) : originalFilter.value;
  uploadImage.style = getResizeStyle(currentResizeValue) + ';' + getFilterStyles(filterName, filterValue);
};

// Скрытие ползунка уровня эффекта
var hideScale = function () {
  uploadScale.style.display = 'none';
};

// Показ ползунка уровня эффекта
var showScale = function () {
  uploadScale.style.display = '';
};

// Добавление событий для переключателей фильтров
var addFiltersEvents = function () {
  [].forEach.call(effectFilters, function (effectFilter) {
    effectFilter.addEventListener('click', function (evt) {
      if (evt.target.value === 'none') {
        hideScale();
      } else {
        showScale();
        setScaleDefaultState();
      }
      activeFilter = evt.target;
      setImageStyle();
    });
  });
};

pinScale.addEventListener('mouseup', function () {
  setImageStyle();
});

resizePlus.addEventListener('click', function () {
  if (currentResizeValue < ResizeParam.MAX) {
    currentResizeValue = currentResizeValue + ResizeParam.STEP;
  }
  setImageStyle();
});

resizeMinus.addEventListener('click', function () {
  if (currentResizeValue > ResizeParam.MIN) {
    currentResizeValue = currentResizeValue - ResizeParam.STEP;
  }
  setImageStyle();
});

var resetInvalidFieldStyle = function (field) {
  field.style.border = '';
};

var setInvalidFieldStyle = function (field) {
  field.style.border = '2px solid #ff0000';
};

var onCommentFieldInvalid = function () {
  if (commentField.validity.tooLong) {
    commentField.setCustomValidity('Длина комментария не более 140 символов');
  } else {
    commentField.setCustomValidity('');
  }
};

var getUniqueArray = function (arr) {
  return arr.filter(function (item, index) {
    return arr.indexOf(item) === index;
  });
};

var removeValueFromArray = function (arr, deleteValue) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === deleteValue) {
      arr.splice(i, 1);
      i--;
    }
  }
  return arr;
};

var getHashtags = function (str) {
  var uniqueHashtags = getUniqueArray(str.split(' '));
  return removeValueFromArray(uniqueHashtags, '');
};

var checkHashtags = function () {
  var hashtagsStr = hashtagsField.value.toLowerCase();

  if (hashtagsStr !== '') {
    var hashtags = getHashtags(hashtagsStr);

    if (hashtags.length > 5) {
      hashtagsField.setCustomValidity('Введите не более 5 хэш-тегов');
      return;
    } else {
      for (var i = 0; i < hashtags.length; i++) {
        if (hashtags[i].charAt(0) !== '#') {
          hashtagsField.setCustomValidity('Добавьте символ # для всех хэш-тегов');
          return;
        } else if (hashtags[i].length === 1) {
          hashtagsField.setCustomValidity('Добавьте название хэш-тега после символа #');
          return;
        } else if (hashtags[i].length > 20) {
          hashtagsField.setCustomValidity('Максимальная длина хэш-тега 20 символов');
          return;
        }
      }
    }
  }

  hashtagsField.setCustomValidity('');
  hashtagsField.value = hashtags.join(' ');
};

hashtagsField.addEventListener('input', function () {
  hashtagsField.setCustomValidity('');
});

commentField.addEventListener('invalid', onCommentFieldInvalid);

commentField.addEventListener('input', function () {
  commentField.setCustomValidity('');
});

uploadForm.addEventListener('input', function (evt) {
  resetInvalidFieldStyle(evt.target);
});

uploadForm.addEventListener('invalid', function (evt) {
  setInvalidFieldStyle(evt.target);
}, true);

uploadSubmit.addEventListener('click', function () {
  checkHashtags();
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

resize.style.zIndex = 1;

// Добавляет события на фильтры
addFiltersEvents();
