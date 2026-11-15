"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SubscriptionForm from "@/components/subscriptions/SubscriptionForm";
import SubscriptionTable from "@/components/subscriptions/SubscriptionTable";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Subscription = {
  id: string;
  customer: { _id: string; name: string; email: string };
  product: { _id: string; name: string; billingCycle: string };
  status: "Active" | "Paused" | "Cancelled" | "Past Due";
  startDate: string;
  nextBillingDate: string;
  price: number;
  billingCycle: "Monthly" | "Yearly" | "One-time";
};

type Customer = { id: string; name: string; email: string };
type Product = {
  id: string;
  name: string;
  price: number;
  billingCycle: string;
  status: string;
};

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchAll() {
      try {
        const [subRes, custRes, prodRes] = await Promise.all([
          fetch("/api/subscriptions"),
          fetch("/api/customers"),
          fetch("/api/products"),
        ]);

        const [subData, custData, prodData] = await Promise.all([
          subRes.json(),
          custRes.json(),
          prodRes.json(),
        ]);

        if (!subRes.ok) {
          throw new Error(subData.message || "Failed to fetch subscriptions");
        }
        if (!custRes.ok) {
          throw new Error(custData.message || "Failed to fetch customers");
        }
        if (!prodRes.ok) {
          throw new Error(prodData.message || "Failed to fetch products");
        }

        const formattedSubs = subData.data.map(
          (sub: Subscription & { _id: string }) => ({
            ...sub,
            id: sub._id,
          })
        );

        const formattedCustomers = custData.data.map(
          (c: Customer & { _id: string }) => ({
            ...c,
            id: c._id,
          })
        );

        const formattedProducts = prodData.data.map(
          (p: Product & { _id: string }) => ({
            ...p,
            id: p._id,
          })
        );

        setSubscriptions(formattedSubs);
        setCustomers(formattedCustomers);
        setProducts(formattedProducts);
      } catch (err) {
        console.error(err);
        setError("Unable to load subscriptions");
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  async function handleCreateSubscription(data: {
    customerId: string;
    productId: string;
    startDate: string;
  }) {
    const res = await fetch("/api/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to create subscription");
    const newSub = { ...result.data, id: result.data._id };
    setSubscriptions((prev) => [newSub, ...prev]);
    toast.success("Subscription created successfully");
  }

  async function handleUpdateStatus(id: string, status: string) {
    const res = await fetch(`/api/subscriptions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const result = await res.json();
    if (!res.ok) {
      toast.error(result.message || "Failed to update");
      return;
    }
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === id ? { ...result.data, id: result.data._id } : s
      )
    );
    toast.success(`Subscription ${status.toLowerCase()}`);
  }

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const searchTerm = search.toLowerCase();
    return (
      sub.customer.name.toLowerCase().includes(searchTerm) ||
      sub.product.name.toLowerCase().includes(searchTerm) ||
      sub.status.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <DashboardLayout title="Subscriptions">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Subscriptions</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage customer subscriptions
          </p>
        </div>

        <SubscriptionForm
          customers={customers}
          products={products}
          onAdd={handleCreateSubscription}
        />
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search by customer, product or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {loading ? (
        <p className="py-10 text-center text-gray-500">
          Loading subscriptions...
        </p>
      ) : error ? (
        <p className="py-10 text-center text-red-500">{error}</p>
      ) : (
        <SubscriptionTable
          subscriptions={filteredSubscriptions}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </DashboardLayout>
  );
}
