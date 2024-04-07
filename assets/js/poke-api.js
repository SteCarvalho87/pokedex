//criando o objeto pokeApi    
const pokeApi = {}

//convertendo os campos da pokeApi para o nosso modelo pokemon
function convertPokeApiDetailToPokemon(pokeDetail) {
    //criando o objeto pokemon
    const pokemon = new Pokemon()
    //adicionando os valores de cada chave recebida da lista de detalhes do pokemon
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    //mapeando a lista dos tipos de pokemons(.map) caso tenha mais de um e adicionando à constante types
    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    
    //o type principal recebe o primeiro type.
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    //a imagem
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    //retorna o pokemon como obejto com os dados completos
    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    //requisição do url do pokemon específico
    return fetch(pokemon.url)
        //criando um arquivo json com o resultado dos detalhes desse pokemon
        .then((response) => response.json())
        //
        .then(convertPokeApiDetailToPokemon)
}

//montando a url da API e fazendo a requisição
pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    //requisição da url
    return fetch(url)
        //tranformando a resposta num arquivo json
        .then((response) => response.json())
        //separando os resultados nesse arquivo gerado
        .then((jsonBody) => jsonBody.results)
        //gerando uma lista de busca dos detalhes dos pokemons utilizando a função .map 
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        //promise.all cria uma lista de promessas, cada promessa faz uma requisição dos detalhes dos pokemons até concluir a lista
        .then((detailRequests) => Promise.all(detailRequests))
        //retornando a lista com os detalhes dos pokemons
        .then((pokemonsDetails) => pokemonsDetails)
}