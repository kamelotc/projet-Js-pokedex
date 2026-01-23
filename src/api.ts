//liste pokemon
export async function fetchListePokemon(offset: number, limit: number) {
    try {
        const catalogue = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`);
        if (!catalogue.ok) throw new Error('Erreur réseau');
        return await catalogue.json();
    } catch (error) {
        console.error("Erreur API Liste:", error);
        throw error;
    }
}


//pour un pokemon recherche
export async function fetchNomPokemon(nom: string) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nom}`);
        if (!response.ok) throw new Error('Erreur réseau');
        return await response.json();
    } catch (error) {
        console.error("Erreur API Liste:", error);
        throw error;
    }
}

export async function fetchTousLesPokemons() {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=2000`);
        if (!response.ok) throw new Error('Erreur réseau');
        return await response.json();
    } catch (error) {
        console.error("Erreur API Global:", error);
        throw error;
    }
}

