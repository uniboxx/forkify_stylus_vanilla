import * as model from './model.js';
import recipeView from './views/recipeView.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2
// https://forkify-api.herokuapp.com/api/v2/recipes

// api key: ec77d6d1-2c1e-4084-ae99-004c0f3da9bd

///////////////////////////////////////
async function controlRecipes() {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // Loading recipe
    await model.loadRecipe(id);

    // Render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
  }
}

['hashchange', 'load'].forEach(ev =>
  window.addEventListener(ev, controlRecipes),
);
