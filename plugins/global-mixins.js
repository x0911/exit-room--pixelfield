import Vue from 'vue';

const mixins = {
  install(Vue, options) {
    Vue.mixin({
      methods: {
        playGameSound(name) {
          if (name) {
            this.$nuxt.$emit('play-game-sound', name);
          }
        },
        getObjType(str) {
          const type = `${typeof str}`.toLowerCase();
          if (type === 'object' && Array.isArray(str)) {
            return 'array';
          }
          return type;
        },
      },
      computed: {
        $tr() {
          return (str = '', expectedType = 'string') => {
            const _expectedType = expectedType.toLowerCase();
            const _str = this.$t(str);
            const _strType = this.getObjType(_str);
            let strToReturn = _str;
            if (_expectedType === _strType) {
              return strToReturn;
            }
            switch (_expectedType) {
              case 'array':
                strToReturn = [];
                break;
              case 'object':
                strToReturn = {};
                break;
            }
            return strToReturn;
          };
        },
      },
    });
  },
};

Vue.use(mixins);
