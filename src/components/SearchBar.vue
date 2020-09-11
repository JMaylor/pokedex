<template>
	<!-- <div class="search-banner py-4">
	<b-container>-->
	<b-jumbotron fluid bg-variant="dark" class="mb-0 py-1">
		<b-row>
			<b-col cols="12" lg="6" class="text-left mb-3">
				<label class="text-white mb-0">Name or Number</label>
				<b-form @submit.prevent="search">
					<b-input-group class="mt-3">
						<b-form-input v-model="query"></b-form-input>
						<b-input-group-append>
							<b-button variant="info" @click="search">
								<b-icon icon="search"></b-icon>
							</b-button>
						</b-input-group-append>
					</b-input-group>
				</b-form>
			</b-col>
			<b-col cols="12" lg="6" class="text-left mb-2">
				<b-card
					bg-variant="success"
					text-variant="white"
					class="text-left"
				>Search for a Pokémon by name or using its National Pokédex number.</b-card>
			</b-col>
		</b-row>
		<b-row>
			<b-col cols="12" lg="6"></b-col>
			<b-col cols="12" lg="6" class="mb-2 d-flex justify-content-around">
				<b-button variant="info" @click="viewAll">View All</b-button>
				<b-button variant="warning" @click="viewFavourites">View Favourites</b-button>
			</b-col>
		</b-row>
	</b-jumbotron>
	<!-- </b-container>
	</div>-->
</template>

<script>
	export default {
		props: {},
		data() {
			return {
				query: ""
			};
		},
		methods: {
			search() {
				console.log("searching");
				this.$store.dispatch("newSearch", this.query);
			},
			viewAll() {
				this.query = "";
				this.search();
			},
			viewFavourites() {
				this.$store.commit("resetSearchResults");
				this.$store.dispatch("favouriteSearch");
			}
		}
	};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.card-body {
		font-family: "Ubuntu-Medium", sans-serif;
		font-size: 125%;
	}

	.search-banner {
		background-color: rgb(47, 47, 47);
	}

	label {
		font-size: 175%;
	}
</style>
