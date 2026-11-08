export function fuse(node, options) {
    let o = options;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    if (getComputedStyle(node).position === "static")
        node.style.position = "relative";
    let runs = [];
    const offset = (el) => {
        let x = 0;
        let y = 0;
        for (let n = el; n && n !== node; n = n.offsetParent) {
            x += n.offsetLeft;
            y += n.offsetTop;
        }
        return { x, y };
    };
    const place = (el, first, last, animate) => {
        const p = offset(first);
        const q = offset(last);
        const curve = "300ms var(--spring-small)";
        el.style.transition = animate && !reduced.matches ? `translate ${curve}, width ${curve}, height ${curve}` : "none";
        el.style.translate = `${p.x}px ${p.y}px`;
        el.style.width = `${q.x + last.offsetWidth - p.x}px`;
        el.style.height = `${q.y + last.offsetHeight - p.y}px`;
    };
    const measure = (animate) => {
        const items = [...node.querySelectorAll(o.items)];
        const spans = [];
        items.forEach((el, i) => {
            if (!o.on(el))
                return;
            const last = spans.at(-1);
            if (last && last[1] === i - 1 && (!o.row || o.row(items[i - 1]) === o.row(el)))
                last[1] = i;
            else
                spans.push([i, i]);
        });
        const next = [];
        for (const [a, b] of spans) {
            let run = runs.find((r) => !next.includes(r) && r.a <= b && a <= r.b);
            if (run) {
                run.a = a;
                run.b = b;
                place(run.el, items[a], items[b], animate);
            }
            else {
                const el = document.createElement("span");
                el.dataset.fuse = "";
                el.setAttribute("aria-hidden", "true");
                el.className = `pointer-events-none absolute top-0 left-0 ${o.className}`;
                place(el, items[a], items[b], false);
                node.prepend(el);
                if (animate && !reduced.matches)
                    el.animate([{ opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1 }], { duration: 220, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" });
                run = { el, a, b };
            }
            next.push(run);
        }
        for (const r of runs) {
            if (next.includes(r))
                continue;
            if (animate && !reduced.matches)
                r.el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120 }).finished.then(() => r.el.remove());
            else
                r.el.remove();
        }
        runs = next;
    };
    const mo = new MutationObserver((records) => {
        // Our own pieces coming and going are not a change of selection.
        if (records.every((r) => r.type === "childList" && [...r.addedNodes, ...r.removedNodes].every((n) => n.dataset?.fuse !== undefined)))
            return;
        measure(true);
    });
    mo.observe(node, { subtree: true, childList: true, attributes: true, attributeFilter: o.watch ?? ["data-state"] });
    const ro = new ResizeObserver(() => measure(false));
    ro.observe(node);
    measure(false);
    return {
        update(next) {
            o = next;
            measure(true);
        },
        destroy() {
            mo.disconnect();
            ro.disconnect();
            for (const r of runs)
                r.el.remove();
        },
    };
}
