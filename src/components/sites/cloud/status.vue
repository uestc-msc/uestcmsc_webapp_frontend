<template>
  <SimpleCard loading>

    <template slot="progress">
      <v-progress-linear
        :color="statusColor"
        :value="100 * !loading"
        :indeterminate="loading"
      />
    </template>

    <v-card-title>
      Onedrive 云盘状态：{{statusString}}
    </v-card-title>

    <v-card-subtitle>
      Status: {{status}}
    </v-card-subtitle>

    <v-card-text>
      （这里本来该有账户名、邮箱和头像的，但作者懒得写了）
    </v-card-text>

    <v-card-actions>
      <v-btn
        text
        :color="statusColor"
        @click="redirectToLoginOnedrive"
      >
        {{status === 'active' ? '重新登录' : '登录'}}
      </v-btn>
    </v-card-actions>

  </SimpleCard>
</template>

<script>
import SimpleCard from "@/components/ui/base/simple-card";
import {getOnedriveStatus, redirectToLoginOnedrive} from "@/api/cloud";

export default {
  components: {SimpleCard},

  data() {
    return {
      status: 'loading',
      loading: false
    }
  },

  computed: {
    statusString() {
      const map = {
        loading: '加载中...',
        active: '正常',
        login_required: '需要登录',
        error: '错误'
      };
      return map[this.status] ? map[this.status] : map['error'];
    },
    statusColor() {
      const map = {
        loading: 'primary',
        active: 'green',
        login_required: 'warning',
        error: 'error'
      };
      return map[this.status] ? map[this.status] : map['error'];
    }
  },

  methods: {
    redirectToLoginOnedrive
  },

  activated() {
    let that = this;
    this.loading = true;
    getOnedriveStatus().then(res => {
      that.status = res.data.status;
      that.loading = false;
    }).catch(res => {
      that.status = res.data;
      that.loading = false;
    })
  }
}
</script>