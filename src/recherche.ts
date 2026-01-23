import { attacherEvenementsCartes, getPokemonIndic, currentPage } from './pagination.ts';
import { fetchNomPokemon } from './api.ts';

// 1. On retire l'argument ici pour utiliser le 'currentPage' importé
export async function rechercherUnPokemon() {
    const input = document.querySelector<HTMLInputElement>('#search-input');
    const liste = document.querySelector<HTMLUListElement>('#pokemon-list')!;
    const pagination = document.querySelector<HTMLDivElement>('.pagination-controls')!;
    const detail = document.querySelector<HTMLUListElement>('#pokemon-detail')!;

    const nom = input?.value.toLowerCase().trim();
    if (!nom) return;

    liste.innerHTML = "<div class='loading'>Recherche en cours...</div>";
    pagination.style.display = "none";

    // Si une fiche détail était ouverte, on la ferme
    if(detail) {
        detail.style.display = "none";
        detail.innerHTML = "";
        liste.style.display = "grid";
    }

    try {
        const pokemon = await fetchNomPokemon(nom);

        liste.innerHTML = `
            <li class="pokemon-card clickable-card" data-name="${pokemon.name}">
                <div class="pokemon-name">${pokemon.name}</div>
                <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}" />
                <button id="back-btn-search" class="back-btn">← Retour à la liste</button>
            </li>
        `;

        // Réattacher l'événement pour cliquer sur la carte et voir le détail
        attacherEvenementsCartes();



        const btnRetour = document.querySelector('#back-btn-search');

        btnRetour?.addEventListener('click', (e) => {
            e.stopPropagation(); // Empêche de cliquer sur la carte en même temps


            getPokemonIndic(currentPage);
        });

    } catch (error) {
        liste.innerHTML = `
            <div style="grid-column: 1/-1; color: var(--cb-pink);">
                ERREUR : Pokémon introuvable.
                <br><br>
                <button id="back-btn-error" class="back-btn">Retour</button>
            </div>`;

        // Gestion du bouton retour même en cas d'erreur
        document.querySelector('#back-btn-error')?.addEventListener('click', () => {
            getPokemonIndic(currentPage);
        });
    }
}