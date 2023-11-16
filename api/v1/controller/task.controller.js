const Task = require('../model/task.model');
const paginationHelper = require('../../../helper/pagination');
const searchHelper = require('../../../helper/search');

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

  //Search
  if (req.query.keyword) {
    const keyword = searchHelper(req.query).regex;
    find.title = keyword;
  }
  //End search

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

//[PATCH] /api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;
    await Task.updateOne({
      _id: id
    }, {
      status: status
    });
    res.json({
      code: 200,
      message: "Cập nhật trạng thái công việc thành công"
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Cập nhật trạng thái công việc thất bại"
    })
  }
}

//[PATCH] /api/v1/tasks/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const ids = req.body.ids;
    const key = req.body.key;
    const value = req.body.value;
    switch (key) {
      case "status":
        await Task.updateMany({ _id: { $in: ids } }, { "status": value });
        res.json({
          code: 200,
          message: "Cập nhật trạng thái công việc thành công"
        });
        break;
      default:
        res.json({
          code: 400,
          message: "Cập nhật công việc thất bại"
        });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Cập nhật công việc thất bại"
    });
  }
}

//[POST] /api/v1/tasks/create
module.exports.create = async (req, res) => {
  try {
    const data = new Task(req.body);
    await data.save();
    res.json({
      code: 200,
      message: "Thêm mới công việc thành công",
      data: data
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Thêm mới công việc thất bại"
    })
  }
}

//[PATCH] /api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    await Task.updateOne({ _id: id }, req.body);
    res.json({
      code: 200,
      message: "Cập nhật thành công"
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Cập nhật thất bại"
    })
  }
}

//[DELETE] /api/v1/tasks/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await Task.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() });
    res.json({
      code: 200,
      message: "Xóa công việc thành công"
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Xóa công việc thất bại"
    })
  }

}