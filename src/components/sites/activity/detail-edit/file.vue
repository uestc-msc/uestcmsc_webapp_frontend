<template>
  <form>
    <!--  已经上传/正在上传的文件  -->
    <v-slide-y-transition group>
      <v-text-field
        readonly
        v-for="fileStatus in fileStatusArray"
        :key="fileStatus.key"
        :loading="fileStatus.showProgressLine"
        :value="fileLabel(fileStatus)"
        :messages="fileStatus.msg"
        prepend-icon="mdi-file"
      >
        <template v-slot:append-outer>
          <v-btn
            v-if="fileStatus.status === Status.default"
            text
            icon
            :href="fileStatus.info.download_link"
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
            tips="您真的取消吗？取消了就要重新上传哦"
            war
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
    </v-slide-y-transition>
    <!--  用户上传新文件的地方  -->
    <v-file-input
      multiple
      @change="uploadNewFile"
      :value="fileInputValue"
      prepend-icon="mdi-upload"
      placeholder="选择文件上传..."
    />
  </form>
</template>

<script>
import ErrorAlertRow from "@/components/ui/base/error-alert-row";
import {downloadFile, FileStatus, formatBytes, formatFileUploaderInput, uploadFile} from "@/utils/file";
import {displayErrorTime, displaySuccessTime, sleep, totalRetryTimes} from "@/utils";
import {addActivityFile, deleteActivityFile} from "@/api/activity";
import ConfirmDialog from "@/components/ui/base/confirm-dialog";
import {Status, StatusColor} from "@/utils/status";

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
      fileStatusArray: [],
      fileInputValue: [],

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

    uploadNewFile(files) {
      let that = this;
      window.that = this;
      const formattedFiles = formatFileUploaderInput(files);

      Promise.all(formattedFiles.map(async (file) => {
        // 将文件状态存到 fileStatus 里并丢进 fileStatusArray
        let fileStatus = new FileStatus(file, null);
        that.fileStatusArray.push(fileStatus);

        const setProgress = (p) => fileStatus.progress = p;
        const setIndeterminate = (s) => fileStatus.status = s;
        const setMsg = (m) => fileStatus.msg = m;

        fileStatus.status = Status.uploading;
        uploadFile(file, setProgress, setIndeterminate, setMsg)
          .then(async (res) => {
            fileStatus.status = Status.submitting;
            fileStatus.msg = '写入数据库';
            const file_id = res.data.id;
            const data = {
              file_id,
              activity_id: that.activity.id
            };
            // 如果上传成功但是写入数据库失败，还是做一下重试操作
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
            fileStatus.msg = '上传成功';
            fileStatus.status = Status.success;
            fileStatus.info = res2.data;
            await sleep(displaySuccessTime);
            fileStatus.msg = '';
            fileStatus.status = Status.default;
            this.updateActivity();
          })
          .catch(async res => {
            fileStatus.msg = res.data;
            fileStatus.status = Status.error;
            await sleep(displayErrorTime);
            let index = that.fileStatusArray.indexOf(fileStatus);
            if (index !== -1)
              that.fileStatusArray.splice(index, 1);
          });
      }));
      that.fileInputValue = [];
    },

    downloadFile,

    cancelUpload(fileStatus) {
      // Todo: cancel upload
    },

    deleteFile(fileStatus) {
      let that = this;
      fileStatus.status = Status.submitting;
      fileStatus.msg = '删除中';
      deleteActivityFile(fileStatus.info.id)
        .then(async () => {
          fileStatus.status = Status.success;
          fileStatus.msg = '删除成功';
          await sleep(displaySuccessTime);
          let index = that.fileStatusArray.indexOf(fileStatus);
          if (index !== -1)
            that.fileStatusArray.splice(index, 1);
          this.updateActivity();
        })
        .catch(async res => {
          fileStatus.status = Status.error;
          fileStatus.msg = res.data;
          await sleep(displayErrorTime);
          fileStatus.status = Status.default;
          fileStatus.msg = '';
        });
    },

    updateFileStatusArray() {   // 根据 activity 更新 fileStatus
      this.fileStatusArray = this.activity.file.map(info => new FileStatus(null, info));
    },

    updateActivity() {   // 根据 status 更新 activity
      let new_activity = {...this.activity};
      new_activity.file = this.fileStatusArray.map(fileStatus => fileStatus.info)
      this.$emit('update', new_activity)
    }
  },

  watch: {
    activity() {
      this.updateFileStatusArray();
    }
  },

  created() {
    this.updateFileStatusArray();
  }
};
</script>