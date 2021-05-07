<template>
  <v-container>
    <v-form ref="form">
      <!--  已经存在的链接  -->
      <v-slide-y-transition group>
        <v-row
          no-gutters
          v-for="(link, index) in linkArray"
          :key="link.key"
        >
          <v-col>
            <v-text-field
              v-model="link.value"
              :readonly="link.status !== Status.editing"
              :disabled="disabled"
              :loading="link.showProgressLine"
              :messages="link.msg"
              :error-messages="link.errorMsg"
              prepend-icon="mdi-link"
              @keydown.enter="updateLink(link)"
            >
              <template v-slot:append-outer>
                <template v-if="link.status === Status.editing">
                  <v-fade-transition hide-on-leave>
                    <v-btn
                      v-if="link === '' || link.modified"
                      text
                      icon
                      :disabled="disabled"
                      @click="updateLink(link)"
                    >
                      <v-icon color="grey">mdi-check</v-icon>
                    </v-btn>
                  </v-fade-transition>

                  <v-fade-transition hide-on-leave>
                    <v-btn
                      text
                      icon
                      :disabled="disabled"
                      @click="link.status=Status.default; link.value=link.info.url"
                    >
                      <v-icon color="grey">mdi-close</v-icon>
                    </v-btn>
                  </v-fade-transition>
                </template>

                <template v-else-if="!link.showProgressLine">
                  <v-fade-transition hide-on-leave>
                    <v-btn
                      key="pencil"
                      text
                      icon
                      :disabled="disabled"
                      @click="link.status=Status.editing"
                    >
                      <v-icon color="grey">mdi-pencil</v-icon>
                    </v-btn>
                  </v-fade-transition>

                  <v-fade-transition hide-on-leave>
                    <v-btn
                      key="open-in-new"
                      text
                      icon
                      :disabled="disabled"
                      :href="formatUrl(link.info.url)"
                      target="_blank"
                    >
                      <v-icon color="grey">mdi-open-in-new</v-icon>
                    </v-btn>
                  </v-fade-transition>

                  <ConfirmDialog
                    key="delete-forever"
                    @confirm="deleteLink(link)"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-fade-transition hide-on-leave>
                        <v-btn
                          text
                          icon
                          :disabled="disabled"
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
                    :indeterminate="link.status === Status.submitting"
                    :color="StatusColor[link.status]"
                  />
                </v-fade-transition>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </v-slide-y-transition>

      <!--  用户创建新链接的地方  -->
      <v-slide-y-transition>
        <v-row no-gutters>
          <v-col>
            <v-text-field
              v-model="inputValue"
              prepend-icon="mdi-link-plus"
              placeholder="添加新的链接..."
              :error-messages="inputErrorMsg"
              :disabled="disabled"
              @keydown.enter="createLink"
            >
              <template v-slot:append-outer>
                <v-fade-transition hide-on-leave>
                  <v-btn
                    v-if="inputValue"
                    text
                    icon
                    :disabled="disabled"
                    @click="createLink"
                  >
                    <v-icon color="grey">mdi-plus</v-icon>
                  </v-btn>
                </v-fade-transition>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </v-slide-y-transition>
    </v-form>
  </v-container>
</template>

<script>
import ErrorAlertRow from "@/components/ui/base/error-alert-row";
import {displayErrorTime, displaySuccessTime, sleep} from "@/utils";
import {addActivityLink, deleteActivityLink, updateActivityLink} from "@/api/activity";
import ConfirmDialog from "@/components/ui/base/confirm-dialog";
import {Status, StatusColor} from "@/utils/status";
import {formatUrl} from "@/utils/file";

class Link {
  constructor(info = null, value = '') {
    this.info = info ? info : {url: value};
    this.value = value ? value : info.url;  // info 和 value 二者有其一就可以互补
    this.status = Status.default;
    this.msg = '';                            // msg 放提交时的状态（包括正确/错误状态）
    this.errorMsg = '';                       // errorMsg 放提交前 validate 发现的错误
    this.key = Math.random();                 // 随机生成的 id
  }

