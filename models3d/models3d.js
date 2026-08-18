const Models3D = {

  articles: [],

  filteredArticles: [],

  async init() {

    try {

      await Access.ready();

    }
    catch (error) {

      console.error(
        "Access initialization error:",
        error
      );

      document
        .getElementById("accessDenied")
        .classList
        .remove("hidden");

      document
        .getElementById("moduleContent")
        .classList
        .add("hidden");

      document
        .getElementById("moduleSidebar")
        .classList
        .add("hidden");

      return;

    }

    if (
      !Access.hasPermission(
        PERMISSIONS.MODULE_MODELS3D
      )
    ) {

      document
        .getElementById("accessDenied")
        .classList
        .remove("hidden");

      document
        .getElementById("moduleContent")
        .classList
        .add("hidden");

      document
        .getElementById("moduleSidebar")
        .classList
        .add("hidden");

      return;

    }

    document
      .getElementById("moduleContent")
      .classList
      .remove("hidden");

    document
      .getElementById("moduleSidebar")
      .classList
      .remove("hidden");

    this.loadData();

    this.renderAuthors();

    this.renderCategories();

    this.renderArticles();

    this.bindEvents();

  },

  loadData() {

    this.articles = [
      ...MODELS
    ];

    this.filteredArticles = [
      ...this.articles
    ];

  },

  renderAuthors() {

    const container =
      document.getElementById(
        "authorFilters"
      );

    container.innerHTML = "";

    const availableAuthors =
      new Set(
        this.articles.map(
          article =>
            article.author
        )
      );

    Object
      .entries(AUTHORS)
      .forEach(
        ([key, name]) => {

          if (
            !availableAuthors.has(key)
          ) {

            return;

          }

          const label =
            document.createElement(
              "label"
            );

          const checkbox =
            document.createElement(
              "input"
            );

          checkbox.type =
            "checkbox";

          checkbox.value =
            key;

          checkbox.className =
            "author-filter";

          label.appendChild(
            checkbox
          );

          label.append(
            document.createTextNode(
              " " + name
            )
          );

          container.appendChild(
            label
          );

        }
      );

  },

  renderCategories() {

    const container =
      document.getElementById(
        "categoryFilters"
      );

    container.innerHTML = "";

    const availableCategories =
      new Set(
        this.articles.map(
          article =>
            article.category
        )
      );

    Object
      .entries(CATEGORIES)
      .forEach(
        ([key, name]) => {

          if (
            !availableCategories.has(key)
          ) {

            return;

          }

          const label =
            document.createElement(
              "label"
            );

          const checkbox =
            document.createElement(
              "input"
            );

          checkbox.type =
            "checkbox";

          checkbox.value =
            key;

          checkbox.className =
            "category-filter";

          label.appendChild(
            checkbox
          );

          label.append(
            document.createTextNode(
              " " + name
            )
          );

          container.appendChild(
            label
          );

        }
      );

  },

  renderArticles() {

    const container =
      document.getElementById(
        "articles"
      );

    container.innerHTML = "";

    this.filteredArticles
      .forEach(article => {

        const button =
          document.createElement(
            "button"
          );

        button.type =
          "button";

        button.className =
          "article-item";

        button.textContent =
          article.title;

        button.addEventListener(
          "click",
          () => {

            window.location.assign(
              `model.html?id=${article.id}`
            );

          }
        );

        container.appendChild(
          button
        );

      });

    this.renderResultsInfo();

  },

  renderResultsInfo() {

    const container =
      document.getElementById(
        "resultsInfo"
      );

    const shown =
      this.filteredArticles.length;

    const total =
      this.articles.length;

    container.textContent =
      `Показано ${shown} із ${total} моделей`;

  },

  applyFilters() {

    const search =
      document
        .getElementById(
          "searchInput"
        )
        .value
        .trim()
        .toLowerCase();

    const authors =
      [
        ...document
          .querySelectorAll(
            ".author-filter:checked"
          )
      ]
        .map(
          item =>
            item.value
        );

    const categories =
      [
        ...document
          .querySelectorAll(
            ".category-filter:checked"
          )
      ]
        .map(
          item =>
            item.value
        );

    this.filteredArticles =
      this.articles.filter(
        article => {

          const authorMatch =
            authors.length === 0 ||
            authors.includes(
              article.author
            );

          const categoryMatch =
            categories.length === 0 ||
            categories.includes(
              article.category
            );

          const categoryName =
            CATEGORIES[
              article.category
            ] || "";

          const searchMatch =
            search === "" ||

            article.title
              .toLowerCase()
              .includes(search) ||

            categoryName
              .toLowerCase()
              .includes(search);

          return (

            authorMatch &&

            categoryMatch &&

            searchMatch

          );

        }
      );

    this.renderArticles();

  },

  bindEvents() {

    document
      .getElementById(
        "searchInput"
      )
      .addEventListener(
        "input",
        () =>
          this.applyFilters()
      );

    document
      .querySelectorAll(
        ".author-filter"
      )
      .forEach(filter => {

        filter.addEventListener(
          "change",
          () =>
            this.applyFilters()
        );

      });

    document
      .querySelectorAll(
        ".category-filter"
      )
      .forEach(filter => {

        filter.addEventListener(
          "change",
          () =>
            this.applyFilters()
        );

      });

  }

};

document.addEventListener(
  "DOMContentLoaded",
  () => Models3D.init()
);