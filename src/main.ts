import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')

// 1. Correction des backticks et de la syntaxe HTML
if (app) {
    app.innerHTML += `
    <h1>Pokedex</h1>
    <ul id="pokemon-list"></ul>
    <div class="pagination-controls">
        <button id="prev-btn">Précédent</button>
        <span id="page-indicator">Page 1</span>
        <button id="next-btn">Suivant</button>
    </div>
  `
}
const LIMIT = 20;
let currentPage = 1;

async function getPokemonIndic(page: number) {
    const liste = document.querySelector<HTMLUListElement>('#pokemon-list')!;
    const indicator = document.querySelector<HTMLSpanElement>('#page-indicator')!;

    // Calcul de l'offset : page 1 = 0, page 2 = 20, etc.
    const offset = (page - 1) * LIMIT;

    // Vider la liste avant d'afficher les nouveaux Pokémon
    liste.innerHTML = "Chargement...";
    indicator.innerText = `Page ${page}`;

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${LIMIT}`);
    const catalogue = await response.json();

    liste.innerHTML = ""; // On enlève le message de chargement

    if (liste) {
        for (const p of catalogue.results) {
            const rep = await fetch(p.url);
            const pokemon = await rep.json();

            liste.innerHTML += `
                <li class="pokemon-card">
                   <span class="pokemon-name">${pokemon.name}</span>
                   <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
                </li>
            `;
        }
    }
}
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

// Premier chargement
getPokemonIndic(currentPage);
getPokemonIndic()