import NewsCategory from "./../../../models/NewsCategory.js"
import AWS from "aws-sdk";


export const handleGetNewsCategory = async (req, res) => {
    let { limit, page } = req.body
    page = parseInt(page) || 1;
    limit = limit ? limit : 10
    let offset = (page - 1) * limit;
    console.log('limit', limit)
    try {
        let getNewsCategory = await NewsCategory.findAll({
            where: { deleted_at: null },
            limit: limit,
            offset: offset,
        });
        if (getNewsCategory) {
            return res.json({
                status: true,
                response_code: 200,
                response_message: "data found succesfully!!!",
                data: getNewsCategory,
                totalcount: getNewsCategory.length
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
        res.json(error)
    }
}


export const handleCreateNewsCategory = async (req, res) => {
    let requestFileData = req.files
    let requestBodyData = req.body
    const records = [];
    try {
        for (const [key, value] of Object.entries(requestBodyData)) {
            const [property, index] = key.split('-');
            const recordIndex = parseInt(index, 10);

            const record = records[recordIndex] || {};

            if (property !== 'image') {
                record[property] = value;
            }
            records[recordIndex] = record;
        }

        // Attach images to records using for...of loop
        for (const [fieldName, file] of Object.entries(requestFileData)) {
            const index = parseInt(fieldName.split('-')[1], 10);

            if (records[index]) {
                const img = await fileUploadWithDigitalOcean(file, "NewsCategory");
                records[index].image = img.image;
            }
        }
        if (records) {
            for (const item of records) {
                await NewsCategory.create({
                    index: 1, name: item.name, image: item.image, status: item.status || 1
                });
            }
            return res.json({
                status: true,
                response_code: 200,
                response_message: "data Created succesfully!!!",
            })
        } else {
            return res.json({
                status: false,
                response_code: 404,
                response_message: "data Not found!!!",
            })
        }
    } catch (error) {
        res.json({ error: error.message })
    }
}

export const getNewsCategoryDataById = async (req, res) => {
    let {id} = req.params
    try {
        let getNewsCategoryById = await NewsCategory.findOne({
            where: { id:id, deleted_at: null },
        });
        if (getNewsCategoryById) {
            return res.json({
                status: true,
                response_code: 200,
                response_message: "data found succesfully!!!",
                data: getNewsCategoryById,
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
        res.json(error)
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
        // if (foldername == "") {
        //     destination = `${process.env.DO_SPACE_FOLDER_DIGITAL}/${fileName}`
        // }
        // else {
        destination = `${process.env.DO_SPACE_FOLDER_DIGITAL}/${foldername}/${fileName}`;
        // }
        //   console.log(
        //     "-calllllllllllllllllllllllllllllllllthe destination",
        //     destination
        //   );
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

async function generatePlainTextSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}