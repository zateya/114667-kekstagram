'use strict';

(function () {
  var ResizeParam = {
    MIN: 25,
    MAX: 100,
    STEP: 25
  };

  var uploadPreview = document.querySelector('.img-upload__preview');
  var resize = document.querySelector('.img-upload__resize');
  var buttonMinus = resize.querySelector('.resize__control--minus');
  var buttonPlus = resize.querySelector('.resize__control--plus');
  var fieldResize = resize.querySelector('.resize__control--value');
  var resizeValue = null;

  var setResizeFieldValue = function (value) {
    fieldResize.value = value + '%';
  };

  // Получение стиля для ресайза фотографии и установка значения в поле формы
  var setResize = function (value) {
    uploadPreview.style = 'transform: scale(' + value / 100 + ')';
    setResizeFieldValue(value);
  };

  // Нажатие на кнопку увеличения масштаба
  buttonPlus.addEventListener('click', function () {
    if (resizeValue < ResizeParam.MAX) {
      resizeValue = resizeValue + ResizeParam.STEP;
    }

    setResize(resizeValue);
  });

  // Нажатие на кнопку уменьшения масштаба
  buttonMinus.addEventListener('click', function () {
    if (resizeValue > ResizeParam.MIN) {
      resizeValue = resizeValue - ResizeParam.STEP;
    }

    setResize(resizeValue);
  });

  window.uploadResize = {
    setDefault: function () {
      resizeValue = ResizeParam.MAX;
      setResize(resizeValue);
    }
  };
})();
