<script lang="tsx">
import { defineComponent } from '@vue/runtime-core';
import { DefaultComponentProps } from './_default';
import { RouterLink } from 'vue-router';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
    href: {
      type: String,
      required: true,
    },
  },
  setup(props, ctx) {
    return () => (
      <>
        {props.href.startsWith('http') ? (
          <a {...props}>{ctx.slots.default ? ctx.slots.default() : ''}</a>
        ) : (
          <RouterLink {...props} to={props.href}>
            {ctx.slots.default ? ctx.slots.default() : ''}
          </RouterLink>
        )}
      </>
    );
  },
});
export default component;
</script>
