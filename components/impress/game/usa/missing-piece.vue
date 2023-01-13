<template>
  <div>
    <div class="items-container">
      <v-img
        width="100vw"
        height="100vh"
        :src="require('~/assets/images/games/usa/missing-piece.png')"
      />
      <template v-for="(item, index) in items">
        <div
          :key="index"
          class="item"
          :class="{
            'item--up': getIsWrongItemClicked(item),
            [`item-${item.name}`]: true,
            [`item-${item.name}--up`]: item.isOpened,
          }"
          @click="selectItemHandler(item)"
        >
          <img
            :src="
              require(`@/assets/images/games/china/items/${item.name}_front.png`)
            "
            :draggable="false"
          />

          <v-dialog
            v-if="getIsWrongItemClicked(item)"
            :value="item.modal"
            overlay-opacity="0"
            persistent
            class="elevation-0"
            content-class="elevation-0"
            :retain-focus="false"
            scrollable
            max-width="600"
          >
            <v-card light tile flat class="rounded-lg pa-4 mx-auto">
              <v-card-text class="d-flex flex-column align-center">
                <v-img
                  width="10rem"
                  height="10rem"
                  :src="
                    require(`@/assets/images/games/china/items/${item.name}_front.png`)
                  "
                ></v-img>
                <div class="text-body-1 font-weight-bold mt-4">
                  {{ $t(`found-object.wrong-item`) }}
                </div>
              </v-card-text>
              <v-card-actions class="px-6 pb-4 d-flex justify-end">
                <v-btn
                  color="primary"
                  class="px-4"
                  tile
                  large
                  depressed
                  @click="item.modal = false"
                >
                  {{ $t('next') }}
                  <v-icon class="ms-2"
                    >mdi-keyboard-backspace mdi-rotate-180</v-icon
                  >
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <div
            v-if="item.hiddenElement?.canFind && item.isOpened"
            :class="`item item-${item.hiddenElement.name}`"
            @click.stop="selectHiddenItemHandler(item.hiddenElement)"
          >
            <img
              :src="
                require(`@/assets/images/games/china/items/${item.hiddenElement.name}_front.png`)
              "
              :draggable="false"
            />
          </div>
        </div>
      </template>
    </div>
    <component :is="selectedModal.component" v-model="selectedModal.modal" />
  </div>
</template>

<script>
import PrivacyNotice from '~/components/impress/game/shared/privacy-notice';
import MissingPrivacyNotice from '~/components/impress/game/shared/missing-privacy-notice';

export default {
  name: 'MissingPiece',
  components: { PrivacyNotice, MissingPrivacyNotice },
  data() {
    return {
      selectedModal: {},
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
          name: 'privacy_notice',
          isOpened: false,
          component: 'privacy-notice',
          modal: true,
        },
        {
          name: 'carpet',
          isOpened: false,
          hiddenElement: {
            name: 'privacy-part-2',
            component: 'missing-privacy-notice',
            modal: true,
            canFind: false,
          },
        },
      ],
      foundItems: [],
    };
  },
  watch: {
    foundItems: {
      deep: true,
      handler(foundItems) {
        if (foundItems?.length === 2) {
          const isAllClosed = foundItems.every((item) => !item.modal);
          if (isAllClosed) {
            this.$store.commit('SET_INSTRUCTIONS', {
              bottomModel: true,
              title: this.$t('franklin'),
              steps: ['found-object.privacy-found-part-2'],
              image: 'avatars/franklin.jpg',
              nextText: this.$t('next'),
              nextMethod: () => this.$emit('next'),
            });
          }
        }
      },
    },
  },
  methods: {
    selectItemHandler(item) {
      item.isOpened = item.hiddenElement ? this.foundItems.length : true;
      item.modal = true;
      const { component, modal } = item;
      if (component) {
        this.selectedModal = { component, modal };
        this.validateFirstPrivacyNotice();
        const isAdded = this.foundItems.some(
          (foundItem) => foundItem.component === component
        );
        if (!isAdded) {
          this.foundItems.push(this.selectedModal);
        }
      }
    },
    selectHiddenItemHandler({ component, modal }) {
      this.selectedModal = { component, modal };
      this.foundItems.push(this.selectedModal);
    },
    getIsWrongItemClicked(item) {
      return item.isOpened && !item.hiddenElement && !item.component;
    },
    validateFirstPrivacyNotice() {
      if (this.foundItems.length) return;

      this.$store.commit('SET_INSTRUCTIONS', {
        bottomModel: true,
        title: this.$t('franklin'),
        steps: ['found-object.privacy-found-part-1'],
        nextText: this.$t('next'),
        image: 'avatars/franklin.jpg',
      });

      this.items.forEach((item) => {
        if (item.hiddenElement) {
          item.hiddenElement.canFind = true;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/components/missing-piece.scss';
</style>
