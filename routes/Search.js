import express from "express";
import { searchAll } from "../controllers/SearchController.js";

const searchrouter = express.Router();

searchrouter.get("/", searchAll);

export default searchrouter;