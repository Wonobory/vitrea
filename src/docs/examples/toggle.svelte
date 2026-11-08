<script lang="ts">
  import { Ticker } from "$lib/components/ui/ticker";
  import * as Toggle from "$lib/components/ui/toggle";
  import HeartIcon from "@lucide/svelte/icons/heart";
  import BookmarkIcon from "@lucide/svelte/icons/bookmark";
  import BellIcon from "@lucide/svelte/icons/bell";

  let following = $state(false);
  let saved = $state(true);
  let alerts = $state(false);
  // Other people following it; you count as soon as you press.
  const others = 23;
</script>

<div class="flex flex-wrap items-center justify-center gap-3">
  <Toggle.Root bind:pressed={following} variant="outline" aria-label={following ? "Unfollow" : "Follow"}>
    <Toggle.Icon pressed={following} icon={HeartIcon} />
    <Toggle.Label pressed={following} off="Follow" on="Following" />
    <span class="pl-0.5 text-muted-foreground" aria-hidden="true"><Ticker value={others + (following ? 1 : 0)} /></span>
  </Toggle.Root>

  <Toggle.Root bind:pressed={saved} variant="outline" aria-label={saved ? "Remove from saved" : "Save"}>
    <Toggle.Icon pressed={saved} icon={BookmarkIcon} />
    <Toggle.Label pressed={saved} off="Save" on="Saved" />
  </Toggle.Root>

  <Toggle.Root bind:pressed={alerts} aria-label="Alerts">
    <Toggle.Icon pressed={alerts} icon={BellIcon} />
  </Toggle.Root>
</div>
