
import Customer from '../../../models/Customer';

export default async function handler(req, res) {
  const { method } = req;

  await connectToDatabase(); // Connect to MongoDB

  switch (method) {
    // GET /api/customer - Fetch all customers
    case 'GET':
      try {
        const customers = await Customer.find(); // Fetch all customers
        res.status(200).json({ success: true, data: customers });
      } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch customers', error: error.message });
      }
      break;

    // POST /api/customer - Create a new customer
    case 'POST':
      try {
        const customer = new Customer(req.body); // Create a new customer instance
        await customer.save(); // Save the customer to the database
        res.status(201).json({ success: true, data: customer });
      } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to create customer', error: error.message });
      }
      break;

    // Default: method not allowed
    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
}

