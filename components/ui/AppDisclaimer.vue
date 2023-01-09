<template>
  <div>
    <v-dialog
      v-model="model"
      :persistent="!disclaimerIsSeen"
      max-width="650"
      scrollable
      :retain-focus="false"
    >
      <v-card class="info-screen px-2 pb-2" light tile flat>
        <v-card-text class="pt-4">
          <div class="d-flex justify-center mb-5">
            <v-avatar rounded="lg" size="150">
              <v-img
                :src="require(`@/assets/images/games/russia/maria.jpg`)"
              ></v-img>
            </v-avatar>
          </div>
          <template v-for="(line, i) in lines">
            <v-divider
              v-if="line === 'v-divider'"
              :key="`divider-${i}`"
              class="mt-3 mb-4"
            ></v-divider>
            <div v-else :key="i" class="mb-1" :inner-html.prop="line"></div>
          </template>
        </v-card-text>
        <v-card-actions class="px-6">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            large
            class="px-7"
            tile
            depressed
            href="https://forms.office.com/Pages/ResponsePage.aspx?id=dGla839g1EeC1_8x19xTpS_Oi7nhLDNDjMLqfSr7BWVURFJBVkMxR0ZNNUpCTEQwUUE4T0VHTTRKQi4u"
            target="_blank"
            @click="proceed()"
          >
            {{ $t('next') }}
            <v-icon class="ms-3">mdi-keyboard-backspace mdi-rotate-180</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import SoundPlayer from '@/mixins/sound-player.js';
export default {
  mixins: [SoundPlayer],
  data: () => ({
    title: '',
    perc: '0',
    cheaperPerc: 0,
    gameIsDone: false,
    disclaimerIsSeen: false,
  }),
  computed: {
    lines() {
      const lines = this.$tr('outro.successText', 'array');
      const newLines = [];
      const score = this.perc;
      lines.forEach((line) => {
        const newLine = line.replace('{score}', `${score}%`);
        newLines.push(newLine);
      });
      return newLines;
    },
    model: {
      get() {
        return this.$store.getters.disclaimerModel;
      },
      set(v) {
        this.$store.commit('SET_DISCLAIMER_MODEL', v);
      },
    },
  },
  watch: {
    gameIsDone(v) {
      this.$store.commit('SET_GAME_IS_DONE', v);
    },
    model() {
      this.getParams();
    },
  },
  mounted() {
    this.getParams();
  },
  methods: {
    proceed() {
      this.playGameSound('big-button-press-1');
      this.$set(this, 'model', false);
      localStorage.setItem('novartis-dp-disclaimer-seen', 'true');
    },
    getParams() {
      const rooms = this.$store.getters.rooms;
      const length = rooms.length;
      const max = length * 100;
      let total = 0;
      let totalDone = 0;
      for (let i = 0; i < length; i++) {
        const room = rooms[i];
        const perc = localStorage.getItem(`room_${room}`) || '0';
        const intPerc = parseInt(perc);
        if (intPerc >= 50) {
          totalDone++;
        }
        total += intPerc;
      }
      const gameIsDone = total >= 70 && totalDone === length;
      const perc = (total / max) * 100;
      let cheaperPerc = 0;
      let title = 'none';
      if (perc >= 50) {
        cheaperPerc = 10;
        title = 'magician';
      }
      if (perc >= 75) {
        cheaperPerc = 25;
        title = 'guru';
      }
      const disclaimerIsSeen =
        localStorage.getItem('novartis-dp-disclaimer-seen') === 'true';
      this.$set(this, 'perc', perc.toFixed());
      this.$set(this, 'cheaperPerc', cheaperPerc);
      this.$set(this, 'title', title);
      this.$set(this, 'gameIsDone', gameIsDone);
      this.$set(this, 'disclaimerIsSeen', disclaimerIsSeen);
    },
  },
};
</script>
