'use strict';

(function () {
  var RANGE_MAX = 100; // %
  var EFFECT_CLASS_PREFIX = 'effects__preview--';

  var effectToggles = document.querySelectorAll('.effects__radio');
  var originalEffect = document.querySelector('#effect-none');
  var fieldScale = document.querySelector('.scale__value');
  var uploadedImage = document.querySelector('.img-upload__preview > img');

  var activeEffect = null;
  var previousEffectClass = null;

  var effectsMap = {
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

  // Получение уровня эффекта
  var getEffectVolume = function (effectName, rangeValue) {
    var effect = effectsMap[effectName] || effectsMap.none;
    return (effect.maxValue - effect.minValue) / RANGE_MAX * rangeValue + effect.minValue;
  };

  // Получение стилей эффекта
  var getEffectStyles = function (effectName, effectValue) {
    effectValue = window.util.isFloat(effectValue) ? effectValue.toFixed(1) : effectValue;

    var effectsStylesMap = {
      chrome: 'filter: grayscale(' + effectValue + ');',
      sepia: 'filter: sepia(' + effectValue + ');',
      marvin: 'filter: invert(' + Math.round(effectValue) + '%);',
      phobos: 'filter: blur(' + effectValue + 'px);',
      heat: 'filter: brightness(' + effectValue + ');',
      none: 'filter: none'
    };

    return effectsStylesMap[effectName] || effectsStylesMap.none;
  };

  // Удаление предыдущего класса на изображении
  var removePreviousClass = function () {
    if (previousEffectClass !== null) {
      uploadedImage.classList.remove(previousEffectClass);
    }
  };

  // Установка класса на изображение
  var setEffectClass = function (effectName) {
    removePreviousClass();
    var effectClass = EFFECT_CLASS_PREFIX + effectName;
    uploadedImage.classList.add(effectClass);
    previousEffectClass = effectClass;
  };

  // Применение стилей к загруженной фотографии
  var setImageEffect = function () {
    var effectName = activeEffect.value;
    var effectValue = (activeEffect !== originalEffect) ? getEffectVolume(activeEffect.value, fieldScale.value) : originalEffect.value;
    uploadedImage.style = getEffectStyles(effectName, effectValue);
  };

  // Обработчик события клика по переключателю фильтров
  var onEffectToggleClick = function (evt) {
    if (evt.target === originalEffect) {
      window.range.hide();
    } else {
      window.range.show();
      window.range.setAction(setImageEffect);
      window.range.setState(RANGE_MAX);
    }
    activeEffect = evt.target;
    setImageEffect();
    setEffectClass(activeEffect.value);
  };

  // Добавление событий для переключателей фильтров
  var addEffectsEvents = function () {
    [].forEach.call(effectToggles, function (effectToggle) {
      effectToggle.addEventListener('click', onEffectToggleClick);
    });
  };

  // Добавляет события на фильтры
  addEffectsEvents();

  window.effects = {
    init: function () {
      originalEffect.checked = true;
      activeEffect = originalEffect;
      setEffectClass(activeEffect.value);
      uploadedImage.style = '';
    },
    remove: function () {
      removePreviousClass();
    }
  };
})();
