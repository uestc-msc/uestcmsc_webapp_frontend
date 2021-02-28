import SimpleCard from "@/components/ui/base/simple-card";
import FloatingActionButton from "@/components/ui/base/floating-action-button";
import axios from "@/utils/axios";
import ErrorAlert from "@/components/ui/base/component-error-alert";
import AdminIcon from "@/components/ui/base/admin-icon";
import FormErrorAlert from "@/components/ui/base/form-error-alert";
import {inputRules} from "@/utils/validators";
import {hasGreaterPermissions} from "@/utils/permissions";

// 需要对 component 代码进行深拷贝才能复用，否则一个 component 被两个 vue 使用会炸
export default ({
  components: {
    FormErrorAlert,
    AdminIcon,
    ErrorAlert,
    FloatingActionButton,
    SimpleCard
  },

  data() {
    return {
      userId: 0,
      userProfile: null,
      valid: false,
      submitting: false,
      success: false,
      error: false,

      firstNameRules: inputRules.user.firstNameRules,
      studentIdRules: inputRules.user.studentIdRules,
      aboutRules: inputRules.user.aboutRules
    }
  },

  computed: {
    canChangePassword() {
      return (this.$store.state.profile.id === this.userId) ||
        hasGreaterPermissions(this.$store.state.profile, this.userProfile);
    },
  },

  activated() {
    this.activatedOrMounted();
  },

  deactivated() {
    window.onbeforeunload = null;
  },

  mounted() {
    this.activatedOrMounted();
  },

  methods: {
    activatedOrMounted() {
      window.onbeforeunload = () => '系统可能不会保存您所做的更改。'
      this.$forceUpdate()

      this.userProfile = this.$route.params.userProfile;
      this.$store.commit('setAppbarLoading', true);
      this.userId = this.$route.params.userId;
      let that = this;
      axios.get(`/users/${this.userId}/`)
        .then(response => {
          that.userProfile = response.data;
        })
        .catch(response => {
          that.error = response.data;
        })
        .finally(() => {
          that.$store.commit('setAppbarLoading', false)
        })
    },
    gotoChangePassword() {
      this.$router.push({
        name: 'ChangePassword', params: {
          userId: this.userId,
        }
      });
    },

    submit() {
      this.valid = this.$refs.form.validate();
      if (!this.valid)
        return;

      this.submitting = true;
      this.error = null;
      let {first_name, last_name, student_id, about, subscribe_email} = this.userProfile;
      let data = {first_name, last_name, student_id, about, subscribe_email};
      let that = this;
      axios.patch(`/users/${that.userId}/`, data)
        .then((response) => {
          that.success = true;
          setTimeout(() => {
            that.success = false;
          }, 1500);
        })
        .catch(response => {
          let detail = response.data;
          if (typeof (detail) == 'string')
            that.error = detail;
          else if (typeof (detail) == 'object')
            that.error = Object.values(detail).join('；');
        })
        .finally(() => {
          that.submitting = false;
        });
    }
  },
});