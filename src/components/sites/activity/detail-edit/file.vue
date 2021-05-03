<template>
  <form>
    <!--  已经上传/正在上传的文件  -->
    <v-slide-y-transition group>
      <v-text-field
        readonly
        v-for="(status, index) in fileStatuses"
        :key="status.key"
        :loading="status.uploading || status.deleting"
        :value="statusLabel(status)"
        :messages="status.msg"
        prepend-icon=mdi-file"
      >
        <template v-slot:append-outer>
          <v-btn
            v-if="!status.uploading && !status.deleting"
            text
            icon
            :href="status.info.download_link"
          >
            <v-icon color="grey">mdi-download</v-icon>
          </v-btn>

          <ConfirmDialog
            v-if="status.uploading"
            @confirm="cancelUpload(status)"
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

          <ConfirmDialog
            v-else-if="!status.deleting"
            @confirm="deleteFile(status)"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                text
                icon
                v-on="on"
                v-bind="attrs"
              >
                <v-icon color="grey">mdi-delete-forever</v-icon>
              </v-btn>
            </template>
          </ConfirmDialog>
        </template>

        <template v-slot:progress>
          <v-fade-transition>
            <v-progress-linear
              absolute
              :indeterminate="status.indeterminate"
              :value="status.progress"
              :color="status.error ? 'error' :
                status.success ? 'success' :
                'primary'"
            />
          </v-fade-transition>
        </template>
      </v-text-field>
    </v-slide-y-transition>
    <!--  用户上传新文件的地方  -->
    <v-file-input
      multiple
      @change="uploadFile"
      :value="fileInputValue"
      prepend-icon="mdi-upload"
      placeholder="选择文件上传..."
    />
  </form>
</template>

<script>
import ErrorAlertRow from "@/components/ui/base/error-alert-row";
import {downloadFile, FileStatus, formatBytes, formatFileUploaderInput, uploadFile} from "@/utils/file";
import {displaySuccessTime, sleep, totalRetryTimes} from "@/utils";
import {addActivityFile, deleteActivityFile} from "@/api/activity";
import ConfirmDialog from "@/components/ui/base/confirm-dialog";

export default {
  props: {
    activity: {
      type: Object,
      required: true
    }
  },

  components: {ConfirmDialog, ErrorAlertRow},

  data() {
    return {
      fileStatuses: [],
      fileInputValue: [],
    };
  },

  computed: {},

  methods: {
    statusLabel(fileStatus) {
      let {filename, size} = fileStatus.info;
      let sizeStr = formatBytes(size);
      return `${filename} (${sizeStr})`;
    },

    uploadFile(files) {
      let that = this;
      window.that = this;
      const formattedFiles = formatFileUploaderInput(files);

      Promise.all(formattedFiles.map(async (file) => {
        // 将文件状态存到 status 里并丢进 fileStatuses
        let status = new FileStatus(file);
        that.fileStatuses.push(status);

        function setProgress(v) {
          status.progress = v;
        }

        const setIndeterminate = (v) => status.indeterminate = v;
        const setMsg = (v) => status.msg = v;

        status.uploading = true;
        uploadFile(file, setProgress, setIndeterminate, setMsg)
          .then(async (res) => {
            status.msg = '写入数据库';
            const file_id = res.data.id;
            const data = {
              file_id,
              activity_id: that.activity.id
            };
            status.indeterminate = true;
            // 如果上传成功但是写入数据库失败，有点惨。还是做一下重试操作
            let res2;
            for (let i = 1; i <= totalRetryTimes; i++) {
              try {
                res2 = await addActivityFile(data);
                break;
              } catch (res2) {
                if (i === totalRetryTimes)
                  throw res2;
              }
            }
            status.msg = '上传成功';
            status.indeterminate = false;
            status.success = true;
            status.info = res2.data;
            await sleep(displaySuccessTime);
            status.msg = '';
            status.uploading = false;
          })
          .catch(res => {
            status.error = true;
            status.msg = res.data;
            status.indeterminate = false;
          });
      }));
      that.fileInputValue = [];
    },

    downloadFile,

    cancelUpload(status) {
    // Todo: cancel upload
    },

    deleteFile(status) {
      let that = this;
      status.indeterminate = true;
      status.success = false;
      status.deleting = true;
      deleteActivityFile(status.info.id)
        .then(async res => {
          status.indeterminate = false;
          status.progress = 100;
          status.success = true;
          status.msg = '删除成功';
          await sleep(displaySuccessTime);
          let index = that.fileStatuses.indexOf(status);
          if (index !== -1)
            that.fileStatuses.splice(index, 1);
          this.updateActivity();
        })
        .catch(async res => {
          status.indeterminate = false;
          status.progress = 100;
          status.error = true;
          status.msg = res.data;
        });
    },

    updateFileStatus() {   // 根据 activity 更新 fileStatus
      this.fileStatuses = this.activity.file.map(info => new FileStatus(null, info));
    },

    updateActivity() {   // 根据 status 更新 activity
      let new_activity = {...this.activity};
      new_activity.file = this.fileStatuses.map(status => status.info)
      this.$emit('update', new_activity)
    }
  },

  watch: {
    activity() {
      this.updateFileStatus();
    }
  },

  created() {
    this.updateFileStatus();
  }
};
</script>