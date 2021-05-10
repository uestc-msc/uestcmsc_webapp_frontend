<template>
  <v-container>
    <v-form ref="form">
      <!--  已经上传/正在上传的文件  -->
      <v-row
        no-gutters
        v-for="fileStatus in fileStatusArray"
        :key="fileStatus.key"
      >
        <v-col>
          <v-text-field
            readonly
            :loading="fileStatus.showProgressLine"
            :disabled="disabled"
            :value="fileLabel(fileStatus)"
            :messages="fileStatus.msg"
            prepend-icon="mdi-file"
          >
            <template v-slot:append-outer>
              <v-btn
                v-if="fileStatus.status === Status.default"
                text
                icon
                :disabled="disabled"
                :href="fileStatus.info.download_link"
                target="_blank"
              >
                <v-icon color="grey">mdi-download</v-icon>
              </v-btn>

              <ConfirmDialog
                v-if="fileStatus.status === Status.default"
                @confirm="deleteFile(fileStatus)"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    text
                    icon
                    :disabled="disabled"
                    v-on="on"
                    v-bind="attrs"
                  >
                    <v-icon color="grey">mdi-delete-forever</v-icon>
                  </v-btn>
                </template>
              </ConfirmDialog>

              <ConfirmDialog
                v-if="fileStatus.status === Status.uploading"
                operation="取消"
                tips="您真的要取消吗？取消了就要重新上传哦"
                @confirm="cancelUpload(fileStatus)"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    text
                    icon
                    v-on="on"
                    v-bind="attrs"
                  >
                    <v-icon color="grey">mdi-close</v-icon>
                  </v-btn>
                </template>
              </ConfirmDialog>
            </template>

            <template v-slot:progress>
              <v-fade-transition>
                <v-progress-linear
                  absolute
                  :value="fileStatus.status === Status.uploading ? fileStatus.progress : 100"
                  :indeterminate="fileStatus.status === Status.submitting"
                  :color="StatusColor[fileStatus.status]"
                />
              </v-fade-transition>
            </template>
          </v-text-field>
        </v-col>
      </v-row>

      <!--  用户上传新文件的地方  -->
      <v-row no-gutters>
        <v-col>
          <v-file-input
            multiple
            v-model="fileInputValue"
            :disabled="disabled"
            prepend-icon="mdi-upload"
            placeholder="选择文件上传..."
          />
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import {
  cancelUploadFileToOnedrive,
  deleteFileFromOnedrive,
  FileStatus,
  formatBytes,
  uploadFileToOnedrive
} from "@/utils/file";
import {addActivityFile, deleteActivityFile} from "@/api/activity";
import ConfirmDialog from "@/components/ui/base/confirm-dialog";
import {Status, StatusColor} from "@/utils/status";

export default {
  props: {
    activity: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
  },

  components: {ConfirmDialog},

  data() {
    return {
      fileInputValue: null,
      fileStatusArray: [],

      Status,
      StatusColor,
    };
  },

  computed: {},

  methods: {
    fileLabel(fileStatus) {
      let {filename, size} = fileStatus.info;
      let sizeStr = formatBytes(size);
      return `${filename} (${sizeStr})`;
    },

    uploadFile(files) {
      let that = this;
      let apiFunction = (response) => addActivityFile({
        file_id: response.data.id,
        activity_id: that.activity.id
      });
      for (let file of files) {
        // 将文件状态存到 fileStatus 里并丢进 fileStatusArray
        let fileStatus = new FileStatus(file, null);
        that.fileStatusArray.push(fileStatus);
        uploadFileToOnedrive(fileStatus, this.fileStatusArray, apiFunction)
          .then(that.updateData)
      }
    },

    cancelUpload(fileStatus) {
      cancelUploadFileToOnedrive(fileStatus);
    },

    deleteFile(fileStatus) {
      let that = this;
      let apiFunction = () => deleteActivityFile(fileStatus.info.id);
      deleteFileFromOnedrive(fileStatus, this.fileStatusArray, apiFunction)
        .then(that.updateData).catch(() => {});
    },

    fetchData() {   // 根据 activity 更新 fileStatus
      this.fileStatusArray = this.activity.file.map(info => new FileStatus(null, info));
    },

    updateData() {   // 根据 fileStatus 更新 activity
      let new_activity = {...this.activity};
      new_activity.file = this.fileStatusArray.map(fileStatus => fileStatus.info)
      this.$emit('update:activity', new_activity)
    }
  },

  watch: {
    'activity.id'() {
      this.fetchData();
    },

    fileInputValue() {
      if (this.fileInputValue.length) {
        this.uploadFile(this.fileInputValue);
        this.fileInputValue = [];
      }
    }
  },

  created() {
    this.fetchData();
  }
};
</script>