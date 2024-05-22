<template>
  <div>
    <div id="designer-host">
      <ReportDesigner
        :on-create="onCreateReport"
        :on-save="onSaveReport"
        :on-save-as="onSaveAsReport"
        :on-open="onOpenReport"
      />
    </div>
    <div
      v-if="showModal"
      id="dlgOpen"
      class="modal"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="exampleModalLabel" class="modal-title">
            Open Report
          </h5>
          <button
            type="button"
            class="close"
            aria-label="Close"
            @click="hideModal"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <strong>Select Report:</strong>
          <div class="list-group">
            <button
              v-for="reportId in reportIds"
              :key="reportId"
              type="button"
              class="list-group-item list-group-item-action"
              @click="onSelectReport(reportId)"
            >
              {{ reportId }}
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="hideModal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Designer } from '@grapecity/activereports-vue'

let resolveFunc = null

export default {
  components: {
    ReportDesigner: Designer,
  },
  data() {
    return {
      reportStorage: new Map(),
      counter: 0,
      showModal: false,
    }
  },
  computed: {
    reportIds() {
      const ret = this.counter ? [...this.reportStorage.keys()] : []
      return ret
    },
  },
  methods: {
    onSelectReport(reportId) {
      if (resolveFunc) {
        resolveFunc({
          definition: this.reportStorage.get(reportId),
          id: reportId,
          displayName: reportId,
        })
        this.showModal = false
      }
    },
    onCreateReport() {
      const CPLReport = {
        Name: 'Report',
        Body: {
          Width: '8.5in',
          Height: '11in',
        },
      }
      const reportId = `NewReport${this.counter + 1}`
      this.counter++
      return Promise.resolve({
        definition: CPLReport,
        id: reportId,
        displayName: reportId,
      })
    },
    onSaveReport(info) {
      const reportId = info.id || `NewReport${this.counter + 1}`
      this.reportStorage.set(reportId, info.definition)
      this.counter++
      return Promise.resolve({ displayName: reportId })
    },
    onSaveAsReport(info) {
      const reportId = `NewReport${this.counter + 1}`
      this.reportStorage.set(reportId, info.definition)
      this.counter++
      return Promise.resolve({ id: reportId, displayName: reportId })
    },
    onOpenReport() {
      const me = this
      return new Promise(function (resolve) {
        resolveFunc = resolve
        me.showModal = true
      })
    },
    hideModal() {
      this.showModal = false
      if (resolveFunc) {
        resolveFunc(null)
        resolveFunc = null
      }
    },
  },
}
</script>

<style>

@import url('~/assets/styles/ar-js-ui.css');
@import url('~/assets/styles/ar-js-viewer.css');
@import url('~/assets/styles/ar-js-designer.css');

#designer-host {
  width: 100%;
  height: 100%;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 4px;
  width: 50%;
  max-width: 500px;
  max-height: 80%;
  overflow-y: auto;
}
</style>
