<template>
  <v-img class="outer" :src="require('~/assets/images/games/usa/phone.png')">
    <v-img :src="require('~/assets/images/games/usa/phone-background.png')" />
    <div v-if="step === 1">
      <div class="content d-flex flex-wrap align-center">
        <div
          v-for="index in 8"
          :key="index"
          class="app-container d-flex justify-center align-center"
        >
          <v-icon v-if="index === 2" x-large class="icon" @click="step++"
            >mdi-web</v-icon
          >
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
          <v-icon x-large style="border-left: 2px solid white" class="pa-1"
            >mdi-magnify</v-icon
          >
        </div>
        <v-checkbox
          v-for="(option, index) in options"
          :key="index"
          v-model="option.value"
          :error="hasErrors"
          style="border: 1px solid white"
          class="rounded-lg pl-3"
          color="white"
          :value="option.value"
          hide-details
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
            style="border-color: #330000 !important"
            color="primary"
            class="px-4"
            large
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
  },
  methods: {
    nextHandler() {
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
