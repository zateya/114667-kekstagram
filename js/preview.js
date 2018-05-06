'use strict';

(function () {
  var COMMENTS_STEP = 5;

  var avatarData = {
    minIndex: 1,
    maxIndex: 6
  };

  var bodyElement = document.body;
  var preview = document.querySelector('.big-picture');
  var socialBlock = document.querySelector('.big-picture__social');
  var socialCommentCount = preview.querySelector('.social__comment-count');
  var socialCommentLoader = preview.querySelector('.social__comment-loadmore');
  var socialFooter = preview.querySelector('.social__footer');
  var socialCommentInput = preview.querySelector('.social__footer-text');
  var previewClose = preview.querySelector('.big-picture__cancel');
  var commentsList = preview.querySelector('.social__comments');
  var comments = [];
  var commentsLoadedElement = null;
  var commentsCounter = 0;

  // Нажатие клавиши Esc при открытии большой фотографии
  var onPreviewKeyDown = function (evt) {
    if (evt.target !== socialCommentInput) {
      window.util.ifEscEventDoAction(evt, closePreview);
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
    comments = [];
    commentsCounter = 0;
    window.util.removeElement(commentsList);
    hideCommentsCounter();
    hideCommentsLoader();
    document.removeEventListener('keydown', onPreviewKeyDown);
  };

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

  // Получение фрагмента комментариев
  var getComments = function () {
    var commentsFragment = document.createDocumentFragment();
    var commentsToShow = comments.splice(0, COMMENTS_STEP);
    commentsCounter += commentsToShow.length;

    commentsToShow.forEach(function (commentData) {
      commentsFragment.appendChild(renderComment(commentData));
    });

    return commentsFragment;
  };

  // Показ количества загруженных комментариев
  var showCommentsLoadedCount = function () {
    commentsLoadedElement.textContent = commentsCounter;
  };

  // Вывод списка комментариев
  var renderComments = function () {
    commentsList = document.createElement('ul');
    commentsList.classList.add('social__comments');
    socialBlock.insertBefore(commentsList, socialFooter);

    commentsList.appendChild(getComments());
    showCommentsLoadedCount();
  };

  // Наполнение данными окна с увеличенной фотографией
  var renderPreview = function (pictureData) {
    comments = pictureData.comments.slice();
    var authorComment = comments.splice(0, 1);

    preview.querySelector('.big-picture__img > img').src = pictureData.url;
    preview.querySelector('.social__caption').textContent = authorComment;
    preview.querySelector('.likes-count').textContent = pictureData.likes;

    socialCommentCount.innerHTML = '<span class="comments-loaded"></span> из <span class="comments-count"></span> комментариев';
    socialCommentCount.querySelector('.comments-count').textContent = pictureData.comments.length - 1; // вычитаем комментарий автора
    commentsLoadedElement = socialCommentCount.querySelector('.comments-loaded');

    if (comments.length > COMMENTS_STEP) {
      showCommentsCounter();
      showCommentsLoader();
    }

    if (comments.length > 0) {
      renderComments();
    }
  };

  // при клике на загрузчик комментариев
  var onLoaderClick = function () {
    if (comments.length <= COMMENTS_STEP) {
      hideCommentsLoader();
    }

    if (comments.length > 0) {
      commentsList.appendChild(getComments());
    }

    showCommentsLoadedCount();
  };

  // Показывает блок с количеством комментариев
  var showCommentsCounter = function () {
    socialCommentCount.classList.remove('hidden');
  };

  // Скрывает блок с количеством комментариев
  var hideCommentsCounter = function () {
    socialCommentCount.classList.add('hidden');
  };

  // Показывает загрузчик комментариев
  var showCommentsLoader = function () {
    socialCommentLoader.classList.remove('hidden');
  };

  // Скрывает загрузчик комментариев
  var hideCommentsLoader = function () {
    socialCommentLoader.classList.add('hidden');
  };

  // Клик по кнопке Закрыть в окне с большой фотографией
  previewClose.addEventListener('click', function () {
    closePreview();
  });

  // удаление списка комментариев в разметке
  window.util.removeElement(commentsList);

  // Скрытие количества комментариев в окне с увеличенной фотографией
  hideCommentsCounter();

  // Добавляет событие клика на загрузчик комментариев
  socialCommentLoader.addEventListener('click', onLoaderClick);

  // Замена курсора на указатель для загрузчика комментариев
  socialCommentLoader.style.cursor = 'pointer';

  // Скрытие загрузчика комментариев в окне с увеличенной фотографией
  hideCommentsLoader();

  window.preview = {
    open: openPreview
  };
})();
