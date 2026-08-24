const Article = {

  article: null,

  viewerPhotos: [],

  viewerIndex: 0,


  async init() {

    this.bindEvents();

    try {

      await Access.ready();

    }
    catch (error) {

      console.error(
        "Access initialization error:",
        error
      );

      this.renderLoadError();

      return;

    }

    if (
      !Access.hasPermission(
        PERMISSIONS.MODULE_KNOWLEDGE
      )
    ) {

      this.renderAccessDenied();

      return;

    }

    const params =
      new URLSearchParams(
        window.location.search
      );

    const id =
      Number(
        params.get("id")
      );

    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {

      this.renderArticleNotFound();

      return;

    }

    this.article =
      KNOWLEDGE.find(
        item => item.id === id
      );

    if (!this.article) {

      this.renderArticleNotFound();

      return;

    }

    if (
      !Access.canAccessKnowledgeCategory(
        this.article.category
      )
    ) {

      this.renderAccessDenied();

      return;

    }

    this.render();

    await this.loadContent();

    this.renderPhotos();

    this.renderFiles();

    this.renderVideos();

  },

  canSeeMedia() {

    return Access.hasPermission(
      PERMISSIONS.KNOWLEDGE_MEDIA_SEE
    );

  },

  canViewMedia() {

    return Access.hasPermission(
      PERMISSIONS.KNOWLEDGE_MEDIA_VIEW
    );

  },

  canViewPhotos() {

    return (

      this.canViewMedia() &&

      Access.hasPermission(
        PERMISSIONS.KNOWLEDGE_PHOTOS_VIEW
      )

    );

  },

  canViewFiles() {

    return (

      this.canViewMedia() &&

      Access.hasPermission(
        PERMISSIONS.KNOWLEDGE_FILES_VIEW
      )

    );

  },

  canViewVideos() {

    return (

      this.canViewMedia() &&

      Access.hasPermission(
        PERMISSIONS.KNOWLEDGE_VIDEOS_VIEW
      )

    );

  },

  render() {

    document.title =
      this.article.title;

    document
      .getElementById(
        "contentTitle"
      )
      .textContent =
      this.article.title;

  },


  renderArticleNotFound() {

    console.error(
      "Article not found"
    );

    document.title =
      "Статтю не знайдено";

    document
      .getElementById(
        "contentTitle"
      )
      .textContent =
      "Статтю не знайдено";

    document
      .getElementById(
        "contentBody"
      )
      .innerHTML = `
        <p>
          Запитану статтю не знайдено.
        </p>
      `;

  },


  renderAccessDenied() {

    console.warn(
      "Article access denied"
    );

    document.title =
      "Доступ обмежено";

    document
      .getElementById(
        "contentTitle"
      )
      .textContent =
      "Доступ обмежено";

    document
      .getElementById(
        "contentBody"
      )
      .innerHTML = `
        <p>
          У вас немає доступу до цієї статті.
        </p>
      `;

  },


  renderLoadError() {

    document.title =
      "Помилка";

    document
      .getElementById(
        "contentTitle"
      )
      .textContent =
      "Помилка";

    document
      .getElementById(
        "contentBody"
      )
      .innerHTML = `
        <p>
          Не вдалося перевірити права доступу.
        </p>
      `;

  },


  async loadContent() {

    const container =
      document.getElementById(
        "contentBody"
      );

    try {

      const response =
        await fetch(
          `text/${this.article.contentFile}`,
          {
            cache:
              "no-store"
          }
        );

      if (!response.ok) {

        throw new Error(
          "Content file not found"
        );

      }

      const html =
        await response.text();

      container.innerHTML =
        html;

    }
    catch (error) {

      console.error(
        "Article content error:",
        error
      );

      container.innerHTML = `
        <p>
          Не вдалося завантажити текст статті.
        </p>
      `;

    }

  },


  renderPhotos() {

    const section =
      document.getElementById(
        "photosSection"
      );

    const container =
      document.getElementById(
        "contentPhotos"
      );

    container.innerHTML = "";

    section.classList.add(
      "hidden"
    );

    this.viewerPhotos = [];

    if (
      !this.canSeeMedia()
    ) {

      return;

    }

    if (
      !Array.isArray(
        this.article.photos
      )
    ) {

      return;

    }

    const photos =
      this.article.photos.filter(
        photo =>

          photo.file &&

          typeof photo.file ===
            "string" &&

          photo.file.trim() !== ""

      );

    if (
      photos.length === 0
    ) {

      return;

    }

    section.classList.remove(
      "hidden"
    );

    const canView =
      this.canViewPhotos();

    if (canView) {

      this.viewerPhotos =
        [...photos];

    }

    photos.forEach(
      (photo, index) => {

        const card =
          document.createElement(
            "div"
          );

        card.className =
          "photo-card";

        if (canView) {

          const image =
            document.createElement(
              "img"
            );

          image.src =
            `${CONFIG.knowledgeBase}/${this.article.id}/photos/${photo.file}`;

          image.alt =
            photo.title || "Фото";

          image.loading =
            "lazy";

          image.addEventListener(
            "click",
            () =>
              this.openPhotoViewer(
                index
              )
          );

          card.appendChild(
            image
          );

        }
        else {

          const locked =
            document.createElement(
              "div"
            );

          locked.className =
            "article-file";

          locked.textContent =
            "🔒 Фото";

          locked.setAttribute(
            "aria-disabled",
            "true"
          );

          card.appendChild(
            locked
          );

        }

        const caption =
          document.createElement(
            "div"
          );

        caption.className =
          "photo-title";

        caption.textContent =
          photo.title ||
          "Фото";

        card.appendChild(
          caption
        );

        container.appendChild(
          card
        );

      }
    );

  },


  openPhotoViewer(index) {

    if (
      !this.canViewPhotos()
    ) {

      return;

    }

    if (
      !Number.isInteger(index) ||
      index < 0 ||
      index >=
        this.viewerPhotos.length
    ) {

      return;

    }

    this.viewerIndex =
      index;

    document
      .getElementById(
        "photoViewer"
      )
      .classList
      .remove("hidden");

    this.showPhoto();

  },


  showPhoto() {

    if (
      !this.canViewPhotos()
    ) {

      return;

    }

    const photo =
      this.viewerPhotos[
        this.viewerIndex
      ];

    if (!photo) {

      return;

    }

    const image =
      document.getElementById(
        "photoImage"
      );

    image.src =
      `${CONFIG.knowledgeBase}/${this.article.id}/photos/${photo.file}`;

    image.alt =
      photo.title || "Фото";

    document
      .getElementById(
        "photoCaption"
      )
      .textContent =
      photo.title || "";

    document
      .getElementById(
        "photoCounter"
      )
      .textContent =
      `${this.viewerIndex + 1} / ${this.viewerPhotos.length}`;

  },


  prevPhoto() {

    if (
      !this.canViewPhotos() ||
      this.viewerPhotos.length === 0
    ) {

      return;

    }

    this.viewerIndex--;

    if (
      this.viewerIndex < 0
    ) {

      this.viewerIndex =
        this.viewerPhotos.length - 1;

    }

    this.showPhoto();

  },


  nextPhoto() {

    if (
      !this.canViewPhotos() ||
      this.viewerPhotos.length === 0
    ) {

      return;

    }

    this.viewerIndex++;

    if (
      this.viewerIndex >=
      this.viewerPhotos.length
    ) {

      this.viewerIndex = 0;

    }

    this.showPhoto();

  },


  closePhotoViewer() {

    document
      .getElementById(
        "photoViewer"
      )
      .classList
      .add("hidden");

  },


  renderFiles() {

    const section =
      document.getElementById(
        "filesSection"
      );

    const container =
      document.getElementById(
        "contentFiles"
      );

    container.innerHTML = "";

    section.classList.add(
      "hidden"
    );

    if (
      !this.canSeeMedia()
    ) {

      return;

    }

    if (
      !Array.isArray(
        this.article.files
      )
    ) {

      return;

    }

    const files =
      this.article.files.filter(
        file =>

          file.file &&

          typeof file.file ===
            "string" &&

          file.file.trim() !== ""

      );

    if (
      files.length === 0
    ) {

      return;

    }

    section.classList.remove(
      "hidden"
    );

    const canView =
      this.canViewFiles();

    files.forEach(file => {

      const button =
        document.createElement(
          "button"
        );

      button.type =
        "button";

      button.className =
        "article-file";

      if (canView) {

        button.textContent =
          `📄 ${file.title}`;

        button.addEventListener(
          "click",
          () => {

            window.open(
              `${CONFIG.knowledgeBase}/${this.article.id}/files/${file.file}`,
              "_blank",
              "noopener,noreferrer"
            );

          }
        );

      }
      else {

        button.textContent =
          `🔒 ${file.title}`;

        button.disabled =
          true;

        button.setAttribute(
          "aria-disabled",
          "true"
        );

      }

      container.appendChild(
        button
      );

    });

  },


  renderVideos() {

    const section =
      document.getElementById(
        "videosSection"
      );

    const container =
      document.getElementById(
        "contentVideos"
      );

    container.innerHTML = "";

    section.classList.add(
      "hidden"
    );

    if (
      !this.canSeeMedia()
    ) {

      return;

    }

    if (
      !Array.isArray(
        this.article.videos
      )
    ) {

      return;

    }

    const videos =
      this.article.videos.filter(
        video =>

          video.file &&

          typeof video.file ===
            "string" &&

          video.file.trim() !== ""

      );

    if (
      videos.length === 0
    ) {

      return;

    }

    section.classList.remove(
      "hidden"
    );

    const canView =
      this.canViewVideos();

    videos.forEach(video => {

      const button =
        document.createElement(
          "button"
        );

      button.type =
        "button";

      button.className =
        "article-file";

      if (canView) {

        button.textContent =
          `🎬 ${video.title}`;

        button.addEventListener(
          "click",
          () =>
            this.openVideoViewer(
              video
            )
        );

      }
      else {

        button.textContent =
          `🔒 ${video.title}`;

        button.disabled =
          true;

        button.setAttribute(
          "aria-disabled",
          "true"
        );

      }

      container.appendChild(
        button
      );

    });

  },


  openVideoViewer(video) {

    if (
      !this.canViewVideos()
    ) {

      return;

    }

    if (
      !video ||
      !video.file
    ) {

      return;

    }

    const viewer =
      document.getElementById(
        "videoViewer"
      );

    const frame =
      document.getElementById(
        "videoFrame"
      );

    const caption =
      document.getElementById(
        "videoCaption"
      );

    frame.src =
      `${CONFIG.streamBase}/${video.file}/iframe`;

    caption.textContent =
      video.title || "";

    viewer.classList.remove(
      "hidden"
    );

  },


  closeVideoViewer() {

    const viewer =
      document.getElementById(
        "videoViewer"
      );

    const frame =
      document.getElementById(
        "videoFrame"
      );

    frame.src = "";

    viewer.classList.add(
      "hidden"
    );

  },


  bindEvents() {

    document
      .getElementById(
        "backButton"
      )
      .addEventListener(
        "click",
        () => {

          window.location.replace(
            "index.html"
          );

        }
      );

    document
      .getElementById(
        "photoClose"
      )
      .addEventListener(
        "click",
        () =>
          this.closePhotoViewer()
      );

    document
      .getElementById(
        "photoPrev"
      )
      .addEventListener(
        "click",
        () =>
          this.prevPhoto()
      );

    document
      .getElementById(
        "photoNext"
      )
      .addEventListener(
        "click",
        () =>
          this.nextPhoto()
      );

    document
      .getElementById(
        "videoClose"
      )
      .addEventListener(
        "click",
        () =>
          this.closeVideoViewer()
      );

    document.addEventListener(
      "keydown",
      event => {

        const photoViewer =
          document.getElementById(
            "photoViewer"
          );

        const videoViewer =
          document.getElementById(
            "videoViewer"
          );

        if (
          !photoViewer
            .classList
            .contains("hidden")
        ) {

          switch (event.key) {

            case "Escape":

              this.closePhotoViewer();

              break;

            case "ArrowLeft":

              this.prevPhoto();

              break;

            case "ArrowRight":

              this.nextPhoto();

              break;

          }

          return;

        }

        if (
          !videoViewer
            .classList
            .contains("hidden") &&
          event.key === "Escape"
        ) {

          this.closeVideoViewer();

        }

      }
    );

  }

};


document.addEventListener(
  "DOMContentLoaded",
  () => Article.init()
);