<template>
	<b-container style="background: white" class="pt-4">
		<b-row class="mb-3">
			<b-col cols="12" sm="6" lg="4" xl="3" v-for="pokemon in $store.state.displayedResults" :key="pokemon.name">
				<PokemonCard :pokemon="pokemon"/>
			</b-col>
		</b-row>

		<b-row class="mb-5">
			<b-col>
				<b-button
					variant="secondary"
					v-if="$store.state.displayedResults.length > 0"
					@click="scrollToTop"
				>Top</b-button>
			</b-col>
		</b-row>
		<b-row class="mb-5">
			<b-col>
				<b-button
					:variant="$store.state.searchResults.length > $store.state.displayedResults.length ? 'success' : 'warning'"
					:disabled="$store.state.searchResults.length <= $store.state.displayedResults.length"
					@click="$store.dispatch('loadResults')"
					class="mb-3"
				>{{ $store.state.searchResults.length > $store.state.displayedResults.length ? 'Load more' : 'No more results' }}</b-button>
			</b-col>
		</b-row>
		
	</b-container>
</template>

<script>
	import PokemonCard from "./PokemonCard";

	export default {
		components: {
			PokemonCard
		},
		computed: {},
		methods: {
			scrollToTop() {
				window.scrollTo({ top: 0, behavior: "smooth" });
			}
		}
	};
</script>