/**
 * <pre>
 *  
 * </pre>
 * 
 * < 개정이력 >
 * 
 *  수정일			수정자			수정내용
 *  =================================================
 *  2025-10-01		KCY				최초 생성
 *  2025-10-02    KCY       템플릿 적용
 */
// Styles
import 'vuetify/styles';
import { md3 } from 'vuetify/blueprints';
import { h } from 'vue';

// Vuetify
import { createVuetify } from 'vuetify'

const iconify = {
  component: props => h('iconify-icon', {icon: props.icon, width: 20, height: 20})
}

export default createVuetify({
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
  blueprint: md3,
  icons: {
    defaultSet: 'iconify',
    sets: { iconify }
  },
  theme: {
    defaultTheme: 'light',
    theme: {
      light: {colors: {primary: "#4f46e5"}},
      dark: { colors: { primary: "#6366f1" } }
    }
  }
});
