import { Op, Sequelize } from "sequelize";
import AWS from "aws-sdk";
import News from "../../../models/News.js";
import NewsHeadline from "../../../models/NewsHeadline.js";

export const GetAllNews = async (req, res) => {
    try {
        let limit = req.body.limit ? parseInt(req.body.limit) : 10;
        let page = req.body.page ? parseInt(req.body.page) : 1;
        let offset = (page - 1) * limit;
        let totalcount = await News.count({
            where: {
                deleted_at: null,
            },
        })
        let newsResponse = await News.findAll({
            where: { deleted_at: null },
            // order: [["news", "ASC"]],
            include:[
              {
                model:NewsHeadline,
                as:"NewsHeadLineTitle",
                attributes:['id','title']
              }
            ],
            
            limit: limit,
            offset: offset,
        });
        return res.json({
            status: true,
            respose_code: 200,
            response_message: "Data Found succsefully",
            data: newsResponse,
            totalcount: totalcount
        });
    } catch (error) {
        return res.json({
            status: false,
            response_message: "Error Occured!!!",
            error: error.message
        });
    }
};


export const CreateNewNews = async (req, res) => {
    try {
        let { news } = req?.body;
        if (news == "") {
            return res.json({
                status: true,
                response_code: 400,
                response_message: "Please enterthe news",
            });
        }
        let createNews = await News.create({ news: news });
        if (createNews) {
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

export const RemoveNews = async (req, res) => {
    try {
      let id = req.params.id;
      let date = new Date();
      let deleteNews = await News.update(
        { deleted_at: date },
        { where: { id: id } }
      );
      if (deleteNews[0] === 1) {
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

  export const GetNewsById = async (req, res) => {
    try {
      let id = req.params.id;
      let getNews = await News.findOne({ where: { id: id } });
      if (getNews) {
        return res.json({
          status: true,
          response_code: 200,
          response_message: "Data found successfully!!!",
          data: getNews,
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

 export const UpdateNews = async (req, res) => {
    try {
      let id = req.params.id;
      let updatestate = await News.update({news:req.body.news}, {
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