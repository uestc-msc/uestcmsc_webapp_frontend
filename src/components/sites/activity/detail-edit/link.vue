<template>
  <form>
    <!--  已经存在的链接  -->
    <v-slide-y-transition group>
      <v-text-field
        v-for="(status, index) in linkStatuses"
        :key="status.key"
        v-model="status.value"
        :readonly="!status.editing"
        :loading="status.progressLine"
        :messages="status.msg"
        :error-messages="status.errorMsg"
        prepend-icon="mdi-link"
        @keydown.enter="updateLink(status)"
      >
        <template v-slot:append-outer>
          <template v-if="status.editing">
            <v-fade-transition hide-on-leave>
              <v-btn
                v-if="status === '' || status.modified"
                text
                icon
                @click="updateLink(status)"
              >
                <v-icon color="grey">mdi-check</v-icon>
              </v-btn>
            </v-fade-transition>

            <v-fade-transition hide-on-leave>
              <v-btn
                text
                icon
                @click="status.editing=false; status.value=status.info.url"
              >
                <v-icon color="grey">mdi-close</v-icon>
              </v-btn>
            </v-fade-transition>
          </template>

          <template v-else-if="!status.progressLine">
            <v-fade-transition hide-on-leave>
              <v-btn
                key="pencil"
                text
                icon
                @click="status.editing=true;"
              >
                <v-icon color="grey">mdi-pencil</v-icon>
              </v-btn>
            </v-fade-transition>

            <v-fade-transition hide-on-leave>
              <v-btn
                key="open-in-new"
                text
                icon
                @click="openLink(status)"
              >
                <v-icon color="grey">mdi-open-in-new</v-icon>
              </v-btn>
            </v-fade-transition>

            <ConfirmDialog
              key="delete-forever"
              @confirm="deleteLink(status)"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-fade-transition hide-on-leave>
                  <v-btn
                    text
                    icon
                    v-on="on"
                    v-bind="attrs"
                  >
                    <v-icon color="grey">mdi-delete-forever</v-icon>
                  </v-btn>
                </v-fade-transition>
              </template>
            </ConfirmDialog>
          </template>
        </template>
        <template v-slot:progress>
          <v-fade-transition>
            <v-progress-linear
              absolute
              value="100"
              :indeterminate="status.updating"
              :color="status.error ? 'error' :
                status.success ? 'success' :
                'primary'"
            />
          </v-fade-transition>
        </template>
      </v-text-field>
    </v-slide-y-transition>

    <!--  用户创建新链接的地方  -->
    <v-slide-y-transition>
      <v-text-field
        v-model="inputValue"
        prepend-icon="mdi-link-plus"
        placeholder="添加新的链接..."
        :error-messages="inputErrorMsg"
        @keydown.enter="createLink"
      >
        <template v-slot:append-outer>
          <v-fade-transition hide-on-leave>
            <v-btn
              v-if="inputValue"
              text
              icon
              @click="createLink"
            >
              <v-icon color="grey">mdi-plus</v-icon>
            </v-btn>
          </v-fade-transition>
        </template>
      </v-text-field>
    </v-slide-y-transition>
  </form>
</template>

<script>
import ErrorAlertRow from "@/components/ui/base/error-alert-row";
import {displayErrorTime, displaySuccessTime, sleep} from "@/utils";
import {addActivityLink, deleteActivityLink, updateActivityLink} from "@/api/activity";
import ConfirmDialog from "@/components/ui/base/confirm-dialog";

class LinkStatus {
  constructor(info = null, value = '') {
    this.info = info ? info : {url: value};
    this.value = value ? value : info.url;  // info 和 value 二者有其一就可以互补
    this.editing = false;
    this.updating = false;
    this.success = false;
    this.error = false;
    this.msg = '';                            // msg 放提交时的状态（包括正确/错误状态）
    this.errorMsg = '';                       // errorMsg 放提交前 validate 发现的错误
    this.key = Math.random();                 // 随机生成的 id
  }

  get modified() {
    return this.info.url !== this.value;
  }

