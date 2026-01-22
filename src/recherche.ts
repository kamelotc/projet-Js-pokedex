import { attacherEvenementsCartes } from './pagination.ts'
import {fetchNomPokemon} from './api.ts'

export async function rechercherUnPokemon() {
    const input = document.querySelector<HTMLInputElement>('#search-input');
    const liste = document.querySelector<HTMLUListElement>('#pokemon-list')!;
    const pagination = document.querySelector<HTMLDivElement>('.pagination-controls')!;

    const nom = input?.value.toLowerCase().trim();
    if (!nom) return;

    liste.innerHTML = "Recherche en cours...";
    pagination.style.display = "none";

    try {
        const pokemon = await fetchNomPokemon(nom);


        // 1. On injecte le HTML
        liste.innerHTML = `
            <li class="pokemon-card clickable-card" data-name="${pokemon.name}">
                <div class="pokemon-name">${pokemon.name}</div>
                <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}" />
                <button id="back-btn" class="back-btn">← Retour à la liste</button>
            </li>
        `;
        // Appelle la fonction, une fois que la carte est dans le DOM
        attacherEvenementsCartes();

        // Gestion du bouton retour
        document.querySelector('#back-btn')?.addEventListener('click', () => {
            location.reload();
        });

    } catch (error) {
        liste.innerHTML = "Une erreur est survenue lors de la recherche.";
    }
}

