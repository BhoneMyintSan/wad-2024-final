import dbConnect from '../../../lib/dbConnect'; // Use relative path
import Customer from '../../../models/Customer';

export default async function handler(req, res) {
    await dbConnect(); // Connect to the database

    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const customers = await Customer.find();
                res.status(200).json({ success: true, data: customers });
            } catch (error) {
                res.status(500).json({ success: false, message: 'Failed to fetch customers', error: error.message });
            }
            break;
        case 'POST':
            try {
                const customer = new Customer(req.body);
                await customer.save();
                res.status(201).json({ success: true, data: customer });
            } catch (error) {
                res.status(400).json({ success: false, message: 'Failed to create customer', error: error.message });
            }
            break;
        default:
            res.status(405).json({ success: false, message: 'Method not allowed' });
            break;
    }
}
