const Task = require('../model/task.model');
const paginationHelper = require('../../../helper/pagination');

//[GET] /api/v1/tasks/
module.exports.index = async (req, res) => {
  const find = {
    deleted: false
  };

  //Lọc theo trạng thái
  const status = req.query.status;
  if (status) {
    find.status = status;
  }
  //End lọc theo trạng thái

  //Sort
  const sortKey = req.query.sortKey;
  const sortValue = req.query.sortValue;
  const sort = {};
  if (sortKey && sortValue) {
    sort[sortKey] = sortValue;
  }
  //End sort

  //Pagination
  let objectPagination = {
    limitItems: 2,
    pageCurrent: 1
  }

  const countRecords = await Task.countDocuments(find);

  objectPagination = paginationHelper(objectPagination, req.query, countRecords);
  //End Pagination

  const tasks = await Task.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.pageSkip);
  res.json(tasks);
}

//[GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
  const id = req.params.id;
  const task = await Task.find({
    _id: id,
    deleted: false,
  })
  res.json(task);
}