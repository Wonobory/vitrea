<script lang="ts">
  import * as InputOTP from "$lib/components/ui/input-otp";
  import { onMount } from "svelte";

  // Demo: 123456 is the right code; anything else fails.
  let code = $state("");
  let status = $state<"idle" | "verifying" | "success" | "error">("idle");
  let resendIn = $state(30);

  function verify(v: string) {
    status = "verifying";
    setTimeout(() => {
      status = v === "123456" ? "success" : "error";
      if (status === "error")
        setTimeout(() => {
          code = "";
          status = "idle";
        }, 900);
    }, 1200);
  }

  onMount(() => {
    const t = setInterval(() => resendIn > 0 && resendIn--, 1000);
    return () => clearInterval(t);
  });

  const message = $derived(
    {
      idle: "Enter the 6-digit code we sent to j•••@example.com",
      verifying: "Checking…",
      success: "Verified. You're in.",
      error: "That code isn't right. Try again.",
    }[status],
  );
</script>

<div class="flex flex-col items-center gap-4">
  <InputOTP.Root
    maxlength={6}
    bind:value={code}
    {status}
    onComplete={verify}
  >
    {#snippet children({ cells })}
      <InputOTP.Group>
        {#each cells.slice(0, 3) as cell (cell)}
          <InputOTP.Slot {cell} />
        {/each}
      </InputOTP.Group>
      <InputOTP.Separator />
      <InputOTP.Group>
        {#each cells.slice(3, 6) as cell (cell)}
          <InputOTP.Slot {cell} />
        {/each}
      </InputOTP.Group>
    {/snippet}
  </InputOTP.Root>

  <p
    class={["text-sm transition-colors", status === "success" ? "text-success" : status === "error" ? "text-danger" : "text-muted-foreground"]}
    aria-live="polite"
  >
    {message}
  </p>
  <button
    type="button"
    disabled={resendIn > 0 || status === "success"}
    onclick={() => (resendIn = 30)}
    class:invisible={status === "success"}
    class="text-xs font-medium text-primary underline-offset-4 tabular-nums hover:underline disabled:pointer-events-none disabled:text-muted-foreground"
  >
    {resendIn > 0 ? `Resend code in 0:${String(resendIn).padStart(2, "0")}` : "Resend code"}
  </button>
  <p class="text-2xs tracking-wider text-muted-foreground uppercase">Try 123456</p>
</div>
