/**
 * Structured address result from parsing a listing URL.
 */
export interface ParsedAddress {
  address: string;
  city: string;
  state: string;
  zip: string;
}

const EMPTY: ParsedAddress = { address: "", city: "", state: "", zip: "" };

/**
 * US state abbreviations used to split "street city ST zip" from Zillow slugs.
 */
const STATE_ABBRS = new Set([
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
]);

/**
 * Extracts a structured address from Zillow or Realtor.com listing URLs.
 * Returns an empty ParsedAddress if URL is not recognized or invalid.
 */
export function parseListingUrl(url: string): ParsedAddress {
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace("www.", "");

    // Zillow: /homedetails/123-Main-St-City-ST-12345_zpid/
    if (host.includes("zillow")) {
      const m = u.pathname.match(/\/homedetails\/([^/]+)/);
      if (m) {
        const slug = m[1].replace(/_\d+$/, ""); // strip _zpid
        return parseZillowSlug(slug);
      }
    }

    // Realtor.com: /realestateandhomes-detail/123-Main-St_City_ST_12345_MxxxxxxM
    if (host.includes("realtor")) {
      const m = u.pathname.match(/\/realestateandhomes-detail\/([^/?]+)/);
      if (m) {
        return parseRealtorSlug(m[1]);
      }
    }
  } catch {
    // invalid URL — ignore
  }
  return EMPTY;
}

/**
 * Zillow slugs use hyphens for all spaces:
 *   "123-Main-St-Louisville-KY-40202"
 * We split backwards: zip (5 digits), state (2-letter), then the city
 * is the word(s) between the last street-type token and the state.
 */
function parseZillowSlug(slug: string): ParsedAddress {
  const parts = slug.split("-");

  // Extract zip (last part, 5 digits)
  let zip = "";
  if (parts.length > 0 && /^\d{5}$/.test(parts[parts.length - 1])) {
    zip = parts.pop()!;
  }

  // Extract state (now last part, 2-letter abbreviation)
  let state = "";
  if (parts.length > 0 && STATE_ABBRS.has(parts[parts.length - 1].toUpperCase())) {
    state = parts.pop()!.toUpperCase();
  }

  // Now we need to separate street address from city.
  // Heuristic: walk backwards from the end to find where the city starts.
  // City names are typically 1-3 words; street addresses end with a street
  // type (St, Ave, Rd, Dr, Ln, Blvd, Ct, Way, Cir, Pl, Pkwy, Ter, Loop).
  const streetTypes = /^(St|Ave|Rd|Dr|Ln|Blvd|Ct|Way|Cir|Pl|Pkwy|Ter|Loop|Trail|Trl|Hwy|Pike)$/i;

  let splitIdx = -1;
  for (let i = 0; i < parts.length; i++) {
    if (streetTypes.test(parts[i])) {
      splitIdx = i;
    }
  }

  let address: string;
  let city: string;

  if (splitIdx >= 0 && splitIdx < parts.length - 1) {
    // Everything up to and including the street type is the address
    address = parts.slice(0, splitIdx + 1).join(" ");
    city = parts.slice(splitIdx + 1).join(" ");
  } else {
    // Fallback: assume last word before state is the city
    if (parts.length > 1) {
      city = parts.pop()!;
      address = parts.join(" ");
    } else {
      address = parts.join(" ");
      city = "";
    }
  }

  return { address, city, state, zip };
}

/**
 * Realtor.com slugs use underscores between address/city/state/zip:
 *   "123-Main-St_Louisville_KY_40202_MxxxxxxM"
 * Hyphens within each segment replace spaces.
 */
function parseRealtorSlug(slug: string): ParsedAddress {
  // Strip MLS ID suffix (e.g., _M12345-67890)
  const cleaned = slug.split("_M")[0];
  const segments = cleaned.split("_");

  const address = (segments[0] || "").replace(/-/g, " ").trim();
  const city = (segments[1] || "").replace(/-/g, " ").trim();
  const state = (segments[2] || "").toUpperCase().trim();
  const zip = (segments[3] || "").trim();

  return { address, city, state, zip };
}
