const express = require("express");
const router = express.Router();
const {
  getLists,
  addList,
  removeList,
  updateList,
} = require("../controllers/lists");

router.route("/").get(getLists).post(addList);

router.route("/:id").delete(removeList).patch(updateList);

module.exports = router;
