<template>
  <div>
    <template v-if="hasLeft">
      {{
        $t('final-task-trap.els-left.undone', {
          n: minElToFind - elementsFound,
        })
      }}
    </template>
    <template v-else>
      <div class="font-weight-bold">
        {{
          $t('final-task-trap.els-left.done', {
            n: elementsFound,
          })
        }}
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    elementsFound: {
      type: Number,
      required: true,
    },
    minElToFind: {
      type: Number,
      required: true,
    },
    hasLeft: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({}),
};
</script>
