<template>
  <v-card
    class="px-8 pt-4 pb-8"
    flat
    light
    max-height="90vh"
    style="overflow-y: scroll"
  >
    <v-card-title
      :inner-html.prop="$t('brazil.mini_game.ranking')"
      class="px-0 subtitle-1"
    />
    <v-card-text class="px-0">
      <v-card class="pa-2 my-0 mx-auto" light style="border: 1px solid black">
        <div style="border: 6px solid black">
          <v-col
            class="white--text text-center text-h5 py-6 mb-2"
            style="background-color: #080b6cff"
          >Top Scores {{ players.id }}
          </v-col>
          <v-row v-for="(player, pIdx) in players" :key="pIdx" class="pt-2">
            <v-col class="pl-12 pr-8" cols="3">
              <img
                :src="require(`@/assets/images/avatars/player-${pIdx + 1}.jpg`)"
                width="80"
              />
            </v-col>
            <v-col cols="9"
            >Passport number: {{ player.passport }}<br/>
              Voyage date: {{ player.voyageDate }} <br/>
              Cabin: {{ player.cabin }}
            </v-col>
          </v-row>
        </div>
        <scoreboard-survey @finish="$emit('next')"/>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script>
import moment from "moment";
import ScoreboardSurvey from '~/components/impress/game/brazil/scoreboard-survey.vue';

export default {
  name: 'RankingCard',
  components: {ScoreboardSurvey},
  data() {
    return {
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
          voyageDate: moment().format('MMMM YYYY'),
          cabin: 42,
        },
        {
          passport: 'A02836295',
          voyageDate: 'May 2019',
          cabin: 71,
        },
        {
          passport: 'H95486012',
          voyageDate: 'September 2013',
          cabin: 106,
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
};
</script>

<style scoped></style>
