// server.js
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // For handling large image payloads

// Routes
app.get('/api/canvas/:canvasId', async (req, res) => {
  try {
    const { canvasId } = req.params;
    const items = await prisma.item.findMany({
      where: { canvasId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/items', async (req, res) => {
  try {
    const savedItem = await prisma.item.create({
      data: req.body
    });
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = await prisma.item.update({
      where: { id: parseInt(id) },
      data: req.body
    });
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.item.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});