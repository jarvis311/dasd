import DrivingSchoolState from "../../models/DrivingSchoolState.js";
import DrivingSchoolCity from "../../models/DrivingSchoolCity.js";
import DrivingSchoolArea from "../../models/DrivingSchoolArea.js";
import DrivingSchoolDetail from "../../models/DrivingSchoolDetails.js";
import { Sequelize,Op } from "sequelize";
/****************************************************driving school state**********************************start******** */
const get_driving_school_state = async (req, res) => {
  try {
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let page = req.body.page ? parseInt(req.body.page) : 1;
    let offset = (page - 1) * limit;
    console.log("======>", typeof limit);
    let totalcount = await DrivingSchoolState.count({where:{
      deleted_at:null
    }})
    let statedata = await DrivingSchoolState.findAll({
      where: { deleted_at: null },
      order: [["state_name", "ASC"]],
      limit: limit,
      offset: offset,
    });
    return res.json({
      status: true,
      respose_code: 200,
      response_message: "Data Found succsefully",
      data: statedata,
      totalcount:totalcount
    });
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};

const store_driving_school_state = async (req, res) => {
  try {
    console.log(req.body);
    if (req.body.state_code=="") {
      return res.json({
        status: false,
        response_code:400,
        response_message: "Please provide the state-code",
      });
    }else if(req.body.state_name==""){
      return res.json({
        status: false,
        response_code:400,
        response_message: "Please provide the state_name",
      });
    }
    let state_code = req.body.state_code;
    let foundstate = await DrivingSchoolState.findOne({
      where: {
        state_code: state_code,
      },
      attributes: ["id"],
    });
    //    return res.json(foundstate)

    if (foundstate) {
      console.log("update here ", foundstate);
      let updatedata = await DrivingSchoolState.update(req.body, {
        where: { id: foundstate.id },
      });
      return res.json({
        status: true,
        respose_code: 200,
        response_message: "data update successfully!!",
      });
    } else {
      let storestate = await DrivingSchoolState.create(req.body);
      if (storestate) {
        console.log("data stored successfully!!!");
        return res.json({
          status: true,
          respose_code: 200,
          response_message: "Data stored successfully!!!",
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

const get_update_driving_school_state = async (req, res) => {
  try {
    let id = req.params.id;
    let data = await DrivingSchoolState.findOne({ where: { id: id } });
    return res.json({
      status: true,
      respose_code: 200,
      data: data,
    });
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};

const update_driving_school_state = async (req, res) => {
  try {
    console.log(req.params.id);
    console.log(req.body);
    let id = req.params.id;

    if (!id || isNaN(id)) {
      return res.json({
        status: false,
        respose_code: 400,
        response_message: "Please provide the valid id",
      });
    }
    let updatestate = await DrivingSchoolState.update(req.body, {
      where: { id: id },
    });
    if (updatestate) {
      return res.json({
        status: true,
        respose_code: 200,
        response_message: "data update successfully!!",
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};
const delete_driving_school_state = async (req, res) => {
  try {
    let id = req.params.id;
    if (!id || isNaN(id)) {
      return res.json({
        status: false,
        respose_code: 400,
        response_message: "Please provide the valid id",
      });
    }
    // let delete_state = await DrivingSchoolState.destroy({where: {id: id}})
    // console.log(delete_state);
    // if (delete_state>0) {
    //     console.log("deleted.......");
    //     return res.json({
    //         status:false,
    //         respose_code:400,
    //         response_message:"record is deleted!!"
    //     })
    // }else if(delete_state===0){
    //     console.log("record not deleted....");
    //     return res.json({
    //         status:false,
    //         respose_code:400,
    //         response_message:"Please provide the valid id"
    //     })
    // }
    let date = new Date();
    let softdelete = await DrivingSchoolState.update(
      { deleted_at: date },
      { where: { id: id } }
    );
    if (softdelete[0] === 1) {
      return res.json({
        status: true,
        respose_code: 200,
        response_message: "Data deleted successfully!!!",
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};

const driving_school_state_search = async(req,res)=>{
  try {
    console.log(req.body);
    let {search} = req.body;
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let page = req.body.page ? parseInt(req.body.page) : 1;
    let offset = (page - 1) * limit;
    let searchcount = await DrivingSchoolState.findAll({
      where:{state_name :{
        [Op.like] : `%${search}%`
      },
      deleted_at:null},
    })
    let stateSearch = await DrivingSchoolState.findAll({
      where:{state_name :{
        [Op.like] : `%${search}%`
      },
      deleted_at:null
    },
      limit:limit,
      offset:offset
    })

    console.log(stateSearch);
     if (stateSearch) {
      return res.json({
        status:true,
        response_code:200,
        response_message:"data Found succesfully!!",
        data:stateSearch,
        totalcount:searchcount.length

      })
     }else{
      return res.json({
        status:false,
        response_code:400,
        response_message:"data not found!!",
        data:stateSearch
      })
     }
    
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
}

const get_all_driving_school_state = async(req,res)=>{
  try {
      // console.log(req.body);
      let allstate = await DrivingSchoolState.findAll()
      return res.json({
        status:true,
        response_code:200,
        response_message:"Data found successfully!!!!",
        data:allstate
      })
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
}

/****************************************************driving school state**********************************End******** */

/*****************************************************driving school city***********************************start*********/
const get_driving_school_city = async (req, res) => {
  try {
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let page = req.body.page ? parseInt(req.body.page) : 1;
    let offset = (page - 1) * limit;
    let totalcount = await DrivingSchoolCity.count({
      where:{
        deleted_at:null
      }
    })
    let allstate = await DrivingSchoolCity.findAll({
      where: { deleted_at: null },
      limit: limit,
      offset: offset,
      order: [["city_name", "ASC"]],
      include:[
        {
          model:DrivingSchoolState,
          as:"stateDetails",
          attributes:["id","state_name"]
        }
      ],
      
    });
    return res.json({
      status: true,
      respose_code: 200,
      response_message: "data Found successfully!!",
      data: allstate,
      totalcount:totalcount
    });
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
      msg:error.message
    });
  }
};

const add_driving_school_city = async (req, res) => {
  try {
    console.log(req.body);
    let { state_id, city_name, other_name } = req.body;
    if (!state_id || state_id == "") {
      return res.json({
        status: false,
        respose_code: 400,
        response_message: "Please provide the state name",
      });
    } else if (!city_name || city_name == "") {
      return res.json({
        status: false,
        respose_code: 400,
        response_message: "Please provide the cityname",
      });
    }
    ;
    let citydata = {
      state_id: state_id,
      city_name: city_name,
      other_name: other_name,
    };
    citydata.other_name = other_name == "" ? null : other_name;
    let storeddata = await DrivingSchoolCity.create(citydata);
    if (storeddata) {
      console.log("data is stored");
      return res.json({
        status: true,
        respose_code: 200,
        response_message: "Data stored successfully!!",
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};

const delete_driving_school_city = async (req, res) => {
  try {
    console.log(req.params.id);
    let id = req.params.id;
    let date = new Date();
    let softdelete = await DrivingSchoolCity.update(
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

const get_update_driving_school_city = async (req, res) => {
  try {
    let id = req.params.id;
    let updatedata = await DrivingSchoolCity.findOne({ where: { id: id },include:[
      {
        model:DrivingSchoolState,
        as:"stateDetails",
        attributes:["id","state_name"]
      }
    ], });
    return res.json({
      status: true,
      response_code: 200,
      response_message: "data found successfully!!!!",
      data: updatedata,
    });
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};
const update_driving_school_city = async (req, res) => {
  try {
    let { state_id, city_name, other_name } = req.body;
    console.log(req.params.id);
    let id = req.params.id;
    if (!state_id || state_id == "") {
      return res.json({
        status: false,
        response_code: 400,
        response_message: "Please provide the state name",
      });
    } else if (!city_name || city_name == "") {
      return res.json({
        status: false,
        response_code: 400,
        response_message: "Please provide the cityname",
      });
    }
    let updatecity = await DrivingSchoolCity.update(req.body, {
      where: { id: id },
    });
    console.log(updatecity);
    if (updatecity[0] === 1) {
      return res.json({
        status: true,
        respose_code: 200,
        response_message: "data update successfully!!!!",
      });
    } else {
      console.log("data is not updated");
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};

const driving_school_city_search = async(req,res)=>{
  try {
    console.log(req.body);
    let{search,state_id}=req.body;
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let page = req.body.page ? parseInt(req.body.page) : 1;
    let offset = (page - 1) * limit;
    let Whereclause = {}

    if (state_id) {
      Whereclause.state_id=state_id,
      Whereclause.deleted_at=null
    }
    if (search) {
      Whereclause.city_name ={
        [Op.like]:`%${search}%`}
        Whereclause.deleted_at=null
    }
    if (state_id && search) {
      Whereclause.state_id=state_id,
      Whereclause.deleted_at=null,
      Whereclause.city_name ={
        [Op.like]:`%${search}%`}
    }
    let searchcitycount = await DrivingSchoolCity.findAll({where:Whereclause})

  let searchcity = await DrivingSchoolCity.findAll({
    where: Whereclause,
    include: [
      {
        model: DrivingSchoolState,
        as: "stateDetails",
        attributes: ["id", "state_name"]
      }
    ],
    limit:limit,
    offset:offset

  });

    // console.log(searchcity);
     if (searchcity) {
       return res.json({
        status:true,
        response_code:200,
        response_message:"Data found sucessfully!!!",
        data:searchcity,
        totalcount:searchcitycount.length
       })
     }else{
      return res.json({
        status:false,
        response_code:400,
        response_message:"Data not found!!!"
      })
     }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
}

const get_all_driving_school_city = async(req,res)=>{
  try {
    console.log(req.body);
    let allcity = await DrivingSchoolCity.findAll()
    return res.json({
      status:true,
      response_code:200,
      response_message:"Data found sucessfully!!!",
      data:allcity,
     })
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
}
/*****************************************************driving school city***********************************stop*********/

/******************************************************driving school area**********************************start****** */
const get_driving_school_area = async (req, res) => {
  try {
    console.log(req.body);
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let page = req.body.page ? parseInt(req.body.page) : 1;
    let offset = (page - 1) * limit;
    let allarea = await DrivingSchoolArea.count({
      where:{
        deleted_at:null
      }
    })
    console.log("======>",allarea);
    let Areadata = await DrivingSchoolArea.findAll({
      where: { deleted_at: null },
      limit: limit,
      offset: offset,
      include:[
        {
          model:DrivingSchoolCity,
          as:"cityDetails",
          attributes:["id","city_name"]
        }
      ],
    });
    return res.json({
      status: true,
      response_code: 400,
      response_message: "Data found successfully!!!",
      data: Areadata,
      totalcount:allarea
    });
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};

const edit_driving_school_area = async (req, res) => {
  try {
    let id = req.params.id;
    console.log("=====>", id);
    let editschoolarea = await DrivingSchoolArea.findOne({ where: { id: id },include:[
      {
        model:DrivingSchoolCity,
        as:"cityDetails",
        attributes:["id","city_name"]
      }
    ] });
    return res.json({
      status: true,
      response_code: 400,
      response_message: "Data Found successfully!!!!!",
      data: editschoolarea,
    });
  } catch (error) {
    return res.json(error);
  }
};

const update_driving_school_area = async (req, res) => {
  try {
    console.log(req.params.id);
    let id = req.params.id;
    let { city_id, area_name, other_name, zip_code } = req.body;
    // let cityid = await DrivingSchoolCity.findOne({where:{city_name:city_name},attributes:["id"]})
    // return res.json(cityid)
    if (!city_id || city_id == "") {
      return res.json({
        status: false,
        response_code: 400,
        response_message: "Please provide the cityid!!",
      });
    } else if (!area_name || area_name == "") {
      return res.json({
        status: false,
        response_code: 400,
        response_message: "Please provide the areaname!!",
      });
    } else if (!zip_code || zip_code == "") {
      return res.json({
        status: false,
        response_code: 400,
        response_message: "Please provide the zipcode!!",
      });
    }
    let updateobject = {
      area_name: area_name,
      other_name: other_name,
      city_id: city_id,
      zip_code: zip_code,
    };
    console.log("========>",updateobject);
    updateobject.other_name =
      other_name == "" || !other_name ? null : other_name;

    let updateschoolarea = await DrivingSchoolArea.update(updateobject, {
      where: { id: id },
    });
    console.log(updateschoolarea);
    if (updateschoolarea[0] === 1) {
      return res.json({
        status: true,
        response_code: 200,
        response_message: "Data update successfully!!",
      });
    } else {
      return res.json({
        status: false,
        response_code: 400,
        response_message: "Data is not updated",
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};

const delete_driving_school_area = async (req, res) => {
  try {
    console.log(req.params.id);
    let id = req.params.id;
    let date = new Date();
    console.log(date);
    let softdelete = await DrivingSchoolArea.update(
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

const store_driving_school_area = async (req, res) => {
  try {
    console.log(req.body);
    let { city_id, area_name, other_name, zip_code } = req.body;
    if (!city_id || city_id == "") {
      return res.json({
        status: false,
        response_code: 400,
        response_message: "Please provide the cityid",
      });
    } else if (!area_name || area_name == "") {
      return res.json({
        status: false,
        response_code: 400,
        response_message: "Please provide the area name",
      });
    } else if (!zip_code || zip_code == "") {
      return res.json({
        status: false,
        response_code: 400,
        response_message: "Please provide the zipcode",
      });
    }
    let areaobject = {
      city_id: city_id,
      area_name: area_name,
      other_name: other_name,
      zip_code: zip_code,
    };
    areaobject.other_name = other_name == "" || !other_name ? null : other_name;
    let storearea = await DrivingSchoolArea.create(areaobject);
    if (storearea) {
      return res.json({
        status: true,
        response_code: 200,
        response_message: "data stored successfully!!!",
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};

const driving_school_area_search = async(req,res)=>{
  try {
    console.log(req.body);
    let {search,city_id}= req.body;
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let page = req.body.page ? parseInt(req.body.page) : 1;
    let offset = (page - 1) * limit;
    if (search!==""&&city_id!=="") {
      let searchDetailcount = await DrivingSchoolArea.findAll({where:{area_name :{
        [Op.like]:`%${search}%`
      },city_id:city_id,
      deleted_at:null},
      
      
    })
      let searchDetail = await DrivingSchoolArea.findAll({where:{area_name :{
        [Op.like]:`%${search}%`
      },city_id:city_id,
      deleted_at:null},
      include:[
        {
          model:DrivingSchoolCity,
          as:"cityDetails",
          attributes:["id","city_name"]
        }
      ],
      limit:limit,
      offset:offset
    })
    return res.json({
      status:true,
      response_code:200,
      response_message:"Data found sucessfully!!",
      data:searchDetail,
      totalcount:searchDetailcount.length
    })
    }else if(search==""){
      let searchDetailcount = await DrivingSchoolArea.findAll({where:{city_id:city_id,deleted_at:null}})
      let searchDetail = await DrivingSchoolArea.findAll({where:{city_id:city_id,deleted_at:null},
        include:[
          {
            model:DrivingSchoolCity,
            as:"cityDetails",
            attributes:["id","city_name"]
          }
        ],  
      limit:limit,
    offset:offset})
    return res.json({
      status:true,
      response_code:200,
      response_message:"Data found sucessfully!!",
      data:searchDetail,
      totalcount:searchDetailcount.length
    })
    }else if (city_id=="") {
      let searchDetailcount = await DrivingSchoolArea.findAll({where:{area_name :{
        [Op.like]:`%${search}%`
      },
      deleted_at:null},
     
  })
      let searchDetail = await DrivingSchoolArea.findAll({where:{area_name :{
        [Op.like]:`%${search}%`
      },
      deleted_at:null},
      include:[
        {
          model:DrivingSchoolCity,
          as:"cityDetails",
          attributes:["id","city_name"]
        }
      ],
    limit:limit,
    offset:offset
  
  })
    return res.json({
      status:true,  
      response_code:200,
      response_message:"Data found sucessfully!!",
      data:searchDetail,
      totalcount:searchDetailcount.length
    })

    }else{
      return res.json({
        status:false,
        response_code:400,
        response_message:"Data not found!!!",
      })
    }
    
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
}

const get_all_area = async(req,res)=>{
  try {
    console.log(req.body);
    let getallarea = await DrivingSchoolArea.findAll({where:{deleted_at:null},
      include:[
        {
          model:DrivingSchoolCity,
          as:"cityDetails",
          attributes:["id","city_name"]
        }
      ]})
    return res.json({
      status:true,
      response_code:200,
      response_message:"Data Found succesfully!!!",
      data:getallarea
    })
    
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
}
/******************************************************driving school area***********************************End******* */

/*******************************************************driving school detail********************************start****** */

const get_driving_school_detail = async (req, res) => {
  try {
    console.log(req.body);
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let page = req.body.page ? parseInt(req.body.page) : 1;
    let offset = (page - 1) * limit;
    let alldetails = await DrivingSchoolDetail.count({
      where:{
        deleted_at:null
      }
    })
    let detaildata = await DrivingSchoolDetail.findAll({
      where: { deleted_at: null },
      limit: limit,
      offset: offset,
      include:[
       {
        model:DrivingSchoolCity,
        as:"cityDetail",
        attributes:["id","city_name"]
       }
      ]
    });
    return res.json({
      status: true,
      respose_code: 200,
      response_message: "Data Found successfully!!!!",
      data: detaildata,
      totalcount:alldetails
    });
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
};

const add_driving_school_Detail = async (req, res) => {
  try {
    let {
      cityId,
      areaId,
      zipCodeId,
      zip_code,
      name,
      address,
      contactName,
      type,
      latitude,
      longitude,
      openTime,
      closeTime,
      closeDays,
      contactNumber1,
      contactNumber2,
      establishedYear,
      email,
      website,
      services,
      sun,
      mon,
      tue,
      wed,
      thu,
      fri,
      sat,
      paymentMode,
      isFeatured,
      rowNumber,
      schoolValue,
      status,
      open_close,
      added_by
    } = req.body;

    if (cityId=="") {
      return res.json({
        status: false,
        response_code:400,
        response_message: "Please provide the cityid",
      });
    }else if(name==""){
      return res.json({
        status: false,
        response_code:400,
        response_message: "Please provide the name",
      });
    }else if(address==""){
      return res.json({
        status: false,
        response_code:400,
        response_message: "Please provide the address",
      });
    }else if(email==""){
      return res.json({
        status: false,
        response_code:400,
        response_message: "Please provide the email",
      });
    }else if(website==""){
      return res.json({
        status: false,
        response_code:400,
        response_message: "Please provide the website",
      })
    }else if(zip_code==""){
      return res.json({
        status: false,
        response_code:400,
        response_message: "Please provide the zipcode",
      })
    }

    let areaobject = {
      cityId: cityId,
      areaId: areaId,
      zipCodeId: zipCodeId,
      zip_code: zip_code,
      name: name,
      address: address,
      contactName: contactName,
      type: type,
      latitude: latitude,
      longitude: longitude,
      openTime: openTime,
      closeTime: closeTime,
      closeDays: closeDays,
      contactNumber1: contactNumber1,
      contactNumber2: contactNumber2,
      establishedYear: establishedYear,
      email: email,
      website: website,
      services: services,
      sun: sun,
      mon: mon,
      tue: tue,
      wed: wed,
      thu: thu,
      fri: fri,
      sat: sat,
      paymentMode: paymentMode,
      isFeatured: isFeatured,
      rowNumber: rowNumber,
      schoolValue: schoolValue,
      status: status,
      open_close:open_close,
      added_by:added_by
    };
    
    


   // Assuming input is an object
   areaobject.contactNumber2 = contactNumber2=="" ? "" :contactNumber2;
   areaobject.open_close = open_close=="" || open_close==undefined ?"" : open_close;
   areaobject.closeDays = closeDays=="" ?"" : closeDays;
   areaobject.contactName = contactName=="" ?"" : contactName;
   areaobject.website = website=="" ?"" : website;
   areaobject.email = email=="" ?"" :email;
   areaobject.establishedYear = establishedYear=="" ?"":establishedYear;
areaobject.added_by = added_by=="" || added_by==undefined?0:added_by
 areaobject.isFeatured = isFeatured==undefined || isFeatured==""?0:isFeatured;
areaobject.rowNumber = rowNumber==undefined || rowNumber==""?0:rowNumber;
areaobject.schoolValue = schoolValue==undefined || schoolValue==""?0:schoolValue;
areaobject.status =status==undefined || status==""?0:status
if (Array.isArray(paymentMode)) {
  paymentMode = paymentMode.join(',');
} else {
  paymentMode = '';
}
// console.log(areaobject);

let storedata = await DrivingSchoolDetail.create(areaobject)
  if (storedata) {
    return res.json({
      status:true,
      response_code:200,
      response_message:"Data stored successfully!!!"
    })
  }
  } catch (error) {
    return res.json({
      status: false,
      response_message: error,
    });
  }
};

const delete_driving_school_detail = async (req, res) => {
  try {
    console.log(req.params.id);
    let id = req.params.id;
    let date = new Date();
    console.log(date);
    let softdelete = await DrivingSchoolDetail.update(
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

const edit_driving_school_detail =async(req,res)=>{
 try {
   let id = req.params.id;
   console.log(id);
   let dataofschool = await DrivingSchoolDetail.findOne({where:{id:id},include:[
    {
     model:DrivingSchoolCity,
     as:"cityDetail",
     attributes:["id","city_name"]
    }
   ]})
   console.log(dataofschool);

   if (dataofschool) {
    return res.json({
      status:true,
      response_code:200,
      response_message:"Data found successfully!!!!",
      data:dataofschool
    })
   }
 } catch (error) {
  return res.json({
    status: false,
    response_message: "Error Occured!!!",
  });
 }
}

const update_driving_school_detail = async(req,res)=>{
 try {
   console.log(req.params.id);
   let id = req.params.id
   let updatedetail = await DrivingSchoolDetail.update(req.body,{where:{id:id}})
   if (updatedetail[0]===1) {
    return res.json({
      status:true,
      response_code:200,
      response_message:"Data update succedssfull!!!"
    })
   }else{
    return res.json({
      status:true,
      response_code:400,
      response_message:"Data not updated!!!"
    })
   }


 } catch (error) {
  return res.json({
    status: false,
    response_message: "Error Occured!!!",
  });
 }
}


const changeStatusDSdetails = async(req,res)=>{
  try {
    let id = req.body.id
    console.log(id);
    let status = {
      status:parseInt(req.body.status)
    }

    console.log(status);

    let statuschange = await DrivingSchoolDetail.update(status,{where:{id:parseInt(id)}})
    console.log(statuschange);
    if (statuschange[0]===1) {
      return res.json({
        status:true,
        response_code:200,
        response_message:"status change successfully!!!"
      })
    }else{
      return res.json({
        status:true,
        response_code:200,
        response_message:"status not changed!!!!"
      })
    }
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
}

const driving_school_detail_search = async(req,res)=>{
  try {
console.log(req.body);
let{searchvalue,cityId,status,added_by} = req.body   
 console.log(req.body); 
 let limit = req.body.limit ? parseInt(req.body.limit) : 10;
 let page = req.body.page ? parseInt(req.body.page) : 1;
 let offset = (page - 1) * limit;
 

 const whereClause = {};

if (searchvalue) {
  whereClause.name = {
    [Op.like]: `%${searchvalue}%`
  };
  whereClause.deleted_at = null;
}

if (cityId) {
  whereClause.cityId = cityId;
  whereClause.deleted_at = null;

}

if (status) {
  whereClause.status = status;
  whereClause.deleted_at = null;

}

if (added_by) {
  whereClause.added_by = added_by;
  whereClause.deleted_at = null;

}
let searchDetailcount = await DrivingSchoolDetail.findAll({
  where:whereClause,
  
 })

 let searchDetail = await DrivingSchoolDetail.findAll({
  where:whereClause,
  include:[
    {
     model:DrivingSchoolCity,
     as:"cityDetail",
     attributes:["id","city_name"]
    }
   ],
  limit:limit,
  offset:offset
 })
if (searchDetail) {
  return res.json({
    status:true,
    response_code:200,
    response_message:"Data found successfully!!!",
    data:searchDetail,
    totalcount:searchDetailcount.length
  })
}

  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
}

const get_all_details = async(req,res)=>{
  try {
    console.log(req.body,"=====>");
   let allDetails = await DrivingSchoolDetail.findAll({where:{deleted_at:null},
    include:[
      {
       model:DrivingSchoolCity,
       as:"cityDetail",
       attributes:["id","city_name"]
      }
     ]})
     if (allDetails) {
      return res.json({
        status:true,
        response_code:200,
        response_message:"Data Found successfully!!",
        data:allDetails
       })
     }
     
  } catch (error) {
    return res.json({
      status: false,
      response_message: "Error Occured!!!",
    });
  }
}

/*******************************************************driving school detail********************************End******** */

export default {
  //state==>
  get_driving_school_state,
  store_driving_school_state,
  update_driving_school_state,
  delete_driving_school_state,
  get_update_driving_school_state,
  driving_school_state_search,
  get_all_driving_school_state,
  // city ===>
  get_driving_school_city,
  add_driving_school_city,
  delete_driving_school_city,
  update_driving_school_city,
  get_update_driving_school_city,
  driving_school_city_search,
  get_all_driving_school_city,
  //area==>
  get_driving_school_area,
  edit_driving_school_area,
  update_driving_school_area,
  delete_driving_school_area,
  store_driving_school_area,
  driving_school_area_search,
  get_all_area,
  //detail==>
  get_driving_school_detail,
  add_driving_school_Detail,
  delete_driving_school_detail,
  edit_driving_school_detail,
  update_driving_school_detail,
  changeStatusDSdetails,
  driving_school_detail_search,
  get_all_details

};
