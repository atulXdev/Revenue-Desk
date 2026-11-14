"use client"

import CustomerForm from "@/components/customers/CustomerForm";
import CustomerTable from "@/components/customers/CustomerTable";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useEffect, useState } from "react";
import EditCustomerDialog from "@/components/customers/EditCustomerDialog";
import CustomerSearch from "@/components/customers/CustomerSearch";
import { toast } from "sonner";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: "Active" | "Inactive";
};

export default function CustomersPage() {

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchCustomers(){
            try{
                const res = await fetch("/api/customers");
                const result = await res.json();

                if(!res.ok){
                    throw new Error(result.message || "Failed to fetch customer")
                }

                const formattedCustomers = result.data.map((customer: {
                    _id: string;
                    name: string;
                    email: string;
                    phone: string;
                    address: string;
                    status: "Active" | "Inactive";
                }) => ({
                    ...customer,
                    id: customer._id,
                }))

                setCustomers(formattedCustomers);
            }
            catch(error){
                console.error(error);
                setError("Unable to load customers");
            }
            finally{
                setLoading(false);
            }
        }

        fetchCustomers();
    }, []);

    async function handleAddCustomer(data: {
        name: string;
        email: string;
        phone: string;
        address: string;
    }){
        const res = await fetch("/api/customers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if(!res.ok){
            throw new Error(result.message || "Failed to create customer")
        }

        const newCustomer = {
            ...result.data,
            id: result.data._id,
        }

        setCustomers((prev) => [...prev, newCustomer]);
        toast.success("Customer added successfully");
    }

    async function handleDeleteCustomer(id: string){
        try{
            const res = await fetch(`/api/customers/${id}`,
                {
                   method: "DELETE" 
                }
            )

            const result = await res.json();

            if(!res.ok){
                throw new Error(result.message || "Failed to delete")
            }

            setCustomers((prev) => prev.filter((customer) => customer.id !== id))
            toast.success("Customer deleted successfully");
        }
        catch(error){
            console.error("Customer deletion failed:", error);
            toast.error("Failed to delete customer. Please try again.");
        }
    }

    async function handleUpdateCustomer(updatedCustomer: Customer){
        const res = await fetch(`/api/customers/${updatedCustomer.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedCustomer)
            }
        );

        const result = await res.json();

        if(!res.ok){
            throw new Error(result.message || "Failed to update customer"); 
        }

        const updatedData = {
            ...result.data,
            id: result.data._id,
        }

        setCustomers((prev) => prev.map((e) => e.id === updatedData.id ? updatedData : e))
        toast.success("Customer updated successfully");
    }

    const filteredCustomers = customers.filter((customer) => {
        const searchTerm = search.toLowerCase();

        return(
            customer.name.toLowerCase().includes(searchTerm) ||
            customer.email.toLowerCase().includes(searchTerm) ||
            customer.phone.toLowerCase().includes(searchTerm)
        )
    })

    return(
        <DashboardLayout title="Customers">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Customers</h2>
                    <p className="mt-1 text-sm text-gray-500">Manage your customer information</p>
                </div>

                <CustomerForm onAdd={handleAddCustomer} />

                    
            </div>
                <div className="mb-4">
                    <CustomerSearch search={search} onSearchChange={setSearch} />
                </div>

            {loading ? (
                    <div className="rounded-xl border bg-white p-10">
                        <div className="space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
                            ))}
                        </div>
                    </div>
                ) : error ? (
                    <div className="rounded-xl border bg-white p-10 text-center">
                        <p className="text-red-500">{error}</p>
                    </div>
                ) : (
                    <CustomerTable
                        customers={filteredCustomers}
                        onDelete={handleDeleteCustomer}
                        onEdit={setSelectedCustomer}
                    />
            )}

            <EditCustomerDialog customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} onUpdate={handleUpdateCustomer} />
        </DashboardLayout>
    )
}
