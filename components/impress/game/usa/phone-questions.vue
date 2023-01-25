<template>
  <v-img :src="require('~/assets/images/games/usa/phone.png')" class="outer">
    <v-img :src="require('~/assets/images/games/usa/phone-background.png')" />
    <div v-if="step === 1">
      <div class="content d-flex flex-wrap align-center">
        <div
          v-for="index in 8"
          :key="index"
          class="app-container d-flex justify-center align-center"
        >
          <v-icon v-if="index === 2" class="icon" x-large @click="step++"
            >mdi-web
          </v-icon>
        </div>
      </div>
      <v-row class="toggle-container d-flex justify-center">
        <div v-for="i in 4" :key="i">
          <v-icon small>mdi-checkbox-blank-circle</v-icon>
        </div>
      </v-row>
    </div>
    <div v-else>
      <div class="form-content d-flex flex-column align-center">
        <div class="app-content-form d-flex justify-center align-center">
          <v-spacer></v-spacer>
          <v-icon class="pa-1" style="border-left: 2px solid white" x-large
            >mdi-magnify
          </v-icon>
        </div>
        <v-checkbox
          v-for="(option, index) in options"
          :key="index"
          v-model="option.value"
          :error="hasErrors"
          :value="option.value"
          class="rounded-lg pl-3"
          color="white"
          hide-details
          style="border: 1px solid white"
        >
          <template #label>
            <div>
              <div class="white--text font-weight-bold pb-2">
                {{ option.title }}
              </div>
              <div class="white--text text-body-2">
                {{ option.description }}
              </div>
            </div>
          </template>
        </v-checkbox>
        <div class="mt-8 d-flex gap-8 justify-center">
          <v-btn class="px-4" large @click="step--">
            {{ $t('previous') }}
          </v-btn>
          <v-btn
            class="px-4"
            color="primary"
            large
            style="border-color: #330000 !important"
            @click.native="nextHandler"
          >
            {{ $t('next') }}
          </v-btn>
        </div>
      </div>
    </div>
  </v-img>
</template>

<script>
export default {
  name: 'PhoneQuestions',
  data() {
    return {
      step: 1,
      options: this.$t('usa.questions.3.options').map((option) => ({
        ...option,
        value: false,
      })),
      correctOptions: this.$t('usa.questions.3.correctOptions'),
      hasErrors: false,
    };
  },
  computed: {
    isFormValidated() {
      return this.options.every(({ value }, index) =>
        this.correctOptions.includes(index) ? value : !value
      );
    },
  },
  watch: {
    options: {
      deep: true,
      handler() {
        this.hasErrors = false;
      },
    },
    step: {
      immediate: true,
      handler(step) {
        if (step === 1) {
          this.$store.commit('SET_HINT', [
            this.$t('usa.hints.phone-questions'),
          ]);
        } else {
          this.$store.commit('SET_INSTRUCTIONS', {
            bottomModel: true,
            title: this.$t('franklin'),
            steps: ['usa.instructions.phone-questions'],
            image: 'avatars/franklin.jpg',
          });
          this.$store.commit('SET_HINT', []);
        }
      },
    },
  },
  methods: {
    nextHandler() {
      this.playGameSound('big-button-press-1');
      if (!this.isFormValidated) {
        this.hasErrors = true;
      } else {
        this.$emit('next');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/phone-questions.scss';
</style>
