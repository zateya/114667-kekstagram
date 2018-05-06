'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var uploadForm = document.querySelector('.img-upload__form');
  var fieldFile = uploadForm.querySelector('#upload-file');
  var uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
  var uploadClose = uploadForm.querySelector('.img-upload__cancel');
  var uploadedImage = uploadForm.querySelector('.img-upload__preview > img');
  var fieldHashtags = uploadForm.querySelector('.text__hashtags');
  var fieldComment = uploadForm.querySelector('.text__description');
  var buttonUpload = uploadForm.querySelector('.img-upload__submit');
  var effectPreviews = uploadForm.querySelectorAll('.effects__preview');

  // Нажатие клавиши Esc в окне с загрузкой фотографии
  var onUploadKeydown = function (evt) {
    if (evt.target !== fieldHashtags && evt.target !== fieldComment) {
      window.util.ifEscEventDoAction(evt, closeUpload);
    }
  };

  // Открытие окна с загрузкой фотографии
  var openUpload = function () {
    uploadOverlay.classList.remove('hidden');
    window.uploadResize.setDefault();
    window.effects.init();
    window.range.hide();
    document.addEventListener('keydown', onUploadKeydown);
  };

  // Сброс стилей неверно заполненных полей
  var resetInvalidInputsStyles = function () {
    var invalidInputs = uploadForm.querySelectorAll('input:invalid');

    [].forEach.call(invalidInputs, function (invalidInput) {
      resetInvalidFieldStyle(invalidInput);
    });
  };

  // Закрытие окна с загрузкой фотографии
  var closeUpload = function () {
    uploadOverlay.classList.add('hidden');
    uploadForm.reset();
    fieldFile.value = '';
    window.effects.remove();
    resetInvalidInputsStyles();
    document.removeEventListener('keydown', onUploadKeydown);
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
      }

      for (var i = 0; i < hashtags.length; i++) {
        if (hashtags[i].charAt(0) !== '#') {
          fieldHashtags.setCustomValidity('Добавьте символ # для всех хэш-тегов');
          return;
        }
        if (hashtags[i].length === 1) {
          fieldHashtags.setCustomValidity('Добавьте название хэш-тега после символа #');
          return;
        }
        if (hashtags[i].length > 20) {
          fieldHashtags.setCustomValidity('Максимальная длина хэш-тега 20 символов');
          return;
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
    var file = fieldFile.files[0];
    window.upload(file, FILE_TYPES, function (reader) {
      uploadedImage.src = reader.result;

      [].forEach.call(effectPreviews, function (effectPreview) {
        effectPreview.style.backgroundImage = 'url(' + reader.result + ')';
      });
    });
    openUpload();
  });

  // Событие клика по кнопке Закрыть в окне с загрузкой фотографии
  uploadClose.addEventListener('click', function () {
    closeUpload();
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

  // При отправке формы
  var onUploadFormSubmit = function () {
    closeUpload();
  };

  uploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.upload(new FormData(uploadForm), onUploadFormSubmit, window.backend.showUploadError);
  });
})();
