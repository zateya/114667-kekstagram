'use strict';

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

var pictureTemplate = document.querySelector('#picture').content;
var picturesList = document.querySelector('.pictures');
var bigPicture = document.querySelector('.big-picture');
var socialCommentCount = document.querySelector('.social__comment-count');
var socialCommentLoader = document.querySelector('.social__comment-loadmore');
var picturesFragment = document.createDocumentFragment();

// Получение случайного элемента массива
var getRandomArrayElement = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
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
var renderBigPicture = function (num) {
  var pictureData = shuffledData[num];

  bigPicture.querySelector('.big-picture__img > img').src = pictureData.url;
  bigPicture.querySelector('.likes-count').textContent = pictureData.likes;
  bigPicture.querySelector('.comments-count').textContent = pictureData.comments.length;

  renderComments(pictureData.comments);
};

// получение данных со списком фотографий
var data = picturesTestData.getPictures();

// перемешивание исходного массива данных
var shuffledData = shuffleArray(data.slice());

// вывод фотографий на странице
renderPictures(shuffledData);

// показ окна с увеличенной фотографией
bigPicture.classList.remove('hidden');

// отрисовка окна с первой фотографией
renderBigPicture(0);

// Скрытие количества комментариев в окне с увеличенной фотографией
socialCommentCount.classList.add('visually-hidden');

// Скрытие загрузчика комментариев в окне с увеличенной фотографией
socialCommentLoader.classList.add('visually-hidden');
