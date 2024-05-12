<template>
  <div id="designer-host">
    <LazyClientOnly>
      <Designer :report="{id: 'reports/customers-list.rdlx-json', displayName: 'Customers-List Report' }" />
    </LazyClientOnly>
  </div>
</template>

  <script lang="ts">
import {Designer} from '@grapecity/activereports-vue'

  export default{
    name: 'DesignerPage',
    components: {
      Designer,
  }}
  </script>

  <style
    src="node_modules/@grapecity/activereports/styles/ar-js-ui.css"
  ></style>
  <style
    src="node_modules/@grapecity/activereports/styles/ar-js-designer.css"
  ></style>

  <style scoped>
  #designer-host {
    height: 100vh;
    width: 100%;
  }
  </style>
