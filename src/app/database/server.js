const express = require('express');
const cors = require('cors');
const sequelize = require('./connection');
const Account = require('./models/account');
const Role = require('./models/roles');
const Product = require('./models/products'); 
const Employee = require('./models/employee');
const Category = require('./models/categories');
const ProductImage = require('./models/productimages');
const Receipt = require('./models/receipt');
const ReceiptDetail = require('./models/receiptdetail');
const Customer = require('./models/customer');
// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:4200',  // Replace with the URL of your Angular app
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const JWT_SECRET = crypto.randomBytes(64).toString('base64');

// Sync database
sequelize.sync();

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const account = await Account.findOne({ where: { AccountUsername: username }, include: Role });
    if (!account) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isValidPassword = Account.findOne({ where: { AccountPassword: password } });
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: account.AccountId, role: account.RoleId }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }

  // const account = await Account.findOne({ where: { AccountUsername: username }, include: Role });
  // if (!account) {
  //   return res.status(401).json({ message: 'Invalid username or password' });
  // }

  // const isValidPassword = Account.findOne({ where: { AccountPassword: password }});
  // // await bcrypt.compare(password, account.AccountPassword);
  // if (!isValidPassword) {
  //   return res.status(401).json({ message: 'Invalid username or password' });
  // }

  // const token = jwt.sign({ id: account.AccountId, role: account.RoleId }, JWT_SECRET, { expiresIn: '1h' });


  // res.json({ token });
});

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.sendStatus(401);
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

// Define routes for accounts
app.get('/accounts', authenticateJWT, async (req, res) => {
  const accounts = await Account.findAll({ include: Role });
  res.json(accounts);
});

app.get('/accounts/:id', authenticateJWT, async (req, res) => {
  const account = await Account.findByPk(req.params.id, { include: Role });
  if (account) {
    res.json(account);
  } else {
    res.status(404).send('Account not found');
  }
});

app.post('/accounts', authenticateJWT, async (req, res) => {
  const account = await Account.create(req.body);
  res.status(201).json(account);
});

app.put('/accounts/:id', authenticateJWT, async (req, res) => {
  const account = await Account.findByPk(req.params.id);
  if (account) {
    await account.update(req.body);
    res.json(account);
  } else {
    res.status(404).send('Account not found');
  }
});

app.delete('/accounts/:id', authenticateJWT, async (req, res) => {
  const account = await Account.findByPk(req.params.id);
  if (account) {
    await account.destroy();
    res.status(204).send();
  } else {
    res.status(404).send('Account not found');
  }
});

// Define routes for products
app.post('/products', authenticateJWT, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/products', authenticateJWT, async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/products/:id', authenticateJWT, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/products/:id', authenticateJWT, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.update(req.body);
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/products/:id', authenticateJWT, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Define routes for employees
app.get('/employees', authenticateJWT, async (req, res) => {
  try {
    const employees = await Employee.findAll({ include: Account });
    res.status(200).json(employees);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/employees/:id', authenticateJWT, async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id, { include: Account });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/employees', authenticateJWT, async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/employees/:id', authenticateJWT, async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    await employee.update(req.body);
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/employees/:id', authenticateJWT, async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    await employee.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Define routes for categories
app.post('/categories', authenticateJWT, async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/categories', authenticateJWT, async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/categories/:id', authenticateJWT, async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/categories/:id', authenticateJWT, async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    await category.update(req.body);
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/categories/:id', authenticateJWT, async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    await category.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Define routes for product images
app.post('/productimages', authenticateJWT, async (req, res) => {
  try {
    const productImage = await ProductImage.create(req.body);
    res.status(201).json(productImage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/productimages', authenticateJWT, async (req, res) => {
  try {
    const productImages = await ProductImage.findAll();
    res.status(200).json(productImages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/productimages/:id', authenticateJWT, async (req, res) => {
  try {
    const productImage = await ProductImage.findByPk(req.params.id);
    if (!productImage) {
      return res.status(404).json({ message: 'Product image not found' });
    }
    res.status(200).json(productImage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/productimages/:id', authenticateJWT, async (req, res) => {
  try {
    const productImage = await ProductImage.findByPk(req.params.id);
    if (!productImage) {
      return res.status(404).json({ message: 'Product image not found' });
    }
    await productImage.update(req.body);
    res.status(200).json(productImage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/productimages/:id', authenticateJWT, async (req, res) => {
  try {
    const productImage = await ProductImage.findByPk(req.params.id);
    if (!productImage) {
      return res.status(404).json({ message: 'Product image not found' });
    }
    await productImage.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Define routes for receipts
app.post('/receipts', authenticateJWT, async (req, res) => {
  try {
    const receipt = await Receipt.create(req.body);
    res.status(201).json(receipt);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/receipts', authenticateJWT, async (req, res) => {
  try {
    const receipts = await Receipt.findAll();
    res.status(200).json(receipts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/receipts/:id', authenticateJWT, async (req, res) => {
  try {
    const receipt = await Receipt.findByPk(req.params.id);
    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }
    res.status(200).json(receipt);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/receipts/:id', authenticateJWT, async (req, res) => {
  try {
    const receipt = await Receipt.findByPk(req.params.id);
    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }
    await receipt.update(req.body);
    res.status(200).json(receipt);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/receipts/:id', authenticateJWT, async (req, res) => {
  try {
    const receipt = await Receipt.findByPk(req.params.id);
    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }
    await receipt.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Define routes for receipt details
app.post('/receiptdetails', authenticateJWT, async (req, res) => {
  try {
    const receiptDetail = await ReceiptDetail.create(req.body);
    res.status(201).json(receiptDetail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/receiptdetails', authenticateJWT, async (req, res) => {
  try {
    const receiptDetails = await ReceiptDetail.findAll();
    res.status(200).json(receiptDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/receiptdetails/:receiptId/:productId', authenticateJWT, async (req, res) => {
  try {
    const receiptDetail = await ReceiptDetail.findOne({
      where: {
        ReceiptId: req.params.receiptId,
        ProductId: req.params.productId
      }
    });
    if (!receiptDetail) {
      return res.status(404).json({ message: 'Receipt detail not found' });
    }
    res.status(200).json(receiptDetail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/receiptdetails/:receiptId/:productId', authenticateJWT, async (req, res) => {
  try {
    const receiptDetail = await ReceiptDetail.findOne({
      where: {
        ReceiptId: req.params.receiptId,
        ProductId: req.params.productId
      }
    });
    if (!receiptDetail) {
      return res.status(404).json({ message: 'Receipt detail not found' });
    }
    await receiptDetail.update(req.body);
    res.status(200).json(receiptDetail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/receiptdetails/:receiptId/:productId', authenticateJWT, async (req, res) => {
  try {
    const receiptDetail = await ReceiptDetail.findOne({
      where: {
        ReceiptId: req.params.receiptId,
        ProductId: req.params.productId
      }
    });
    if (!receiptDetail) {
      return res.status(404).json({ message: 'Receipt detail not found' });
    }
    await receiptDetail.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Define routes for customers
app.post('/customers', authenticateJWT, async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/customers', authenticateJWT, async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.status(200).json(customers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/customers/:id', authenticateJWT, async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/customers/:id', authenticateJWT, async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    await customer.update(req.body);
    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/customers/:id', authenticateJWT, async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    await customer.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
