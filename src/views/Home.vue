<template>
	<div>
		<SearchBar />
		<Loading v-if="$store.state.loading == true" />
		<PokemonList v-if="$store.state.displayedResults.length > 0 && $store.state.loading == false" />
		<PokemonDetailModal v-if="$store.state.detailView && $store.state.loading == false" />
	</div>
</template>

<script>
	// @ is an alias to /src
	import Loading from "@/components/Loading"
	import SearchBar from "@/components/SearchBar";
	import PokemonList from "@/components/PokemonList";
	import PokemonDetailModal from "@/components/PokemonDetailModal";

	export default {
		components: {
			Loading,
			SearchBar,
			PokemonList,
			PokemonDetailModal
		},
		mounted() {
			this.$store.commit("setLoadingTrue");
			this.$store.dispatch("getFullPokemonList");
		}
	};
</script>
