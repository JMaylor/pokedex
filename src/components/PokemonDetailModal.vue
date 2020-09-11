<template>
	<b-modal
		ref="detail-modal"
		centered
		size="xl"
		@hidden="$store.commit('hideDetailModal')"
		header-class="text-center"
		title-class="w-100 display-4"
	>
		<template v-slot:modal-title class="w-100 text-center">
			{{ capitalize(pokemon.name) }}
			<span class="pokemon-id">#{{ getLongID(pokemon.id) }}</span>
		</template>

		<b-container>
			<b-row>
				<b-col cols="12" lg="6">
					<b-img
						:src="`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${getLongID(pokemon.id)}.png`"
					></b-img>
				</b-col>
				<b-col cols="12" lg="6">
					<h3>Base Stats</h3>

					<div
						v-for="(statistic, index) in pokemon.stats"
						:key="statistic.stat.name"
						class="row mb-1"
						border-variant="dark"
					>
						<div class="col-5">{{ capitalize(statistic.stat.name) }}:</div>
						<div class="col-7 pt-1">
							<b-progress
								striped
								max="180"
								show-value
								:value="statistic.base_stat"
								:variant="variants[index]"
							></b-progress>
						</div>
					</div>
					<hr />
					<h3>Types</h3>
					<div>
						<h3>
							<b-badge
								pill
								v-for="pokemonType in pokemon.types"
								:key="pokemonType.type.name"
								variant="none"
								class="mr-2"
								:class="pokemonType.type.name"
							>{{ capitalize(pokemonType.type.name) }}</b-badge>
						</h3>
					</div>
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
				</b-col>
			</b-row>
			<hr>
			<b-row>
				Evolution Chain - Coming Soon
			</b-row>
			<b-row>
				<span v-for="pokemonGen1 in Object.keys(evoChain)" :key="pokemonGen1">{{ pokemonGen1 }}</span>
			</b-row>
		</b-container>
	</b-modal>
</template>

<script>
	export default {
		data() {
			return {
				variants: [
					"primary",
					"danger",
					"warning",
					"info",
					"success",
					"secondary"
				]
			};
		},
		computed: {
			pokemon() {
				return this.$store.state.selectedPokemon;
			},
			evoChain() {
				return this.$store.state.selectedEvolutionChain;
			}
		},
		methods: {
			getLongID(number) {
				const zeros = "0".repeat(3 - String(number).length);
				return zeros + number;
			},
			capitalize(text) {
				const wordArray = text.split("-");
				const capitalizedWords = wordArray.map(
					word => word.substring(0, 1).toUpperCase() + word.substring(1)
				);
				return capitalizedWords.join(" ");
			}
		},
		mounted() {
			this.$refs["detail-modal"].show();
		}
	};
</script>