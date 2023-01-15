<template>
  <v-card light tile flat class="px-8 pt-4 pb-0">
    <v-card-title
      class="px-0 subtitle-1"
      :inner-html.prop="$t('brazil.mini_game.ranking', { ranking: 2 })"
    />
    <v-card-text class="px-0">
      {{ $t('brazil.mini_game.ranking-2') }}
    </v-card-text>
    <v-card-text class="px-0">
      <template v-if="false">
        <div class="subtitle-2 text--darken-4 font-weight-bold mb-3">
          {{ $t('brazil.mini_game.statistics') }}
        </div>
        <v-data-table
          :headers="headers"
          :items="items"
          :items-per-page="5"
          class="elevation-0"
        ></v-data-table>
      </template>
      <v-card class="pa-0" flat>
        <v-card-title
          class="px-0 pb-0 mb-3 subtitle-1"
          v-text="$t('brazil.questions.4.label')"
        />
        <v-checkbox
          v-for="(option, oIdx) in $t('brazil.questions.4.options')"
          :key="oIdx"
          color="primary"
          class="ma-0 mb-2 caption"
          hide-details
          :label="option"
          :value="oIdx"
          :error="hasErrors"
          v-model="questionModel"
        />
        <div class="d-flex justify-center pt-8">
          <v-btn
            color="primary"
            class="px-4"
            tile
            large
            depressed
            @click="finish"
          >
            {{ $t('submit') }}
          </v-btn>
        </div>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'RankingCard',
  data() {
    return {
      questionModel: [],
      hasErrors: false,
      items: [
        {
          name: 'Carla Smith',
          score: 100,
          address: 'Prague, Czech',
          cabin_number: 10,
          age: 32,
          nationality: 'English',
        },
        {
          name: 'Yuri Salazar',
          score: 99,
          address: 'London, England',
          cabin_number: 23,
          age: 45,
          nationality: 'English',
        },
        {
          name: 'Yael Cooper',
          score: 97,
          address: 'Paris, France',
          cabin_number: 2,
          age: 27,
          nationality: 'English',
        },
      ],
    };
  },
  computed: {
    headers() {
      return Object.keys(this.items[0]).map((header) => ({
        text: this.$t(header),
        value: header,
        sortable: false,
        align: 'center',
      }));
    },
  },
  watch: {
    questionModel: {
      deep: true,
      handler() {
        this.hasErrors = false;
      },
    },
  },
  methods: {
    finish() {
      const passed =
        !this.questionModel.includes(2) && this.questionModel.length === 2;
      if (!passed) {
        this.hasErrors = true;
      } else {
        this.$emit('finish');
      }
    },
  },
};
</script>

<style scoped></style>
