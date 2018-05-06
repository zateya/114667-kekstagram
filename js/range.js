'use strict';

(function () {
  var range = document.querySelector('.scale');
  var rangeScale = range.querySelector('.scale__line');
  var rangeLevel = range.querySelector('.scale__level');
  var pin = range.querySelector('.scale__pin');
  var fieldScale = range.querySelector('.scale__value');
  var rangeWidth = null;
  var rangeAction = null;

  // Показ ползунка уровня эффекта
  var showRange = function () {
    range.classList.remove('hidden');
  };

  // Скрытие ползунка уровня эффекта
  var hideRange = function () {
    range.classList.add('hidden');
  };

  var setRangeAction = function (action) {
    rangeAction = action;
  };

  var getRangeValue = function (x) {
    return x / rangeWidth * 100;
  };

  // Установка состояния слайдера
  var setRangeState = function (value) {
    rangeLevel.style.width = pin.style.left = value + '%';
    fieldScale.value = Math.round(value);
  };

  // События перетаскивания ползунка слайдера
  pin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    if (rangeWidth === null) {
      rangeWidth = rangeScale.offsetWidth;
    }

    var startCoord = evt.clientX;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = startCoord - moveEvt.clientX;
      startCoord = moveEvt.clientX;

      var currentCoord = pin.offsetLeft - shift;

      if (currentCoord < 0) {
        currentCoord = 0;
      } else if (currentCoord > rangeWidth) {
        currentCoord = rangeWidth;
      }

      var currentValue = getRangeValue(currentCoord);
      setRangeState(currentValue);
      window.util.ifFunctionDoAction(rangeAction);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      window.util.ifFunctionDoAction(rangeAction);

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  window.range = {
    show: showRange,
    hide: hideRange,
    setAction: setRangeAction,
    setState: setRangeState
  };
})();
