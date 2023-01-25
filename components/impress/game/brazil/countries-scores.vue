<template>
  <v-card flat tile light class="pa-6">
    <v-card-title class="subtitle-1 text-h5">
      {{ $t('countries_scores') }}</v-card-title
    >
    <v-card-text>
      <v-divider></v-divider>
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="items"
        class="elevation-0"
        disable-pagination
        disable-filtering
        disable-sort
        hide-default-footer
      >
      </v-data-table>
      <v-divider></v-divider>
      <div class="d-flex justify-center pt-4">
        <v-btn
          color="primary"
          class="px-4 mt-4"
          tile
          large
          @click="
            playGameSound('big-button-press-1');
            $emit('next');
          "
        >
          {{ $t('next') }}
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { countries } from '@/assets/js/countries';
export default {
  name: 'CountriesScores',
  data() {
    return {
      headers: [
        { text: this.$t('country'), value: 'country' },
        { text: this.$t('score'), value: 'score' },
      ],
      items: [],
      loading: false,
    };
  },
  async mounted() {
    this.$store.commit('SET_INSTRUCTIONS', {
      bottomModel: true,
      title: this.$t('franklin'),
      steps: ['brazil.welcome-to-game-room'],
      nextText: this.$t('start'),
      image: 'avatars/franklin.jpg',
      overlay: true,
    });
    await this.getItems();
  },
  methods: {
    async getItems() {
      try {
        this.$set(this, 'loading', true);
        const response = await this.$store.dispatch('getGameRoomStats');
        if (response && response.length > 0) {
          const items = [];
          response.forEach((obj) => {
            const country = countries.find((c) => c.code === obj.country);
            if (country) {
              items.push({
                score: obj.score,
                iso: obj.country,
                country: `${country.name} (${obj.country})`,
              });
            }
          });
          this.$set(this, 'items', items);
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.$set(this, 'loading', false);
      }
    },
  },
};
</script>
<style scoped>
::v-deep table thead tr th {
  font-size: 0.875rem !important;
}
::v-deep table tbody tr td {
  font-size: 0.75rem !important;
}
</style>
