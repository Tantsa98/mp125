const ModelPage = {

  model: null,

  photos: [],

  currentPhoto: 0,

  models: [],

  currentModel: 0,

  files: [],

  viewer: null,

  async init() {

    try {

      await Access.ready();

    }
    catch (error) {

      console.error(
        "Access initialization error:",
        error
      );

      this.showAccessDenied();

      return;

    }

    if (
      !Access.hasPermission(
        PERMISSIONS.MODULE_MODELS3D
      )
    ) {

      this.showAccessDenied();

      return;

    }

    if (
      !Access.canViewModels3DItem()
    ) {

      this.showAccessDenied();

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

    this.model =
      MODELS.find(
        item =>
          item.id === id
      );

    if (!this.model) {

      window.location.replace(
        "index.html"
      );

      return;

    }

    this.initializeHeader();

    this.renderHeader();

    this.viewer =
      document.getElementById(
        "modelViewer"
      );

    this.renderPhotos();

    this.renderModels();

    this.renderFiles();

    this.bindEvents();

    document
      .getElementById(
        "moduleContent"
      )
      .classList
      .remove("hidden");

  },

  showAccessDenied() {

    document
      .getElementById(
        "accessDenied"
      )
      .classList
      .remove("hidden");

    document
      .getElementById(
        "moduleContent"
      )
      .classList
      .add("hidden");

  },

  initializeHeader() {

    document
      .getElementById(
        "backButton"
      )
      .addEventListener(
        "click",
        () => {

          window.location.assign(
            "index.html"
          );

        }
      );

  },

  renderHeader() {

    document
      .getElementById(
        "contentTitle"
      )
      .textContent =
      this.model.title;

    document
      .getElementById(
        "contentInfo"
      )
      .classList
      .add("hidden");

    document
      .getElementById(
        "contentBody"
      )
      .textContent =

      this.model.description || "";

  },

  renderPhotos() {

    this.photos =

        this.model.photos.filter(
        photo =>
            photo.file
        );

    if (
        this.photos.length === 0
    ) {

        return;

    }

    document
        .getElementById(
        "photosSection"
        )
        .classList
        .remove("hidden");

    const container =
        document.getElementById(
        "contentPhotos"
        );

    container.innerHTML = "";

    this.photos.forEach(
        (photo, index) => {

        const card =
          document.createElement(
            "div"
          );

        card.className =
          "photo-card";

        const image =
          document.createElement(
            "img"
          );

        image.src =
          `${CONFIG.mediaBase}/models3d/${this.model.id}/photos/${photo.file}`;

        image.alt =
          photo.title ||
          this.model.title;

        const caption =
          document.createElement(
            "div"
          );

        caption.className =
          "photo-title";

        caption.textContent =
          photo.title || "";

        if (
          Access.canViewModels3DMedia()
        ) {

          image.addEventListener(
            "click",
            () =>
              this.openPhoto(index)
          );

        }

        card.appendChild(
          image
        );

        card.appendChild(
          caption
        );

        container.appendChild(
          card
        );

        }
    );

  },
  
  renderModels() {

    this.models =

      this.model.models.filter(
        model =>
          model.file
      );

    if (
      this.models.length === 0
    ) {

      return;

    }

    document
      .getElementById(
        "modelsSection"
      )
      .classList
      .remove("hidden");

    const container =
      document.getElementById(
        "contentModels"
      );

    container.innerHTML = "";

    this.models.forEach(
      (model, index) => {

        const button =
          document.createElement(
            "button"
          );

        button.type =
          "button";

        button.className =
          "article-item";

        button.textContent =
          model.title;

        button.dataset.index =
          index;

        if (
          Access.canViewModels3DMedia()
        ) {

          button.addEventListener(
            "click",
            () =>
              this.openModel(index)
          );

        }

        container.appendChild(
          button
        );

      }
    );

  },

  renderFiles() {

    this.files =

      this.model.files.filter(
        file =>
          file.file
      );

    if (
      this.files.length === 0
    ) {

      return;

    }

    document
      .getElementById(
        "filesSection"
      )
      .classList
      .remove("hidden");

    const container =
      document.getElementById(
        "contentFiles"
      );

    container.innerHTML = "";

    this.files.forEach(
      (file, index) => {

        const button =
          document.createElement(
            "button"
          );

        button.type =
          "button";

        button.className =
          "article-item";

        button.textContent =
          file.title;

        button.dataset.index =
          index;

        if (
          Access.canViewModels3DMedia()
        ) {

          button.addEventListener(
            "click",
            () =>
              this.openFile(index)
          );

        }

        container.appendChild(
          button
        );

      }
    );

  },

  openModel(index) {

    this.currentModel =
      index;

    const model =
      this.models[index];

    if (!model) {

      return;

    }

    this.loadModel(model);

    this.showViewer(model);

  },

  loadModel(model) {

    this.viewer.src =
      `${CONFIG.mediaBase}/models3d/${this.model.id}/models/${model.file}`;

    this.viewer.addEventListener(
      "load",
      () => {

        this.viewer.cameraTarget = "auto auto auto";

        this.viewer.cameraOrbit = "45deg 75deg auto";

        this.viewer.jumpCameraToGoal();

      },
      { once: true }
    );

  },

  showViewer(model) {

    document
      .getElementById(
        "modelTitle"
      )
      .textContent =
      model.title;

    const downloadButton =

      document.getElementById(
        "downloadModel"
      );

    if (
      Access.canDownloadModels3D()
    ) {

      downloadButton.classList.remove(
        "hidden"
      );

    }
    else {

      downloadButton.classList.add(
        "hidden"
      );

    }

    document
      .getElementById(
        "modelViewerOverlay"
      )
      .classList
      .remove("hidden");

  },

  closeViewer() {

    document
      .getElementById(
        "modelViewerOverlay"
      )
      .classList
      .add("hidden");

    document
      .getElementById(
        "modelTitle"
      )
      .textContent = "";

    this.viewer.removeAttribute(
      "src"
    );

    document
      .getElementById(
        "downloadModel"
      )
      .classList
      .add("hidden");

    this.currentModel = 0;

  },

  openFile(index) {

    const file =
      this.files[index];

    if (!file) {

      return;

    }

    window.open(

      `${CONFIG.mediaBase}/models3d/${this.model.id}/files/${file.file}`,

      "_blank"

    );

  },

  openPhoto(index) {

    this.currentPhoto =
        index;

    const photo =
        this.photos[index];

        if (!photo) {

          return;

        }

    document
        .getElementById(
        "photoImage"
        )
        .src =
        `${CONFIG.mediaBase}/models3d/${this.model.id}/photos/${photo.file}`;

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
        `${index + 1} / ${this.photos.length}`;

    document
        .getElementById(
        "photoViewer"
        )
        .classList
        .remove("hidden");

  },

  closePhoto() {

    document
      .getElementById(
        "photoViewer"
      )
      .classList
      .add("hidden");

  },

  previousPhoto() {

    if (
      this.photos.length === 0
    ) {

      return;

    }

    this.currentPhoto--;

    if (
      this.currentPhoto < 0
    ) {

      this.currentPhoto =
        this.photos.length - 1;

    }

    this.openPhoto(
      this.currentPhoto
    );

  },

  nextPhoto() {

    if (
      this.photos.length === 0
    ) {

      return;

    }

    this.currentPhoto++;

    if (
      this.currentPhoto >=
      this.photos.length
    ) {

      this.currentPhoto = 0;

    }

    this.openPhoto(
      this.currentPhoto
    );

  },

  bindEvents() {

    document
      .getElementById(
        "photoClose"
      )
      .addEventListener(
        "click",
        () =>
          this.closePhoto()
      );

    document
      .getElementById(
        "photoPrev"
      )
      .addEventListener(
        "click",
        () =>
          this.previousPhoto()
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
        "photoViewer"
      )
      .addEventListener(
        "click",
        event => {

          if (
            event.target.id ===
            "photoViewer"
          ) {

            this.closePhoto();

          }

        }
      );

    document
      .getElementById(
        "modelClose"
      )
      .addEventListener(
        "click",
        () =>
          this.closeViewer()
      );

    document
      .getElementById(
        "downloadModel"
      )
      .addEventListener(
        "click",
        () => {

          const model =
            this.models[
              this.currentModel
            ];

          if (!model) {

            return;

          }

          const link =
            document.createElement(
              "a"
            );

          link.href =
            `${CONFIG.mediaBase}/models3d/${this.model.id}/models/${model.file}`;

          link.setAttribute(
            "download",
            model.file
          );

          document.body.appendChild(
            link
          );

          link.click();

          document.body.removeChild(
            link
          );

        }
      );

    document
      .getElementById(
        "modelViewerOverlay"
      )
      .addEventListener(
        "click",
        event => {

          if (
            event.target.id ===
            "modelViewerOverlay"
          ) {

            this.closeViewer();

          }

        }
      );

    document
      .addEventListener(
        "keydown",
        event => {

          const photoViewer =
            document.getElementById(
              "photoViewer"
            );

          const modelViewer =
            document.getElementById(
              "modelViewerOverlay"
            );

          const photoOpened =

            !photoViewer.classList.contains(
              "hidden"
            );

          const modelOpened =

            !modelViewer.classList.contains(
              "hidden"
            );

          if (
            !photoOpened &&
            !modelOpened
          ) {

            return;

          }

          switch (event.key) {

            case "Escape":

              if (photoOpened) {

                this.closePhoto();

              }

              if (modelOpened) {

                this.closeViewer();

              }

              break;

            case "ArrowLeft":

              if (photoOpened) {

                this.previousPhoto();

              }

              break;

            case "ArrowRight":

              if (photoOpened) {

                this.nextPhoto();

              }

              break;

          }

        }
      );

  },

};

document.addEventListener(

  "DOMContentLoaded",

  () => ModelPage.init()

);