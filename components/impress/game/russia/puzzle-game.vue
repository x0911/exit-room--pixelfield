<template>
  <v-card class="pa-10 px-auto" flat light tile>
    <div v-if="showCode" class="code"></div>
    <v-row>
      <div class="text-body-1 mb-2 font-weight-bold">
        {{ $t('russia.complete_puzzle') }}
      </div>
    </v-row>
    <v-row>
      <v-col class="d-flex align-center justify-start pl-0" cols="6">
        <v-img
          :src="
            require('~/assets/images/games/russia/puzzle/puzzle_template.png')
          "
          max-width="360"
        >
          <div class="puzzle-images">
            <div
              v-for="(image, index) in correctImages"
              :key="image.id"
              :style="{
                ...getCommonStyles(image, index),
                ...image.styles,
              }"
              draggable="true"
              @dragstart="dragReturnPuzzleItem($event, image)"
              @dragenter="dragEnterHandler(image)"
              @dragleave="dragLeaveHandler(image)"
              @drop.prevent="dropPuzzleItem($event, image)"
              @dragover.prevent
            >
              <img
                v-if="image.src"
                :src="image.src"
                height="100%"
                width="100%"
              />
            </div>
          </div>
        </v-img>
      </v-col>
      <v-col
        draggable="true"
        @drop.prevent="dropReturnPuzzleItem"
        @dragover.prevent
        cols="6"
      >
        <div class="puzzle-items">
          <div
            v-for="image in randomImages"
            :key="image.id"
            draggable="true"
            @dragstart="dragPuzzleItem($event, image)"
            @drop.prevent="dropPuzzleItem($event, image)"
            @dragover.prevent
          >
            <img :src="image.src" height="72px" role="button" width="72px" />
          </div>
        </div>
      </v-col>
      <v-row
        v-if="isPuzzleValid"
        class="mt-0"
        style="max-width: calc(100% - 20px)"
      >
        <v-col class="d-flex align-center mb-2" cols="3">
          <div class="text-body-2 font-weight-bold">
            {{ $t('enter-the-code') }}:
          </div>
        </v-col>
        <v-col class="d-flex align-center pr-0" cols="3">
          <v-otp-input v-model="code" length="3" type="number"></v-otp-input>
        </v-col>
      </v-row>
      <v-col class="d-flex justify-center" cols="12">
        <v-btn
          class="px-6 mt-4 ml-16 mr-8"
          color="primary"
          large
          outlined
          tile
          @click="restartPuzzleHandler"
        >
          {{ $t('restart') }}
        </v-btn>
        <v-btn
          :disabled="!isCodeValid"
          class="px-6 mt-4"
          color="primary"
          large
          tile
          @click="validatePuzzleHandler"
        >
          {{ $t('next') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
const IMAGES = [
  {
    id: 1,
    src: require(`~/assets/images/games/russia/puzzle/1.png`),
    styles: {
      width: '124px',
      height: '93px',
    },
  },
  {
    id: 2,
    src: require(`~/assets/images/games/russia/puzzle/2.png`),
    styles: {
      width: '98px',
      height: '124px',
      left: '85px',
    },
  },
  {
    id: 3,
    src: require(`~/assets/images/games/russia/puzzle/3.png`),
    styles: {
      width: '160px',
      height: '94px',
      left: '145px',
    },
  },
  {
    id: 4,
    src: require(`~/assets/images/games/russia/puzzle/4.png`),
    styles: {
      height: '126px',
      left: '267px',
    },
  },
  {
    id: 5,
    src: require(`~/assets/images/games/russia/puzzle/5.png`),
    styles: {
      height: '165px',
      width: '93px',
      top: '53px',
    },
  },
  {
    id: 6,
    src: require(`~/assets/images/games/russia/puzzle/6.png`),
    styles: {
      left: '56px',
      top: '86px',
      height: '99px',
      width: '158px',
    },
  },
  {
    id: 7,
    src: require(`~/assets/images/games/russia/puzzle/7.png`),
    styles: {
      left: '177px',
      top: '56px',
      height: '162px',
      width: '98px',
    },
  },
  {
    id: 8,
    src: require(`~/assets/images/games/russia/puzzle/8.png`),
    styles: {
      left: '235px',
      top: '86px',
      height: '99px',
      width: '124px',
    },
  },
  {
    id: 9,
    src: require(`~/assets/images/games/russia/puzzle/9.png`),
    styles: {
      top: '179px',
      height: '94px',
      width: '126px',
    },
  },
  {
    id: 10,
    src: require(`~/assets/images/games/russia/puzzle/10.png`),
    styles: {
      left: '88px',
      top: '147px',
      height: '158px',
      width: '96px',
    },
  },
  {
    id: 11,
    src: require(`~/assets/images/games/russia/puzzle/11.png`),
    styles: {
      left: '146px',
      top: '179px',
      height: '94px',
      width: '158px',
    },
  },
  {
    id: 12,
    src: require(`~/assets/images/games/russia/puzzle/12.png`),
    styles: {
      left: '265px',
      top: '145px',
      height: '161px',
      width: '96px',
    },
  },
  {
    id: 13,
    src: require(`~/assets/images/games/russia/puzzle/13.png`),
    styles: {
      top: '235px',
      height: '125px',
      width: '94px',
    },
  },
  {
    id: 14,
    src: require(`~/assets/images/games/russia/puzzle/14.png`),
    styles: {
      left: '56px',
      top: '266px',
      height: '95px',
      width: '161px',
    },
  },
  {
    id: 15,
    src: require(`~/assets/images/games/russia/puzzle/15.png`),
    styles: {
      left: '179px',
      top: '234px',
      height: '127px',
      width: '93px',
    },
  },
  {
    id: 16,
    src: require(`~/assets/images/games/russia/puzzle/16.png`),
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
    this.restartPuzzleHandler();
  },
  methods: {
    dragPuzzleItem(event, image) {
      event.dataTransfer.setData('image', JSON.stringify(image));
    },
    dragReturnPuzzleItem(event, image) {
      event.dataTransfer.setData('image-back', JSON.stringify(image));
    },
    dropPuzzleItem(event, dropImage) {
      this.dragLeaveHandler(dropImage);
      if (dropImage.src) return;
      const imageData = event.dataTransfer.getData('image');
      if (imageData) {
        const imageJson = JSON.parse(imageData);
        this.updatePuzzleImage(imageJson, dropImage);
      }
    },
    dropReturnPuzzleItem(event) {
      const imageData = event.dataTransfer.getData('image-back');
      if (imageData) {
        const { id, src } = JSON.parse(imageData);
        const image = this.correctImages.find((image) => image.id === id);
        const imageId = +src.split('/').pop().split('.png')[0];
        const { styles } = this.images.find((image) => image.id === imageId);
        this.randomImages.push({
          id: imageId,
          src: require(`~/assets/images/games/russia/puzzle/${imageId}.png`),
          styles,
        });
        delete image.src;
      }
      this.updateImages();
    },
    updatePuzzleImage(imageSource, imageDestination) {
      const rImageIdx = this.randomImages.findIndex(
        (rImage) => rImage.id === imageSource.id
      );
      this.randomImages.splice(rImageIdx, 1);
      imageDestination.src = require(`~/assets/images/games/russia/puzzle/${imageSource.id}.png`);
      imageDestination.styles =
        imageSource.id === imageDestination.id
          ? imageSource.styles
          : {
              width: '90px',
              height: '90px',
            };
      this.updateImages();
    },
    getCommonStyles(image, index) {
      return {
        position: 'absolute',
        minHeight: '90px',
        minWidth: '90px',
        borderCollapse: 'collapse',
        left: 90 * (index % 4) + 'px',
        top: 90 * parseInt(index / 4) + 'px',
        background: image?.background,
        zIndex: image.src ? 2 : 1,
      };
    },
    validatePuzzleHandler() {
      this.playGameSound('big-button-press-1');
      this.$emit('next');
    },
    restartPuzzleHandler() {
      this.playGameSound('big-button-press-1');
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
      this.updateImages();
    },
    dragLeaveHandler(image) {
      image.background = 'transparent';
      this.updateImages();
    },
    updateImages() {
      this.correctImages = [...this.correctImages];
      this.randomImages = [...this.randomImages];
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/puzzle-game.scss';
</style>
