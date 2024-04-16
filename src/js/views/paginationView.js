import View from './view.js';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const gotoPage = +btn.dataset.goto;
      handler(gotoPage);
    });
  }

  _generateBtnMarkup(type, currentPage) {
    const templateBtn =
      type === 'prev'
        ? `
      <svg class="search__icon">
        <use href="src/img/icons.svg#icon-arrow-left"></use>
      </svg>
      <span>Page ${currentPage - 1}</span>`
        : `<span>Page ${currentPage + 1}</span>
      <svg class="search__icon">
        <use href="src/img/icons.svg#icon-arrow-right"></use>
      </svg>`;
    return (
      `<button data-goto="${
        type === 'prev' ? currentPage - 1 : currentPage + 1
      }" class="btn--inline pagination__btn--${type}">` +
      templateBtn +
      `</button>`
    );
  }

  _generateMarkup() {
    const numberOfPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage,
    );
    const currentPage = this._data.page;

    if (numberOfPages === 1) return '';
    else if (currentPage === numberOfPages)
      return this._generateBtnMarkup('prev', currentPage);
    else if (currentPage === 1)
      return this._generateBtnMarkup('next', currentPage);
    else
      return (
        this._generateBtnMarkup('prev', currentPage) +
        this._generateBtnMarkup('next', currentPage)
      );
  }
}

export default new PaginationView();
