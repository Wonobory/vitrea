import { PinInput as InputOTPPrimitive } from "bits-ui";
type $$ComponentProps = InputOTPPrimitive.RootProps & {
    /**
     * What happened to the code once complete: `verifying` runs a wave
     * along the slots, `success` turns them green one after another,
     * `error` shakes the field in red. The slots read it from the root.
     */
    status?: "idle" | "verifying" | "success" | "error";
};
declare const InputOtp: import("svelte").Component<$$ComponentProps, {}, "ref" | "value">;
type InputOtp = ReturnType<typeof InputOtp>;
export default InputOtp;
