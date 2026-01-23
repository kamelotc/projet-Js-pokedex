import {fetchNomPokemon} from './api.ts'

export async function afficherFicheDetaillee(nom: string) {
    const liste = document.querySelector<HTMLUListElement>('#pokemon-list')!;
    const pagination = document.querySelector<HTMLDivElement>('.pagination-controls')!;
    const detail = document.querySelector<HTMLUListElement>('#pokemon-detail')!;


    pagination.style.display = "none";
    liste.style.display = "none";
    detail.style.display = "block";


    detail.innerHTML = "<div class='loading'>CHARGEMENT</div>";

    try {
        const pokemon  = await fetchNomPokemon(nom);
        const criUrl = pokemon.cries.latest;

        const statsHtml = pokemon.stats.map((s: any) => `
            <div class="stat-row">
                <div>${s.stat.name.toUpperCase()}</div>
                <div class="stat-bar"><div style="width: ${s.base_stat}%"></div></div>
                <div>${s.base_stat}</div>
            </div>
        `).join('');


        detail.innerHTML = `
            <li class="pokemon-card detail-view">
                <div class="detail-header">
                    <div class="pokemon-name">ID_${pokemon.id.toString().padStart(3, '0')} // ${pokemon.name}</div>
                </div>
                <img src="${pokemon.sprites.other['official-artwork'].front_default}" />
                <div class="card-info">
                    <p>> TYPE: ${pokemon.types.map((t: any) => t.type.name).join(' / ')}</p>
                    <p>> HEIGHT: ${pokemon.height / 10}M | WEIGHT: ${pokemon.weight / 10}KG</p>
                    <div class="stats-container">
                        ${statsHtml}
                    </div>
                    <button id="play-cry" class="cry-btn">
                        🔊 Écouter le cri
                    </button>
                </div>
                <button id="back-btn" class="back-btn">Retour à la liste</button>
            </li>`;


        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                // On rappelle la fonction principale qui va réafficher la liste et cacher le détail
                if(liste) liste.style.display = "grid";
                if(detail) detail.style.display = "none";
                if(detail) detail.innerHTML = "";
                if(pagination) pagination.style.display = "flex";
            });
        }


        const cryBtn = document.getElementById('play-cry');
        if (cryBtn) {
            cryBtn.addEventListener('click', () => {
                new Audio(criUrl).play();
            });
        }

    } catch (error) {
        detail.innerHTML = "<div class='error-box'>FATAL_ERROR: DATA_CORRUPT</div>";
        console.error(error);
    }
}