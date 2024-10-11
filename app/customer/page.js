"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

export default function Home() {
  const APIBASE = "http://localhost:3000/api"; // Hardcode the API base URL for now
  const { register, handleSubmit, reset } = useForm();
  const [customers, setCustomers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editCustomerId, setEditCustomerId] = useState(null);

  // Function to start editing a customer
  const startEdit = (customer) => () => {
    setEditMode(true);
    setEditCustomerId(customer._id); // Set the customer id for updating
    reset(customer);
  };

  // Function to fetch all customers
  async function fetchCustomers() {
    try {
      const response = await fetch(`${APIBASE}/customer`); // Use hardcoded API base URL
      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }
      const data = await response.json();
      setCustomers(data.data); // Assuming your API sends a 'data' field
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  }

  // Function to create or update a customer
  const createCustomerOrUpdate = async (data) => {
    try {
      if (editMode) {
        const response = await fetch(`${APIBASE}/customer/${editCustomerId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`Failed to update customer: ${response.status}`);
        }
        alert("Customer updated successfully");
      } else {
        const response = await fetch(`${APIBASE}/customer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`Failed to add customer: ${response.status}`);
        }
        alert("Customer added successfully");
      }

      // Reset form fields
      reset({
        name: "",
        dateOfBirth: "",
        memberNumber: "",
        interests: "",
      });

      fetchCustomers(); // Refresh the customer list
    } catch (error) {
      console.error("Error creating/updating customer:", error);
    }
  };

  // Function to delete a customer by ID
  const deleteById = (id) => async () => {
    if (!confirm("Are you sure?")) return;

    try {
      const response = await fetch(`${APIBASE}/customer/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete customer: ${response.status}`);
      }
      alert("Customer deleted successfully");
      fetchCustomers(); // Refresh the customer list after deletion
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  // Fetch customers when the component is mounted
  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="flex flex-row gap-4">
      <div className="flex-1 w-64">
        <form onSubmit={handleSubmit(createCustomerOrUpdate)}>
          <div className="grid grid-cols-2 gap-4 m-4 w-1/2">
            <div>Name:</div>
            <div>
              <input
                name="name"
                type="text"
                {...register("name", { required: true })}
                className="border border-black w-full"
              />
            </div>
            <div>Date of Birth:</div>
            <div>
              <input
                name="dateOfBirth"
                type="date"
                {...register("dateOfBirth", { required: true })}
                className="border border-black w-full"
              />
            </div>
            <div>Member Number:</div>
            <div>
              <input
                name="memberNumber"
                type="number"
                {...register("memberNumber", { required: true })}
                className="border border-black w-full"
              />
            </div>
            <div>Interests:</div>
            <div>
              <input
                name="interests"
                type="text"
                {...register("interests", { required: true })}
                className="border border-black w-full"
              />
            </div>
            <div className="col-span-2">
              {editMode ? (
                <input
                  type="submit"
                  value="Update"
                  className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                />
              ) : (
                <input
                  type="submit"
                  value="Add"
                  className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                />
              )}
              {editMode && (
                <button
                  onClick={() => {
                    reset({ name: "", dateOfBirth: "", memberNumber: "", interests: "" });
                    setEditMode(false);
                  }}
                  className="ml-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
      <div className="border m-4 bg-slate-300 flex-1 w-64">
        <h1 className="text-2xl">Customers ({customers.length})</h1>
        <ul className="list-disc ml-8">
          {customers.map((c) => (
            <li key={c._id}>
              <button className="border border-black p-1/2" onClick={startEdit(c)}>
                📝
              </button>{" "}
              <button className="border border-black p-1/2" onClick={deleteById(c._id)}>
                ❌
              </button>{" "}
              <Link href={`/customer/${c._id}`} className="font-bold">
                {c.name}
              </Link>{" "}
              - {c.memberNumber}, Interests: {c.interests.join(", ")}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
