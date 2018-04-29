'use strict';

(function () {
  var SCALE_MAX = 100; // %
  var FILTER_CLASS_PREFIX = 'effects__preview--';

  var filtersMap = {
    chrome: {
      minValue: 0,
      maxValue: 1
    },
    sepia: {
      minValue: 0,
      maxValue: 1
    },
    marvin: {
      minValue: 0,
      maxValue: 100
    },
    phobos: {
      minValue: 0,
      maxValue: 3
    },
    heat: {
      minValue: 1,
      maxValue: 3
    },
    none: {
      minValue: 0,
      maxValue: 0
    }
  };

  var ResizeParam = {
    MIN: 25,
    MAX: 100,
    STEP: 25
  };

  var uploadForm = document.querySelector('.img-upload__form');
  var fieldFile = uploadForm.querySelector('#upload-file');
  var uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
  var uploadClose = uploadForm.querySelector('.img-upload__cancel');
  var uploadedImage = uploadForm.querySelector('.img-upload__preview');

  var fieldScale = uploadForm.querySelector('.scale__value');
  var fieldHashtags = uploadForm.querySelector('.text__hashtags');
  var fieldComment = uploadForm.querySelector('.text__description');
  var buttonUpload = uploadForm.querySelector('.img-upload__submit');

  var effectFilters = uploadForm.querySelectorAll('.effects__radio');
  var originalFilter = uploadForm.querySelector('#effect-none');

  var resize = uploadForm.querySelector('.img-upload__resize');
  var buttonMinus = resize.querySelector('.resize__control--minus');
  var buttonPlus = resize.querySelector('.resize__control--plus');
  var fieldResize = resize.querySelector('.resize__control--value');

  var currentResizeValue = null;
  var activeFilter = null;
  var previousFilterClass = null;

  // Нажатие клавиши Esc в окне с загрузкой фотографии
  var onUploadKeydown = function (evt) {
    if (evt.target !== fieldHashtags && evt.target !== fieldComment) {
      window.util.ifEscEventDoAction(evt, closeUpload);
    }
  };

  // Сброс фильтров
  var resetFilters = function () {
    originalFilter.checked = true;
    currentResizeValue = ResizeParam.MAX;
    uploadedImage.style = '';
  };

  // Открытие окна с загрузкой фотографии
  var openUpload = function () {
    uploadOverlay.classList.remove('hidden');
    originalFilter.checked = true;
    activeFilter = originalFilter;
    setFilterClass(activeFilter.value);
    setFieldResizeValue(ResizeParam.MAX);
    resetFilters();
    window.range.hide();
    document.addEventListener('keydown', onUploadKeydown);
  };

  // Закрытие окна с загрузкой фотографии
  var closeUpload = function () {
    uploadOverlay.classList.add('hidden');
    removePreviousClass();
    document.removeEventListener('keydown', onUploadKeydown);
    fieldFile.value = '';
  };

  // Установка значения в поле масштаба фотографии
  var setFieldResizeValue = function (value) {
    fieldResize.value = value + '%';
  };

  // Получение стиля для ресайза фотографии
  var getResizeStyle = function (value) {
    return 'transform: scale(' + value / 100 + ')';
  };

  // Получение уровня эффекта
  var getEffectVolume = function (effectName, rangeValue) {
    return (filtersMap[effectName].maxValue - filtersMap[effectName].minValue) / SCALE_MAX * rangeValue + filtersMap[effectName].minValue;
  };

  // Получение стилей эффекта
  var getFilterStyles = function (effectName, effectValue) {
    effectValue = window.util.isFloat(effectValue) ? effectValue.toFixed(1) : effectValue;

    var filtersStylesMap = {
      chrome: 'filter: grayscale(' + effectValue + ');',
      sepia: 'filter: sepia(' + effectValue + ');',
      marvin: 'filter: invert(' + Math.round(effectValue) + '%);',
      phobos: 'filter: blur(' + effectValue + 'px);',
      heat: 'filter: brightness(' + effectValue + ');',
      none: 'filter: none'
    };

    return filtersStylesMap[effectName] || filtersStylesMap['none'];
  };

  var removePreviousClass = function () {
    if (previousFilterClass !== null) {
      uploadedImage.classList.remove(previousFilterClass);
    }
  };

  var setFilterClass = function (effectName) {
    removePreviousClass();
    var filterClass = FILTER_CLASS_PREFIX + effectName;
    uploadedImage.classList.add(filterClass);
    previousFilterClass = filterClass;
  };

  // Применение стилей к загруженной фотографии
  var setImageFilter = function () {
    var filterName = activeFilter.value;
    setFieldResizeValue(currentResizeValue);
    var filterValue = (activeFilter !== originalFilter) ? getEffectVolume(activeFilter.value, fieldScale.value) : originalFilter.value;
    uploadedImage.style = getResizeStyle(currentResizeValue) + ';' + getFilterStyles(filterName, filterValue);
  };

  // Обработчик события клика по переключателю фильтров
  var onEffectFilterClick = function (evt) {
    if (evt.target === originalFilter) {
      window.range.hide();
    } else {
      window.range.show();
      window.range.setAction(setImageFilter);
      window.range.setState(SCALE_MAX);
    }
    activeFilter = evt.target;
    setImageFilter();
    setFilterClass(activeFilter.value);
  };

  // Добавление событий для переключателей фильтров
  var addFiltersEvents = function () {
    [].forEach.call(effectFilters, function (effectFilter) {
      effectFilter.addEventListener('click', onEffectFilterClick);
    });
  };

  // Сброс стилей неверно заполненных полей формы
  var resetInvalidFieldStyle = function (field) {
    field.style.border = '';
  };

  // Применение стилей к неверно заполненным полям формы
  var setInvalidFieldStyle = function (field) {
    field.style.border = '2px solid #ff0000';
  };

  // Валидация поля комментария
  var onfieldCommentInvalid = function () {
    if (fieldComment.validity.tooLong) {
      fieldComment.setCustomValidity('Длина комментария не более 140 символов');
    } else {
      fieldComment.setCustomValidity('');
    }
  };

  // Получение массива хэш-тегов
  var getHashtags = function (str) {
    var uniqueHashtags = window.util.getUniqueArray(str.split(' '));
    return window.util.removeValueFromArray(uniqueHashtags, '');
  };

  // Валидация поля хэш-тегов
  var checkHashtags = function () {
    var hashtagsStr = fieldHashtags.value.toLowerCase();

    if (hashtagsStr !== '') {
      var hashtags = getHashtags(hashtagsStr);

      if (hashtags.length > 5) {
        fieldHashtags.setCustomValidity('Введите не более 5 хэш-тегов');
        return;
      } else {
        for (var i = 0; i < hashtags.length; i++) {
          if (hashtags[i].charAt(0) !== '#') {
            fieldHashtags.setCustomValidity('Добавьте символ # для всех хэш-тегов');
            return;
          } else if (hashtags[i].length === 1) {
            fieldHashtags.setCustomValidity('Добавьте название хэш-тега после символа #');
            return;
          } else if (hashtags[i].length > 20) {
            fieldHashtags.setCustomValidity('Максимальная длина хэш-тега 20 символов');
            return;
          }
        }
      }
    }

    if (hashtags) {
      fieldHashtags.value = hashtags.join(' ');
    }

    fieldHashtags.setCustomValidity('');
  };

  // Событие изменения загруженной фотографии
  fieldFile.addEventListener('change', function () {
    openUpload();
  });

  // Событие клика по кнопке Закрыть в окне с загрузкой фотографии
  uploadClose.addEventListener('click', function () {
    closeUpload();
  });

  // Нажатие на кнопку увеличения масштаба
  buttonPlus.addEventListener('click', function () {
    if (currentResizeValue < ResizeParam.MAX) {
      currentResizeValue = currentResizeValue + ResizeParam.STEP;
    }
    setImageFilter();
  });

  // Нажатие на кнопку уменьшения масштаба
  buttonMinus.addEventListener('click', function () {
    if (currentResizeValue > ResizeParam.MIN) {
      currentResizeValue = currentResizeValue - ResizeParam.STEP;
    }
    setImageFilter();
  });

  // Отмена сообщений валидации при инпуте в поле хэш-тегов
  fieldHashtags.addEventListener('input', function () {
    fieldHashtags.setCustomValidity('');
  });

  // Добавление события валидации поля комментария (при неверно заполненном комментарии)
  fieldComment.addEventListener('invalid', onfieldCommentInvalid);

  // Отмена сообщений валидации при инпуте в поле комментария
  fieldComment.addEventListener('input', function () {
    fieldComment.setCustomValidity('');
  });

  // Сброс стилей неверно заполненных полей при инпуте в форму
  uploadForm.addEventListener('input', function (evt) {
    resetInvalidFieldStyle(evt.target);
  });

  // Добавление события валидации неверно заполненных полей формы
  uploadForm.addEventListener('invalid', function (evt) {
    setInvalidFieldStyle(evt.target);
  }, true);

  // Добавление события проверки поля хэш-тегов при клике на кнопку отправки формы
  buttonUpload.addEventListener('click', function () {
    checkHashtags();
  });

  // Вывод контролов изменения масштаба поверх фотографии
  resize.style.zIndex = 1;

  // Добавляет события на фильтры
  addFiltersEvents();

  uploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.upload(new FormData(uploadForm), function () {
      closeUpload();
      uploadForm.reset();
    }, window.backend.showUploadError);
  });
})();
