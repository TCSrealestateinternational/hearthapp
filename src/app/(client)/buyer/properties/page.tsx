"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useBrokerage } from "@/hooks/useBrokerage";
import { useTransactions } from "@/hooks/useTransaction";
import { useTransaction } from "@/hooks/useTransaction";
import { PropertyCard } from "@/components/buyer/PropertyCard";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { Property, PropertyStatus } from "@/types";
import { parseListingUrl } from "@/lib/parseListingUrl";
import { Link2, Plus, Search, SlidersHorizontal } from "lucide-react";

export default function PropertiesPage() {
  const { user } = useAuth();
  const { brokerage } = useBrokerage();
  const { transactions } = useTransactions(
    brokerage?.id || "",
    user?.id || ""
  );
  const buyingTx = transactions.find((t) => t.type === "buying");
  const { properties, addProperty } = useTransaction(buyingTx?.id || "");

  const [showAdd, setShowAdd] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | "all">(
    "all"
  );
  const [sortBy, setSortBy] = useState<"price" | "rating" | "date">("date");

  async function quickAddFromUrl() {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    const parsed = parseListingUrl(trimmed);
    await addProperty({
      transactionId: buyingTx?.id || "",
      address: parsed || trimmed,
      city: "",
      state: "",
      zip: "",
      price: 0,
      beds: 0,
      baths: 0,
      sqft: 0,
      status: "interested",
      rating: 0,
      notes: "",
      pros: [],
      cons: [],
      photos: [],
      mlsUrl: trimmed,
    });
    setUrlInput("");
  }

  const filtered = properties
    .filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          p.address.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // date order from Firestore
    });

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-text-primary">My Properties</h1>
        <Button variant="cta" size="sm" onClick={() => setShowAdd(true)}>
          <Plus size={16} />
          Add Property
        </Button>
      </div>

      {/* Quick-add from MLS/Zillow link */}
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-2.5">
          <Link2 size={16} className="text-text-secondary shrink-0" />
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && quickAddFromUrl()}
            placeholder="Paste a Zillow or Realtor.com link to quick-add a property..."
            className="flex-1 text-sm bg-transparent focus:outline-none text-text-primary placeholder:text-text-secondary"
          />
        </div>
        <Button
          variant="cta"
          size="sm"
          onClick={quickAddFromUrl}
          disabled={!urlInput.trim()}
        >
          Add
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by address or city..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-surface text-text-primary text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as PropertyStatus | "all")
          }
          className="px-3 py-2 rounded-lg border border-border bg-surface text-text-primary text-sm"
        >
          <option value="all">All Statuses</option>
          <option value="interested">Interested</option>
          <option value="toured">Toured</option>
          <option value="offer-pending">Offer Pending</option>
          <option value="offer-accepted">Offer Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-3 py-2 rounded-lg border border-border bg-surface text-text-primary text-sm"
        >
          <option value="date">Newest First</option>
          <option value="price">Highest Price</option>
          <option value="rating">Highest Rating</option>
        </select>
      </div>

      {/* Property grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-text-secondary">
          <SlidersHorizontal size={40} className="mx-auto mb-3 opacity-50" />
          <p>No properties yet.</p>
          <p className="text-sm mt-1">
            Add properties you are interested in to track them here.
          </p>
        </div>
      )}

      {/* Add property modal */}
      <AddPropertyModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={async (data) => {
          await addProperty({
            ...data,
            transactionId: buyingTx?.id || "",
          });
          setShowAdd(false);
        }}
      />
    </div>
  );
}

function AddPropertyModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Property, "id" | "createdAt" | "updatedAt">) => void;
}) {
  const [mlsUrl, setMlsUrl] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("KY");
  const [zip, setZip] = useState("");
  const [price, setPrice] = useState(0);
  const [beds, setBeds] = useState(3);
  const [baths, setBaths] = useState(2);
  const [sqft, setSqft] = useState(1500);

  function handleUrlPaste(value: string) {
    setMlsUrl(value);
    if (!address) {
      const parsed = parseListingUrl(value);
      if (parsed) setAddress(parsed);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      transactionId: "",
      address,
      city,
      state,
      zip,
      price,
      beds,
      baths,
      sqft,
      status: "interested",
      rating: 0,
      notes: "",
      pros: [],
      cons: [],
      photos: [],
      mlsUrl: mlsUrl || undefined,
    });
    // Reset
    setMlsUrl("");
    setAddress("");
    setCity("");
    setZip("");
    setPrice(0);
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Property">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            MLS / Zillow Link
          </label>
          <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2 bg-surface">
            <Link2 size={14} className="text-text-secondary shrink-0" />
            <input
              type="url"
              value={mlsUrl}
              onChange={(e) => handleUrlPaste(e.target.value)}
              placeholder="Paste listing URL to auto-fill address..."
              className="flex-1 text-sm bg-transparent focus:outline-none text-text-primary placeholder:text-text-secondary"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Address
          </label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary"
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              City
            </label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              State
            </label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              ZIP
            </label>
            <input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Price
          </label>
          <input
            type="number"
            required
            value={price || ""}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary"
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Beds
            </label>
            <input
              type="number"
              value={beds}
              onChange={(e) => setBeds(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Baths
            </label>
            <input
              type="number"
              value={baths}
              onChange={(e) => setBaths(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Sq Ft
            </label>
            <input
              type="number"
              value={sqft}
              onChange={(e) => setSqft(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="cta" type="submit">
            Add Property
          </Button>
        </div>
      </form>
    </Modal>
  );
}
