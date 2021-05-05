<!-- 用户选择器，保证输出的数组升序  -->
<!--  参考链接：https://vuetifyjs.com/zh-Hans/components/autocompletes/#section-987976ee548c900962e99879  -->
<template>
  <v-autocomplete
    chips
    multiple
    :label="label"
    :loading="real_loading"
    color="blue-grey lighten-2"

    v-model="selected"
    @input="add"
    :items="candidates"
    item-value="id"
    :search-input.sync="keyword"

    no-data-text="找不到对象"
    no-filter
    cache-items
  >

    <!--  在已选择的框里的 chip 元素  -->
    <template v-slot:selection="data">
      <v-chip
        v-bind="data.attrs"
        :input-value="data.selected"
        close
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

    <!-- 在候选列表里面的 list-item 元素  -->
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
  </v-autocomplete>
</template>

<script>
import {getUserList} from "@/api/user";
import debounce from "lodash/debounce";
import {debounceTime, lazyAvatar} from "@/utils";

export default {
  props: {
    value: {
      type: Array,
      default: []
    },
    label: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      // 用户选择的结果，保证为升序
      selected: [],
      candidates: [],
      keyword: '',
      search_loading: false,
      debouncedFetchData: null,
      avatarDefault: lazyAvatar
    }
  },

  computed: {
    real_loading() {
      console.log(this.loading, this.search_loading, this.loading || this.search_loading)
      return this.loading || this.search_loading;
    }
  },

  methods: {
    fetchData() {
      let that = this;
      that.search_loading = true;
      getUserList(that.keyword, 1, 15).then(res => {
        that.candidates = res.data.results;
        that.search_loading = false;
      })
    },

    add() {
      // 这里还有算法优化空间
      // 排序可以采用插入排序，因为数组除了最后一个元素都是有序的
      // 但是数据量这么小 优化个 p
      this.selected.sort();
      this.$emit('input', this.selected);
    },
    remove(user) {
      const index = this.selected.indexOf(user.id);
      if (index >= 0) this.selected.splice(index, 1);
      // 删除元素显然不会破坏有序性
      this.$emit('input', this.selected);
    },


  },

  watch: {
    keyword() {
      this.debouncedFetchData();
    },

    value() {
      this.selected = [...this.value];
    }
  },

  created() {
    this.fetchData();
    this.debouncedFetchData = debounce(this.fetchData, debounceTime);
    this.selected = [...this.value]; // 将最新的数据复制一遍
  },

}
</script>