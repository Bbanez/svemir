<script lang="tsx">
import { defineComponent } from 'vue';
import { Link } from '../components';

const component = defineComponent({
  setup() {
    return () => (
      <div class="home">
        <Link class="home--project" href="/mind-snake">
          Mind Snake
        </Link>
      </div>
    );
  },
});
export default component;
</script>
