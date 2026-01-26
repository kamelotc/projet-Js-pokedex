// detail.ts
import { fetchNomPokemon, fetchGenericURL } from './api.ts'

export async function afficherFicheDetaillee(nom: string) {
    const liste = document.querySelector<HTMLUListElement>('#pokemon-list')!;
    const pagination = document.querySelector<HTMLDivElement>('.pagination-controls')!;
    const detail = document.querySelector<HTMLUListElement>('#pokemon-detail')!;

    pagination.style.display = "none";
    liste.style.display = "none";
    detail.style.display = "block";

    detail.innerHTML = "<div class='loading'>CHARGEMENT DES DONNÉES...</div>";

    try {
        // 1. Info principale
        const pokemon = await fetchNomPokemon(nom);

        // 2. Info Espèce (pour avoir le lien de la chaîne d'évolution)
        const species = await fetchGenericURL(pokemon.species.url);

        // 3. Info Chaîne d'évolution
        const evolutionChainData = await fetchGenericURL(species.evolution_chain.url);

        // --- TRAITEMENT DES ÉVOLUTIONS ---
        const evolutions: any[] = [];
        let currentEvo = evolutionChainData.chain;

        // On parcourt l'arbre (boucle simple pour chaîne linéaire, sinon récursif pour Evoli)
        do {
            const evoDetails = currentEvo.species;
            // Astuce pour récupérer l'ID depuis l'URL (ex: .../pokemon-species/25/)
            const idPart = evoDetails.url.split('/');
            const id = idPart[idPart.length - 2];

            evolutions.push({
                name: evoDetails.name,
                id: id,
                image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
            });

            // On passe au suivant (on prend le premier enfant pour simplifier)
            currentEvo = currentEvo.evolves_to[0];
        } while (currentEvo !== undefined && currentEvo.hasOwnProperty('species'));

        // Création du HTML des évolutions
        const evoHtml = evolutions.map(evo => `
            <div class="evo-card" onclick="document.dispatchEvent(new CustomEvent('nav-pokemon', {detail: '${evo.name}'}))">
                <img src="${evo.image}" alt="${evo.name}">
                <span>${evo.name}</span>
            </div>
        `).join('<div class="arrow">➜</div>');


        // --- RENDU FINAL ---
        const statsHtml = pokemon.stats.map((s: any) => `
            <div class="stat-row">
                <div>${s.stat.name.toUpperCase()} : </div>
                <div>${s.base_stat}</div>
            </div>
        `).join('');

        detail.innerHTML = `
            <li class="pokemon-card detail-view">
                <div class="detail-header">
                    <div class="pokemon-name">ID_${pokemon.id.toString().padStart(3, '0')} // ${pokemon.name}</div>
                </div>
                
                <div class="main-content">
                    <img class="main-img" src="${pokemon.sprites.other['official-artwork'].front_default}" />
                    
                    <div class="card-info">
                        <p>> TYPE: ${pokemon.types.map((t: any) => t.type.name).join(' / ')}</p>
                        <p>> HEIGHT: ${pokemon.height / 10}M | WEIGHT: ${pokemon.weight / 10}KG</p>
                        
                        <div class="stats-container">
                            ${statsHtml}
                        </div>

                        <div class="evolution-section">
                            <div class="evo-title">> CHAÎNE D'ÉVOLUTION</div>
                            <div class="evo-container">
                                ${evoHtml}
                            </div>
                        </div>

                        <button id="play-cry" class="cry-btn">🔊 Écouter le cri</button>
                    </div>
                </div>
                
                <button id="back-btn" class="back-btn">Retour à la liste</button>
            </li>`;

        // Écouteur pour naviguer via clic sur une évolution
        document.addEventListener('nav-pokemon', (e: any) => {
            afficherFicheDetaillee(e.detail);
        });

        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if(liste) liste.style.display = "grid";
                if(detail) detail.style.display = "none";
                if(detail) detail.innerHTML = "";
                if(pagination) pagination.style.display = "flex";
            });
        }

        const cryBtn = document.getElementById('play-cry');
        if (cryBtn) {
            cryBtn.addEventListener('click', () => {
                new Audio(pokemon.cries.latest).play();
            });
        }

    } catch (error) {
        detail.innerHTML = "<div class='error-box'>FATAL_ERROR: DATA_CORRUPT</div>";
        console.error(error);
    }
}