import { TodoModel } from "./../model/Todo";
import { Request, Response, Router } from "express";

export const Todorouter = Router();

Todorouter.get("/getall", async (req: Request, res: Response) => {
  try {
    const alltodos = await TodoModel.find({});
    return res.status(201).json(alltodos);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

Todorouter.post("/create", async (req: Request, res: Response) => {
  try {
    const flag = await TodoModel.exists({ title: req.body.title });
    if (flag) {
      return res
        .status(500)
        .json({ error: "todo with this title already exists" });
    }
    if (
      req.body.title == null ||
      req.body.title == undefined ||
      req.body.author == null ||
      req.body.author == undefined
    ) {
      return res
        .status(403)
        .json({ error: "title and author must be specified" });
    }
    const newTodo = await TodoModel.create({
      title: req.body.title,
      author: req.body.author,
      body: req.body.body,
    });

    await newTodo.save();
    return res.status(200).json(newTodo);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

Todorouter.put("/done", async (req: Request, res: Response) => {
  try {
    const todo = await TodoModel.findById(req.body.id);

    if (todo == null) {
      return res.status(404).json({ error: "can't find todo by this id" });
    }
    if (todo.done) {
      return res.status(403).json({ error: "todo already done" });
    }
    const now = new Date();
    todo.done = await true;
    todo.doneAte = await now;

    await todo.save();
    return res.status(200).json(todo);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

Todorouter.delete("/delete", async (req: Request, res: Response) => {
  try {
    if (
      req.body.id == undefined ||
      req.body.id == null ||
      req.body.id.length < 24
    ) {
      return res
        .status(404)
        .json({ error: "request id can not be null or < 24" });
    }

    const todo = await TodoModel.findById(req.body.id);
    if (todo == null) {
      return res.status(404).json({ error: "can't find todo by this id" });
    }
    TodoModel.deleteOne({ _id: req.body.id }, function (err) {
      if (err) return err;
      // deleted at most one tank document
    });
    return res
      .status(200)
      .json({ flag: true, message: `todo by title ${todo.title} was deleted` });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});
