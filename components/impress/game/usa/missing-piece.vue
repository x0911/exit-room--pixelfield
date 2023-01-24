<template>
  <div>
    <div class="items-container">
      <v-img
        :src="require('~/assets/images/games/usa/missing-piece.png')"
        height="100vh"
        width="100vw"
      />
      <template v-for="(item, index) in items">
        <div
          :key="index"
          :class="{
            'item--up': getIsWrongItemClicked(item),
            [`item-${item.name}`]: true,
            [`item-${item.name}--up`]: item.isOpened,
          }"
          class="item"
          @click="selectItemHandler(item)"
        >
          <img
            :draggable="false"
            :src="
              require(`@/assets/images/games/china/items/${item.name}_front.png`)
            "
          />
          <div
            v-if="item.hiddenElement && item.isOpened"
            :class="`item item-${item.hiddenElement.name}`"
            @click.stop="selectHiddenItemHandler(item.hiddenElement)"
          >
            <img
              :draggable="false"
              :src="
                require(`@/assets/images/games/china/items/${item.hiddenElement.name}_front.png`)
              "
            />
          </div>
          <v-dialog
            v-if="getIsWrongItemClicked(item)"
            :retain-focus="false"
            :value="item.modal"
            class="elevation-0"
            content-class="elevation-0"
            max-width="600"
            overlay-opacity="0"
            persistent
            scrollable
          >
            <v-card class="rounded-lg pa-4 mx-auto" flat light tile>
              <v-card-text class="d-flex flex-column align-center">
                <v-img
                  :src="
                    require(`@/assets/images/games/china/items/${item.name}_front.png`)
                  "
                  height="10rem"
                  width="10rem"
                ></v-img>
                <div class="text-body-1 font-weight-bold mt-4">
                  {{ $t(`found-object.wrong-item.${wrongItemLabelIdx}`) }}
                </div>
              </v-card-text>
              <v-card-actions class="px-6 pb-4 d-flex justify-end">
                <v-btn
                  class="px-4"
                  color="primary"
                  depressed
                  large
                  tile
                  @click.stop="closeItemModalHandler(item)"
                >
                  {{ $t('next') }}
                  <v-icon class="ms-2"
                    >mdi-keyboard-backspace mdi-rotate-180
                  </v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </template>
    </div>
    <component :is="selectedModal.component" v-model="selectedModal.modal" />
  </div>
</template>

<script>
import MissingPrivacyNotice from '~/components/impress/game/shared/missing-privacy-notice';

export default {
  name: 'MissingPiece',
  components: { MissingPrivacyNotice },
  data() {
    return {
      selectedModal: {},
      wrongItemLabelIdx: 1,
      items: [
        {
          name: 'alarm',
          isOpened: false,
          modal: true,
        },
        {
          name: 'boat',
          isOpened: false,
          modal: true,
        },
        {
          name: 'book',
          isOpened: false,
          modal: true,
        },
        {
          name: 'candle',
          isOpened: false,
          modal: true,
        },
        {
          name: 'charger',
          isOpened: false,
          modal: true,
        },
        {
          name: 'cup',
          isOpened: false,
          modal: true,
        },
        {
          name: 'key',
          isOpened: false,
          modal: true,
        },
        {
          name: 'pillow',
          isOpened: false,
          modal: true,
        },
        {
          name: 'carpet',
          isOpened: false,
          hiddenElement: {
            name: 'privacy-part-2',
            component: 'missing-privacy-notice',
            modal: true,
          },
        },
      ],
      wrongItems: [],
    };
  },
  watch: {
    items: {
      deep: true,
      handler(items) {
        const isParentOfHiddenOpen = items
          .filter(({ hiddenElement }) => hiddenElement)
          .every(({ isOpened }) => isOpened);

        if (isParentOfHiddenOpen) {
          this.$store.commit('SET_HINT', this.$t('usa.hints.missing-piece.2'));
        }
      },
    },
    wrongItems: {
      deep: true,
      handler() {
        if (this.wrongItems.length > 2) {
          this.wrongItemLabelIdx = 2;
        }
      },
    },
    selectedModal: {
      deep: true,
      handler({ modal }) {
        if (modal) return;
        this.$store.commit('SET_HINT', []);
        this.$emit('next');
      },
    },
  },
  methods: {
    selectItemHandler(item) {
      item.isOpened = true;
      item.modal = true;
    },
    selectHiddenItemHandler({ component, modal }) {
      this.selectedModal = { component, modal };
    },
    getIsWrongItemClicked(item) {
      return item.isOpened && !item.hiddenElement && !item.component;
    },
    closeItemModalHandler(item) {
      item.modal = false;
      const isAdded = this.wrongItems.some(
        (wrongItem) => wrongItem.name === item.name
      );
      if (!isAdded) {
        this.wrongItems.push(item);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/components/missing-piece.scss';
</style>
