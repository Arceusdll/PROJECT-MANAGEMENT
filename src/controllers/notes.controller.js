import asyncHandler from 'express-async-handler';
import ProjectNote from '../models/projectNote.model.js';   
import { User } from '../models/user.models.js';
import { Project } from '../models/project.model.js';
import mongoose from 'mongoose';
import {ApiResponse} from '../utils/apiResponse.js';




export const createNote = asyncHandler(async (req, res) => {
  const { project, content } = req.body;

  // 1. Validate input
  if (!project || !content) {
    throw new ApiError(400, "Project and content are required");
  }

  // 2. Check valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(project)) {
    throw new ApiError(400, "Invalid project ID");
  }

  // 3. Check if project exists
  const projectExists = await Project.findById(project);
  if (!projectExists) {
    throw new ApiError(404, "Project not found");
  }

  // 4. Create note
  const note = await ProjectNote.create({
    project,
    content,
    createdBy: req.user._id
  });

  res
    .status(201)
    .json(new ApiResponse(true, "Note created successfully", note));
});