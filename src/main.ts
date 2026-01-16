import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')

// 1. Structure HTML avec la barre de recherche intégrée
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

const LIMIT = 18;
let currentPage = 1;

// --- FONCTION DE RECHERCHE ---
async function rechercherUnPokemon() {
    const input = document.querySelector<HTMLInputElement>('#search-input');
    const liste = document.querySelector<HTMLUListElement>('#pokemon-list')!;
    const pagination = document.querySelector<HTMLDivElement>('.pagination-controls')!;

    const nom = input?.value.toLowerCase().trim();
    if (!nom) return;

    liste.innerHTML = "Recherche en cours...";
    // On cache la pagination pendant la recherche pour ne pas créer de confusion
    pagination.style.display = "none";

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nom}`);

        if (!response.ok) {
            liste.innerHTML = `
                <div class="error-box">
                    <p>Le Pokémon "${nom}" n'existe pas.</p>
                    <button id="back-btn" class="back-btn">Retour à la liste</button>
                </div>`;
            document.querySelector('#back-btn')?.addEventListener('click', () => {
                location.reload(); // Recharge la page pour retrouver la liste
            });
            return;
        }

        const pokemon = await response.json();

        liste.innerHTML = `
            <li class="pokemon-card search-result">
                <span class="pokemon-name">${pokemon.name}</span>
                <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}" />
                <div class="card-info">
                    <p>Type: ${pokemon.types.map((t: any) => t.type.name).join(', ')}</p>
                    <p>Taille: ${pokemon.height / 10}m | Poids: ${pokemon.weight / 10}kg</p>
                </div>
                <button id="back-btn" class="back-btn">← Retour à la liste</button>
            </li>
        `;

        document.querySelector('#back-btn')?.addEventListener('click', () => {
            location.reload();
        });

    } catch (error) {
        liste.innerHTML = "Une erreur est survenue lors de la recherche.";
    }
}

// --- FONCTION DE LISTE (PAGINATION) ---
async function getPokemonIndic(page: number) {
    const prevBtn = document.querySelector<HTMLButtonElement>('#prev-btn');
    const pagination = document.querySelector<HTMLDivElement>('.pagination-controls')!;

    pagination.style.display = "flex"; // On s'assure que la pagination est visible

    if (prevBtn) {
        prevBtn.disabled = (page === 1);
    }

    const liste = document.querySelector<HTMLUListElement>('#pokemon-list')!;
    const indicator = document.querySelector<HTMLSpanElement>('#page-indicator')!;

    const offset = (page - 1) * LIMIT;
    liste.innerHTML = "Chargement...";
    indicator.innerText = `Page ${page}`;

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${LIMIT}`);
    const catalogue = await response.json();

    liste.innerHTML = "";

    if (liste) {
        for (const p of catalogue.results) {
            const rep = await fetch(p.url);
            const pokemon = await rep.json();

            liste.innerHTML += `
                <li class="pokemon-card">
                   <span class="pokemon-name">${pokemon.name}</span>
                  <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}" />
                </li>
            `;
        }
    }
}

// --- ÉCOUTEURS D'ÉVÉNEMENTS ---

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
document.querySelector('#search-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') rechercherUnPokemon();
});

// Premier chargement
getPokemonIndic(currentPage);