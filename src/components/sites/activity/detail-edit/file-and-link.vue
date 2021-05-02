<template>
  <!--  已经上传/正在上传的文件  -->
  <!--  TODO: 删除文件 -->
  <!--  TODO: 重名 -->
  <form>
  <v-slide-y-transition group>
    <v-text-field
      readonly
      v-for="(fileStatus, index) in fileStatuses"
      :key="statusKey(fileStatus)"
      :loading="fileStatus.uploading || fileStatus.deleting"
      :value="statusLabel(fileStatus)"
      :messages="fileStatus.msg"
      prepend-icon="mdi-file"
    >
      <template v-slot:append>
        <v-btn
          v-if="!fileStatus.uploading && !fileStatus.deleting"
          text
          icon
          :href="fileStatus.fileInfo.download_link"
        >
          <v-icon color="primary">mdi-download</v-icon>
        </v-btn>
      </template>

      <template v-slot:append-outer>
        <ConfirmDialog
          v-if="fileStatus.uploading"
          @confirm="cancelUpload(fileStatus)"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              text
              icon
              v-on="on"
              v-bind="attrs"
            >
              <v-icon color="primary">mdi-close</v-icon>
            </v-btn>
          </template>
        </ConfirmDialog>

        <ConfirmDialog
          v-else-if="!fileStatus.deleting"
          @confirm="deleteFile(fileStatus)"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              text
              icon
              v-on="on"
              v-bind="attrs"
            >
              <v-icon color="error">mdi-delete-forever</v-icon>
            </v-btn>
          </template>
        </ConfirmDialog>
      </template>

      <template v-slot:progress>
        <v-fade-transition>
          <v-progress-linear
            absolute
            :indeterminate="fileStatus.indeterminate"
            :value="fileStatus.progress"
            :color="fileStatus.error ? 'error' :
                fileStatus.success ? 'success' :
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
      placeholder="单击以上传文件..."
    />
  </form>
</template>

<script>
import FormErrorAlert from "@/components/ui/base/form-error-alert";
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

  components: {ConfirmDialog, FormErrorAlert},

  data() {
    return {
      fileStatuses: [],
      fileInputValue: [],
    };
  },

  computed: {},

  methods: {
    statusLabel(fileStatus) {
      let {filename, size} = fileStatus.fileInfo;
      let sizeStr = formatBytes(size);
      return `${filename} (${sizeStr})`;
    },
    statusKey(fileStatus) {
      let {filename, size} = fileStatus.fileInfo;
      let lastModified = (this.file && fileStatus.file.lastModified) ? fileStatus.file.lastModified : '';
      return filename + size + lastModified;
    },

    uploadFile(files) {
      let that = this;
      window.that = this;
      const formattedFiles = formatFileUploaderInput(files);

      Promise.all(formattedFiles.map(async (file) => {
        // 将文件状态存到 fileStatus 里并丢进 fileStatuses
        let fileStatus = new FileStatus(file);
        that.fileStatuses.push(fileStatus);

        function setProgress(v) {
          fileStatus.progress = v;
        }

        const setIndeterminate = (v) => fileStatus.indeterminate = v;
        const setMsg = (v) => fileStatus.msg = v;

        fileStatus.uploading = true;
        uploadFile(file, setProgress, setIndeterminate, setMsg)
          .then(async (res) => {
            fileStatus.msg = '写入数据库';
            const file_id = res.data.id;
            const data = {
              file_id,
              activity_id: that.activity.id
            };
            fileStatus.indeterminate = true;
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
            fileStatus.msg = '上传成功';
            fileStatus.indeterminate = false;
            fileStatus.success = true;
            fileStatus.fileInfo = res2.data;
            await sleep(displaySuccessTime);
            fileStatus.msg = '';
            fileStatus.uploading = false;
          })
          .catch(res => {
            fileStatus.error = true;
            fileStatus.msg = res.data;
            fileStatus.indeterminate = false;
          });
      }));
      that.fileInputValue = [];
    },

    downloadFile,

    updateFileStatus() {
      this.fileStatuses = this.activity.file.map(fileInfo => {
        let fileStatus = new FileStatus(null);
        fileStatus.fileInfo = fileInfo;
        fileStatus.file = new File([], fileInfo.filename);
        return fileStatus;
      });
    },

    cancelUpload(fileStatus) {

    },

    deleteFile(fileStatus) {
      let that = this;
      fileStatus.indeterminate = true;
      fileStatus.success = false;
      fileStatus.deleting = true;
      deleteActivityFile(fileStatus.fileInfo.id)
        .then(async res => {
          fileStatus.indeterminate = false;
          fileStatus.progress = 100;
          fileStatus.success = true;
          fileStatus.msg = '删除成功';
          await sleep(displaySuccessTime);
          let index = that.fileStatuses.indexOf(fileStatus);
          if (index !== -1) {
            that.fileStatuses.splice(index, 1);
          }
        })
        .catch(async res => {
          fileStatus.indeterminate = false;
          fileStatus.progress = 100;
          fileStatus.error = true;
          fileStatus.msg = res.data;
        });
    }
  },

  created() {
    window.uploader = this;
    this.updateFileStatus();
  }
};
</script>