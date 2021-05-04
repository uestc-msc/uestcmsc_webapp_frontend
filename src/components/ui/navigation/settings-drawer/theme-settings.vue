<script>
// Extensions
import SettingsGroup from './settings-groups'


export default {
  name: 'ThemeSettings',

  extends: SettingsGroup,

  data() {
    return {
      title: '主题',
      items: [
        {
          value: 'light',
          text: '浅色主题',
          icon: 'mdi-white-balance-sunny',
          callback: () => this.setTheme(),
        },
        {
          value: 'dark',
          text: '深色主题',
          icon: 'mdi-weather-night',
          callback: () => this.setTheme(true),
        },
        {
          value: 'system',
          text: '跟随系统',
          icon: 'mdi-desktop-tower-monitor',
          callback: () => this.setSystemTheme(),
        },
      ]
    };
  },

  computed: {

    internalValue: {
      get() {
        return this.system ? '跟随系统' :
          this.dark ? '深色主题' : '浅色主题';
      },
      set(val) {
        const set = this.items.find(item => item.value === val)

        set.callback()
      },
    },
  },

  watch: {
    '$vuetify.theme.dark'(val) {
      this.dark = val
    },
    dark(val) {
      this.$vuetify.theme.dark = val
    },
  },

  created() {
    const matchMedia = this.getMatchMedia()
    if (!matchMedia) return

    if (this.internalValue === 'system') {
      this.dark = matchMedia.matches
    }

    matchMedia.onchange = ({matches}) => {
      if (this.system) {
        this.dark = matches
      }
    }
  },

  methods: {
    getMatchMedia() {
      return (window.matchMedia) ? window.matchMedia('(prefers-color-scheme: dark)') : false
    },
    setTheme(
      dark = false,
      system = false,
    ) {
      this.dark = dark
      this.system = system
    },
    setSystemTheme() {
      const matchMedia = this.getMatchMedia()
      if (!matchMedia) return

      this.setTheme(matchMedia.matches, true)
    },
  },
}
</script>
