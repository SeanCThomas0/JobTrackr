"use strict";
// backend/src/controllers/applicationController.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApplicationById = exports.getAllApplications = void 0;
const getAllApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Replace with actual logic to fetch applications from database
        const applications = []; // Fetch applications from database
        //res.status(200).json(applications);
    }
    catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getAllApplications = getAllApplications;
const getApplicationById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // Replace with actual logic to fetch application by ID from database
        const application = {}; // Fetch application from database
        if (!application) {
            res.status(404).json({ message: `Application with id ${id} not found` });
        }
        else {
            res.status(200).json(application);
        }
    }
    catch (error) {
        console.error(`Error fetching application with id ${id}:`, error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getApplicationById = getApplicationById;
