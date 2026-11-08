import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Always one array: `cn(["a", cond && "b", className])`. */
export const cn = (inputs: ClassValue[]) => twMerge(clsx(inputs));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
	ref?: U | null;
};
type UnknownFunction = (...args: unknown[]) => unknown;

type SafeInvoke = {
	<Args extends unknown[], Return>(
		callback: ((...args: Args) => Return) | null | undefined,
		...args: Args
	): Return | undefined;
	method: <Args extends unknown[], Return>(
		target: unknown,
		methodName: PropertyKey,
		...args: Args
	) => Return | undefined;
};

const skippedCallableLogKeys = new Set<string>();

const runtimeType = (value: unknown) => (value === null ? "null" : typeof value);

const isCallable = (value: unknown): value is UnknownFunction => typeof value === "function";

const logSkippedCallable = ({
	callable,
	methodName,
	target,
}: {
	callable: unknown;
	methodName?: string;
	target?: unknown;
}) => {
	const callableType = runtimeType(callable);
	const targetType = target === undefined ? undefined : runtimeType(target);
	const logKey = [methodName, targetType, callableType].join("|");

	if (skippedCallableLogKeys.has(logKey)) return;
	skippedCallableLogKeys.add(logKey);
};

const safeInvokeCallback = <Return>(callback: unknown, ...args: unknown[]): Return | undefined => {
	if (callback === null || callback === undefined) return undefined;

	if (!isCallable(callback)) {
		logSkippedCallable({ callable: callback });
		return undefined;
	}

	return callback(...args) as Return;
};

const safeInvokeMethod = <Return>(
	target: unknown,
	methodName: PropertyKey,
	...args: unknown[]
): Return | undefined => {
	if (target === null || target === undefined) return undefined;

	const callable = Reflect.get(Object(target), methodName);
	if (!isCallable(callable)) {
		logSkippedCallable({ callable, methodName: String(methodName), target });
		return undefined;
	}

	return callable.apply(target, args) as Return;
};

export const safeInvoke = Object.assign(safeInvokeCallback, {
	method: safeInvokeMethod,
}) as SafeInvoke;

export const isTouchEvent = (e: Pick<PointerEvent, "pointerType">) => e.pointerType === "touch";

export const parseStyleString = (styleStr?: string): Record<string, string> | undefined => {
	if (!styleStr) return;
	return Object.fromEntries(
		styleStr
			.split(";")
			.filter(Boolean)
			.map((rule) => rule.split(":").map((part) => part.trim()))
			.filter(([k, v]) => k && v)
	);
};
