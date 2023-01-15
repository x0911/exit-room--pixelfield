<template>
  <v-card flat tile light class="pa-6">
    <v-card-title class="subtitle-1">
      {{ $t('countries_scores') }}</v-card-title
    >
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="5"
        class="elevation-0"
        :disable-pagination="true"
      >
      </v-data-table>
      <div class="d-flex justify-center">
        <v-btn
          color="primary"
          class="px-4 mt-4"
          tile
          large
          @click="$emit('next')"
        >
          {{ $t('next') }}
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'CountriesScores',
  data() {
    return {
      headers: [
        { text: this.$t('country'), value: 'country', sortable: false },
        { text: this.$t('score'), value: 'score', sortable: false },
      ],
      items: [
        { country: 'England', score: 99 },
        { country: 'France', score: 98 },
        { country: 'China', score: 92 },
        { country: 'USA', score: 91 },
        { country: 'Germany', score: 90 },
      ],
    };
  },
  mounted() {
    this.$store.commit('SET_INSTRUCTIONS', {
      bottomModel: true,
      title: this.$t('franklin'),
      steps: ['brazil.welcome-to-game-room'],
      nextText: this.$t('start'),
      image: 'avatars/franklin.jpg',
      overlay: true,
    });
  },
};
</script>
<style scoped></style>