  get progressLine() {                      // 显示 progress line
    return this.updating || this.success || this.error;
  }
}

export default {
  props: {
    activity: {
      type: Object,
      required: true
    }
  },

  components: {ConfirmDialog, ErrorAlertRow},

  data() {
    let that = this;
    return {
      linkStatuses: [],
      inputValue: '',
      inputErrorMsg: '',
    };
  },

  computed: {},

  methods: {
    uniqueUrl(url) {
      return this.linkStatuses.find(status => status.info.url === url) === undefined;
    },

    //TODO displayerrortime
    createLink() {
      let that = this;
      // 提交时检测是否有重复；输入时检测重复的性能开销太大，长按连续输入/删除字符时有明显卡顿
      if (!this.uniqueUrl(this.inputValue)) {
        this.inputErrorMsg = '链接已存在';
        // 3s 后去掉错误提示
        setTimeout(() => that.inputErrorMsg = '', displayErrorTime)
        return;
      }

      let url = this.inputValue;
      this.inputValue = '';
      // 将链接状态存到 status 里并丢进 linkStatuses
      let status = new LinkStatus(null, url);
      this.linkStatuses.push(status);

      status.updating = true;
      let data = {
        url,
        activity_id: this.activity.id
      };
      addActivityLink(data)
        .then(async res => {
          status.msg = '添加成功';
          status.success = true;
          status.updating = false;
          status.info = res.data;

          await sleep(displaySuccessTime);
          status.msg = '';
          status.success = false;
          that.updateActivity();
        })
        .catch(async res => {
          status.error = true;
          status.updating = false;
          status.msg = res.data;

          await sleep(displaySuccessTime);
          let index = that.linkStatuses.indexOf(status);
          if (index !== -1)
            that.linkStatuses.splice(index, 1);
        });
    },

    updateLink(status) {
      let that = this;
      // 检测是否是可提交状态
      if (status.editing === false || status.value === '')
        return;
      // 提交时检测是否有重复；输入时检测重复的性能开销太大，长按连续输入/删除字符时有明显卡顿
      if (!this.uniqueUrl(status.value)) {
        status.errorMsg = '链接已存在';
        // 3s 后去掉错误提示
        setTimeout(() => status.errorMsg = '', displayErrorTime)
        return;
      }

      status.editing = false;
      status.updating = true;
      status.info.url = status.value;
      updateActivityLink(status.info.id, {url: status.value})
        .then(async res => {
          status.updating = false;
          status.success = true;
          status.msg = '更新成功';
          status.info = res.data;
          that.updateActivity();
          await sleep(displaySuccessTime);
          status.success = false;
          status.msg = '';
        })
        .catch(async res => {
          status.updating = false;
          status.error = true;
          status.msg = res.data;
          await sleep(displayErrorTime);
          status.error = false;
          status.msg = '';
        });
    },

    deleteLink(status) {
      status.updating = true;
      let that = this;
      deleteActivityLink(status.info.id)
        .then(async res => {
          status.updating = false;
          status.success = true;
          status.msg = '删除成功';

          await sleep(displaySuccessTime);
          status.success = false;
          let index = that.linkStatuses.indexOf(status);
          if (index !== -1)
            that.linkStatuses.splice(index, 1);
          that.updateActivity();
        })
        .catch(async res => {
          status.updating = false;
          status.error = true;
          status.msg = res.data;

          await sleep(displaySuccessTime);
          status.error = false;
          status.msg = '';
        });
    },

    openLink(status) {
      let link = status.info.url;
      if (link.indexOf('://') === -1)
        link = 'https://' + link;
      window.open(link);
    },

    updateLinkStatus() {   // 根据 activity 更新 linkStatus
      this.linkStatuses = this.activity.link.map(info => new LinkStatus(info));
    },

    updateActivity() {   // 根据 status 更新 activity
      let new_activity = {...this.activity};
      new_activity.file = this.linkStatuses.map(status => status.info);
      this.$emit('update', new_activity);
    }
  },

  watch: {
    activity() {
      this.updateLinkStatus()
    }
  },

  created() {
    this.updateLinkStatus();
  },
};
</script>