'use strict';

(function () {
  var avatarData = {
    minIndex: 1,
    maxIndex: 6
  };

  var socialCommentCount = document.querySelector('.social__comment-count');
  var socialCommentLoader = document.querySelector('.social__comment-loadmore');
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureClose = bigPicture.querySelector('.big-picture__cancel');
  var uploadForm = document.querySelector('.img-upload__form');

  // Вывод одного комментария
  var renderComment = function (commentText) {
    var comment = document.createElement('li');
    comment.classList.add('social__comment', 'social__comment--text');
    var commentAvatar = '<img class="social__picture" src="img/avatar-'
                        + window.util.getRandomFromRange(avatarData.minIndex, avatarData.maxIndex)
                        + '.svg" alt="Аватар комментатора фотографии" width="35" height="35">';
    comment.insertAdjacentHTML('afterbegin', commentAvatar + commentText);

    return comment;
  };

  // Вывод списка комментариев
  var renderComments = function (comments) {
    var commentsList = document.querySelector('.social__comments');
    var commentsFragment = document.createDocumentFragment();

    window.util.removeChildNodes(commentsList);

    comments.forEach(function (comment) {
      commentsFragment.appendChild(renderComment(comment));
    });

    commentsList.appendChild(commentsFragment);

    return commentsList;
  };

  // Нажатие клавиши Esc при открытии большой фотографии
  var onBigPictureKeyDown = function (evt) {
    window.util.ifEscEventDoAction(evt, closeBigPicture);
  };

  // Наполнение данными окна с увеличенной фотографией
  var renderBigPicture = function (pictureData) {
    bigPicture.querySelector('.big-picture__img > img').src = pictureData.url;
    bigPicture.querySelector('.likes-count').textContent = pictureData.likes;
    bigPicture.querySelector('.comments-count').textContent = pictureData.comments.length;

    renderComments(pictureData.comments);
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

  // Скрытие количества комментариев в окне с увеличенной фотографией
  socialCommentCount.classList.add('visually-hidden');

  // Скрытие загрузчика комментариев в окне с увеличенной фотографией
  socialCommentLoader.classList.add('visually-hidden');

  // Открытие большой фотографии
  window.preview = {
    open: function (pictureData) {
      renderBigPicture(pictureData);
      bigPicture.classList.remove('hidden');
      document.addEventListener('keydown', onBigPictureKeyDown);
    }
  };
})();
