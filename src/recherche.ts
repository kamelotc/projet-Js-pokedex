// recherche.ts
import { attacherEvenementsCartes, getPokemonIndic, currentPage } from './pagination.ts';
import { fetchTousLesPokemons } from './api.ts'; // On importe la nouvelle fonction

export async function rechercherUnPokemon() {
    const input = document.querySelector<HTMLInputElement>('#search-input');
    const liste = document.querySelector<HTMLUListElement>('#pokemon-list')!;
    const pagination = document.querySelector<HTMLDivElement>('.pagination-controls')!;
    const detail = document.querySelector<HTMLUListElement>('#pokemon-detail')!;

    const nomRecherche = input?.value.toLowerCase().trim();
    if (!nomRecherche) return;

    liste.innerHTML = "<div class='loading'>Analyse de la base de données...</div>";
    pagination.style.display = "none";

    // Cacher le détail si ouvert
    if(detail) {
        detail.style.display = "none";
        detail.innerHTML = "";
        liste.style.display = "grid";
    }

    try {
        // 1. On récupère la liste complète (très léger en données)
        const data = await fetchTousLesPokemons();
        const tousLesPokemons = data.results;
        const regex = new RegExp(`^${nomRecherche}`, 'i');
        const resultats = tousLesPokemons.filter((p: any) => regex.test(p.name));

        if (resultats.length === 0) {
            throw new Error("Aucun résultat");
        }

        liste.innerHTML = "";

        liste.innerHTML += `
            <div style="grid-column: 1/-1; margin-bottom: 20px;">
                <button id="back-btn-search" class="back-btn">← Retour à la liste complète</button>
                <h3 style="color: var(--cb-blue)">${resultats.length} Résultat(s) trouvé(s) pour "${nomRecherche}"</h3>
            </div>
        `;


        resultats.forEach((pokemon: any) => {
            // Astuce : L'API renvoie l'URL "https://pokeapi.co/api/v2/pokemon/25/"
            // On découpe l'URL pour récupérer l'ID (ex: 25) sans refaire un appel réseau lent
            const id = pokemon.url.split('/').filter(Boolean).pop();
            const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

            liste.innerHTML += `
                <li class="pokemon-card clickable-card" data-name="${pokemon.name}">
                    <div class="pokemon-name">${pokemon.name}</div>
                    <img src="${imageUrl}" alt="${pokemon.name}" loading="lazy" />
                </li>
            `;
        });

        // 4. On réactive le clic sur les cartes pour voir le détail
        attacherEvenementsCartes();

        // Gestion du bouton retour
        const btnRetour = document.querySelector('#back-btn-search');
        btnRetour?.addEventListener('click', (e) => {
            e.stopPropagation();
            getPokemonIndic(currentPage); // Retour à la page où on était
        });

    } catch (error) {
        liste.innerHTML = `
            <div style="grid-column: 1/-1; color: var(--cb-pink);">
                ERREUR : Aucun Pokémon ne commence par "${nomRecherche}".
                <br><br>
                <button id="back-btn-error" class="back-btn">Retour</button>
            </div>`;

        document.querySelector('#back-btn-error')?.addEventListener('click', () => {
            getPokemonIndic(currentPage);
        });
    }
}