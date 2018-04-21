'use strict';

(function () {
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
        arr.push(window.util.getRandomArrayElement(this.commentParam.phrases));
      }

      return arr;
    },

    getPicture: function (num) {
      return {
        url: 'photos/' + (num + this.minIndex) + '.jpg',
        likes: window.util.getRandomFromRange(this.likeParam.minValue, this.likeParam.maxValue),
        comments: this.getPictureComments(window.util.getRandomFromRange(this.commentParam.minIndex, this.commentParam.maxIndex)),
        description: window.util.getRandomArrayElement(this.descriptions),
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

  window.data = picturesTestData.getPictures();
})();
