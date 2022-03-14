import View from "./view";

class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _message = 'Recipe was successgully uploaded!';
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');
    
    constructor() {
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
    }

    toggleWinodw() {
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    }
    
    _addHandlerShowWindow() {
        this._btnOpen.addEventListener('click', this.toggleWinodw.bind(this));
    }
    
    _addHandlerHideWindow() {
        this._btnClose.addEventListener('click', this.toggleWinodw.bind(this));
        this._overlay.addEventListener('click', this.toggleWinodw.bind(this));
    }

    addHandlerUpload(handler) {
        this._parentElement.addEventListener('submit', function(event){
            event.preventDefault();
            const dataArray = [...new FormData(this)];
            const data = Object.fromEntries(dataArray);  // Takes an array and transforms to an object
            handler(data);
        });
    }    

    _generateMarkup() {

    }

}

export default new AddRecipeView();
