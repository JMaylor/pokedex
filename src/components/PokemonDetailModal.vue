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
					<!-- <div>
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
					</div>-->
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
			<hr />
			<b-row class="justify-content-center">
				<h4>Evolution Chain</h4>
			</b-row>
			<b-row class="justify-content-center text-center">
				<b-img
					v-if="evoChain"
					:src="`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${getPokemonID(Object.keys(evoChain)[0])}.png`"
				></b-img>
			</b-row>
			<b-row class="justify-content-center">
				<b-icon icon="arrow-down" scale="3"></b-icon>
			</b-row>
			<b-row class="justify-content-center text-center">
				<b-col
					cols="auto"
					v-for="pokemonGen2 in Object.keys(evoChain[Object.keys(evoChain)[0]])"
					:key="pokemonGen2"
				>
					<b-img
						class="mx-auto"
						:src="`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${getPokemonID(pokemonGen2)}.png`"
					></b-img>
					<br />
					<div v-for="pokemonGen3 in evoChain[Object.keys(evoChain)[0]][pokemonGen2]" :key="pokemonGen3">
						<b-icon icon="arrow-down" scale="3"></b-icon>
						<br />
						<b-img
							:src="`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${getPokemonID(pokemonGen3)}.png`"
						></b-img>
					</div>
				</b-col>
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
			},
			getPokemonID(pokemonName) {
				return this.getLongID(
					this.$store.state.fullPokemonList.find(
						x => x.name == pokemonName
					).id
				);
			}
		},
		mounted() {
			this.$refs["detail-modal"].show();
		}
	};
</script>