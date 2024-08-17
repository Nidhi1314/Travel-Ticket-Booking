import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import { Question } from "../models/question.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const uploadQuestion = asyncHandler( async (req, res) => {
    const {subject, examType, year, chapter, topic, content, options, correctOption, difficulty} = req.body;

    // if (
    //     [subject, examType, year, chapter, topic, content, correctOption, difficulty].some((field) => 
    //     field?.trim() === "")
    // ) {
    //     throw new ApiError(400 ,"All fields are required");
    // }

    const question = await Question.create({
        subject,
        examType,
        year,
        chapter,
        topic,
        content,
        options,
        correctOption,
        difficulty
    });

    
    const createdQuestion = await  Question.findById(question._id).select(
        ""
    );


    return res.status(201).json(new ApiResponse(200, createdQuestion, "Question uploaded successfully"));

})


const getQuestions = asyncHandler( async (req, res) => {

})


export {
    uploadQuestion
}