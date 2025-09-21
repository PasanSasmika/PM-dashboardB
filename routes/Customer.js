import express from 'express';
import { createCustomer, deleteCustomer, getAllCustomers, getCustomerById, updateCustomer } from '../controllers/CustomerController.js';

const Customerrouter = express.Router();

Customerrouter.get('/', getAllCustomers);
Customerrouter.post('/', createCustomer);
Customerrouter.get('/:id', getCustomerById);
Customerrouter.put('/:id', updateCustomer);
Customerrouter.delete('/:id', deleteCustomer);

export default Customerrouter;