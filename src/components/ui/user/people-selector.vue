<!-- 用户选择器  -->
<!--  参考链接：https://vuetifyjs.com/zh-Hans/components/autocompletes/#section-987976ee548c900962e99879  -->
<template>
  <v-autocomplete
    v-model="selected"
    :items="candidates"
    :label="label"
    :search-input.sync="keyword"
    cache-items
    color="blue-grey lighten-2"
    item-value="id"
    :item-text="itemText"
    :loading="loading"
    v-bind="$attrs"
    chips
    multiple
  >

    <template v-slot:selection="data">
      <v-chip
        v-bind="data.attrs"
        :input-value="data.selected"
        close
        @click="data.select"
        @click:close="remove(data.item)"
      >
        <v-avatar left>
          <v-img
            :src="data.item.avatar_url"
            :lazy-src="avatarDefault"
          />
        </v-avatar>
        {{ data.item.first_name }}
      </v-chip>
    </template>

    <template v-slot:item="data">
      <template v-if="typeof data.item !== 'object'">
        <v-list-item-content v-text="data.item"></v-list-item-content>
      </template>

      <template v-else>
        <v-list-item-avatar>
          <v-img
            :src="data.item.avatar_url"
            :lazy-src="avatarDefault"
          />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-html="data.item.first_name"></v-list-item-title>
          <v-list-item-subtitle v-html="data.item.student_id"></v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </template>

    <template v-slot:no-data>
      <v-list-item>
        <v-list-item-title>
          找不到对象
        </v-list-item-title>
      </v-list-item>
    </template>

  </v-autocomplete>
</template>

<script>
import {getUserList} from "@/api/user";
import debounce from "lodash/debounce";
import {lazyAvatar, debounceTime} from "@/utils";

export default {
  props: {
    value: {
      type: Array,
      default: []
    },
    label: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      selected: [],
      candidates: [],
      keyword: '',
      loading: false,
      debouncedFetchData: null,
      avatarDefault: lazyAvatar
    }
  },

  methods: {
    fetchData() {
      let that = this;
      that.loading = true;
      getUserList(that.keyword, 1, 15).then(res => {
        that.candidates = res.data.results;
        that.loading = false;
      })
    },
    itemText(user) {
      // auto-complete 将以该字段作为本地搜索的字段
      return `${user.id} ${user.first_name} ${user.student_id}`;
    },
    remove(user) {
      const index = this.selected.indexOf(user.id)
      if (index >= 0) this.selected.splice(index, 1)
    },
  },

  watch: {
    keyword() {
      this.debouncedFetchData();
    },

    selected() {
      this.$emit('input', this.selected);
    }
  },

  created() {
    // console.log('created');
    this.fetchData();
    this.debouncedFetchData = debounce(this.fetchData, debounceTime);
    this.selected = [...this.value]; // 将最新的数据复制一遍
  },
}
</script>