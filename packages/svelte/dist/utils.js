import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
const skippedCallableLogKeys = new Set();
const runtimeType = (value) => value === null ? "null" : typeof value;
const isCallable = (value) => typeof value === "function";
const logSkippedCallable = ({ callable, methodName, target, }) => {
    const callableType = runtimeType(callable);
    const targetType = target === undefined ? undefined : runtimeType(target);
    const logKey = [methodName, targetType, callableType].join("|");
    if (skippedCallableLogKeys.has(logKey))
        return;
    skippedCallableLogKeys.add(logKey);
};
const safeInvokeCallback = (callback, ...args) => {
    if (callback === null || callback === undefined)
        return undefined;
    if (!isCallable(callback)) {
        logSkippedCallable({ callable: callback });
        return undefined;
    }
    return callback(...args);
};
const safeInvokeMethod = (target, methodName, ...args) => {
    if (target === null || target === undefined)
        return undefined;
    const callable = Reflect.get(Object(target), methodName);
    if (!isCallable(callable)) {
        logSkippedCallable({ callable, methodName: String(methodName), target });
        return undefined;
    }
    // Preserve `this` for method-bearing objects like GSAP timelines.
    return callable.apply(target, args);
};
/**
 * Safely invokes callback-like runtime values at shared UI/Web Component boundaries.
 * Nullish values are skipped silently; present non-functions are skipped and logged once per value shape.
 * Use `safeInvoke.method(target, methodName, ...args)` for method-bearing objects that need their original `this` value.
 */
export const safeInvoke = Object.assign(safeInvokeCallback, {
    method: safeInvokeMethod,
});
export const isTouchEvent = (e) => e.pointerType === "touch";
export const parseStyleString = (styleStr) => {
    if (!styleStr)
        return;
    return Object.fromEntries(styleStr
        .split(";")
        .filter(Boolean)
        .map((rule) => rule.split(":").map((part) => part.trim()))
        .filter(([k, v]) => k && v));
};
