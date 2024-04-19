import { API_URL, RES_PER_PAGE } from './config';
// import { getJSON, sendJSON } from './helpers';
import { ajax } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

function createRecipeObject(data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    //^ insert property only if a condition is true
    ...(recipe.key && { key: recipe.key }),
  };
}

export async function loadRecipe(id) {
  const data = await ajax(
    `${API_URL}/${id}?key=${import.meta.env.VITE_API_KEY}`,
  );
  state.recipe = createRecipeObject(data);

  if (state.bookmarks.some(bookmark => bookmark.id === id))
    state.recipe.bookmarked = true;
  else state.recipe.bookmarked = false;
  console.log(state.recipe);
}

export async function loadSearchResults(query) {
  state.search.query = query;
  const data = await ajax(
    `${API_URL}?search=${query}&key=${import.meta.env.VITE_API_KEY}`,
  );
  state.search.results = data.data.recipes.map(el => {
    return {
      id: el.id,
      title: el.title,
      publisher: el.publisher,
      image: el.image_url,
      ...(el.key && { key: el.key }),
    };
  });
  state.search.page = 1;
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

export function updateServings(newServings) {
  state.recipe.ingredients?.forEach(ing => {
    // newQt = oldQt * (newServings / oldServings)
    ing.quantity *= newServings / state.recipe.servings;
  });
  state.recipe.servings = newServings;
}

function persistBookmarks() {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export function addBookmark(recipe) {
  // add bookmark
  state.bookmarks.push(recipe);
  // localStorage.bookmarks = 2;

  // mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
}

export function removeBookmark(id) {
  // remove bookmark
  const idx = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(idx, 1);

  // mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
}

export function init() {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
}
init();

function clearBookmarks() {
  localStorage.clear('bookmarks');
}

// clearBookmarks();

export async function uploadRecipe(newRecipe) {
  // console.log(newRecipe);
  const ingredients = Object.entries(newRecipe)
    .filter(el => el[0].startsWith('ingredient') && el[1] !== '')
    .map(ing => {
      const ingArray = ing[1].split(',').map(el => el.trim());
      if (ingArray.length !== 3)
        throw new Error(
          'Wrong ingredient format! Please use the correct format :)',
        );
      const [quantity, unit, description] = ingArray;

      return { quantity: quantity ? +quantity : null, unit, description };
    });
  // console.log(ingredients);

  const recipe = {
    title: newRecipe.title,
    source_url: newRecipe.sourceUrl,
    image_url: newRecipe.image,
    publisher: newRecipe.publisher,
    cooking_time: +newRecipe.cookingTime,
    servings: +newRecipe.servings,
    ingredients,
  };
  const data = await ajax(
    `${API_URL}?key=${import.meta.env.VITE_API_KEY}`,
    recipe,
  );
  state.recipe = createRecipeObject(data);
  addBookmark(state.recipe);
}
