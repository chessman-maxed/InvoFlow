import Fuse, { IFuseOptions } from "fuse.js";
import pricesData from "../../data/prices.json";

export interface CatalogItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: number;
}

export interface MatchResult {
  item: CatalogItem;
  score: number; // 0 is exact match, 1 is no match
  confidence: number; // Normalized score: 1.0 is exact match, 0.0 is low/no match
}

const fuseOptions: IFuseOptions<CatalogItem> = {
  keys: [
    { name: "name", weight: 0.7 },
    { name: "category", weight: 0.3 },
  ],
  threshold: 0.7, // Relaxed threshold to handle extra conversational words
  includeScore: true,
  ignoreLocation: true,
  useExtendedSearch: false,
};

const catalog: CatalogItem[] = pricesData as CatalogItem[];
const fuse = new Fuse(catalog, fuseOptions);

/**
 * Preprocesses natural language queries to avoid keyword dilution
 * and preserve multi-word concepts (e.g. "brand logo" -> "Logo Design").
 */
function preprocessQuery(query: string): string {
  let q = query.toLowerCase();

  // If query mentions "logo", the primary intention is Logo Design.
  // We strip diluting possessives and qualifiers ("brand's", "brand", "company", "for my")
  // so that "brand logo" doesn't skew toward "Brand Guidelines" / category Branding.
  if (/\blogo\b/.test(q)) {
    q = q.replace(/\b(brand's|brands|company's|company|brand)\b/g, "");
    q = q.replace(/\b(for|my|our|the|a|an)\b/g, "");
    q = q.replace(/\blogo\b/g, "logo design");
  } else {
    // Standard conversational mappings when "logo" is not present
    q = q.replace(/\b(instagram|ig|facebook|fb|tiktok)\b/g, "social media");
    q = q.replace(/\b(promotional|promo)\b/g, "video");
    q = q.replace(/\bcards\b/g, "card printing");
  }

  return q.replace(/\s+/g, " ").trim();
}

/**
 * Finds the best matching catalog item for a given query item name.
 * @param queryName Natural language item name extracted from conversation
 * @param maxScoreThreshold Maximum allowed Fuse score (default 0.7). Lower means stricter match requirement.
 * @returns MatchResult if a reasonable match is found, or null if no match.
 */
export function matchCatalogItem(
  queryName: string,
  maxScoreThreshold = 0.7
): MatchResult | null {
  if (!queryName || !queryName.trim()) {
    return null;
  }

  const preprocessedQuery = preprocessQuery(queryName);
  let results = fuse.search(preprocessedQuery);

  // If preprocessing didn't yield a match or score was too loose, fallback to raw query
  if (results.length === 0 || (results[0].score && results[0].score > maxScoreThreshold)) {
    const fallbackResults = fuse.search(queryName.trim());
    if (
      fallbackResults.length > 0 &&
      fallbackResults[0].score !== undefined &&
      fallbackResults[0].score <= maxScoreThreshold
    ) {
      results = fallbackResults;
    }
  }

  if (results.length === 0) {
    return null;
  }

  const bestMatch = results[0];
  const score = bestMatch.score ?? 1;

  if (score > maxScoreThreshold) {
    return null;
  }

  const confidence = Math.max(0, Math.min(1, 1 - score));

  return {
    item: bestMatch.item,
    score,
    confidence,
  };
}
