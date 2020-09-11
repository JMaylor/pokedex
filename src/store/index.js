import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
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
    retrieveFavourites(state) {
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
          x.url
            .split("/")
            .slice(-2)[0]
            .includes(state.searchQuery)
      );
    },
    filterByFavourites(state) {
      console.log(state.fullPokemonList);
      console.log("filtering by favourites");
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
    getFullPokemonList(context) {
      fetch("https://pokeapi.co/api/v2/pokemon?limit=893")
        .then((response) => response.json())
        .then((result) => {
          context.commit("setFullPokemonList", result.results);
          context.dispatch("favouriteSearch");
        });
    },
    favouriteSearch(context) {
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
      // find how many total results there are
      //   const totalResultsCount = context.state.totalResults.length;
      // find how many are currently loaded
      const pokemonAlreadyLoaded = context.getters.getDisplayedResultsLength;
      console.log("already loaded", pokemonAlreadyLoaded);

      const urlsToFetch = context.state.searchResults.slice(
        pokemonAlreadyLoaded,
        pokemonAlreadyLoaded + context.state.resultsPerPage
      );
      console.log(urlsToFetch);
      // load the next x
      Promise.all(
        urlsToFetch.map((result) =>
          fetch(result.url).then((response) => response.json())
        )
      ).then((pokemonArray) =>
        context.commit("addPokemonToResults", pokemonArray)
      );
    },
    selectPokemon(context, pokemon) {
      context.commit("selectPokemon", pokemon);
      context.dispatch("getEvolutionChain", pokemon);
    },
    async getEvolutionChain(context, pokemon) {
      console.log("getting evolution chain");
      // go to species URL and get evolution_chain url
      const speciesURL = pokemon.species.url;
      const speciesData = await fetch(speciesURL).then((response) =>
        response.json()
      );

      // go evolution_chain url
      const evolutionData = await fetch(
        speciesData.evolution_chain.url
      ).then((response) => response.json().then((data) => data.chain));
      console.log(evolutionData);

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

      console.log(evoChain);
      context.commit("setEvolutionChain", evoChain);
    },
  },
  modules: {},
});
