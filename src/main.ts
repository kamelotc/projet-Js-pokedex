import './style.css'
import {retourListe} from "./pagination.ts";


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
    <ul id="pokemon-detail"></ul>
    <div class="pagination-controls">
        <button id="prev-btn">Précédent</button>
        <div id="pagination-numbers" class="pagination-numbers"></div>
        <button id="next-btn">Suivant</button>
    </div>
  `
    retourListe()
}