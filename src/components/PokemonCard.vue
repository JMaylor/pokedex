<template>
	<b-card class="text-left mb-5 animated-bounce" footer-bg-variant="transparent">
		<b-img
			@click="$store.dispatch('selectPokemon', pokemon)"
			:src="`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${getLongID(pokemon.id)}.png`"
		></b-img>

		<template v-slot:footer>
			<span class="pokemon-id">#{{ getLongID(pokemon.id) }}</span>
			<b-icon
				:icon="isFavourited ? 'star-fill' : 'star'"
				variant="warning"
				scale="1.5"
				class="float-right m-2 favourite-icon"
				@click="setFavourite"
			></b-icon>
			<br />
			<span class="pokemon-name">{{ capitalize(pokemon.name) }}</span>
			<br />
			<div
				class="icon"
				v-for="pokemonType in pokemon.types"
				:key="pokemonType.type.name"
				:class="pokemonType.type.name"
				style="display: inline-block"
			>
				<img
					:src="`https://duiker101.github.io/pokemon-type-svg-icons/icons/${pokemonType.type.name}.svg`"
				/>
			</div>
		</template>
	</b-card>
</template>

<script>
	export default {
		props: ["pokemon"],
		methods: {
			getLongID(number) {
				const zeros = "0".repeat(3 - String(number).length);
				return zeros + number;
			},
			capitalize(text) {
				return text.substring(0, 1).toUpperCase() + text.substring(1);
			},
			setFavourite() {
				console.log("setting favourite");
				this.$store.commit("toggleFavourite", this.pokemon.name);
			}
		},
		computed: {
			isFavourited() {
				return this.$store.state.favourites.indexOf(this.pokemon.name) > -1;
			}
		}
	};
</script>

<style>
	img {
		max-width: 100%;
	}

	.pokemon-id {
		color: darkgray;
		font-style: italic;
		font-weight: 500;
	}

	.pokemon-name {
		font-weight: bold;
		font-size: 150%;
	}

	.animated-bounce {
		-webkit-transition: -webkit-transform 0.2s ease-in-out;
		transition: transform 0.2s ease-in-out;
	}

	.animated-bounce:hover {
		-webkit-transform: scale(1.1);
		transform: scale(1.1);
	}

	.favourite-icon:hover {
		cursor: pointer;
	}
</style>