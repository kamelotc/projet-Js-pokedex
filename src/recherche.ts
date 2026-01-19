
// Fonction de recherche
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
            liste.innerHTML = `
                <div class="error-box">
                    <p>Le Pokémon "${nom}" n'existe pas.</p>
                    <button id="back-btn" class="back-btn">Retour à la liste</button>
                </div>`;
            document.querySelector('#back-btn')?.addEventListener('click', () => {
                location.reload(); // Recharge la page pour retrouver la liste
            });
            return;
        }

        const pokemon = await response.json();

        liste.innerHTML = `
            <li class="pokemon-card search-result">
                <span class="pokemon-name">${pokemon.name}</span>
                <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}" />
                <div class="card-info">
                    <p>Type: ${pokemon.types.map((t: any) => t.type.name).join(', ')}</p>
                    <p>Taille: ${pokemon.height / 10}m | Poids: ${pokemon.weight / 10}kg</p>
                </div>
                <button id="back-btn" class="back-btn">← Retour à la liste</button>
            </li>
        `;

        document.querySelector('#back-btn')?.addEventListener('click', () => {
            location.reload();
        });

    } catch (error) {
        liste.innerHTML = "Une erreur est survenue lors de la recherche.";
    }
}