import './style.css'

interface PokeInfo{
    id:number;
    name:string;
}

async function getPokemonIndic(id: number) {
    const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    const result = await pokemon.json() as PokeInfo;
    return result;
}

const app = document.querySelector<HTMLDivElement>('#liste-pokemon')!

for (let i = 1; i < 1026; i++) {
    const pok = await getPokemonIndic(i);
    app.insertAdjacentHTML('beforeend',`
        <div class="pokemon">
        <p>${i} | ${pok.name}</p>
        </div>`)
}