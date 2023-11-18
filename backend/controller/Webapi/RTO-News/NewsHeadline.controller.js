import { Op, Sequelize } from "sequelize";
import NewsCategory from "../../../models/NewsCategory.js";
import NewsHeadline from "./../../../models/NewsHeadline.js"
import AWS from "aws-sdk";
import Categories from "../../../models/Categories.js";
import Brands from "../../../models/Brands.js";
import fileUpload from "../../../helpers/fileUpload.js";

export const handleFetchNewsHeadline = async (req, res) => {
    let { limit, page } = req.body
    page = parseInt(page) || 1;
    limit = limit ? limit : 10
    let offset = (page - 1) * limit;
    try {
        let getNewsHeadlines = await NewsHeadline.findAll({
            where: { deleted_at: null },
            limit: limit,
            offset: offset,
            include: [
                {
                    model: Categories,
                    as: "newsVehicleCategory"
                },
                {
                    model: Brands,
                    as: "newsVehicleBrands"
                },
            ]
        });
        if (getNewsHeadlines) {
            for (const item of getNewsHeadlines) {
                if (item.dataValues.category_id) {
                    let categoryId = item.dataValues.category_id.split(',');
                    let boj = await NewsCategory.findAll({
                        where: {
                            id: {
                                [Op.in]: categoryId
                            }
                        }
                    })
                    item.dataValues.newsHeadlineCategory = boj;
                }
            }
            return res.json({
                status: true,
                response_code: 200,
                response_message: "data found succesfully!!!",
                data: getNewsHeadlines,
                totalcount: getNewsHeadlines.length
            })
        } else {

            return res.json({
                status: false,
                response_code: 404,
                response_message: "data Not found!!!",
                data: [],
            })
        }

    } catch (error) {
        // console.log(error)
        res.json({ error: error.message })
    }
}

export const handleGetNewsCategoryById = async (req, res) => {
    const { id } = req.params
    try {
        let getNewsHeadline = await NewsHeadline.findOne({
            where: { id: id, deleted_at: null },
            include: [
                {
                    model: Categories,
                    as: "newsVehicleCategory"
                },
                {
                    model: Brands,
                    as: "newsVehicleBrands"
                },
            ]
        });
        if (getNewsHeadline) {
            if (getNewsHeadline?.dataValues?.category_id) {
                let categoryId = getNewsHeadline?.dataValues?.category_id.split(',');
                let boj = await NewsCategory.findAll({
                    where: {
                        id: {
                            [Op.in]: categoryId
                        }
                    }
                })
                getNewsHeadline.dataValues.newsHeadlineCategory = boj;
            }
            return res.json({
                status: true,
                response_code: 200,
                response_message: "data found succesfully!!!",
                data: getNewsHeadline,
                totalcount: getNewsHeadline.length
            })
        } else {

            return res.json({
                status: false,
                response_code: 404,
                response_message: "data Not found!!!",
                data: [],
            })
        }

    } catch (error) {
        // console.log(error)
        res.json({ error: error.message })
    }
}


export const handleCreatNewsHeadline = async (req, res) => {
    let {
        category_id,
        vehicle_category_id,
        brand_id,
        tag_id,
        title,
        news_url,
        description,
        date,
        is_slider,
        is_popular,
        headtag,
        status,
    } = req.body
    const newHeadLineImageD = req?.files?.image
    const newHeadLineWebsiteImageD = req?.files?.websiteimage
    try {
        const newHeadLineImage = await fileUploadWithDigitalOcean(newHeadLineImageD, "NewsHeadLine")
        const newHeadLineWebsiteImage = await fileUploadWithDigitalOcean(newHeadLineWebsiteImageD, "NewsHeadLine")

        const createNewsHeadline = await NewsHeadline.create({
            category_id: category_id,
            vehicle_category_id: vehicle_category_id,
            index: 1,
            brand_id: brand_id,
            tag_id: tag_id,
            title: title,
            news_url: news_url,
            description: description,
            date: date,
            image: newHeadLineImage?.image,
            websiteimage: newHeadLineWebsiteImage?.image,
            is_slider: is_slider,
            is_popular: is_popular,
            headtag: headtag,
            status: status,
        })
        if (createNewsHeadline) {
            return res.json({
                status: true,
                response_code: 200,
                response_message: "data Create succesfully!!!",
            })
        }
    } catch (error) {
        console.log('error >>>>', error.message)
        return res.json({
            status: false,
            response_code: 404,
            response_message: "data Not found!!!",
        })
    }
}
export const handleGetNewsHeadlinesCategoryOptions = async (req, res) => {
    try {
        let getNewsCategoryOptions = await NewsCategory.findAll({
            where: { deleted_at: null },
            attributes: ['id', 'name']
        });
        if (getNewsCategoryOptions) {
            return res.json({
                status: true,
                response_code: 200,
                response_message: "data found succesfully!!!",
                data: getNewsCategoryOptions,
            })
        } else {
            return res.json({
                status: false,
                response_code: 404,
                response_message: "data Not found!!!",
            })
        }
    } catch (error) {
        res.json(error)
    }
}
export const handleGetCategoryOptions = async (req, res) => {
    try {
        let getCategoryOptions = await Categories.findAll({
            where: { deleted_at: null },
            attributes: ['id', 'category_name']
        });
        if (getCategoryOptions) {
            return res.json({
                status: true,
                response_code: 200,
                response_message: "data found succesfully!!!",
                data: getCategoryOptions,
            })
        } else {
            return res.json({
                status: false,
                response_code: 404,
                response_message: "data Not found!!!",
            })
        }
    } catch (error) {
        res.json(error)
    }
}
export const handleGetBrandOptionsIdWise = async (req, res) => {
    try {
        let getCategoryOptions = await Brands.findAll({
            where: { category_id: req.body.id, deleted_at: null },
            attributes: ['id', 'name']
        });
        if (getCategoryOptions) {
            return res.json({
                status: true,
                response_code: 200,
                response_message: "data found succesfully!!!",
                data: getCategoryOptions,
            })
        } else {
            return res.json({
                status: false,
                response_code: 404,
                response_message: "data Not found!!!",
            })
        }
    } catch (error) {
        res.json(error)
    }
}

