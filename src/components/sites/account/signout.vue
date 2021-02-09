<script>
import Vue from 'vue'

import axios from '@/utils/axios';
import { goBack } from '@/utils/router';

export default Vue.extend({
  mounted() {
    axios.post('/accounts/logout/').then(() => {
      this.$store.commit('account/clear');
      goBack();
    });
  },
});
</script>
