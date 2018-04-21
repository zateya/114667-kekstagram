'use strict';

(function () {
  var ESC_KEYCODE = 27;

  // Если нажата клавиша Escape выполнить переданную функцию
  var ifEscEventDoAction = function (evt, action) {
    if (evt.keyCode === ESC_KEYCODE) {
      action();
    }
  };

  // Получение случайного целого
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

  // Перемешивание массива
  var shuffleArray = function (arr) {
    return arr.sort(function () {
      return Math.random() - 0.5;
    });
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

  // Проверка является ли значение десятичной дробью
  var isFloat = function (value) {
    return Number(value) === value && value % 1 !== 0;
  };

  window.util = {
    ifEscEventDoAction: ifEscEventDoAction,
    getRandomInt: getRandomInt,
    getRandomArrayElement: getRandomArrayElement,
    getRandomFromRange: getRandomFromRange,
    removeChildNodes: removeChildNodes,
    shuffleArray: shuffleArray,
    getUniqueArray: getUniqueArray,
    removeValueFromArray: removeValueFromArray,
    isFloat: isFloat
  };
})();
