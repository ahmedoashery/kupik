<template>
  <div id="designer-host">
    <LazyClientOnly>
      <Designer :report="report" :language="lang" />
    </LazyClientOnly>
  </div>
</template>

  <script setup lang="ts">
import {Designer} from '@grapecity/activereports-vue'

const props = defineProps({
  report: {type: Object, default: null, required: true},
  lang: {type: String, default: 'ar'}
})
  </script>

  <style
    src="node_modules/@grapecity/activereports/styles/ar-js-ui.css"
  ></style>
  <style
    src="node_modules/@grapecity/activereports/styles/ar-js-designer.css"
  ></style>

  <style scoped>
  #designer-host {
    height: 100%;
    width: 100%;
  }
  </style>
