import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')

if (app) {
    app.innerHTML += `
    <h1>Pokedex</h1>
    <ul id="pokemon-list"></ul>
  `
}

async function getPokemonIndic() {
    const liste = document.querySelector<HTMLUListElement>('#pokemon-list')!
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20`)
    const catalogue = await response.json();

    if (liste) {
        for (const p of catalogue.results) {
            const rep = await fetch(p.url)
            const pokemon = await rep.json()


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