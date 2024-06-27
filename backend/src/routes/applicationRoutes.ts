// backend/src/routes/applicationRoutes.ts

import express from 'express';
import { getAllApplications, getApplicationById } from '../controllers/applicationController';

const router = express.Router();

// GET all applications
router.get('/', getAllApplications);

// GET application by ID
router.get('/:id', getApplicationById);

// POST new application
router.post('/', (req, res) => {
  // Implement create application logic
});

// PUT update application by ID
router.put('/:id', (req, res) => {
  // Implement update application logic
});

// DELETE application by ID
router.delete('/:id', (req, res) => {
  // Implement delete application logic
});

export default router;
