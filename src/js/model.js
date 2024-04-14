import { API_URL, API_KEY } from './config';
import { getJSON } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
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
