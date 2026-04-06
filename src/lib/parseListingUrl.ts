/**
 * Extracts a human-readable address from Zillow or Realtor.com listing URLs.
 * Returns empty string if URL is not recognized or invalid.
 */
export function parseListingUrl(url: string): string {
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace("www.", "");

    // Zillow: /homedetails/123-Main-St-City-ST-Zip_zpid/
    if (host.includes("zillow")) {
      const m = u.pathname.match(/\/homedetails\/([^/]+)/);
      if (m) {
        return m[1]
          .replace(/_\d+$/, "")
          .replace(/-/g, " ")
          .replace(/\s+/g, " ")
          .trim();
      }
    }

    // Realtor.com: /realestateandhomes-detail/123-Main-St_City_ST_Zip_MxxxxxxM
    if (host.includes("realtor")) {
      const m = u.pathname.match(/\/realestateandhomes-detail\/([^/?]+)/);
      if (m) {
        return m[1]
          .split("_M")[0]
          .replace(/_/g, ", ")
          .replace(/-/g, " ")
          .trim();
      }
    }
  } catch {
    // invalid URL — ignore
  }
  return "";
}
