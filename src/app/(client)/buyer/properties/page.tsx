"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useBrokerage } from "@/hooks/useBrokerage";
import { useTransactions } from "@/hooks/useTransaction";
import { useTransaction, createTransaction } from "@/hooks/useTransaction";
import { PropertyCard } from "@/components/buyer/PropertyCard";
import { NeighborhoodData } from "@/components/buyer/NeighborhoodData";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { Property, PropertyStatus } from "@/types";
import { parseListingUrl } from "@/lib/parseListingUrl";
import type { ParsedAddress } from "@/lib/parseListingUrl";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { PermissionGate } from "@/components/shared/PermissionGate";

export default function PropertiesPage() {
  const { user } = useAuth();
  const { brokerage } = useBrokerage();
  const { transactions, refresh: refreshTxs } = useTransactions(
    brokerage?.id || "",
    user?.id || ""
  );
  const buyingTx = transactions.find((t) => t.type === "buying");
  const { properties, addProperty } = useTransaction(buyingTx?.id || "");

  // Auto-create a buying transaction if the buyer doesn't have one yet
  const creatingTx = useRef(false);
  useEffect(() => {
    if (!user?.id || !brokerage?.id) return;
    if (buyingTx || creatingTx.current) return;
    // Only fire once transactions have loaded (array exists but no buying tx)
    if (transactions.length === 0 && !buyingTx) {
      // Wait — transactions may still be loading on first render.
      // We check: if transactions array is populated OR if we've loaded at
      // least once. The useTransactions hook sets loading=false after fetch,
      // so an empty array means truly no transactions.
      return;
    }
    creatingTx.current = true;
    createTransaction({
      brokerageId: brokerage.id,
      clientId: user.id,
      type: "buying",
      status: "active",
      label: "Home Search",
    }).then(() => {
      refreshTxs();
      creatingTx.current = false;
    });
  }, [user?.id, brokerage?.id, buyingTx, transactions, refreshTxs]);

  const [showAdd, setShowAdd] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | "all">(
    "all"
  );
  const [sortBy, setSortBy] = useState<"price" | "rating" | "date">("date");

  async function quickAddFromUrl() {
    const trimmed = urlInput.trim();
    if (!trimmed || !buyingTx) return;
    const parsed = parseListingUrl(trimmed);
    await addProperty({
      transactionId: buyingTx.id,
      address: parsed.address || trimmed,
      city: parsed.city,
      state: parsed.state,
      zip: parsed.zip,
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
    <PermissionGate transactionId={buyingTx?.id} permission="property">
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight text-on-surface font-serif">My Properties</h1>
        <Button variant="cta" size="sm" onClick={() => setShowAdd(true)}>
          <MaterialIcon name="add" size={16} />
          Add Property
        </Button>
      </div>

      {/* Quick-add from MLS/Zillow link */}
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 bg-surface border border-outline-variant rounded-lg px-3 py-2.5">
          <MaterialIcon name="link" size={16} className="text-on-surface-variant shrink-0" />
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && quickAddFromUrl()}
            placeholder="Paste a Zillow or Realtor.com link to quick-add a property..."
            aria-label="Paste a listing URL"
            className="flex-1 text-sm bg-transparent focus:outline-none text-on-surface placeholder:text-on-surface-variant"
          />
        </div>

        <Button
          variant="cta"
          size="sm"
          onClick={quickAddFromUrl}
          disabled={!urlInput.trim() || !buyingTx}
        >
          Add
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <MaterialIcon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by address or city..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-outline-variant bg-surface text-on-surface text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as PropertyStatus | "all")
          }
          className="px-3 py-2 rounded-xl border border-outline-variant bg-surface text-on-surface text-sm"
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
          className="px-3 py-2 rounded-xl border border-outline-variant bg-surface text-on-surface text-sm"
        >
          <option value="date">Newest First</option>
          <option value="price">Highest Price</option>
          <option value="rating">Highest Rating</option>
        </select>
      </div>

      {/* Property grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onClick={() => setSelectedProperty(property)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-on-surface-variant">
          <MaterialIcon name="tune" size={40} className="mx-auto mb-3 opacity-50" />
          <p>No properties yet.</p>
          <p className="text-sm mt-1">
            Add properties you are interested in to track them here.
          </p>
        </div>
      )}

      {/* Property detail modal with neighborhood data */}
      <Modal
        open={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
        title={selectedProperty?.address || "Property Details"}
        maxWidth="max-w-2xl"
      >
        {selectedProperty && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-on-surface-variant">
              <span>{selectedProperty.beds} bed</span>
              <span>{selectedProperty.baths} bath</span>
              <span>{selectedProperty.sqft.toLocaleString()} sqft</span>
              <span className="font-bold text-on-surface">
                ${selectedProperty.price.toLocaleString()}
              </span>
            </div>
            <hr className="border-outline-variant" />
            <NeighborhoodData
              address={selectedProperty.address}
              city={selectedProperty.city}
              state={selectedProperty.state}
              zip={selectedProperty.zip}
            />
          </div>
        )}
      </Modal>

      {/* Add property modal */}
      <AddPropertyModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={async (data) => {
          if (!buyingTx) return;
          await addProperty({
            ...data,
            transactionId: buyingTx.id,
          });
          setShowAdd(false);
        }}
      />
    </div>
    </PermissionGate>
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
    const parsed = parseListingUrl(value);
    if (parsed.address) {
      setAddress(parsed.address);
      if (parsed.city) setCity(parsed.city);
      if (parsed.state) setState(parsed.state);
      if (parsed.zip) setZip(parsed.zip);
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
          <label className="block text-sm font-medium text-on-surface mb-1">
            MLS / Zillow Link
          </label>
          <div className="flex items-center gap-2 border border-outline-variant rounded-xl px-3 py-2 bg-surface">
            <MaterialIcon name="link" size={14} className="text-on-surface-variant shrink-0" />
            <input
              type="url"
              value={mlsUrl}
              onChange={(e) => handleUrlPaste(e.target.value)}
              placeholder="Paste listing URL to auto-fill address..."
              className="flex-1 text-sm bg-transparent focus:outline-none text-on-surface placeholder:text-on-surface-variant"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface mb-1">
            Address
          </label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface text-on-surface"
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">
              City
            </label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface text-on-surface"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">
              State
            </label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface text-on-surface"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">
              ZIP
            </label>
            <input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface text-on-surface"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface mb-1">
            Price
          </label>
          <input
            type="number"
            required
            value={price || ""}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface text-on-surface"
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">
              Beds
            </label>
            <input
              type="number"
              value={beds}
              onChange={(e) => setBeds(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface text-on-surface"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">
              Baths
            </label>
            <input
              type="number"
              value={baths}
              onChange={(e) => setBaths(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface text-on-surface"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">
              Sq Ft
            </label>
            <input
              type="number"
              value={sqft}
              onChange={(e) => setSqft(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface text-on-surface"
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
