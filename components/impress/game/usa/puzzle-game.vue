<template>
  <v-card light tile flat class="pa-10 px-auto">
    <div v-if="showCode" class="code"></div>
    <v-row>
      <div class="text-body-1 mb-2 font-weight-bold">
        {{ $t('usa.complete_puzzle') }}
      </div>
    </v-row>
    <v-row>
      <v-col class="d-flex align-center justify-start pl-0" cols="6">
        <div class="puzzle-images">
          <div
            v-for="(image, index) in correctImages"
            :key="image.id"
            :style="{
              ...getCommonStyles(image, index),
              ...image.styles,
            }"
            @dragenter="dragEnterHandler(image)"
            @dragleave="dragLeaveHandler(image)"
            @drop.prevent="dropPuzzleItem($event, image)"
            @dragover.prevent
          >
            <img v-if="image.src" :src="image.src" width="100%" height="100%" />
          </div>
        </div>
      </v-col>
      <v-col cols="6">
        <div class="puzzle-items">
          <div
            v-for="image in randomImages"
            :key="image.id"
            draggable="true"
            @dragstart="dragPuzzleItem($event, image)"
          >
            <img width="72px" height="72px" role="button" :src="image.src" />
          </div>
        </div>
      </v-col>
      <v-row
        v-if="isPuzzleValid"
        style="max-width: calc(100% - 20px)"
        class="mt-0"
      >
        <v-col class="d-flex align-center mb-2" cols="3">
          <div class="text-body-2 font-weight-bold">Enter the code:</div>
        </v-col>
        <v-col class="d-flex align-center pr-0" cols="3">
          <v-otp-input v-model="code" length="3" type="number"></v-otp-input>
        </v-col>
      </v-row>
      <v-col cols="12" class="d-flex justify-center">
        <v-btn
          color="primary"
          class="px-6 mt-4 ml-16 mr-8"
          tile
          large
          outlined
          @click="restartPuzzleHandler"
        >
          {{ $t('restart') }}
        </v-btn>
        <v-btn
          color="primary"
          class="px-6 mt-4"
          tile
          large
          :disabled="!isCodeValid"
          @click="validatePuzzleHandler"
        >
          {{ $t('next') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import SoundPlayer from '~/mixins/sound-player';

const IMAGES = [
  {
    id: 1,
    src: require(`~/assets/images/games/usa/puzzle/1.png`),
    styles: {
      width: '124px',
      height: '93px',
    },
  },
  {
    id: 2,
    src: require(`~/assets/images/games/usa/puzzle/2.png`),
    styles: {
      width: '98px',
      height: '124px',
      left: '85px',
    },
  },
  {
    id: 3,
    src: require(`~/assets/images/games/usa/puzzle/3.png`),
    styles: {
      width: '160px',
      height: '94px',
      left: '145px',
    },
  },
  {
    id: 4,
    src: require(`~/assets/images/games/usa/puzzle/4.png`),
    styles: {
      height: '126px',
      left: '267px',
    },
  },
  {
    id: 5,
    src: require(`~/assets/images/games/usa/puzzle/5.png`),
    styles: {
      height: '165px',
      width: '93px',
      top: '53px',
    },
  },
  {
    id: 6,
    src: require(`~/assets/images/games/usa/puzzle/6.png`),
    styles: {
      left: '56px',
      top: '86px',
      height: '99px',
      width: '158px',
    },
  },
  {
    id: 7,
    src: require(`~/assets/images/games/usa/puzzle/7.png`),
    styles: {
      left: '177px',
      top: '56px',
      height: '162px',
      width: '98px',
    },
  },
  {
    id: 8,
    src: require(`~/assets/images/games/usa/puzzle/8.png`),
    styles: {
      left: '235px',
      top: '86px',
      height: '99px',
      width: '124px',
    },
  },
  {
    id: 9,
    src: require(`~/assets/images/games/usa/puzzle/9.png`),
    styles: {
      top: '179px',
      height: '94px',
      width: '126px',
    },
  },
  {
    id: 10,
    src: require(`~/assets/images/games/usa/puzzle/10.png`),
    styles: {
      left: '88px',
      top: '147px',
      height: '158px',
      width: '96px',
    },
  },
  {
    id: 11,
    src: require(`~/assets/images/games/usa/puzzle/11.png`),
    styles: {
      left: '146px',
      top: '179px',
      height: '94px',
      width: '158px',
    },
  },
  {
    id: 12,
    src: require(`~/assets/images/games/usa/puzzle/12.png`),
    styles: {
      left: '265px',
      top: '145px',
      height: '161px',
      width: '96px',
    },
  },
  {
    id: 13,
    src: require(`~/assets/images/games/usa/puzzle/13.png`),
    styles: {
      top: '235px',
      height: '125px',
      width: '94px',
    },
  },
  {
    id: 14,
    src: require(`~/assets/images/games/usa/puzzle/14.png`),
    styles: {
      left: '56px',
      top: '266px',
      height: '95px',
      width: '161px',
    },
  },
  {
    id: 15,
    src: require(`~/assets/images/games/usa/puzzle/15.png`),
    styles: {
      left: '179px',
      top: '234px',
      height: '127px',
      width: '93px',
    },
  },
  {
    id: 16,
    src: require(`~/assets/images/games/usa/puzzle/16.png`),
    styles: {
      left: '233px',
      top: '267px',
      height: '94px',
      width: '127px',
    },
  },
];

export default {
  name: 'PuzzleGame',
  mixins: [SoundPlayer],
  data() {
    return {
      images: IMAGES,
      randomImages: [],
      correctImages: [],
      code: null,
      showCode: false,
      showOtpCode: false,
      correctCode: '573',
    };
  },
  computed: {
    isPuzzleValid() {
      return this.correctImages.every(({ id, src }) => src?.includes(id));
    },
    isCodeValid() {
      return this.code === this.correctCode;
    },
  },
  watch: {
    isPuzzleValid(value) {
      if (value) {
        this.showCode = true;
      }
    },
  },
  created() {
    this.$store.commit('SET_INSTRUCTIONS', {
      model: true,
      title: this.$t('screens.usa.games.2.title'),
      steps: ['screens.usa.games.2.a1'],
    });
    this.restartPuzzleHandler();
  },
  methods: {
    dragPuzzleItem(event, image) {
      event.dataTransfer.setData('image', JSON.stringify(image));
    },
    dropPuzzleItem(event, dropImage) {
      this.dragLeaveHandler(dropImage);
      if (dropImage.src) return;
      const imageData = event.dataTransfer.getData('image');
      if (imageData) {
        const imageJson = JSON.parse(imageData);
        this.updateImageSrc(imageJson, dropImage);
      }
    },
    updateImageSrc(imageSource, imageDestination) {
      const rImageIdx = this.randomImages.findIndex(
        (rImage) => rImage.id === imageSource.id
      );
      this.randomImages.splice(rImageIdx, 1);
      imageDestination.src = require(`~/assets/images/games/usa/puzzle/${imageSource.id}.png`);
      imageDestination.styles =
        imageSource.id === imageDestination.id
          ? imageSource.styles
          : {
              width: '90px',
              height: '90px',
            };
      this.correctImages = [...this.correctImages];
    },
    getCommonStyles(image, index) {
      return {
        position: 'absolute',
        minHeight: '90px',
        minWidth: '90px',
        border: !image.src ? 'solid 1px' : 'none',
        borderCollapse: 'collapse',
        left: 90 * (index % 4) + 'px',
        top: 90 * parseInt(index / 4) + 'px',
        background: image?.background,
        zIndex: image.src ? 2 : 1,
      };
    },
    validatePuzzleHandler() {
      this.playGameSound('big-button-press-1');
      this.$store.commit('SET_SCORE_BOARD_DIALOG', {
        model: true,
        score: 100,
        game: 'usa',
        next: () => {
          this.$emit('next');
          window.impressAPI.goto('map');
        },
      });
    },
    restartPuzzleHandler() {
      this.showCode = false;
      this.correctImages = new Array(16)
        .fill(0)
        .map((_, idx) => ({ id: idx + 1 }));
      this.randomImages = [...this.images].sort(() =>
        Math.random() > 0.5 ? 1 : -1
      );
    },
    dragEnterHandler(image) {
      image.background = 'lightgrey';
      this.correctImages = [...this.correctImages];
    },
    dragLeaveHandler(image) {
      image.background = 'transparent';
      this.correctImages = [...this.correctImages];
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/puzzle-game.scss';
</style>
