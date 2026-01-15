import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')

// 1. Correction des backticks et de la syntaxe HTML
if (app) {
    app.innerHTML += `
    <h1>Pokedex</h1>
    <ul id="pokemon-list"></ul>
  `
}

async function getPokemonIndic() {
    // 2. Correction de l'ID (on cherche bien #pokemon-list créé plus haut)
    // On précise que c'est un élément de type liste (HTMLUListElement)
    const liste = document.querySelector<HTMLUListElement>('#pokemon-list')!

    // 3. Correction de l'URL (suppression des guillemets en trop)
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1026`)
    const catalogue = await response.json();

    if (liste) {
        for (const p of catalogue.results) {
            const rep = await fetch(p.url)
            const pokemon = await rep.json()

            // 4. Ajout des backticks pour le template string HTML
            liste.innerHTML += `
        <li class="pokemon-card">
           <span class="pokemon-name">${pokemon.name}</span>
           <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
        </li>
      `
        }
    }
}

getPokemonIndic()