import { attacherEvenementsCartes } from './pagination.ts';
//import {gestionPagination} from './main.ts'
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

        liste.innerHTML = `
            <li class="pokemon-card clickable-card" data-name="${pokemon.name}">
                <span class="pokemon-name">${pokemon.name}</span>
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
                <button id="back-btn" class="back-btn">← Retour à la liste</button>
            </li>
        `;

        attacherEvenementsCartes();

        document.querySelector('#back-btn')?.addEventListener('click', () => {
            location.reload();
        });

    } catch (error) {
        liste.innerHTML = "Une erreur est survenue lors de la recherche.";
    }
}

