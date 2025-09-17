// components/BuyerForm.tsx
"use client";
import React, { useState } from "react";
import { z } from "zod";
import { buyerCreateSchema } from "@/lib/validators";
import { useRouter } from "next/navigation";

type Props = {
  initial?: Partial<any>;
  onSuccess?: (buyer: any) => void;
  submitUrl?: string; // POST /api/buyers or PUT /api/buyers/:id
  method?: "POST" | "PUT";
};

export default function BuyerForm({
  initial = {},
  onSuccess,
  submitUrl = "/api/buyers",
  method = "POST",
}: Props) {
  const [form, setForm] = useState<any>({ ...initial });
  const [errors, setErrors] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (k: string, v: any) =>
    setForm((s: any) => ({ ...s, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors(null);
    // client validate
    const result = buyerCreateSchema.safeParse(form);
    if (!result.success) {
      setErrors(result.error.flatten());
      setLoading(false);
      return;
    }
    // include updatedAt if present (for edit)
    const payload = { ...result.data, updatedAt: form.updatedAt };
    let res;
    try {
      res = await fetch(submitUrl, {
        method,
        body: JSON.stringify(payload),
        headers: { "content-type": "application/json" },
      });
    } catch (err: any) {
      setErrors({ network: err.message ?? String(err) });
      setLoading(false);
      return;
    }

    // Safely parse JSON, but fall back to text for non-JSON responses
    let js: any = null;
    try {
      js = await res.json();
    } catch (e) {
      try {
        const txt = await res.text();
        js = { error: txt || `HTTP ${res.status}` };
      } catch (_) {
        js = { error: `HTTP ${res.status}` };
      }
    }

    if (!res.ok) {
      setErrors(js.error ?? js);
      setLoading(false);
      return;
    }
    setLoading(false);
    onSuccess?.(js.buyer ?? js);
    router.push("/buyers");
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm">Full name</label>
        <input
          value={form.fullName ?? ""}
          onChange={(e) => handleChange("fullName", e.target.value)}
          className="border p-2 w-full"
        />
        {errors?.fieldErrors?.fullName && (
          <div className="text-red-600">
            {errors.fieldErrors.fullName.join(", ")}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm">Phone</label>
          <input
            value={form.phone ?? ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="border p-2 w-full"
          />
          {errors?.fieldErrors?.phone && (
            <div className="text-red-600">
              {errors.fieldErrors.phone.join(", ")}
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input
            value={form.email ?? ""}
            onChange={(e) => handleChange("email", e.target.value)}
            className="border p-2 w-full"
          />
        </div>
      </div>

      <div>
        <label>City</label>
        <select
          value={form.city ?? "Chandigarh"}
          onChange={(e) => handleChange("city", e.target.value)}
          className="border p-2 w-full"
        >
          <option>Chandigarh</option>
          <option>Mohali</option>
          <option>Zirakpur</option>
          <option>Panchkula</option>
          <option>Other</option>
        </select>
      </div>

      <div>
        <label>Property Type</label>
        <select
          value={form.propertyType ?? "Apartment"}
          onChange={(e) => handleChange("propertyType", e.target.value)}
          className="border p-2 w-full"
        >
          <option>Apartment</option>
          <option>Villa</option>
          <option>Plot</option>
          <option>Office</option>
          <option>Retail</option>
        </select>
      </div>

      {["Apartment", "Villa"].includes(form.propertyType) && (
        <div>
          <label>BHK</label>
          <select
            value={form.bhk ?? ""}
            onChange={(e) => handleChange("bhk", e.target.value)}
            className="border p-2 w-full"
          >
            <option value="">Select</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="Studio">Studio</option>
          </select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Purpose</label>
          <select
            value={form.purpose ?? "Buy"}
            onChange={(e) => handleChange("purpose", e.target.value)}
            className="border p-2 w-full"
          >
            <option>Buy</option>
            <option>Rent</option>
          </select>
        </div>
        <div>
          <label>Timeline</label>
          <select
            value={form.timeline ?? "Exploring"}
            onChange={(e) => handleChange("timeline", e.target.value)}
            className="border p-2 w-full"
          >
            <option>0-3m</option>
            <option>3-6m</option>
            <option>{">6m"}</option>
            <option>Exploring</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Budget Min (INR)</label>
          <input
            type="number"
            value={form.budgetMin ?? ""}
            onChange={(e) =>
              handleChange(
                "budgetMin",
                e.target.value ? Number(e.target.value) : null
              )
            }
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label>Budget Max (INR)</label>
          <input
            type="number"
            value={form.budgetMax ?? ""}
            onChange={(e) =>
              handleChange(
                "budgetMax",
                e.target.value ? Number(e.target.value) : null
              )
            }
            className="border p-2 w-full"
          />
        </div>
      </div>

      <div>
        <label>Source</label>
        <select
          value={form.source ?? "Website"}
          onChange={(e) => handleChange("source", e.target.value)}
          className="border p-2 w-full"
        >
          <option>Website</option>
          <option>Referral</option>
          <option>Walk-in</option>
          <option>Call</option>
          <option>Other</option>
        </select>
      </div>

      <div>
        <label>Notes</label>
        <textarea
          value={form.notes ?? ""}
          onChange={(e) => handleChange("notes", e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label>Tags (comma separated)</label>
        <input
          value={(form.tags || []).join(", ")}
          onChange={(e) =>
            handleChange(
              "tags",
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            )
          }
          className="border p-2 w-full"
        />
      </div>

      <div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>

      {errors && typeof errors === "object" && (
        <pre className="text-sm text-red-600">
          {JSON.stringify(errors, null, 2)}
        </pre>
      )}
    </form>
  );
}
