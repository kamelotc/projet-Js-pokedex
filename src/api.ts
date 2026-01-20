const urlApi ='http://pokeapi.co/api/v2/pokemon';


//pour liste pokemon
export async function fetchListePokemon(offset: number, limit: number) {
    try {
        const response = await fetch(`${urlApi}/?offset=${offset}&limit=${limit}`);
        if (!response.ok) throw new Error('Erreur réseau');
        return await response.json();
    } catch (error) {
        console.error("Erreur API Liste:", error);
        throw error;
    }
}


//pour un pokemon
export async function listeApiPokemonrecherche(nom: string) {
    try {
        const reponse = await fetch(`${nom}/pokemonrecherche`, {})
    }


}

const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${LIMIT}`);

const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nom}`);

const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nom}`);
