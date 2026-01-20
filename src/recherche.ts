import { attacherEvenementsCartes } from './pagination.ts';

export async function rechercherUnPokemon() {
    const input = document.querySelector<HTMLInputElement>('#search-input');
    const liste = document.querySelector<HTMLUListElement>('#pokemon-list')!;
    const pagination = document.querySelector<HTMLDivElement>('.pagination-controls')!;

    const nom = input?.value.toLowerCase().trim();
    if (!nom) return;

    liste.innerHTML = "Recherche en cours...";
    pagination.style.display = "none";

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nom}`);

        if (!response.ok) {
            // ... (ton code d'erreur reste le même)
            return;
        }

        const pokemon = await response.json();

        // 1. On injecte le HTML
        liste.innerHTML = `
            <li class="pokemon-card clickable-card" data-name="${pokemon.name}">
                <div class="pokemon-name">${pokemon.name}</div>
                <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}" />
                <button id="back-btn" class="back-btn">← Retour à la liste</button>
            </li>
        `;
        // 2. CRUCIAL : On appelle la fonction ICI, une fois que la carte est dans le DOM
        attacherEvenementsCartes();

        // Gestion du bouton retour
        document.querySelector('#back-btn')?.addEventListener('click', () => {
            location.reload();
        });

    } catch (error) {
        liste.innerHTML = "Une erreur est survenue lors de la recherche.";
    }
}

