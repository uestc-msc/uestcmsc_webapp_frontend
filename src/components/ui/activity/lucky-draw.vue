<template>
  <v-dialog
    v-model="showDialog"
    width="500"
    persistent
  >
    <template v-slot:activator="slotProps">
      <slot name="activator" v-bind="slotProps"/>
    </template>

    <v-card>
      <v-card-title>
        抽奖
      </v-card-title>
      <v-btn absolute top right icon @click="showDialog=false">
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <v-card-text class="pa-4">
        <v-row class="ma-0">
          <PeopleChipGroup :user-id="results"/>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-row no-gutters>
          <v-col>
            <v-text-field
              v-model="prizes"
              :rules="luckyDrawRules(userList.length)"
              :disabled="loading"
              :loading="loading"
              type="number"
              label="奖品数"
              ref="prizesInput"
              required/>
          </v-col>
        </v-row>
        <v-btn
          color="primary"
          text
          @click="luckyDraw"
        >
          {{ textOnButton }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {sleep} from "@/utils";
import PeopleChipGroup from "@/components/ui/user/people-chip-group";
import {inputRules} from "@/utils/validators";

export default {
  components: {PeopleChipGroup},
  props: {
    userList: {
      type: Array,
      required: true
    },
  },

  data() {
    return {
      results: [],

      luckyDrawRules: inputRules.activity.luckyDrawRules,
      showDialog: false,
      textOnButton: '开奖！',
      prizes: 1,
      loading: false,
    }
  },

  methods: {
    async luckyDraw() {
      if (this.loading || this.$refs.prizesInput.validate() === false)
        return;
      this.loading = true;
      this.textOnButton = '开奖中';
      this.results = [];
      // 洗牌算法
      let array = [...this.userList];
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      for (let i = 0; i < this.prizes; i++) {
        this.textOnButton = `开奖中（${i} / ${this.prizes}）`;
        await sleep(2000);
        this.results.push(array[i]);
      }
      this.loading = false;
      this.textOnButton = '再开一次！';
    }
  }
}
</script>