export const handleUpdateNewsHeadlines = async (req, res) => {
    let {
        category_id,
        vehicle_category_id,
        brand_id,
        tag_id,
        title,
        news_url,
        description,
        date,
        is_slider,
        is_popular,
        headtag,
        status,
    } = req.body
    const id = req.params.id

    const newHeadLineImageD = req?.files?.image
    const newHeadLineWebsiteImageD = req?.files?.websiteimage
    JSON.parse(category_id)
    try {
        let newHeadLineImage
        let newHeadLineWebsiteImage
        if (req.files) {
            newHeadLineImage = await fileUploadWithDigitalOcean(newHeadLineImageD, "NewsHeadLine")
            newHeadLineWebsiteImage = await fileUploadWithDigitalOcean(newHeadLineWebsiteImageD, "NewsHeadLine")
        }
        if (Array.isArray(JSON.parse(category_id))) {
            category_id = JSON.parse(category_id).join(',');
          } else {
            category_id = '';
          }
        let updateHeadlineObject = {
            category_id: category_id,
            vehicle_category_id: vehicle_category_id,
            index: 1,
            brand_id: brand_id,
            tag_id: tag_id,
            title: title,
            news_url: news_url,
            description: description,
            date: date,
            image: newHeadLineImage?.image || null,
            websiteimage: newHeadLineWebsiteImage?.image || null,
            is_slider: is_slider,
            is_popular: is_popular,
            headtag: headtag,
            status: status,
        }
        if (!req.files) {
            delete updateHeadlineObject.image
            delete updateHeadlineObject.websiteimage
        } else {
            if (updateHeadlineObject.image == null) {
                delete updateHeadlineObject.image
            }
            if (updateHeadlineObject.websiteimage == null) {
                delete updateHeadlineObject.websiteimage
            }
        }
        console.log('updateHeadlineObject >>>', updateHeadlineObject)
        const createNewsHeadline = await NewsHeadline.update(updateHeadlineObject, { where: { id: id } })
        if (createNewsHeadline) {
            return res.json({
                status: true,
                response_code: 200,
                response_message: "data Updtae succesfully!!!",
            })
        }
    } catch (error) {
        console.log('error >>>>', error.message)
        return res.json({
            status: false,
            response_code: 404,
            response_message: "data Not found!!!",
        })
    }
}








async function fileUploadWithDigitalOcean(file, foldername) {
    try {
        console.log("filefilefile-", file);
        const extension = file.name.split(".");
        //   console.log("==========>", extension);
        const fileName = `${Math.floor(Math.random() * 9000000000) + 1000000000
            }${Date.now()}.${extension[extension.length - 1]}`;
        const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT);
        const s3 = new AWS.S3({
            endpoint: spacesEndpoint,
            accessKeyId: process.env.DO_SPACES_KEY,
            secretAccessKey: process.env.DO_SPACES_SECRET,
        });
        let destination;
        destination = `${process.env.DO_SPACE_FOLDER_DIGITAL}/${foldername}/${fileName}`;
        const digiCridential = {
            Bucket: process.env.DO_SPACES_BUCKET,
            folder: process.env.DO_SPACE_FOLDER_DIGITAL,
            Key: destination,
            Body: file.data,
            ACL: "public-read",
            region: process.env.DO_SPACES_REGION,
        };
        const dataLoc = await s3.upload(digiCridential).promise();
        console.log("dataLoc0", dataLoc);
        if (dataLoc) {
            return {
                status: true,
                image: dataLoc.Location,
                // image : (dataLoc.Location).replace("https://rtoapplication.sgp1.digitaloceanspaces.com/",process.env.DO_SPACES_BASE_URL_DIGITAl)
            };
        }
    } catch (error) {
        console.log("--error", error);
        if (error) {
            return {
                status: false,
            };
        }
        return error;
    }
}