import {attacherEvenementsCartes, getPokemonIndic,currentPage} from './pagination.ts';

export async function rechercherUnPokemon(page: number) {
    const input = document.querySelector<HTMLInputElement>('#search-input');
    const liste = document.querySelector<HTMLUListElement>('#pokemon-list')!;
    const pagination = document.querySelector<HTMLDivElement>('.pagination-controls')!;
    const detail = document.querySelector<HTMLUListElement>('#pokemon-detail')!;
    const nom = input?.value.toLowerCase().trim();
    if (!nom) return;

    liste.innerHTML = "Recherche en cours...";
    pagination.style.display = "none";

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nom}`);

        if (!response.ok) {
            liste.innerHTML ="Pokémon non trouvé."
            return;
        }

        const pokemon = await response.json();

        liste.innerHTML = `
            <li class="pokemon-card clickable-card" data-name="${pokemon.name}">
                <span class="pokemon-name">${pokemon.name}</span>
                <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}" />
                <button id="back-btn" class="back-btn">← Retour à la liste</button>
            </li>
        `;

        attacherEvenementsCartes();

        document.querySelector('#back-btn')?.addEventListener('click', () => {
            if(liste) liste.style.display = "grid";
            if(detail) detail.style.display = "none";
            if(detail) detail.innerHTML = "";
            if(pagination) pagination.style.display = "flex";
        });

    } catch (error) {
        liste.innerHTML = "Une erreur est survenue lors de la recherche.";
    }
}

