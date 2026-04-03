/**
 * Build a Google Maps search URL for an address.
 * On mobile, tapping opens the user's maps app chooser (Google Maps, Apple Maps, Waze).
 * On desktop, opens Google Maps in the browser.
 */
export function getMapUrl(
  address: string,
  city: string,
  state: string,
  zip: string
): string {
  const full = getFullAddress(address, city, state, zip);
  return `https://maps.google.com/maps?q=${encodeURIComponent(full)}`;
}

/** Returns a formatted single-line address string. */
export function getFullAddress(
  address: string,
  city: string,
  state: string,
  zip: string
): string {
  return `${address}, ${city}, ${state} ${zip}`;
}
