<script lang="ts">
  import * as Calendar from "$lib/components/ui/calendar";
  import { getDayOfWeek, getLocalTimeZone, today, type DateValue } from "@internationalized/date";

  let value = $state<DateValue | undefined>(today(getLocalTimeZone()));

  // Example data: how many auctions close each day (none at weekends).
  const closing = (d: DateValue) =>
    getDayOfWeek(d, "en-GB") > 4 ? 0 : (Math.imul(d.year * 400 + d.month * 32 + d.day, 2654435761) >>> 0) % 18;
  const dots = (n: number) => (n === 0 ? 0 : n < 6 ? 1 : n < 12 ? 2 : 3);
  const long = (d: DateValue) => d.toDate(getLocalTimeZone()).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
</script>

<div class="flex flex-col items-center gap-3">
  <Calendar.Calendar type="single" bind:value class="rounded-xl border bg-card shadow-sm">
    {#snippet day({ day })}
      <Calendar.Day>
        {#snippet children({ day: label })}
          {label}
          <span class="flex h-1 gap-0.5" aria-hidden="true">
            {#each { length: dots(closing(day)) } as _, i (i)}
              <i class="size-1 rounded-full bg-current opacity-70"></i>
            {/each}
          </span>
        {/snippet}
      </Calendar.Day>
    {/snippet}
  </Calendar.Calendar>
  <p class="text-xs text-muted-foreground tabular-nums">
    {#if value}
      <span class="font-medium text-foreground">{closing(value)} auctions</span> close on {long(value)} · Example data
    {:else}
      Pick a day
    {/if}
  </p>
</div>
