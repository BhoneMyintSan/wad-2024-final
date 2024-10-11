import React from 'react';

// This function runs on the server to fetch data before rendering
export async function getServerSideProps({ params }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  // Fetch the customer data by ID from the API
  const res = await fetch(`${API_BASE}/customer/${params.id}`, { cache: "no-store" });
  const customer = await res.json();

  // Pass the customer data to the component as props
  return {
    props: {
      customer,
    },
  };
}

const Customer = ({ customer }) => {
  return (
    <div className="m-4">
      <h1>Customer</h1>
      <p className="font-bold text-xl text-blue-800">Name: {customer.name}</p>
      <p>Date of Birth: {new Date(customer.dateOfBirth).toLocaleDateString()}</p>
      <p>Member Number: {customer.memberNumber}</p>
      <p>Interests: {customer.interests.join(", ")}</p>
    </div>
  );
};

export default Customer;
