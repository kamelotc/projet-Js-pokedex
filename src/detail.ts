
export async function afficherFicheDetaillee(nom: string) {
    const liste = document.querySelector<HTMLUListElement>('#pokemon-list')!;
    const pagination = document.querySelector<HTMLDivElement>('.pagination-controls')!;

    pagination.style.display = "none";
    liste.innerHTML = "<div class='loading'>CHARGEMENT</div>";

    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nom}`);
        const pokemon = await res.json();
        const criUrl = pokemon.cries.latest;
        // Calcul des stats pour une barre de progression (optionnel)
        const statsHtml = pokemon.stats.map((s: any) => `
            <div class="stat-row">
                <div>${s.stat.name.toUpperCase()}</div>
                <div class="stat-bar"><div style="width: ${s.base_stat}%"></div></div>
                <div>${s.base_stat}</div>
            </div>
        `).join('');

        liste.innerHTML = `
            <li class="pokemon-card detail-view">
                <div class="detail-header">
                    <div class="pokemon-name">ID_${pokemon.id.toString().padStart(3, '0')} // ${pokemon.name}</div>
                </div>
                <img src="${pokemon.sprites.other['official-artwork'].front_default}" </img>
                <div class="card-info">
                    <p>> TYPE: ${pokemon.types.map((t: any) => t.type.name).join(' / ')}</p>
                    <p>> HEIGHT: ${pokemon.height / 10}M | WEIGHT: ${pokemon.weight / 10}KG</p>
                    <div class="stats-container">
                        ${statsHtml}
                    </div>
                    <button onclick="new Audio('${criUrl}').play()" class="cry-btn">
                        🔊 Écouter le cri
                    </button>
                </div>
                <button onclick="location.reload()" class="back-btn">Retour à la liste</button>
            </li>`;
    } catch (error) {
        liste.innerHTML = "<div class='error-box'>FATAL_ERROR: DATA_CORRUPT</div>";
    }
}