import './style.css'
import { getPokemonIndic } from './pagination.ts'
import {  rechercherUnPokemon} from './recherche.ts'

const app = document.querySelector<HTMLDivElement>('#app')

// structure html
if (app) {
    app.innerHTML = `
    <h1>Pokedex</h1>
    
    <div class="search-container">
        <input type="text" id="search-input" placeholder="Chercher un Pokémon (ex: Mewtwo)...">
        <button id="search-btn">Rechercher</button>
    </div>

    <ul id="pokemon-list"></ul>

    <div class="pagination-controls">
        <button id="prev-btn">Précédent</button>
        <span id="page-indicator">Page 1</span>
        <button id="next-btn">Suivant</button>
    </div>
  `
}

//const LIMIT = 18;
let currentPage = 1;
// Pagination
document.querySelector('#prev-btn')?.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        getPokemonIndic(currentPage);
    }
});

document.querySelector('#next-btn')?.addEventListener('click', () => {
    currentPage++;
    getPokemonIndic(currentPage);
});

// Recherche (Clic bouton et Touche Entrée)
document.querySelector('#search-btn')?.addEventListener('click', rechercherUnPokemon);
document.querySelector<HTMLInputElement>('#search-input')?.addEventListener('keypress', (e:KeyboardEvent) => {
    if (e.key === 'Enter') rechercherUnPokemon();
});


rechercherUnPokemon();
// Premier chargement
getPokemonIndic(currentPage);