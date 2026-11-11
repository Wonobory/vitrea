import assert from "node:assert/strict";
import { slotsOf } from "./slots.ts";

const keys = (t: string) =>
	slotsOf(t)
		.map((s) => `${s.key}=${s.ch}`)
		.join(" ");

assert.equal(keys("7 %"), "i0=7 s1=  s0=%");
assert.equal(keys("7,2 %"), "i0=7 d=, f0=2 s1=  s0=%");
assert.equal(keys("10,0 %"), "i1=1 i0=0 d=, f0=0 s1=  s0=%");
assert.equal(keys("1.000 €"), "i4=1 i3=. i2=0 i1=0 i0=0 s1=  s0=€");
assert.equal(keys("1.234,5"), "i4=1 i3=. i2=2 i1=3 i0=4 d=, f0=5");
assert.equal(keys("€1,234.50"), "p0=€ i4=1 i3=, i2=2 i1=3 i0=4 d=. f0=5 f1=0");
assert.equal(keys("1,234,567"), "i8=1 i7=, i6=2 i5=3 i4=4 i3=, i2=5 i1=6 i0=7");
assert.equal(keys("−0.25"), "p0=− i0=0 d=. f0=2 f1=5");
assert.equal(keys("—"), "s0=—");
console.log("slots ok");
