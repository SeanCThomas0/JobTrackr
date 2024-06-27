"use strict";
// backend/src/routes/applicationRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const applicationController_1 = require("../controllers/applicationController");
const router = express_1.default.Router();
// GET all applications
router.get('/', applicationController_1.getAllApplications);
// GET application by ID
router.get('/:id', applicationController_1.getApplicationById);
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
exports.default = router;
