import { allPhotos } from "../content/photos.js";

/** What makes a listing complete, and where to fix each part. */
export function listingChecks(b) {
  return [
    { done: allPhotos(b).length >= 3, label: "At least 3 photos", to: "/dashboard/photos" },
    { done: (b.description || "").length >= 120, label: "A description of a few sentences", to: "/dashboard/listing" },
    { done: !!b.tagline, label: "A one-line tagline", to: "/dashboard/listing" },
    { done: (b.services || []).length >= 3, label: "At least 3 services", to: "/dashboard/listing" },
    { done: !!b.hours, label: "Opening hours", to: "/dashboard/listing#hours" },
    { done: !!b.priceFrom, label: "A starting price", to: "/dashboard/listing#prices" },
    { done: !!(b.suburb && b.at), label: "Suburb and map pin", to: "/dashboard/listing#location" },
    { done: (b.payments || []).length > 0, label: "How customers can pay", to: "/dashboard/listing#prices" },
  ];
}
