import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { getMapUrl, getFullAddress } from "@/lib/maps";

interface AddressLinkProps {
  address: string;
  city: string;
  state: string;
  zip: string;
  /** Show only the street address (hide city/state/zip). Default false. */
  compact?: boolean;
  className?: string;
}

export function AddressLink({
  address,
  city,
  state,
  zip,
  compact = false,
  className = "",
}: AddressLinkProps) {
  const url = getMapUrl(address, city, state, zip);
  const display = compact ? address : getFullAddress(address, city, state, zip);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex items-center gap-1 text-primary hover:underline ${className}`}
    >
      <MaterialIcon name="location_on" size={14} className="flex-shrink-0" />
      <span className="truncate">{display}</span>
    </a>
  );
}
