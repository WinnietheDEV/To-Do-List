const List = require("../model/List");
const { NotFoundError, BadRequestError } = require("../error");
const { StatusCodes } = require("http-status-codes");

const getLists = async (req, res) => {
  const { search } = req.query;
  const queryObject = {};
  if (search) {
    queryObject.name = { $regex: search, $options: "i" };
  }

  const lists = await List.find(queryObject);
  const listCount = lists.length;

  res.status(StatusCodes.OK).json({ lists, listCount });
};

const addList = async (req, res) => {
  const { name: listName } = req.body;

  if (!listName) {
    throw new BadRequestError("please provide to-do list");
  }

  const list = await List.create({ name: listName });

  res.status(StatusCodes.CREATED).json({ list });
};

const removeList = async (req, res) => {
  const { id: taskID } = req.params;
  const list = await List.findOneAndDelete({ _id: taskID });
  if (!list) {
    throw new NotFoundError(`no list with id ${taskID}`);
  }
  res.status(StatusCodes.OK).json({ list });
};

const updateList = async (req, res) => {
  const { id: taskID } = req.params;
  const complete = req.body;
  const list = await List.findOneAndUpdate({ _id: taskID }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!list) {
    throw new NotFoundError(`no list with id ${taskID}`);
  }
  res.status(StatusCodes.OK).json({ list });
};

module.exports = { getLists, addList, removeList, updateList };