  get modified() {
    return this.info.url !== this.value;
  }

  get showProgressLine() {
    return [Status.submitting, Status.success, Status.error].includes(this.status);
  }
}

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
  components: {ConfirmDialog, ErrorAlertRow},

  data() {
    let that = this;
    return {
      linkArray: [],
      inputValue: '',
      inputErrorMsg: '',

      Status,
      StatusColor,
      formatUrl,
    };
  },

  computed: {},

  methods: {
    uniqueUrl(url) {
      return this.linkArray.find(status => status.info.url === url) === undefined;
    },

    async createLink() {
      let that = this;
      // 提交时检测是否有重复；输入时检测重复的性能开销太大，长按连续输入/删除字符时有明显卡顿
      if (!this.uniqueUrl(this.inputValue)) {
        this.inputErrorMsg = '链接已存在';
        // 3s 后去掉错误提示
        await sleep(displayErrorTime);
        this.inputErrorMsg = '';
        return;
      }

      let url = this.inputValue;
      this.inputValue = '';
      // 将链接状态存到 link 里并丢进 linkArray
      let link = new Link(null, url);
      this.linkArray.push(link);

      link.status = Status.submitting;
      let data = {
        url,
        activity_id: this.activity.id
      };
      addActivityLink(data)
        .then(async res => {
          link.msg = '添加成功';
          link.status = Status.success;
          link.info = res.data;

          await sleep(displaySuccessTime);
          link.msg = '';
          link.status = Status.default;
          that.updateData();
        })
        .catch(async res => {
          link.status = Status.error;
          link.msg = res.data;

          await sleep(displayErrorTime);
          let index = that.linkArray.indexOf(link);
          if (index !== -1)
            that.linkArray.splice(index, 1);
        });
    },

    async updateLink(link) {
      let that = this;
      // 检测是否是可提交状态
      if (link.status !== Status.editing || link.value === '')
        return;
      // 提交时检测是否有重复；输入时检测重复的性能开销太大，长按连续输入/删除字符时有明显卡顿
      if (!this.uniqueUrl(link.value)) {
        link.errorMsg = '链接已存在';
        await sleep(displayErrorTime);
        link.errorMsg = '';
        return;
      }

      link.status = Status.submitting;
      updateActivityLink(link.info.id, {url: link.value})
        .then(async res => {
          link.status = Status.success;
          link.msg = '更新成功';
          link.info = res.data;
          that.updateData();
          await sleep(displaySuccessTime);
          link.status = Status.default;
          link.msg = '';
        })
        .catch(async res => {
          link.status = Status.error;
          link.msg = res.data;
          await sleep(displayErrorTime);
          link.status = Status.default;
          link.msg = '';
        });
    },

    deleteLink(link) {
      link.status = Status.submitting;
      let that = this;
      deleteActivityLink(link.info.id)
        .then(async res => {
          link.status = Status.success;
          link.msg = '删除成功';

          await sleep(displaySuccessTime);
          link.status = Status.default;
          let index = that.linkArray.indexOf(link);
          if (index !== -1)
            that.linkArray.splice(index, 1);
          that.updateData();
        })
        .catch(async res => {
          link.status = Status.error;
          link.msg = res.data;

          await sleep(displayErrorTime);
          link.status = Status.default;
          link.msg = '';
        });
    },

    fetchData() {   // 根据 activity 更新 linkArray
      this.linkArray = this.activity.link.map(info => new Link(info));
    },

    updateData() {   // 根据 linkArray 更新 activity
      let new_activity = {...this.activity};
      new_activity.link = this.linkArray.map(status => status.info);
      this.$emit('update:activity', new_activity);
    }
  },

  watch: {
    activity() {
      this.fetchData();
    }
  },

  created() {
    this.fetchData();
  },

};
</script>