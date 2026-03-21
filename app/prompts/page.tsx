import { redirect } from "next/navigation";
import { REEL_TOKENS, FULL_PROMPTS, CATEGORIES, PromptFull } from "@/lib/prompts-data";
import ReelPage from "./reel-page";

export default async function PromptsPage({
  searchParams,
}: {
  searchParams: Promise<{ r?: string }>;
}) {
  const params = await searchParams;
  const token = params.r;

  if (token !== undefined) {
    const tokenData = REEL_TOKENS[token];
    if (!tokenData) {
      redirect("/prompts");
    }
    const prompt = FULL_PROMPTS[tokenData.promptId];
    const extraPrompts: PromptFull[] = (tokenData.extraPromptIds ?? [])
      .map((id) => FULL_PROMPTS[id])
      .filter((p): p is PromptFull => Boolean(p));
    const category = CATEGORIES.find((c) => c.id === tokenData.categoryId)!;
    const otherCategories = CATEGORIES.filter(
      (c) => c.id !== tokenData.categoryId
    );

    return (
      <ReelPage
        prompt={prompt}
        extraPrompts={extraPrompts}
        displayOrder={tokenData.displayOrder}
        bannerSubtext={tokenData.bannerSubtext}
        guideUrl={tokenData.guideUrl}
        category={category}
        otherCategories={otherCategories}
      />
    );
  }

  // No token: the beforeFiles rewrite in next.config.mjs serves the static HTML.
  // This branch is only reached if that rewrite somehow fails - redirect as fallback.
  redirect("/prompts/111_originale_venta.html");
}
