import { Op, Sequelize } from "sequelize";
import AWS from "aws-sdk";
import Tag from "../../../models/Tag.js";

export const GetAllTags = async (req, res) => {
    try {
        let limit = req.body.limit ? parseInt(req.body.limit) : 10;
        let page = req.body.page ? parseInt(req.body.page) : 1;
        let offset = (page - 1) * limit;
        let totalcount = await Tag.count({
            where: {
                deleted_at: null
            }
        })
        let tagResponse = await Tag.findAll({
            where: { deleted_at: null },
            // order: [["name", "ASC"]],
            limit: limit,
            offset: offset,
        });
        return res.json({
            status: true,
            respose_code: 200,
            response_message: "Data Found succsefully",
            data: tagResponse,
            totalcount: totalcount
        });
    } catch (error) {
        return res.json({
            status: false,
            response_message: "Error Occured!!!",
        });
    }
};


export const CreateNewTags = async (req, res) => {
    try {
        let { name } = req?.body;
        if (name == "") {
            return res.json({
                status: true,
                response_code: 400,
                response_message: "Please enterthe name",
            });
        }
        let createTag = await Tag.create({ name: name });
        if (createTag) {
            return res.json({
                status: true,
                response_code: 200,
                response_message: "data added succesfully!!!",
            });
        }
    } catch (error) {
        return res.json({
            status: false,
            response_message: "Error Occured!!!",
        });
    }
};

export const RemoveTag = async (req, res) => {
    try {
      let id = req.params.id;
      let date = new Date();
      let deleteTag = await Tag.update(
        { deleted_at: date },
        { where: { id: id } }
      );
      if (deleteTag[0] === 1) {
        return res.json({
          status: true,
          respose_code: 200,
          response_message: "Data deleted successfully!!!",
        });
      } else {
        return res.json({
          status: true,
          respose_code: 400,
          response_message: "Data is not deleted",
        });
      }
    } catch (error) {
      return res.json({
        status: false,
        response_message: "Error Occured!!!",
      });
    }
  };

  export const GetTagById = async (req, res) => {
    try {
      let id = req.params.id;
      let getTag = await Tag.findOne({ where: { id: id } });
      if (getTag) {
        return res.json({
          status: true,
          response_code: 200,
          response_message: "Data found successfully!!!",
          data: getTag,
        });
      } else {
        return res.json({
          status: false,
          response_code: 200,
          response_message: "Data not found!!",
        });
      }
    } catch (error) {
      return res.json({
        status: false,
        response_message: "Error Occured!!!",
      });
    }
  };

 export const UpdateTag = async (req, res) => {
    try {
      let id = req.params.id;
      let updatestate = await Tag.update({name:req.body.name}, {
        where: { id: id },
      });
      if (updatestate[0] === 1) {
        return res.json({
          status: true,
          response_code: 200,
          response_message: "data update successfully!!!",
        });
      }
    } catch (error) {
      return res.json({
        status: false,
        response_message: "Error Occured!!!",
      });
    }
  };