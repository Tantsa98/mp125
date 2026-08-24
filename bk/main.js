// main.js
// Завантажує та парсить CSV, експортує getData()

const App = (function () {

  let _data = null;


  /*
   * Простий CSV parser
   */

  function parseCSV(text) {

    const rows =
      text
        .trim()
        .split(/\r?\n/);

    if (!rows.length) {

      return [];

    }

    const header =
      rows[0]
        .split(
          /,(?=(?:[^"]*"[^"]*")*[^"]*$)/
        )
        .map(item =>
          item
            .replace(/^"|"$/g, "")
            .trim()
        );

    const result = [];

    for (
      let rowIndex = 1;
      rowIndex < rows.length;
      rowIndex++
    ) {

      const row =
        rows[rowIndex];

      if (!row.trim()) {

        continue;

      }

      const values =
        row
          .split(
            /,(?=(?:[^"]*"[^"]*")*[^"]*$)/
          )
          .map(item =>
            item
              .replace(/^"|"$/g, "")
              .trim()
          );

      const object = {};

      header.forEach(
        (
          key,
          index
        ) => {

          object[key] =
            values[index] ?? "";

        }
      );

      result.push(object);

    }

    return result;

  }


  /*
   * Завантаження CSV
   */

  async function loadCSV(
    path = "../data/bk/BK.csv"
  ) {

    if (_data) {

      return _data;

    }

    try {

      const response =
        await fetch(
          path,
          {
            cache:
              "no-store"
          }
        );

      if (!response.ok) {

        throw new Error(
          "CSV not found"
        );

      }

      const text =
        await response.text();

      _data =
        parseCSV(text);

      return _data;

    }
    catch (error) {

      console.error(
        "Error loading CSV:",
        error
      );

      _data = [];

      return _data;

    }

  }


  /*
   * Унікальні значення
   */

  function unique(values) {

    return [
      ...new Set(values)
    ].filter(Boolean);

  }


  return {

    loadCSV,

    getAll:
      () => _data,

    utils: {

      unique

    }

  };

})();


window.App =
  App;