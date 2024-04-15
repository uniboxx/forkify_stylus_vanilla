import { API_URL, API_KEY, RES_PER_PAGE } from './config';
import { getJSON } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
};

export async function loadRecipe(id) {
  const data = await getJSON(`${API_URL}/${id}`);
  const { recipe } = data.data;
  state.recipe = {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
  };
  console.log(state.recipe);
}

export async function loadSearchResults(query) {
  state.search.query = query;
  const data = await getJSON(`${API_URL}?search=${query}`);
  state.search.results = data.data.recipes.map(el => {
    return {
      id: el.id,
      title: el.title,
      publisher: el.publisher,
      image: el.image_url,
    };
  });
}

export function getSearchResultsPage(page = state.search.page) {
  state.search.page = page;
  state.search.numberOfPages = Math.ceil(
    state.search.results.length / state.search.resultsPerPage,
  );
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
}
