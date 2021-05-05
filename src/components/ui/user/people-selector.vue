<!-- 用户选择器，保证输出的数组升序  -->
<!--  参考链接：https://vuetifyjs.com/zh-Hans/components/autocompletes/#section-987976ee548c900962e99879  -->
<template>
  <v-autocomplete
    chips
    multiple
    :label="label"
    :loading="loading || search_loading"
    color="blue-grey lighten-2"

    v-model="selected"
    @input="add"
    :items="candidates"
    item-value="id"
    :item-text="u => u.first_name + u.student_id"
    :search-input.sync="keyword"

    no-data-text="找不到对象"
    cache-items
  >

    <!--  在已选择的框里的 chip 元素  -->
    <template v-slot:selection="data">
      <v-chip
        ripple
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
        <AdminIcon :user="data.item"/>
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
          <v-list-item-title>
            <span>{{data.item.first_name}}</span>
            <AdminIcon :user="data.item"/>
          </v-list-item-title>
          <v-list-item-subtitle v-html="data.item.student_id"></v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </template>
  </v-autocomplete>
</template>

<script>
import {getUserDetail, getUserList} from "@/api/user";
import debounce from "lodash/debounce";
import {debounceTime, lazyAvatar} from "@/utils";
import AdminIcon from "@/components/ui/user/admin-icon";

export default {
  components: {AdminIcon},
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

    updateData() {
      this.selected = [...this.value]; // 将最新的数据复制一遍
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
      this.updateData()
    }
  },

  created() {
    window.uploader = this;
    this.fetchData();
    this.debouncedFetchData = debounce(this.fetchData, debounceTime);
    this.updateData();
    // todo 下面能暂时解决在名单的人初始化不能被加载
    //  但是不能解决第二次进入该控件时刷新
    // 如果把这段加入 updated，函数压力有亿点大
    // 不如考虑缓存 userList
    this.value.forEach(id => {
      getUserDetail(id).then(res => {
        this.candidates = [res.data];
      })
    })
  },

}
</script>