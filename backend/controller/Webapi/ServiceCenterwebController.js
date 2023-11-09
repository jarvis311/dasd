import ServiceCenterState from "../../models/ServiceCenterState.js";
import ServiceCenterCity from "../../models/ServiceCenterCity.js";
import ServiceCenterBrand from "../../models/ServiceCenterBrand.js";
import ServiceCenterData from "../../models/ServiceCenterData.js";
import ServiceCenterDealer from "../../models/ServiceCenterDealer.js"
// import testBrand from "../../models/test_model.js"


import { Sequelize, Op, where } from "sequelize";
import AWS from "aws-sdk";
// import db from "../../config/database.js"


/**************************************service center state ********************************Start************/

const get_service_center_state = async (req, res) => {
  try {
    console.log(req.body);
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let page = req.body.page ? parseInt(req.body.page) : 1;
    let offset = (page - 1) * limit;
    let getallstateCount = await ServiceCenterState.count({
      where: {
        deleted_at: null,
      },
    });
    let getstatedata = await ServiceCenterState.findAll({
      where: { deleted_at: null },
      limit: limit,
      offset: offset,
    });
    // return res.json(getstatedata)
    if (getstatedata) {
      return res.json({
        status: true,
        response_code: 200,
        response_message: "data found succesfully!!!",
        data: getstatedata,
        totalcount: getallstateCount,
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};

const store_service_center_state = async (req, res) => {
  try {
    // let {index,state,name} = req.body;
    if (req.body.name == "") {
      return res.json({
        status: true,
        response_code: 400,
        response_message: "Please enterthe name",
      });
    }
    let stateobject = {
      name: req.body.name,
      status: 1,
      index: 1,
    };
    console.log(stateobject);
    let addstate = await ServiceCenterState.create(stateobject);
    if (addstate) {
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

const delete_service_center_state = async (req, res) => {
  try {
    console.log(req.params.id);
    let id = req.params.id;
    let date = new Date();
    let softdelete = await ServiceCenterState.update(
      { deleted_at: date },
      { where: { id: id } }
    );
    if (softdelete[0] === 1) {
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

const edit_driving_school_state = async (req, res) => {
  try {
    console.log(req.params.id);
    let id = req.params.id;
    console.log(id);
    let dataofstate = await ServiceCenterState.findOne({ where: { id: id } });
    if (dataofstate) {
      return res.json({
        status: true,
        response_code: 200,
        response_message: "Data found successfully!!!",
        data: dataofstate,
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
const get_all_service_state = async (req, res) => {
  try {
    // console.log(req.body);
    let allstate = await ServiceCenterState.findAll({
      where: {
        deleted_at: null,
      },
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });
    return res.json({
      status: true,
      response_code: 200,
      response_message: "Data Found successfully!!!",
      data: allstate,
      totalcount: allstate.length,
    });
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};
const update_service_center_state = async (req, res) => {
  try {
    console.log(req.params.id);
    let id = req.params.id;
    let updatestate = await ServiceCenterState.update(req.body, {
      where: { id: id },
    });
    console.log(updatestate);
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
const Servicestatuschange = async (req, res) => {
  try {
    console.log(req.body);
    let { id, status } = req.body;
    let statusupdates = {
      status: status,
    };
    let statusupdate = await ServiceCenterState.update(statusupdates, {
      where: { id: id },
    });
    if (statusupdate) {
      return res.json({
        status: true,
        response_code: 200,
        response_message: "status update successfully!!!",
      });
    } else {
      return res.json({
        status: false,
        response_code: 400,
        response_message: "status not updated!!!",
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};
/**************************************service center state **********************************End**********/

/**************************************service center city **********************************start**********/

const get_Service_center_city = async (req, res) => {
  try {
    console.log(req.body);
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let page = req.body.page ? parseInt(req.body.page) : 1;
    let offset = (page - 1) * limit;
    let totalcount = await ServiceCenterCity.count({
      where: {
        deleted_at: null,
      },
    });
    let dataofcity = await ServiceCenterCity.findAll({
      where: { deleted_at: null },
      include: [
        {
          model: ServiceCenterState,
          as: "stateDetails",
          attributes: ["id", "name"],
        },
      ],
      limit: limit,
      offset: offset,
    });
    if (dataofcity) {
      return res.json({
        status: true,
        response_code: 200,
        response_message: "Data found sucessfully!!",
        data: dataofcity,
        totalcount: totalcount,
      });
    } else {
      return res.json({
        status: false,
        response_code: 400,
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

const store_service_center_city = async (req, res) => {
  try {
    let { state_id, name } = req.body;
    if (!state_id || state_id == "" || isNaN(state_id)) {
      return res.json({
        status: false,
        response_code: 400,
        response_message: "Please provide valid state_id",
      });
    } else if (!name || name == "") {
      return res.json({
        status: false,
        response_code: 400,
        response_message: "Please provide city name",
      });
    }
    let cityobject = {
      name: name,
      status: 1,
      index: 1,
      state_id: state_id,
    };
    let storecity = await ServiceCenterCity.create(cityobject);
    // console.log(storecity);
    if (storecity) {
      return res.json({
        status: true,
        response_code: 200,
        response_message: "Data store successfully!!!!",
      });
    } else {
      return res.json({
        status: false,
        response_code: 200,
        response_message: "Data not found",
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};

const delete_service_center_city = async (req, res) => {
  try {
    console.log(req.params.id);
    let id = req.params.id;
    let date = new Date();
    let softdelete = await ServiceCenterCity.update(
      { deleted_at: date },
      { where: { id: id } }
    );
    if (softdelete[0] === 1) {
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

const edit_service_center_city = async (req, res) => {
  try {
    console.log(req.params.id);
    let id = req.params.id;
    let dataofcity = await ServiceCenterCity.findOne({
      where: { id: id },
      include: [
        {
          model: ServiceCenterState,
          as: "stateDetails",
          attributes: ["id", "name"],
        },
      ],
    });
    if (dataofcity) {
      return res.json({
        status: true,
        response_code: 200,
        response_message: "Data Found sucessfully!!",
        data: dataofcity,
      });
    } else {
      return res.json({
        status: true,
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

const update_service_center_city = async (req, res) => {
  try {
    console.log(req.params.id);
    let id = req.params.id;
    let updatecity = await ServiceCenterCity.update(req.body, {
      where: { id: id },
    });
    // console.log(updatecity);
    if (updatecity[0] === 1) {
      return res.json({
        status: true,
        response_code: 200,
        response_message: "Data updated succesfully!!!",
      });
    } else {
      return res.json({
        status: true,
        response_code: 400,
        response_message: "Data not updated!!!",
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};

const service_center_city_search = async (req, res) => {
  try {
    console.log(req.body);
    let { state_id, name } = req.body;
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let page = req.body.page ? parseInt(req.body.page) : 1;
    let offset = (page - 1) * limit;
    let Whereclause = {};
    if (name) {
      (Whereclause.name = {
        [Op.like]: `%${name}%`,
      }),
        (Whereclause.deleted_at = null);
    }
    if (state_id) {
      (Whereclause.state_id = parseInt(state_id)),
        (Whereclause.deleted_at = null);
    }
    if (name && state_id) {
      (Whereclause.name = {
        [Op.like]: `%${name}%`,
      }),
        (Whereclause.state_id = parseInt(state_id)),
        (Whereclause.deleted_at = null);
    }
    let searchCityCount = await ServiceCenterCity.findAll({
      where: Whereclause,
    });

    let searchCity = await ServiceCenterCity.findAll({
      where: Whereclause,
      include: [
        {
          model: ServiceCenterState,
          as: "stateDetails",
          attributes: ["id", "name"],
        },
      ],
      limit: limit,
      offset: offset,
    });

    return res.json({
      status: true,
      response_code: 200,
      response_message: "Data Found sucessfully!!",
      data: searchCity,
      totalcount: searchCityCount.length,
    });
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};

const Citystatuschange = async (req, res) => {
  try {
    console.log(req.body);
    let { id, status } = req.body;
    let changestatus = {
      id: parseInt(id),
      status: parseInt(status),
    };
    let changeStatusinDb = await ServiceCenterCity.update(changestatus, {
      where: { id: id },
    });
    console.log(changeStatusinDb);
    if (changeStatusinDb[0] == 1) {
      return res.json({
        status: true,
        response_code: 200,
        response_message: "Status update successfully!!!",
      });
    } else {
      return res.json({
        status: false,
        response_code: 400,
        response_message: "Status not updated!!!",
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};

const getAllcity = async (req, res) => {
  try {
    console.log(req.body);
    let allcity = await ServiceCenterCity.findAll({
      where: { deleted_at: null },
      include: [
        {
          model: ServiceCenterState,
          as: "stateDetails",
          attributes: ["id", "name"],
        },
      ],
    });
    if (allcity) {
      return res.json({
        status: true,
        response_code: 200,
        response_message: "Data Found successfully!!!",
        data: allcity,
        totalcount: allcity.length,
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};

/**************************************service center city **********************************End**********/

/**************************************service center Brand **********************************start******/
const get_Service_center_Brand = async (req, res) => {
  try {
    console.log(req.body);
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let page = req.body.page ? parseInt(req.body.page) : 1;
    let offset = (page - 1) * limit;
    let allBrandCount = await ServiceCenterBrand.count({
      where: { deleted_at: null },
    });
    let getallBrandfromDB = await ServiceCenterBrand.findAll({
      where: { deleted_at: null },
      limit: limit,
      offset: offset,
    });
    if (getallBrandfromDB) {
      return res.json({
        status: true,
        response_code: 200,
        response_message: "Data Found successfully!!",
        data: getallBrandfromDB,
        totalcount: allBrandCount,
      });
    } else {
      return res.json({
        status: true,
        response_message: 200,
        response_message: "Data Found successfully!!",
        data: getallBrandfromDB,
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};

const SearchBrand = async (req, res) => {
  try {
    console.log(req.body);
    let { type, search } = req.body;
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let page = req.body.page ? parseInt(req.body.page) : 1;
    let offset = (page - 1) * limit;
    let Whereclause = {};
    console.log(type);
    if (type) {
      Whereclause.type = type;
      Whereclause.deleted_at = null;
    }
    if (search) {
      Whereclause.brand_name = {
        [Op.like]: `%${search}%`,
      };
      Whereclause.deleted_at = null;
    }
    let brandsearchCount = await ServiceCenterBrand.findAll({
      where: Whereclause,
    });
    let brandsearchdata = await ServiceCenterBrand.findAll({
      where: Whereclause,
      limit: limit,
      offset: offset,
    });
    if (brandsearchdata) {
      return res.json({
        status: true,
        response_code: 200,
        response_message: "Data Found Successfully!!!",
        data: brandsearchdata,
        totalcount: brandsearchCount.length,
      });
    } else {
      return res.json({
        status: true,
        response_code: 200,
        response_message: "Data not Found!!!",
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};

const statuschangeBrand = async (req, res) => {
  try {
    console.log(req.body);
    let { id, status } = req.body;
    let statuschange = {
      id: id,
      status: status,
    };
    let dbstatuschange = await ServiceCenterBrand.update(statuschange, {
      where: { id: id },
    });
    if (dbstatuschange[0] === 1) {
      return res.json({
        status: true,
        response_code: 200,
        response_message: "status change successfully!!!",
      });
    } else {
      return res.json({
        status: true,
        response_code: 400,
        response_message: "status not changed!!!",
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};

const edit_service_center_Brand = async (req, res) => {
  try {
    console.log(req.params.id);
    let id = req.params.id;
    let ViewBranddata = await ServiceCenterBrand.findOne({ where: { id: id } });
    if (ViewBranddata) {
      return res.json({
        status: true,
        response_code: 200,
        response_message: "Data Found Successfully!!!",
        data: ViewBranddata,
      });
    } else {
      return res.json({
        status: true,
        response_code: 400,
        response_message: "Data not Found!!!",
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};

const store_service_Brand = async (req, res) => {
  try {
    console.log(req.body);
    let imagefile = req.files;
    let { type, brand_name, brand_slug } = req.body;
    console.log(imagefile);
    if (type == "") {
      return res.json({
        status: true,
        response_code: 400,
        response_message: "Please provide type",
      });
    } else if (req.files == null) {
      return res.json({
        status: true,
        response_code: 400,
        response_message: "Please provide image",
      });
    } else if (brand_name == "") {
      return res.json({
        status: true,
        response_code: 400,
        response_message: "Please provide Brand Name",
      });
    } else if (brand_slug == "") {
      return res.json({
        status: true,
        response_code: 400,
        response_message: "Please provide Brand slug",
      });
    }

    async function fileUploadWithDigitalOcean(file, foldername) {
      try {
        console.log("filefilefile-", file);
        const extension = file.brand_image.name.split(".");
        console.log("==========>", extension);
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
        console.log(
          "-calllllllllllllllllllllllllllllllllthe destination",
          destination
        );
        const digiCridential = {
          Bucket: process.env.DO_SPACES_BUCKET,
          folder: process.env.DO_SPACE_FOLDER_DIGITAL,
          Key: destination,
          Body: file.brand_image.data,
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
    if (imagefile) {
      let filesave = await fileUploadWithDigitalOcean(imagefile, "Brand");
      let image = filesave.image;
      function generatePlainTextSlug(text) {
        return text
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");
      }
      let newBrand_slug = generatePlainTextSlug(brand_slug);
      let NewBrandData = {
        brand_name: brand_name,
        brand_slug: newBrand_slug,
        brand_image: image,
        type: type,
        // index: 1,
        status: 1,
      };
      console.log(NewBrandData);
      let storeBrand = await ServiceCenterBrand.create(NewBrandData);
      if (storeBrand) {
        return res.json({
          status: true,
          response_code: 200,
          response_message: "Data stored successfully!!!!",
        });
      }
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};

const update_Service_center_Brand = async (req, res) => {
  try {
    console.log(req.params.id);
    let id = req.params.id;
    let { type, brand_name, brand_slug } = req.body;
    let imagefile = req.files;
    function generatePlainTextSlug(text) {
      return text
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    }
    let newslugbrand = generatePlainTextSlug(brand_slug);
    async function fileUploadWithDigitalOcean(file, foldername) {
      try {
        console.log("filefilefile-", file);
        const extension = file.brand_image.name.split(".");
        console.log("==========>", extension);
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
        console.log(
          "-calllllllllllllllllllllllllllllllllthe destination",
          destination
        );
        const digiCridential = {
          Bucket: process.env.DO_SPACES_BUCKET,
          folder: process.env.DO_SPACE_FOLDER_DIGITAL,
          Key: destination,
          Body: file.brand_image.data,
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
    let filesave = await fileUploadWithDigitalOcean(imagefile, "Brand");
    let image = filesave.image;

    let updateobject = {
      type: type,
      brand_image: image,
      brand_name: brand_name,
      brand_slug: newslugbrand,
      status: 1,
    };
    let updateBrand = await ServiceCenterBrand.update(updateobject, {
      where: { id: id },
    });
    if (updateBrand[0] === 1) {
      return res.json({
        status: true,
        response_code: 200,
        response_message: "Data update succesfully!!",
      });
    } else {
      return res.json({
        status: true,
        response_code: 400,
        response_message: "Data not updated!!",
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};

const getallBrand = async (req, res) => {
  try {
    console.log(req.body);
    let getallBranddata = await ServiceCenterBrand.findAll({
      where: { deleted_at: null },
    });
    if (getallBranddata) {
      return res.json({
        status: true,
        response_code: 200,
        response_message: "Data Found Successfully!!",
        data: getallBranddata,
        totalcount: getallBranddata.length,
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};
const deletebrand = async (req, res) => {
  try {
    console.log(req.params.id);
    try {
      console.log(req.params.id);
      let id = req.params.id;
      let date = new Date();
      let softdelete = await ServiceCenterBrand.update(
        { deleted_at: date },
        { where: { id: id } }
      );
      if (softdelete[0] === 1) {
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
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};
/**************************************sevice center Brand*************************************End */

/**************************************service center data*************************************start */
const getAll_service_center_data = async (req, res) => {
  try {
    console.log(req.body);
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let page = req.body.page ? parseInt(req.body.page) : 1;
    let offset = (page - 1) * limit;
    let allservicecenterData = await ServiceCenterData.findAll({
      where: { deleted_at: null },
      include: [
        {
          model: ServiceCenterCity,
          as: "cityDetails",
          attributes: ["id", "name"],
        },
      ], limit: limit, offset: offset
    }).then((rows) => {
      if (rows.length) {
        return rows.map((r) => {
          return r.dataValues;
        });
      }
    });

    let allservicedatacount = await ServiceCenterData.count({
      where: { deleted_at: null },
    });

    if (allservicecenterData && allservicecenterData.length) {
      for (let i = 0; i < allservicecenterData.length; i++) {
        let service_element = allservicecenterData[i];
        const brand_ids = service_element.brand_id
          ? service_element.brand_id.split(",")
          : [];
        const _service_data = await ServiceCenterBrand.findAll({
          where: {
            id: {
              [Op.in]: brand_ids,
            },
          },
        });
        service_element.BrandDetails = _service_data;
      }
    }
    // console.log(allservicedatacount);
    if (allservicecenterData) {
      return res.json({
        status: true,
        response_code: 200,
        response_message: "Data found succesfully!!!",
        data: allservicecenterData,
        totalcount: allservicedatacount,
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};
//  const getServiceCenterDetailsById = async(req,res) => {

//  }




const searchservicedata = async (req, res) => {
  try {
    console.log(req.body);
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let page = req.body.page ? parseInt(req.body.page) : 1;
    let offset = (page - 1) * limit;
    let { searchvalue, cityid, brand, type, added_by } = req.body;
    let whereClause = {};

    if (searchvalue) {
      whereClause.name = {
        [Op.like]: `%${searchvalue}%`,
      };
      whereClause.deleted_at = null;
    }
    if (cityid) {
      (whereClause.city_id = cityid), (whereClause.deleted_at = null);
    }
    if (brand) {
      whereClause.brand_id = brand;
      whereClause.deleted_at = null;
    }
    if (type) {
      whereClause.type = type;
      whereClause.deleted_at = null;
    }
    if (added_by) {
      whereClause.added_by = added_by;
      whereClause.deleted_at = null;
    }
    let searchBrandCount = await ServiceCenterData.findAll({
      where: whereClause,
    });
    let searchBrand = await ServiceCenterData.findAll({
      where: whereClause,
      include: [
        {
          model: ServiceCenterCity,
          as: "cityDetails",
          attributes: ["id", "name"],
        },
      ],
      limit: limit,
      offset: offset,
    }).then((rows) => {
      if (rows.length) {
        return rows.map((r) => {
          return r.dataValues;
        });
      }
    });

    if (searchBrand && searchBrand.length) {
      for (let i = 0; i < searchBrand.length; i++) {
        let service_element = searchBrand[i];
        const brand_ids = service_element.brand_id
          ? service_element.brand_id.split(",")
          : [];
        const _service_data = await ServiceCenterBrand.findAll({
          where: {
            id: {
              [Op.in]: brand_ids,
            },
          },
        });
        service_element.BrandDetails = _service_data;
      }
    } else {
      return res.json({
        status: false,
        response_code: 400,
        response_message: "Data not found!!!!!"
      })
    }
    if (searchBrand) {
      return res.json({
        status: true,
        response_code: 200,
        response_message: "Data Found sucessfully!!",
        data: searchBrand,
        totalcount: searchBrandCount.length,
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};

const changefeature = async (req, res) => {
  try {
    console.log(req.body);
    let { featured, id } = req.body;
    let changefeature = {
      featured: featured,
      id: id,
    };
    let changefeatureDb = await ServiceCenterData.update(changefeature, {
      where: { id: id },
    });
    if (changefeatureDb[0] === 1) {
      return res.json({
        status: true,
        response_code: 200,
        response_message: "update succesfully!!!",
      });
    } else {
      return res.json({
        status: true,
        response_code: 400,
        response_message: "not updated!!!",
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};

const changestatus = async (req, res) => {
  try {
    console.log(req.body);
    let { status, id } = req.body;
    let changestatus = {
      status: status,
      id: id,
    };

    let changefeatureDb = await ServiceCenterData.update(changestatus, {
      where: { id: id },
    });
    if (changefeatureDb[0] === 1) {
      return res.json({
        status: true,
        response_code: 200,
        response_message: "update succesfully!!!",
      });
    } else {
      return res.json({
        status: true,
        response_code: 400,
        response_message: "not updated!!!",
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};
const add_service_center_data = async (req, res) => {
  try {
    console.log(req.body);

    let Dataobject = {
      type: req.body.type,
      city_id: req.body.city_id,
      name: req.body.name,
      address: req.body.address,
      zipcode: req.body.zipcode,
      website: req.body.website,
      number: req.body.number,
      email: req.body.email,
      featured: req.body.featured,
      type: req.body.type,
      paymentMode: JSON.parse(req.body.paymentMode),
      sun: req.body.sun,
      mon: req.body.mon,
      tue: req.body.tue,
      wed: req.body.wed,
      thu: req.body.thu,
      fri: req.body.fri,
      sat: req.body.sat,
      brand_id: JSON.parse(req.body.brand_id),
    };

    if (Array.isArray(Dataobject.paymentMode)) {
      Dataobject.paymentMode = JSON.parse(req.body.paymentMode).join(",");
    } else {
      Dataobject.paymentMode = "";
    }

    // console.log(Dataobject.paymentMode);

    if (Dataobject.brand_id) {
      Dataobject.brand_id = JSON.parse(req.body.brand_id).join(",");
      // console.log(Dataobject.brand_id);
    }

    let storedata = await ServiceCenterData.create(Dataobject);
    if (storedata) {
      return res.json({
        status: true,
        response_code: 200,
        response_message: "Data Stored successfully!!!",
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
      error: error.message
    });
  }
};

const edit_service_center_data = async (req, res) => {
  try {
    let id = req.params.id;
    let allservicecenterData = await ServiceCenterData.findOne({
      where: { id: id },
      include: [
        {
          model: ServiceCenterCity,
          as: "cityDetails",
          attributes: ["id", "name"],
        },
      ],
    });
    let allservicedatacount = await ServiceCenterData.count({
      where: { deleted_at: null },
    });
    let brand_ids = allservicecenterData.brand_id
      ? allservicecenterData.brand_id.split(",")
      : [];
    let _service_data = await ServiceCenterBrand.findAll({
      where: {
        id: {
          [Op.in]: brand_ids,
        },
      },
    });
    allservicecenterData.dataValues.BrandDetails = _service_data;

    console.log(allservicedatacount);
    if (allservicecenterData) {
      return res.json({
        status: true,
        response_code: 200,
        response_message: "Data found succesfully!!!",
        data: allservicecenterData,
        totalcount: allservicedatacount,
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};

const deleteservicedata = async (req, res) => {
  console.log(req.params.id);
  try {
    console.log(req.params.id);
    let id = req.params.id;
    let date = new Date();
    let softdelete = await ServiceCenterData.update(
      { deleted_at: date },
      { where: { id: id } }
    );
    if (softdelete[0] === 1) {
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

const update_service_center = async (req, res) => {
  try {
    console.log(req.params.id);
    let id = req.params.id;
    let updateObject = {
      type: req.body.type,
      city_id: req.body.city_id,
      name: req.body.name,
      address: req.body.address,
      zipcode: req.body.zipcode,
      website: req.body.website,
      number: req.body.number,
      email: req.body.email,
      featured: req.body.featured,
      type: req.body.type,
      paymentMode: JSON.parse(req.body.paymentMode),
      brand_id: JSON.parse(req.body.brand_id),
      sun: req.body.sun,
      mon: req.body.mon,
      tue: req.body.tue,
      wed: req.body.wed,
      thu: req.body.thu,
      fri: req.body.fri,
      sat: req.body.sat,
    };
    if (Array.isArray(updateObject.paymentMode)) {
      updateObject.paymentMode = JSON.parse(req.body.paymentMode).join(",");
    } else {
      updateObject.paymentMode = "";
    }
    if (updateObject.brand_id) {
      updateObject.brand_id = JSON.parse(req.body.brand_id).join(",");
      console.log(updateObject.brand_id);
    }

    let updatedata = await ServiceCenterData.update(updateObject, {
      where: { id: id },
    });
    if (updatedata[0] === 1) {
      return res.json({
        status: true,
        response_code: 400,
        response_message: "Data update successfully!!",
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};


const get_all_service_center_data = async (req, res) => {
  try {
    let allservicecenterData = await ServiceCenterData.findAll({
      where: { deleted_at: null },
    });
    let allservicedatacount = await ServiceCenterData.count({
      where: { deleted_at: null },
    });
    if (allservicecenterData) {
      return res.json({
        status: true,
        response_code: 200,
        response_message: "Data found succesfully!!!",
        data: allservicecenterData,
        totalcount: allservicedatacount,
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};



const getSeviceCenterBrandOption = async (req, res) => {
  try {
    console.log(req.body);
    let getallBranddata = await ServiceCenterBrand.findAll({
      where: { type: req.body.typeId, deleted_at: null },
    });
    if (getallBranddata) {
      return res.json({
        status: true,
        response_code: 200,
        response_message: "Data Found Successfully!!",
        data: getallBranddata,
        totalcount: getallBranddata.length,
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};

/**************************************service center data*************************************End */

/**************************************service dealer data*************************************start */
const get_all_service_dealer = async (req, res) => {
  try {
    console.log(req.body);
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let page = req.body.page ? parseInt(req.body.page) : 1;
    let offset = (page - 1) * limit;
    let allservicecenterDatacount = await ServiceCenterDealer.count({ where: { deleted_at: null } })
    let allservicecenterData = await ServiceCenterDealer.findAll({
      where: { deleted_at: null },
      include: [
        {
          model: ServiceCenterCity,
          as: "cityDetail",
          attributes: ["id", "name"]
        }
      ], limit: limit, offset: offset
    }).then((rows) => {
      if (rows.length) {
        return rows.map((r) => {
          return r.dataValues;
        });
      }
    });

    if (allservicecenterData && allservicecenterData.length) {
      for (let i = 0; i < allservicecenterData.length; i++) {
        let service_element = allservicecenterData[i];
        const brand_ids = service_element.brand_id
          ? service_element.brand_id.split(",")
          : [];
        const _service_data = await ServiceCenterBrand.findAll({
          where: {
            id: {
              [Op.in]: brand_ids,
            },
          },
        });
        service_element.BrandDetails = _service_data;
      }
    }


    if (allservicecenterData) {
      return res.json({
        status: true,
        response_code: 200,
        response_message: "Data found successfully!!!",
        data: allservicecenterData,
        totalcount: allservicecenterDatacount
      })
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
}

const change_featured = async (req, res) => {
  try {
    console.log(req.body);
    let featuredobject = {
      featured: req.body.featured
    }
    let updatefeatured = await ServiceCenterDealer.update(featuredobject, { where: { id: req.body.id } })
    if (updatefeatured[0] === 1) {
      return res.json({
        status: true,
        response_code: 200,
        response_message: "featured update successfully!!!"
      })
    } else {
      return res.json({
        status: true,
        response_code: 400,
        response_message: "featured not updated!!!"
      })
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
}

const change_status = async (req, res) => {
  try {
    console.log(req.body);
    let statusobject = {
      status: req.body.status
    }
    let statusupdate = await ServiceCenterDealer.update(statusobject, { where: { id: req.body.id } })
    if (statusupdate[0] === 1) {
      return res.json({
        status: true,
        response_code: 200,
        response_message: "status update successfully!!!"
      })
    } else {
      return res.json({
        status: true,
        response_code: 400,
        response_message: "status not updated!!!"
      })
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
}

const search_dealer = async (req, res) => {
  try {
    console.log(req.body);
    let { searchvalue, cityid, brand, type, added_by } = req.body;
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let page = req.body.page ? parseInt(req.body.page) : 1;
    let offset = (page - 1) * limit;
    let Whereclause = {}
    if (searchvalue) {
      Whereclause.name = {
        [Op.like]: `%${searchvalue}%`
      }
    }
    if (cityid) {
      Whereclause.city_id = parseInt(cityid)
    }
    if (brand) {
      Whereclause.brand_id = brand
    }
    if (type) {
      Whereclause.type = parseInt(type)
    }
    if (added_by) {
      Whereclause.added_by = added_by
    }

    console.log(Whereclause);
    let finddealer = await ServiceCenterDealer.findAll({
      where: Whereclause,
      include: [
        {
          model: ServiceCenterCity,
          as: "cityDetail",
          attributes: ["id", "name"],
          // where:{
          //   deleted_at:null
          // }
        }
      ],
      deleted_at: null, limit: limit, offset: offset
    })
    // .then((rows) => {
    //   if (rows.length) {
    //     return rows.map((r) => {
    //       return r.dataValues;
    //     });
    //   }
    // });

    // return res.json(finddealer)

    if (finddealer && finddealer.length) {
      for (let i = 0; i < finddealer.length; i++) {
        let service_element = finddealer[i];
        const brand_ids = service_element.brand_id
          ? service_element.brand_id.split(",")
          : [];
        const _service_data = await ServiceCenterBrand.findAll({
          where: {
            id: {
              [Op.in]: brand_ids,
            },
          },
        });
        service_element.BrandDetails = _service_data;
      }
    } else {
      return res.json({
        status: false,
        response_code: 400,
        response_message: "Data not found!!!"
      })
    }





    if (finddealer) {
      return res.json({
        status: true,
        response_code: 200,
        response_message: "Data Found succesfully!!!",
        data: finddealer,
        totalcount: finddealer.length
      })
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
}

const store_service_dealer = async (req, res) => {
  try {
    console.log(req.body);
    let Dataofdealer = {
      city_id: req.body.city_id,
      brand_id: JSON.parse(req.body.brand_id),
      name: req.body.name,
      address: req.body.address,
      zipcode: req.body.zipcode,
      website: req.body.website,
      email: req.body.email,
      number: req.body.number,
      featured: req.body.featured,
      type: req.body.type,
      paymentMode: JSON.parse(req.body.paymentMode),
      sun: req.body.sun,
      mon: req.body.mon,
      tue: req.body.tue,
      wed: req.body.wed,
      thu: req.body.thu,
      fri: req.body.fri,
      sat: req.body.sat,
    }
    Dataofdealer.website = Dataofdealer.website == "" ? null : req.body.website;
    Dataofdealer.email = Dataofdealer.email == "" ? null : req.body.email;


    if (Array.isArray(Dataofdealer.paymentMode)) {
      Dataofdealer.paymentMode = JSON.parse(req.body.paymentMode).join(",");
    } else {
      Dataofdealer.paymentMode = "";
    }
    if (Dataofdealer.brand_id) {
      Dataofdealer.brand_id = JSON.parse(req.body.brand_id).join(",");
      console.log(Dataofdealer.brand_id);
    }
    let storedata = await ServiceCenterDealer.create(Dataofdealer)
    if (storedata) {
      return res.json({
        status: true,
        response_code: 200,
        response_message: "Data Stored successfully!!!"
      })
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
}

const delete_service_dealer = async (req, res) => {
  try {
    console.log(req.params.id);
    let id = req.params.id;
    let date = new Date();
    let softdelete = await ServiceCenterDealer.update(
      { deleted_at: date },
      { where: { id: id } }
    );
    if (softdelete[0] === 1) {
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
}

const getalldealer = async (req, res) => {
  try {
    let allservicecenterDatacount = await ServiceCenterDealer.count({ where: { deleted_at: null } })
    let allservicecenterData = await ServiceCenterDealer.findAll({
      where: { deleted_at: null },
      include: [
        {
          model: ServiceCenterCity,
          as: "cityDetail",
          attributes: ["id", "name"]
        }
      ],
    }).then((rows) => {
      if (rows.length) {
        return rows.map((r) => {
          return r.dataValues;
        });
      }
    });

    if (allservicecenterData && allservicecenterData.length) {
      for (let i = 0; i < allservicecenterData.length; i++) {
        let service_element = allservicecenterData[i];
        const brand_ids = service_element.brand_id
          ? service_element.brand_id.split(",")
          : [];
        const _service_data = await ServiceCenterBrand.findAll({
          where: {
            id: {
              [Op.in]: brand_ids,
            },
          },
        });
        service_element.BrandDetails = _service_data;
      }
    }


    if (allservicecenterData) {
      return res.json({
        status: true,
        response_code: 200,
        response_message: "Data found successfully!!!",
        data: allservicecenterData,
        totalcount: allservicecenterDatacount
      })
    }

  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
}


const update_service_dealer = async (req, res) => {
  try {
    // console.log(req.body);
    let id = req.params.id
    let Dataofdealer = {
      city_id: req.body.city_id,
      brand_id: JSON.parse(req.body.brand_id),
      name: req.body.name,
      address: req.body.address,
      zipcode: req.body.zipcode,
      website: req.body.website,
      email: req.body.email,
      number: req.body.number,
      featured: req.body.featured,
      type: req.body.type,
      paymentMode: JSON.parse(req.body.paymentMode),
      sun: req.body.sun,
      mon: req.body.mon,
      tue: req.body.tue,
      wed: req.body.wed,
      thu: req.body.thu,
      fri: req.body.fri,
      sat: req.body.sat,
    }
    Dataofdealer.website = Dataofdealer.website == "" ? null : req.body.website;
    Dataofdealer.email = Dataofdealer.email == "" ? null : req.body.email;


    if (Array.isArray(Dataofdealer.paymentMode)) {
      Dataofdealer.paymentMode = JSON.parse(req.body.paymentMode).join(",");
    } else {
      Dataofdealer.paymentMode = "";
    }
    if (Dataofdealer.brand_id) {
      Dataofdealer.brand_id = JSON.parse(req.body.brand_id).join(",");
      console.log(Dataofdealer.brand_id);
    }
    let storedata = await ServiceCenterDealer.update(Dataofdealer, { where: { id: id } })
    if (storedata) {
      return res.json({
        status: true,
        response_code: 200,
        response_message: "Data update successfully!!!"
      })
    }

  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
}


const edit_service_deler_data = async (req, res) => {
  try {
    let id = req.params.id;
    let allservicecenterData = await ServiceCenterDealer.findOne({
      where: { id: id },
      include: [
        {
          model: ServiceCenterCity,
          as: "cityDetailsDealer",
          attributes: ["id", "name"],
        },
      ],
    });
    let allservicedatacount = await ServiceCenterData.count({
      where: { deleted_at: null },
    });
    let brand_ids = allservicecenterData.brand_id
      ? allservicecenterData.brand_id.split(",")
      : [];
    let _service_data = await ServiceCenterBrand.findAll({
      where: {
        id: {
          [Op.in]: brand_ids,
        },
      },
    });
    allservicecenterData.dataValues.BrandDetails = _service_data;

    console.log(allservicedatacount);
    if (allservicecenterData) {
      return res.json({
        status: true,
        response_code: 200,
        response_message: "Data found succesfully!!!",
        data: allservicecenterData,
        totalcount: allservicedatacount,
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};

/**************************************service dealer data*************************************End */

/************************************** ****************************************************start*/



export default {
  //service state===>
  get_service_center_state,
  store_service_center_state,
  delete_service_center_state,
  edit_driving_school_state,
  get_all_service_state,
  update_service_center_state,
  Servicestatuschange,
  //service city===>
  get_Service_center_city,
  store_service_center_city,
  delete_service_center_city,
  edit_service_center_city,
  update_service_center_city,
  service_center_city_search,
  Citystatuschange,
  getAllcity,
  //service BRAND===>
  get_Service_center_Brand,
  SearchBrand,
  statuschangeBrand,
  edit_service_center_Brand,
  store_service_Brand,
  update_Service_center_Brand,
  getallBrand,
  deletebrand,
  //service center data==>
  getAll_service_center_data,
  searchservicedata,
  changefeature,
  changestatus,
  add_service_center_data,
  edit_service_center_data,
  deleteservicedata,
  update_service_center,
  get_all_service_center_data,
  getSeviceCenterBrandOption,
  //service dealer==>
  get_all_service_dealer,
  change_featured,
  change_status,
  search_dealer,
  store_service_dealer,
  delete_service_dealer,
  getalldealer,
  update_service_dealer,
  edit_service_deler_data

};
