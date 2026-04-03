"use client";

import type { Property } from "@/types";
import { AddressLink } from "@/components/shared/AddressLink";
import { Star } from "lucide-react";

interface PropertyCompareProps {
  properties: Property[];
}

export function PropertyCompare({ properties }: PropertyCompareProps) {
  if (properties.length === 0) {
    return (
      <p className="text-center text-text-secondary py-8">
        Select properties to compare them side by side.
      </p>
    );
  }

  const fields: { label: string; render: (p: Property) => React.ReactNode }[] =
    [
      {
        label: "Price",
        render: (p) => `$${p.price.toLocaleString()}`,
      },
      { label: "Beds", render: (p) => p.beds },
      { label: "Baths", render: (p) => p.baths },
      { label: "Sq Ft", render: (p) => p.sqft.toLocaleString() },
      {
        label: "Year Built",
        render: (p) => p.yearBuilt || "-",
      },
      { label: "HOA", render: (p) => (p.hoa ? `$${p.hoa}/mo` : "None") },
      { label: "Lot Size", render: (p) => p.lotSize || "-" },
      { label: "Garage", render: (p) => p.garage || "-" },
      {
        label: "Rating",
        render: (p) => (
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={12}
                className={
                  s <= p.rating ? "fill-cta text-cta" : "text-border"
                }
              />
            ))}
          </div>
        ),
      },
      {
        label: "Status",
        render: (p) => (
          <span className="capitalize">{p.status.replace("-", " ")}</span>
        ),
      },
      {
        label: "Pros",
        render: (p) =>
          p.pros.length > 0 ? (
            <ul className="text-xs space-y-0.5">
              {p.pros.map((pro, i) => (
                <li key={i} className="text-success">
                  + {pro}
                </li>
              ))}
            </ul>
          ) : (
            "-"
          ),
      },
      {
        label: "Cons",
        render: (p) =>
          p.cons.length > 0 ? (
            <ul className="text-xs space-y-0.5">
              {p.cons.map((con, i) => (
                <li key={i} className="text-error">
                  - {con}
                </li>
              ))}
            </ul>
          ) : (
            "-"
          ),
      },
    ];

  return (
    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left py-2 pr-4 text-text-secondary font-medium sticky left-0 bg-background">
              Feature
            </th>
            {properties.map((p) => (
              <th
                key={p.id}
                className="text-left py-2 px-3 text-text-primary font-semibold min-w-[180px]"
              >
                <AddressLink
                  address={p.address}
                  city={p.city}
                  state={p.state}
                  zip={p.zip}
                  compact
                  className="text-text-primary font-semibold"
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {fields.map((field) => (
            <tr key={field.label} className="border-t border-border">
              <td className="py-2 pr-4 text-text-secondary font-medium sticky left-0 bg-background">
                {field.label}
              </td>
              {properties.map((p) => (
                <td key={p.id} className="py-2 px-3 text-text-primary">
                  {field.render(p)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
