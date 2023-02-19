"use strict";
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
exports.Todorouter = void 0;
const Todo_1 = require("./../model/Todo");
const express_1 = require("express");
exports.Todorouter = (0, express_1.Router)();
exports.Todorouter.get("/getall", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const alltodos = yield Todo_1.TodoModel.find({});
        return res.status(201).json(alltodos);
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
}));
exports.Todorouter.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const flag = yield Todo_1.TodoModel.exists({ title: req.body.title });
        if (flag) {
            return res
                .status(500)
                .json({ error: "todo with this title already exists" });
        }
        if (req.body.title == null ||
            req.body.title == undefined ||
            req.body.author == null ||
            req.body.author == undefined) {
            return res
                .status(403)
                .json({ error: "title and author must be specified" });
        }
        const newTodo = yield Todo_1.TodoModel.create({
            title: req.body.title,
            author: req.body.author,
            body: req.body.body,
        });
        yield newTodo.save();
        return res.status(200).json(newTodo);
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
}));
exports.Todorouter.put("/done", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todo = yield Todo_1.TodoModel.findById(req.body.id);
        if (todo == null) {
            return res.status(404).json({ error: "can't find todo by this id" });
        }
        if (todo.done) {
            return res.status(403).json({ error: "todo already done" });
        }
        const now = new Date();
        todo.done = yield true;
        todo.doneAte = yield now;
        yield todo.save();
        return res.status(200).json(todo);
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
}));
exports.Todorouter.delete("/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.id == undefined ||
            req.body.id == null ||
            req.body.id.length < 24) {
            return res
                .status(404)
                .json({ error: "request id can not be null or < 24" });
        }
        const todo = yield Todo_1.TodoModel.findById(req.body.id);
        if (todo == null) {
            return res.status(404).json({ error: "can't find todo by this id" });
        }
        Todo_1.TodoModel.deleteOne({ _id: req.body.id }, function (err) {
            if (err)
                return err;
            // deleted at most one tank document
        });
        return res
            .status(200)
            .json({ flag: true, message: `todo by title ${todo.title} was deleted` });
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
}));
