<script lang="tsx">
import { defineComponent, onMounted, ref } from 'vue';
import { createSvemir } from '..';

const component = defineComponent({
  setup() {
    const container = ref<HTMLDivElement | null>(null);

    onMounted(async () => {
      const game = createSvemir({
        element: container.value as HTMLElement,
        frameTicker: true,
      });
      await game.run();
    });

    return () => <div ref={container} />;
  },
});
export default component;
</script>
