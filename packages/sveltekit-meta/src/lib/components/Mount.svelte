<script lang="ts">
  import { page } from "$app/state";
  import { afterNavigate } from "$app/navigation";

  let metaTags = $state(page.data.metaTags);

  afterNavigate(() => {
    metaTags = page.data.metaTags;
  });

  $inspect(page.data);
</script>
