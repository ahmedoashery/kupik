<template>
    <div id="viewer-host">
        <ClientOnly>
          <Viewer v-bind:report="{ Uri: 'reports/CustomersList.rdlx-json' }" />
        </ClientOnly>  
    </div>
  </template>
  
  <script lang="ts">
  import {PdfExport} from '@grapecity/activereports';
  import {Viewer} from '@grapecity/activereports-vue';
  const pdf = PdfExport;
  
  export default {
    name: "IndexPage",
    components: {
      Viewer
    },
  };
  </script>
  
  <style
    src="node_modules/@grapecity/activereports/styles/ar-js-ui.css"
  ></style>
  <style
    src="node_modules/@grapecity/activereports/styles/ar-js-viewer.css"
  ></style>
  
  <style scoped>
  #viewer-host {
    height: 100vh;
    width: 100%;
  }
  </style>