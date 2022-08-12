import type { PropType, StyleValue } from 'vue';

export const DefaultComponentProps = {
  id: String,
  class: String,
  style: Object as PropType<StyleValue | string>,
};
