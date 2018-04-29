'use strict';

(function () {
  var avatarData = {
    minIndex: 1,
    maxIndex: 6
  };

  var bodyElement = document.body;
  var uploadForm = document.querySelector('.img-upload__form');
  var preview = document.querySelector('.big-picture');
  var socialBlock = document.querySelector('.big-picture__social');
  var socialCommentCount = preview.querySelector('.social__comment-count');
  var socialCommentLoader = preview.querySelector('.social__comment-loadmore');
  var socialFooter = preview.querySelector('.social__footer');
  var previewClose = preview.querySelector('.big-picture__cancel');
  var commentsFragment = document.createDocumentFragment();
  var commentsList = preview.querySelector('.social__comments');

  // Вывод одного комментария
  var renderComment = function (commentText) {
    var commentElement = document.createElement('li');
    commentElement.classList.add('social__comment', 'social__comment--text');
    var commentAvatar = '<img class="social__picture" src="img/avatar-'
                        + window.util.getRandomFromRange(avatarData.minIndex, avatarData.maxIndex)
                        + '.svg" alt="Аватар комментатора фотографии" width="35" height="35">';
    commentElement.insertAdjacentHTML('afterbegin', commentAvatar + commentText);

    return commentElement;
  };

  // Вывод списка комментариев
  var renderComments = function (comments) {
    commentsList = document.createElement('ul');
    commentsList.classList.add('social__comments');
    socialBlock.insertBefore(commentsList, socialFooter);

    comments.forEach(function (comment) {
      commentsFragment.appendChild(renderComment(comment));
    });

    commentsList.appendChild(commentsFragment);

    return commentsList;
  };

  // Нажатие клавиши Esc при открытии большой фотографии
  var onPreviewKeyDown = function (evt) {
    window.util.ifEscEventDoAction(evt, closePreview);
  };

  // Наполнение данными окна с увеличенной фотографией
  var renderPreview = function (pictureData) {
    var comments = pictureData.comments.slice();
    var authorComment = comments.splice(0, 1);

    preview.querySelector('.big-picture__img > img').src = pictureData.url;
    preview.querySelector('.social__caption').textContent = authorComment;
    preview.querySelector('.likes-count').textContent = pictureData.likes;
    preview.querySelector('.comments-count').textContent = pictureData.comments.length;

    if (comments.length > 0) {
      renderComments(comments);
    }
  };

  // Открытие большой фотографии
  var openPreview = function (pictureData) {
    bodyElement.classList.add('modal-open');
    renderPreview(pictureData);
    preview.classList.remove('hidden');
    document.addEventListener('keydown', onPreviewKeyDown);
  };

  // Закрытие большой фотографии
  var closePreview = function () {
    preview.classList.add('hidden');
    bodyElement.classList.remove('modal-open');
    commentsList.remove();
    uploadForm.reset();
    document.removeEventListener('keydown', onPreviewKeyDown);
  };

  // Клик по кнопке Закрыть в окне с большой фотографией
  previewClose.addEventListener('click', function () {
    closePreview();
  });

  // удаление списка комментариев в разметке
  if (commentsList) {
    commentsList.remove();
  }

  // Скрытие количества комментариев в окне с увеличенной фотографией
  socialCommentCount.classList.add('visually-hidden');

  // Скрытие загрузчика комментариев в окне с увеличенной фотографией
  socialCommentLoader.classList.add('visually-hidden');

  window.preview = {
    open: openPreview
  };
})();
