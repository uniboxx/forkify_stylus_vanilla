import View from './view.js';
import icons from '../../img/icons.svg';

class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = `No recipes found for your query! Please try again ;)`;
  _message = '';

  _generateMarkup() {
    return this._data.reduce((acc, el) => {
      return (acc += `
      <li class="preview">
        <!-- <a class="preview__link preview__link--active" href="#23456"> -->
        <a class="preview__link" href="#${el.id}">
          <figure class="preview__fig">
            <img src="${el.image}" alt="${el.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${el.title}</h4>
            <p class="preview__publisher">${el.publisher}</p>
            <!--<div class="preview__user-generated">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>-->
          </div>
        </a>
    </li>
      `);
    }, '');
  }
}
export default new ResultsView();
