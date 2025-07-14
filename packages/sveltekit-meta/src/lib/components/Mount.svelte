<script lang="ts">
  import { page } from "$app/state";
  import { afterNavigate } from "$app/navigation";

  let data = $state(page.data);
  $inspect(data)

  // Update data on navigation
  afterNavigate(() => {
    data = page.data;
  });
</script>
