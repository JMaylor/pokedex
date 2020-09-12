import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: true,
    fullPokemonList: [],
    searchQuery: "",
    searchResults: [],
    resultsPerPage: 12,
    displayedResults: [],
    favourites: [],
    selectedPokemon: {},
    selectedEvolutionChain: {},
    detailView: false,
  },
  getters: {
    getDisplayedResultsLength(state) {
      return state.displayedResults.length;
    },
    getTotalResultsLength(state) {
      return state.searchResults.length;
    },
  },
  mutations: {
    setLoadingTrue(state) {
      state.loading = true;
    },
    setLoadingFalse(state) {
      state.loading = false;
    },
    retrieveFavourites(state) {
      console.log("retrieveFavourites");
      if (localStorage.getItem("favourites") === null) {
        localStorage.setItem("favourites", JSON.stringify([]));
      }
      state.favourites = JSON.parse(localStorage.getItem("favourites"));
    },
    toggleFavourite(state, pokemon) {
      const index = state.favourites.indexOf(pokemon);
      if (index > -1) {
        state.favourites.splice(index, 1);
      } else {
        state.favourites.push(pokemon);
      }
      localStorage.setItem("favourites", JSON.stringify(state.favourites));
    },
    resetSearchResults(state) {
      state.searchQuery = "";
      state.searchResults = [];
      state.displayedResults = [];
    },
    setFullPokemonList(state, pokemonList) {
      state.fullPokemonList = pokemonList;
    },
    setSearchQuery(state, query) {
      state.searchQuery = query;
    },
    searchPokemon(state) {
      state.searchResults = state.fullPokemonList.filter(
        (x) =>
          x.name.includes(state.searchQuery) ||
          x.id.toString().includes(state.searchQuery)
      );
    },
    filterByFavourites(state) {
      state.searchResults = [];
      state.searchResults = state.fullPokemonList.filter(
        (x) => state.favourites.indexOf(x.name) > -1
      );
    },
    addPokemonToResults(state, array) {
      array.forEach((pokemon) => {
        state.displayedResults.push(pokemon);
      });
    },
    selectPokemon(state, pokemon) {
      state.selectedPokemon = pokemon;
      state.detailView = true;
    },
    hideDetailModal(state) {
      state.detailView = false;
    },
    setEvolutionChain(state, evoChain) {
      state.selectedEvolutionChain = evoChain;
    },
  },
  actions: {
    async getFullPokemonList(context) {
      console.log("getting all pokemon");
      await fetch("https://pokeapi.co/api/v2/pokemon?limit=893")
        .then((response) => response.json())
        .then((result) => {
          Promise.all(
            result.results.map((x) =>
              fetch(x.url).then(async (response) => {
                const jsonResponse = await response.json();
                // here don't save ALL the information as the response is simply too long
                return (({
                  abilities,
                  height,
                  id,
                  name,
                  species,
                  stats,
                  types,
                  weight,
                }) => ({
                  abilities,
                  height,
                  id,
                  name,
                  species,
                  stats,
                  types,
                  weight,
                }))(jsonResponse);
              })
            )
          ).then((pokemonArray) => {
            context.commit("setFullPokemonList", pokemonArray);
            console.log("all pokemon now stored");
            context.commit("retrieveFavourites");
            if (context.state.favourites.length == 0) {
              context.dispatch("newSearch", "");
            } else {
              context.dispatch("favouriteSearch");
            }
            context.commit("setLoadingFalse");
          });
        });
    },
    favouriteSearch(context) {
      console.log("favouriteSearch");
      context.commit("filterByFavourites");
      context.dispatch("loadResults");
    },
    newSearch(context, query) {
      context.commit("resetSearchResults");
      context.commit("setSearchQuery", query);
      context.commit("searchPokemon");
      context.dispatch("loadResults");
    },
    loadResults(context) {
      const pokemonAlreadyLoaded = context.getters.getDisplayedResultsLength;
      const pokemonToLoad = context.state.searchResults.slice(
        pokemonAlreadyLoaded,
        pokemonAlreadyLoaded + context.state.resultsPerPage
      );
      context.commit("addPokemonToResults", pokemonToLoad);
    },
    async selectPokemon(context, pokemon) {
      await context.dispatch("getEvolutionChain", pokemon);
      context.commit("selectPokemon", pokemon);
    },
    async getEvolutionChain(context, pokemon) {
      // go to species URL and get evolution_chain url
      const speciesURL = pokemon.species.url;
      const speciesData = await fetch(speciesURL).then((response) =>
        response.json()
      );

      // go evolution_chain url
      const evolutionData = await fetch(
        speciesData.evolution_chain.url
      ).then((response) => response.json().then((data) => data.chain));

      // initalise empty evoChain
      const evoChain = {};

      // get gen 1 pokemon and set to evoChain
      const baseSpecies = evolutionData.species.name;
      evoChain[baseSpecies] = {};

      // gen gen 2 pokemons and set as properties of baseSpecies
      const secondGen = evolutionData.evolves_to.map((x) => x.species.name);
      secondGen.forEach((mon) => {
        evoChain[baseSpecies][mon] = {};
      });

      // get gen 3 pokemon and list as array under gen 2 pokemons
      evolutionData.evolves_to.forEach((secondGen) => {
        evoChain[baseSpecies][
          secondGen.species.name
        ] = secondGen.evolves_to.map((x) => x.species.name);
      });

      context.commit("setEvolutionChain", evoChain);

      return;
    },
  },
  modules: {},
});
