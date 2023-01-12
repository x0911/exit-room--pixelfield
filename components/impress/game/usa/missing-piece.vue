<template>
  <div>
    <div class="items-container">
      <template v-for="(item, i) in rotatableItems">
        <div
          :key="i"
          class="item"
          :class="[`item-${item.name}`, `dir-${item.dir}`]"
          @click="rotateItem(i)"
        >
          <img
            :alt="`item-${item.name}-${item.dir}`"
            :src="
              require(`@/assets/images/games/china/items/${item.name}_${item.dir}.png`)
            "
            :draggable="false"
          />
        </div>
      </template>
    </div>
    <v-dialog
      v-if="foundObject.name === 'charger'"
      v-model="foundObject.model"
      overlay-opacity="0"
      persistent
      class="elevation-0"
      content-class="elevation-0"
      :retain-focus="false"
      scrollable
      max-width="600"
    >
      <div>
        <v-card light tile flat class="transparent mx-auto">
          <div class="mb-4">
            <v-card light tile flat class="info-screen py-3 border-3">
              <v-card-text>
                <v-layout justify-center column align-center class="gap-2">
                  <div class="mb-4 text-center">
                    <v-avatar tile size="120">
                      <v-img
                        v-if="foundObject.name"
                        :src="
                          require(`@/assets/images/games/china/symbols/${foundObject.name}.svg`)
                        "
                        contain
                      ></v-img>
                    </v-avatar>
                    <div class="f-tech text-body-1">
                      {{ $t(`found-object.items.phone`) }}
                    </div>
                  </div>
                  <div class="w-full mb-5">
                    <v-divider></v-divider>
                  </div>
                  <template
                    v-if="foundObject.items.length === foundObject.count"
                  >
                    <div class="text-h5">
                      {{ $t('found-object.find-phone') }}
                    </div>
                  </template>
                </v-layout>
              </v-card-text>
            </v-card>
          </div>
        </v-card>
        <v-card-actions class="mt-4 px-6 pb-4">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="px-4"
            tile
            large
            depressed
            :data-video-start="
              foundObject.items.length === foundObject.count
                ? `${stepId}-x4`
                : ''
            "
            @click="hideFoundObjectModel()"
          >
            {{ $t('next') }}
            <v-icon class="ms-2">mdi-keyboard-backspace mdi-rotate-180</v-icon>
          </v-btn>
        </v-card-actions>
      </div>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'MissingPiece',
  props: {
    stepId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      rotatableItems: [
        {
          name: 'alarm',
          dir: 'front',
          correctDir: 'left',
          object: 'hourglass',
          isOpened: false,
        },
        {
          name: 'boat',
          dir: 'front',
          correctDir: 'back',
          object: 'bridge',
          isOpened: false,
        },
        {
          name: 'book',
          dir: 'front',
          correctDir: 'back',
          object: 'handshake',
          isOpened: false,
        },
        {
          name: 'candle',
          dir: 'front',
          correctDir: 'right',
          object: 'note',
          isOpened: false,
        },
        {
          name: 'charger',
          dir: 'front',
          correctDir: 'back',
          object: 'charger',
          isOpened: false,
        },
        {
          name: 'cup',
          dir: 'front',
          correctDir: 'bot',
          object: 'eye',
          isOpened: false,
        },
        {
          name: 'key',
          dir: 'front',
          correctDir: 'left',
          object: 'lock',
          isOpened: false,
        },
        {
          name: 'pillow',
          dir: 'front',
          correctDir: 'back',
          object: null,
          isOpened: false,
        },
      ],
      dirs: ['front', 'back', 'left', 'right', 'top', 'bot'],
      foundObject: {
        model: false,
        name: '',
        items: [],
        count: 1,
      },
    };
  },
  methods: {
    resetValues() {
      this.rotatableItems.forEach((_, i) => {
        this.$set(this.rotatableItems[i], 'dir', 'front');
      });
      this.$set(this.foundObject, 'items', []);
    },
    rotateItem(i = 0) {
      const foundObjects = this.foundObject.items;
      const item = this.rotatableItems[i];
      const dirs = this.dirs;
      let nextDirIndex = dirs.indexOf(item.dir) + 1;
      if (nextDirIndex === dirs.length) {
        nextDirIndex = 0;
      }
      const nextDir = dirs[nextDirIndex];
      item.dir = nextDir;
      if (
        item.dir === item.correctDir &&
        item.object &&
        !foundObjects.includes(item.object)
      ) {
        this.showObject(item.object);
      }
    },
    showObject(name = '') {
      this.$set(this.foundObject, 'name', name);
      if (name !== 'note') {
        this.foundObject.items.push(name);
        this.$set(this.foundObject, 'model', true);
      }
      this.$emit('next')
    },
    hideFoundObjectModel() {
      this.$set(this.foundObject, 'model', false);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/pages/game-china.scss';
</style>
