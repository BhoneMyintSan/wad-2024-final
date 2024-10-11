import dbConnect from '@/lib/dbConnect';
import Customer from '@/models/Customer';

// GET /api/customer/[id] - Fetch a customer by ID
export async function GET(request, { params }) {
  const { id } = params;

  try {
    await dbConnect(); // Connect to MongoDB

    const customer = await Customer.findById(id); // Find customer by ID

    if (!customer) {
      return new Response(JSON.stringify({ message: 'Customer not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(customer), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    return new Response(JSON.stringify({ message: 'Error fetching customer' }), { status: 500 });
  }
}

// DELETE /api/customer/[id] - Delete a customer by ID
export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    await dbConnect(); // Connect to MongoDB

    const customer = await Customer.findByIdAndDelete(id); // Find and delete customer by ID

    if (!customer) {
      return new Response(JSON.stringify({ message: 'Customer not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Customer deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return new Response(JSON.stringify({ message: 'Error deleting customer' }), { status: 500 });
  }
}
