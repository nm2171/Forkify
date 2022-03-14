import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function() {
  try {
    const id = window.location.hash.slice(1);

    if(!id) return;
    recipeView.renderSpinner();
    
    // Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    
    // Update bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // Loading recipe
    await model.loadRecipe(id);
    const recipe = model.state.recipe;
    
    // Rendering recipe
    recipeView.render(model.state.recipe);
    
  } catch (error) {
    recipeView.renderError();
    console.error(error);
  }
};

const controlSearchResults = async function() {
  try {
    // Get search query
    const query = searchView.getQuery();
    if (!query) return;
    
    // Load search results
    resultsView.renderSpinner();
    await model.loadSearchResults(query);
    
    // Render results
    resultsView.render(model.getSearchResultsPage());
    
    // Render initial pagination buttons
    paginationView.render(model.state.search);
    
  } catch (error) {
    console.log(error);
  }
}
controlSearchResults();

const controlPagination = function(goToPage) {
  // Render new results
  resultsView.render(model.getSearchResultsPage(goToPage)); 
  
  // Render initial pagination buttons
  paginationView.render(model.state.search);  
}

const controlServings = function(newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

const cotrolAddBookmark = function() {
  // Add or remove bookmark
  if (!model.state.recipe.bookmarked){
    model.addBookmark(model.state.recipe);
  } else { 
    model.deleteBookmark(model.state.recipe.id);
  }
  
  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks);
}

const contolAddRecipe = async function(newRecipe) {
  try {

    // Render spinner
    addRecipeView.renderSpinner();
  
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Display success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Close the form window
    setTimeout(function() {
      addRecipeView.toggleWinodw();
    }, MODAL_CLOSE_SEC * 1000);
    
    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    
  } catch (error) {
    console.error(`💥💥💥 ${error} 💥💥💥`);
    addRecipeView.renderError(error.message);  
  }
}

const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerAddBookmark(cotrolAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(contolAddRecipe);
}
init();