<template>
	<div>
		<SearchBar />
		<PokemonList v-if="$store.state.displayedResults.length > 0" />
		<PokemonDetailModal v-if="$store.state.detailView" />
	</div>
</template>

<script>
	// @ is an alias to /src
	import SearchBar from "@/components/SearchBar";
	import PokemonList from "@/components/PokemonList";
	import PokemonDetailModal from "@/components/PokemonDetailModal";

	export default {
		components: {
			SearchBar,
			PokemonList,
			PokemonDetailModal
		},
		mounted() {
			this.$store.dispatch("getFullPokemonList");
		}
	};
</script>
