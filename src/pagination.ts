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

    const totalPokemon = catalogue.count;
    genererPagination(page, LIMIT, totalPokemon);

    const nextBtn = document.querySelector<HTMLButtonElement>('#next-btn');
    const maxPages = Math.ceil(totalPokemon / LIMIT);
    if (nextBtn) {
        nextBtn.disabled = (page >= maxPages);
    }

    liste.innerHTML = "";

    if (liste) {
        for (const p of catalogue.results) {
            const rep = await fetch(p.url);
            const pokemon = await rep.json();

            liste.innerHTML += `
                <li class="pokemon-card clickable-card" data-name="${pokemon.name}">
                    <span class="pokemon-name">${pokemon.name}</span>
                    <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}" />
                </li>
            `;
        }
        attacherEvenementsCartes();
    }
}
function genererPagination(page: number, LIMIT: number, totalPokemon: number) {
    const conteneur = document.querySelector<HTMLDivElement>('#pagination-numbers');
    if (!conteneur) return;

    conteneur.innerHTML= ``;
    const totalPages = Math.ceil(totalPokemon / LIMIT);
    const creeBtn = (numPage: number) => {
        const btn = document.createElement('button');
        btn.innerText = numPage.toString();
        btn.className = 'btn-primary';

        if (numPage === page) {
            btn.classList.add('active');
            btn.disabled = true;
        }
        btn.addEventListener('click', () => {
            getPokemonIndic(numPage);
        });
        conteneur.appendChild(btn);
    }
    creeBtn(1);
    if (page>3){
        const span = document.createElement('span');
        span.innerText = `...`;
        conteneur.appendChild(span);
    }
    let debut = Math.max(2, page -1);
    let fin = Math.min(totalPages -1, page +1)

    if (page === 1 )fin = Math.min(totalPages - 1,3);
    if (page === totalPages) debut = Math.max(2, totalPages - 2);

    for (let i = debut; i <= fin; i++) {
        creeBtn(i);
    }

    if (page < totalPages -2){
        const span = document.createElement('span');
        span.innerText = `...`;
        conteneur.appendChild(span);
    }

    if (totalPages > 1){
        creeBtn(totalPages);
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




