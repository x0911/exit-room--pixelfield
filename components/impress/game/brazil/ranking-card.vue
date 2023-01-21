<template>
  <v-card class="px-8 pt-4 pb-0" flat light tile>
    <v-card-title
      :inner-html.prop="$t('brazil.mini_game.ranking')"
      class="px-0 subtitle-1"
    />
    <v-card-text class="px-0">
      <v-card light class="pa-2 my-0 mx-auto" style="border: 1px solid black">
        <v-col
          style="background-color: #080b6cff"
          class="white--text text-center text-h5 py-6 mb-2"
          >Top Scores</v-col
        >
        <v-row v-for="(player, pIdx) in players" :key="pIdx" class="pt-2">
          <v-col cols="3" class="pl-12 pr-8">
            <img width="80px" src="@/assets/images/avatars/player.png" />
          </v-col>
          <v-col cols="9"
            >Passport number: {{ player.passport }}<br />
            Voyage date: {{ player.voyageDate }} <br />
            Cabin: {{ player.cabin }}
          </v-col>
        </v-row>
      </v-card>
    </v-card-text>
    <v-card-text class="px-0">
      <v-card class="pa-0" flat>
        <v-card-title
          class="px-0 pb-0 mb-3 subtitle-1"
          v-text="$t('brazil.questions.5.label')"
        />
        <v-checkbox
          v-for="(option, oIdx) in $t('brazil.questions.4.options')"
          :key="oIdx"
          v-model="questionModel"
          :error="hasErrors"
          :label="option"
          :value="oIdx"
          class="ma-0 mb-2 caption"
          color="primary"
          hide-details
        />
        <div class="d-flex justify-center pt-4">
          <v-btn
            class="px-4"
            color="primary"
            depressed
            large
            tile
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
          name: 'Dave Cooper',
          score: 97,
          address: 'Paris, France',
          cabin_number: 2,
          age: 27,
          nationality: 'English',
        },
      ],
      players: [
        {
          passport: 'Q29181948',
          voyageDate: '[***]',
          cabin: 42
        },
        {
          passport: 'A02836295',
          voyageDate: 'May 2019',
          cabin: 71
        },
        {
          passport: 'H95486012',
          voyageDate: 'September 2013',
          cabin: 106
        }
      ]
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
        this.$emit('next');
      }
    },
  },
};
</script>

<style scoped></style>
