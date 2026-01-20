import {afficherFicheDetaillee} from  './detail.ts'
export async function getPokemonIndic(page: number, LIMIT=18) {
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
                <li class="pokemon-card clickable-card" data-name="${pokemon.name}">
                    <span class="pokemon-name">${pokemon.name}</span>
                    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
                </li>
            `;
        }
        attacherEvenementsCartes();
    }
}
export function attacherEvenementsCartes() {
    // On récupère toutes les cartes qui viennent d'être créer
    const cartes = document.querySelectorAll('.clickable-card');
    cartes.forEach(carte => {
        carte.addEventListener('click', () => {
            // Récupère le nom stocker dans 'data-name'
            const nom = carte.getAttribute('data-name');
            // appelle la fonction pour afficher le nom
            if (nom) afficherFicheDetaillee(nom);
        });
    });
}




