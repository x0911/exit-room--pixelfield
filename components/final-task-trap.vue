<template>
  <v-dialog
    v-model="model"
    persistent
    scrollable
    max-width="460"
    class="elevation-0"
    content-class="elevation-0"
    :retain-focus="false"
  >
    <v-card class="transparent" tile flat>
      <v-card-text class="px-0 py-2 info-screen v-card darken border-3">
        <v-card class="transparent" tile flat>
          <v-slide-y-transition group hide-on-leave>
            <div v-if="step === 1" key="step-1">
              <v-card-title>{{ $t('congratulations') }}</v-card-title>
              <v-card-subtitle class="mt-2">
                {{ $t('final-task-trap.title') }}
              </v-card-subtitle>
              <div class="g__fake_offer px-4">
                {{ $t('final-task-trap.offer') }}
              </div>
              <v-card-text>
                {{ $t('final-task-trap.cta') }}
                <div class="mt-4 text-white text-decoration-underline">
                  http://www.darkweb.com/downloadapp
                </div>
              </v-card-text>
            </div>
            <div v-if="step === 2" key="step-2">
              <v-card-title>
                {{ $t('final-task-trap.wrong_decision') }}
              </v-card-title>
              <v-card-text>
                {{ $t('final-task-trap.trapped') }}
              </v-card-text>
            </div>
            <div v-if="step === 3" key="step-3">
              <v-card-title>
                {{ $t('final-task-trap.right_decision') }}
              </v-card-title>
              <v-card-text>
                {{ $t('final-task-trap.not-trapped') }}
              </v-card-text>
            </div>
          </v-slide-y-transition>
        </v-card>
      </v-card-text>
      <v-card-actions class="mt-4 px-0 pb-4">
        <v-spacer></v-spacer>
        <template v-if="step === 1">
          <v-btn
            color="white"
            class="px-4"
            tile
            large
            light
            depressed
            @click="noThanks()"
          >
            {{ $t('final-task-trap.no-thanks') }}
          </v-btn>
          <v-btn
            color="error"
            class="px-4"
            tile
            large
            depressed
            @click="goToLink()"
          >
            <v-icon class="me-2">mdi-download</v-icon>
            <span class="text-decoration-underline">
              {{ $t('final-task-trap.download-app') }}
            </span>
          </v-btn>
        </template>
        <v-btn
          v-else
          color="primary"
          class="px-4"
          tile
          large
          depressed
          @click="backToGame()"
        >
          {{ $t('continue') }}
          <v-icon class="ms-2">mdi-keyboard-backspace mdi-rotate-180</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    model: false,
    step: 1,
    rooms: [
      {
        country: 'italy',
        progress: 0,
        done: false,
      },
      {
        country: 'egypt',
        progress: 0,
        done: false,
      },
      {
        country: 'china',
        progress: 0,
        done: false,
      },
      {
        country: 'brazil',
        progress: 0,
        done: false,
      },
      {
        country: 'usa',
        progress: 0,
        done: false,
      },
      {
        country: 'russia',
        progress: 0,
        done: false,
      },
      {
        country: 'india',
        progress: 0,
        done: false,
      },
    ],
  }),
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const showDialog =
        localStorage.getItem('privacy-cruise-final-task-trap') || 'false';
      if (showDialog === 'false') {
        this.$set(this, 'step', 1);
        this.$set(this, 'model', true);
      }
    },
    goToLink() {
      this.$set(this, 'step', 2);
    },
    noThanks() {
      this.$set(this, 'step', 3);
    },
    backToGame() {
      this.$set(this, 'model', false);
      localStorage.setItem('privacy-cruise-final-task-trap', 'true');
    },
  },
};
</script>
