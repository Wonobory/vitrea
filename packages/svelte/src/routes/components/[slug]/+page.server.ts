import { error } from "@sveltejs/kit";
import { codeToHtml } from "shiki";
import { DOCS } from "$docs/docs";
import type { EntryGenerator, PageServerLoad } from "./$types";

const sources = import.meta.glob<string>("/src/docs/examples/*.svelte", {
	query: "?raw",
	import: "default",
	eager: true,
});

export const entries: EntryGenerator = () => DOCS.map((d) => ({ slug: d.slug }));

export const load: PageServerLoad = async ({ params }) => {
	const i = DOCS.findIndex((d) => d.slug === params.slug);
	const code = sources[`/src/docs/examples/${params.slug}.svelte`];
	if (i < 0 || code === undefined) error(404, "Not found");
	const html = await codeToHtml(code.trim(), {
		lang: "svelte",
		themes: { light: "github-light", dark: "github-dark-default" },
		defaultColor: false,
	});
	return { doc: DOCS[i]!, prev: DOCS[i - 1] ?? null, next: DOCS[i + 1] ?? null, html, code };
};
