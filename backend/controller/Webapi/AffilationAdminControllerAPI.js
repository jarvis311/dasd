import { DataTypes, Op,Sequelize, where } from "sequelize"
import ServicesCategory from "../../models/ServicesCategory.js";
import ServiceProvider from "../../models/ServiceProvider.js"
import AffiliationServices from "../../models/AffiliationServices.js"
import AffiliationPlace from "../../models/AffiliationPlace.js"
import AdType from "../../models/AdType.js"
import AffilationState from "../../models/AffilationState.js"
import AffilationData from "../../models/AffilationData.js";
import Affilation from "../../models/Affilation.js"
import ServiceCityList from "../../models/ServiceCityList.js"
import ServiceCategory from "../../models/ServiceCategory.js";
import Offer from "../../models/Offer.js"
import moment from "moment";
import uploadfiles from "../../helpers/fileUpload.js"
import Language from "../../models/Language.js"
import AffilationCityPinCode from "../../models/AffilationCityPinCode.js";

const getAffilationDashboard = async (req, res) => {
    try {
        const serviceCategoryData = await ServicesCategory.findAll({
            attributes: ['category', 'id'],
            group: ['category', 'id'],
            order:[['id','ASC']],
            where : {
                deleted_at : null
            }
        });
        const serviceProviderData = await ServiceProvider.findAll({
            where : {
                deleted_at : null
            },
            attributes: ['provider', 'id'],
            group: ['provider', 'id'],
            order:[['id','ASC']]
        });
        const affliationServiceData = await AffiliationServices.findAll({
            attributes: ['services', 'id'],
            group: ['services', 'id'],
            order:[['id','ASC']]
        });
        const affliationPlaceData = await AffiliationPlace.findAll({
            where : {
                deleted_at : null
            },
            attributes: ['place', 'id'],
            group: ['place', 'id'],
            order:[['id','ASC']]
        });
        const adTypeData = await AdType.findAll({
            attributes: ['type', 'id'],
            group: ['type', 'id'],
            order:[['id','ASC']]
        });
        const affilationCityData = await AffilationState.findAll({
            where : {
                deleted_at : null
            },
            attributes: ['city', 'id'],
            group: ['city', 'id'],
            order:[['id','ASC']]
        });
        const _response = {
            service_category :serviceCategoryData ,
            service_providers :serviceProviderData ,
            ad_type: adTypeData,
            affiliation_place :affliationPlaceData ,
            affiliation_services : affliationServiceData,
            affilation_city : affilationCityData,
            status : [  
                {
                    name:'Active',
                    value :"1"
                },
                {
                    name:'De-active',
                    value :"0"
                }
            ],
            is_default:[
                {
                    name:'True',
                    value :"1"
                },
                {
                    name:'False',
                    value :"0"
                }
            ]
        }
        return res.send({
            status: true,
            message: "Data Found SuccessFully !",
            data: _response
        })
    } catch (error) {
        console.log("-error", error);
        return res.json({
            status: false,
            message: "Error Eccoured !"
        })
    }
}

const getAffilationDashboardData  = async(req,res) =>{
    try {
        const {affiliation_place, service_category,service_providers,affiliation_services,ad_type,status,is_default,affilation_city} = req.body
 
        let where = {
            deleted_at : null
        }
        if(affiliation_place && affiliation_place != ""){
            const affiliationIds = await Affilation.findAll({
                where:{
                    affiliation_place_id : affiliation_place
                },
               
                // attributes: ['id']
            })
            if(affiliationIds.length){
                where = {...where ,
                    affiliate_id : {
                        [Op.in]:affiliationIds.map(affiliation => affiliation.id)
                    }
                }
            }

              
        }
        if(service_category && service_category!= ""){
            const affiliationIds = await Affilation.findAll({
                where:{
                    service_category_id : service_category
                },
                attributes: ['id']
            })
            if(affiliationIds.length){
                where = {...where ,
                    affiliate_id : {
                        [Op.in]:affiliationIds.map(affiliation => affiliation.id)
                    }
                }
            }
        }
      
        if(service_providers && service_providers != ""){
            where = {...where ,service_provider_id : service_providers      }
        }
        if(affiliation_services && affiliation_services != ""){
            where = {...where ,affiliation_services_id : affiliation_services   }

        }
        if(ad_type && ad_type != ""){
            where = {...where , ad_type_id : ad_type  }

        }
        if(status && status != ""){
            where = {...where ,status : status}

        }
        
        if(is_default && is_default != ""){
            where = {...where ,is_default : is_default}

        }

        if(affilation_city && affilation_city != ""){
            let citylist = await ServiceCityList.findAll({
                attributes: ['affiliation_services_id', 'service_provider_id'],
                where: {
                [Op.or]: [
                    { city_id: {  [Op.like]:`%${affilation_city}%`   } },
                    { city_id: { [Op.in]: ['ALL'] } },

                ],
                deleted_at : null
                }
            });
            if(citylist.length){
                const affiliation_services_id = citylist.map(city => city.affiliation_services_id);
                const service_provider_id = citylist.map(city => city.service_provider_id);
             
                if(where && where.affiliation_services_id){
                    where = {...where ,
                        service_provider_id : service_provider_id,
                    }
                }else{
                    where = {...where ,
                        affiliation_services_id : affiliation_services_id,
                        service_provider_id : service_provider_id,
                    }
                }

            }
          
        }
        let affilation_data = await AffilationData.findAll({
            where :{...where},
            include:[{
                model: Affilation,
                as:'get_affilation',
                include:[{
                    model: AffiliationPlace,
                    as:'get_affiliation_place',
                    attributes: ['id', 'place']
                  },
                  {
                    model:ServiceCategory,
                    as:'get_name'
                  }]
              },
              {
                model: ServiceProvider,
                as: 'get_service_provider_name',
              },
              {
                model: AffiliationServices,
                as: 'get_affiliation_services',
              },
              {
                model: AdType,
                as: 'get_ad_type_name',
              }
            ],
            group:['id']
         
        })
        return res.send({
            status: true,
            message: "Data Found SuccessFully !",
            data: affilation_data
        })
    } catch (error) {
        console.log("-error", error);
        return res.json({
            status: false,
            message: "Error Eccoured !"
        })
    }
}


const updateAffilationStatus = async(req,res) =>{
    try {
        const { id } = req.body
        if(!id){
            return res.send({
                status: false,
                message: "Id is required"
            })
        }
        if(!req.body.status){
            return res.send({
                status: false,
                message: "Status is required"
            })
        }
        await AffilationData.update({status :req.body.status },{
            where:{
                id : id
            }
        })
        return res.send({
            status: true,
            message: "Category updated SuccessFully !"
        })
    } catch (error) {
        console.log("-error", error);
        return res.json({
            status: false,
            message: "Something Went Wrong, Status Not Changed ..!"
        })
    }
    
}

const getAffilationData = async(req,res) => {
    try {
        const limit = 25
        const offset = 0
        const affiliations_update = await Affilation.findAll({
            limit,
            offset,
            include:[{
                model: AffiliationPlace,
                as:'get_affiliation_place',
                attributes: ['id', 'place']
              }
            ],
            // group:['id']
        });
        const affilationCount = await Affilation.count({})

        // Calculate the total number of pages
        const totalPages = Math.ceil(affilationCount / limit);
        const _affilationResponse = {
            total_record : affilationCount,
            per_page : limit,
            total_page : totalPages,
            data:affiliations_update
        }

        //affilation Place
        const affilationPlace = await AffiliationPlace.findAll({
            attributes: ['id', 'place'],
            where : {
                deleted_at : null
            }
        });

        const _response ={
            app_update : _affilationResponse,
            affiliation_place : affilationPlace
        }
        return res.send({
            status : true,
            message : "Data Found SuccessFully !",
            data:_response
        })
        
    } catch (error) {
        console.log("-error", error);
        return res.json({
            status: false,
            message: "Something Went Wrong...!"
        })
    }
}

const getAffilationPlace = async(req,res) => {
    try {
        // let affilation_data = await AffiliationPlace
    } catch (error) {
        console.log("-error", error);
        return res.json({
            status: false,
            message: "Something Went Wrong...!"
        })
    }
}
const getPaginationAffilation = async(req,res) =>{
    try {
        let { limit,place,services } = req.body;
        let offset
        limit = limit ? limit : 25
        let page = req.body.page ? req.body.page : 1
        if(limit && limit > 0){
            offset =  (page - 1) * limit
        }
        let where = { }
        if(place && place != 'all'){
            where = {...where , 
                affiliation_place_id : place
            }
        }
        if(services && services != 'all'){s
            where = {...where , 
                affiliation_services_id : place
            }
        }
        limit = typeof limit == "number" ? limit : Number(limit)
        const affiliations_update = await Affilation.findAll({
            where,
            include:[{
                model: AffiliationPlace,
                as:'get_affiliation_place',
                attributes: ['id', 'place']
              }
            ],
            group:['id'],
            limit : Number(limit),
            offset : offset,
        });
        // const affilationCount = await Affilation.findAll({
        //     where, 
        //     include:[{
        //         model: AffiliationPlace,
        //         as:'get_affiliation_place',
        //         attributes: ['id', 'place']
        //       }
        //     ],
        //     group:['id'],
        // })
        const affilationCount = await Affilation.count({
            where, 
        })
      
      
        // Calculate the total number of pages
        const totalPages = Math.ceil(affilationCount / limit);
        const _affilationResponse = {
            total_record : affilationCount,
            per_page : Number(limit),
            total_page : totalPages,
            data:affiliations_update
        }
        return res.send({
            status: true,
            message: "Data Found SuccessFully !",
            data: _affilationResponse
        })
    } catch (error) {
        console.log("-error", error);
        return res.json({
            status: false,
            message: "Something Went Wrong...!"
        })
    }
}

const getAffilationById = async(req,res) => {
    try {
        const { id } = req.params
        console.log("==id",id);
        if(!id){
            return res.send({
                status : false,
                message :"Please Provide Id..."
            })
        }

        const affilation_data = await Affilation.findOne({
            where:{
                id : id
            }
        })
        const affliation_place_data = await AffiliationPlace.findAll({
            where : {
                deleted_at : null
            },
            attributes: ['place', 'id'],
            group: ['place', 'id'],
        });
        const _response = {
            affilation_data:affilation_data,
            affiliation_place : affliation_place_data
        }
        return res.send({
            status : true,
            message :"Data Found SuccessFully !",
            data:_response
        })

    } catch (error) {
        console.log("-error", error);
        return res.json({
            status: false,
            message: "Something Went Wrong...!"
        })
    }
}

const getAffilationDataShow = async(req,res) => {
    try {
        const { place_id} = req.body
        let place_name
        if(!place_id){
            const _response = {
                status : false,
                message : "Place Id is required",
            }
            return res.send(_response )
        }
        const affilation_id_data =await Affilation.findAll(
            {
                where :{
                    affiliation_place_id : place_id
                },
                attributes: ['id'],
            }
        )
        const find_place_name = await Affilation.findOne({
            where:{
                affiliation_place_id : place_id
            },
            include:[
                {
                    model: AffiliationPlace,
                    as:'get_affiliation_place',
                    attributes: ['id', 'place']
                }
            ]
        })
        if(find_place_name){
            place_name = find_place_name.get_affiliation_place ? find_place_name.get_affiliation_place.place : null
            if(place_name && place_name == "service"){

                // service affilation with sub category
                const data = await Affilation.findAll({
                    where :{
                        affiliation_place_id : place_id
                    },
                    include:[
                        {
                            model:ServiceCategory,
                            as:'get_name'
                        },
                        {
                            model: AffilationData,
                            as:'affilation_data_list',
                            where :{
                                deleted_at : null
                            },
                            include:[
                                {
                                    model: ServiceProvider,
                                    as: 'get_service_provider_name',
                                },
                                {
                                    model: AffiliationServices,
                                    as: 'get_affiliation_services',
                                },
                                {
                                    model: AdType,
                                    as: 'get_ad_type_name',
                                }
                            ]
                        }
                        
                    ],
                    order: [
                        [{
                            model: AffilationData,
                            as: 'affilation_data_list'
                        }, 'position', 'ASC'],  
                    ]
                })
                const _response = {
                    status : true,
                    place_name : place_name,
                    message : "Data Found SuccessFully..!",
                    data : data
                }
                return res.send(_response)
            }
          
            if(place_name && place_name == "home_slider"){ 
                const affilation_data = await AffilationData.findAll({
                    where :{
                        deleted_at : null,
                        affiliate_id : {
                            [Op.in]:affilation_id_data.map(element => element.id)
                        }
                    },
                    attributes :['group_id'],
                    group : ['group_id'],
                    order:[['group_id','ASC']]
                })
                let _homeSliderData = []
                if(affilation_data && affilation_data.length){
                    for (let i = 0; i < affilation_data.length; i++) {
                        const element = affilation_data[i];
                        let home_silder_data = await AffilationData.findAll({
                            where :{
                                deleted_at : null,
                                affiliate_id : {
                                    [Op.in]:affilation_id_data.map(affilation => affilation.id)
                                },
                                group_id : element.group_id,
                            },
                            include:[
                                {
                                    model: ServiceProvider,
                                    as: 'get_service_provider_name',
                                },
                                {
                                    model: AffiliationServices,
                                    as: 'get_affiliation_services',
                                },
                                {
                                    model: AdType,
                                    as: 'get_ad_type_name',
                                }
                            ],
                            order : [['position','ASC']]
                        })
                        const _response = {
                            group_id : element.group_id,
                            affilation_data_list : home_silder_data
                        }
                        _homeSliderData.push(_response)
                    }
                   
                }
                const _response = {
                    status : true,
                    place_name : place_name,
                    message : "Data Found SuccessFully..!",
                    data : _homeSliderData
                }
                return res.send(_response )
            }
        }
       
        const affilation_data = await AffilationData.findAll({
            where :{
                deleted_at : null,
                affiliate_id : {
                    [Op.in]:affilation_id_data.map(element => element.id)
                }
            },
            include:[
                {
                    model: ServiceProvider,
                    as: 'get_service_provider_name',
                },
                {
                    model: AffiliationServices,
                    as: 'get_affiliation_services',
                },
                {
                    model: AdType,
                    as: 'get_ad_type_name',
                }
            ],
            group :['id'],
            order:[['position','ASC']]
        })
        const _response = {
            status : true,
            place_name : place_name,
            message : "Data Found SuccessFully..!",
            data : affilation_data
        }
        return res.send(_response )
    } catch (error) {
        console.log("-error", error);
        return res.json({
            status: false,
            message: "Something Went Wrong...!"
        })
    }
}

const updateAppStatus = async(req,res) => {
    try {
        const { status ,key_name, id} = req.body
        console.log("=status",status);
        if(!id){
            return res.send({
                status: false,
                message: "Id is required"
            })
        }
        if(!status){
            return res.send({
                status: false,
                message: "Status is required"
            })
        }
        if(!key_name){
            return res.send({
                status: false,
                message: "Key Name is required"
            })
        }
        console.log("condition",key_name  && key_name == "is_need_to_show");
        if(key_name  && key_name == "is_need_to_show"){
            await Affilation.update({is_need_to_show :status },
                {
                    where:{
                        id : id
                    }
                }  
            )
        }

        return res.send({
            status : true,
            message : 'Suceessfully'
        })
    } catch (error) {
        console.log("-error", error);
        return res.json({
            status: false,
            message: "Something Went Wrong...!"
        })
    }
}

const deleteAffilationData = async(req,res) =>{
    try {
        const { id } = req.params;
        if(!id){
            return res.json({
                status :false,
                message : 'Id is required..'
            })
        }
        await Affilation.destroy(
            {
                where: {
                    id : id,
                },
            }
        )
        await AffilationData.destroy({
            where:{
                affiliate_id : id,
            }
        })
        return res.json({
            status :true,
            message : 'Deleted SuccessFully !'
        })
    } catch (error) {
        console.log("-error", error);
        return res.json({
            status: false,
            message: "Something Went Wrong...!"
        })
    }
}

/************** Offer Module **************/
const getOfferData = async(req,res) =>{
    try {
        const offer_data = await Offer.findAll({
            where : {
                deleted_at : null
            }
        })
        const _response = {
            status : true,
            message: "Data Found SuccessFully !",
            data : offer_data
        }
        return res.send(_response)
    } catch (error) {
        console.log("-error", error);
        return res.json({
            status: false,
            message: "Something Went Wrong...!"
        })
    }
}

const addOfferData = async(req,res) => {
    try {
        const { offer_data, deleted_ids} = req.body
        const files = req.files
        const offers_new_data = JSON.parse(offer_data)
        let offer_ids = offers_new_data.length ? offers_new_data.map((offer) => offer.id) : []
        const currentTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        if(offers_new_data.length){
            for (let i = 0; i < offers_new_data.length; i++) {
                const element = offers_new_data[i];
                let temp = {
                    index : element.index,
                    lable : element.lable,
                    description : element.description,
                    percentage : element.percentage,
                    code : element.code,
                    url : element.url,
                    utm_term : element.utm_term,
                    action_button : element.action_button,
                    color_code : element.color_code,
                    status : element.status,
                }
                if(element.id){
                    if(files){
                        if(files[`image_${element.id}`]){
                            const _imageResponse =  await uploadfiles.affilationEditFileUpload(files[`image_${element.id}`],"affiliate",element.image)
                            if(_imageResponse.status){
                                temp.image = _imageResponse.image
                            }
                        }
                        
                    }
                    await Offer.update(temp,{
                        where:{
                            id : element.id
                        }
                    })
                }else{
                    if(files){
                        if(files[`new_image_${element.new_id}`]){ 
                            const _imageResponse =  await uploadfiles.fileUploadWithDigitalOcean(files[`new_image_${element.new_id}`],"affiliate")
                            if(_imageResponse.status){
                                temp.image = _imageResponse.image
                            }
                        }
                    }
                    await Offer.create(temp)
                }
            }
        }
        const deleted_ids_data = await Offer.update({deleted_at : currentTime,updated_at:currentTime} ,{
            where : {
                id:{
                    [Op.notIn]: offer_ids
                },
                deleted_at : null
            }
        })
        return res.send({
            status : true,
            message : 'Data updated successFully..!'
        })
    } catch (error) {
        console.log("-error", error);
        return res.json({
            status: false,
            message: "Something Went Wrong...!"
        })
    }
}
const getDynamicDropDown = async(req,res) => {
    try {
        const serviceCategoryData = await ServicesCategory.findAll({
            attributes: [['category','name'], 'id'],
            group: ['category', 'id'],
            order:[['id','ASC']],
            where : {
                deleted_at : null
            }
        });
        const serviceProviderData = await ServiceProvider.findAll({
            where : {
                deleted_at : null
            },
            attributes: [['provider','name'], 'id'],
            group: ['provider', 'id'],
            order:[['id','ASC']]
        });
        const affliationServiceData = await AffiliationServices.findAll({
            where : {
                deleted_at : null
            },
            attributes: [['services','name'], 'id'],
            group: ['services', 'id'],
            order:[['id','ASC']]
        });
        const affliationPlaceData = await AffiliationPlace.findAll({
            where : {
                deleted_at : null
            },
            attributes: [['place','name'], 'id'],
            group: ['place', 'id'],
            order:[['id','ASC']]
        });
        const adTypeData = await AdType.findAll({
            attributes: [['type','name'], 'id'],
            group: ['type', 'id'],
            order:[['id','ASC']]
        });
        const utm_term = await AffilationData.findAll({
            where:{
                deleted_at :null
            },
            attributes: [['utm_term','name']],
            group:['utm_term'],
            order:[['utm_term','ASC']]
        })
        const _response = {
            service_category :serviceCategoryData ,
            service_providers :serviceProviderData ,
            ad_type: adTypeData,
            affiliation_place :affliationPlaceData ,
            affiliation_services : affliationServiceData,
            utm_term:utm_term
        }
        return res.send({
            status: true,
            message: "Data Found SuccessFully !",
            data: _response
        })
    } catch (error) {
        console.log("-error", error);
        return res.json({
            status: false,
            message: "Something Went Wrong...!"
        })
    }
}

const updateDynamicDropDown = async(req,res) =>{
    try {
        const { field_name,old_value } = req.body
        if(!field_name){
            return res.send({
                staus :false,
                message:"field_name is required"
            }) 
        }
        let data_value = req.body.data_value ? JSON.parse(req.body.data_value) : null
        console.log("=data_value",data_value);
        if(!data_value){
            return res.send({
                staus :false,
                message:"data_value is required"
            }) 
        }
        if(!data_value.length){
            return res.send({
                staus :false,
                message:"data_value is required"
            }) 
        }
        const currentTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const ids =  data_value.length &&  data_value.map((s) => s.id)
        if(field_name && field_name == "service_category"){
            for (let i = 0; i < data_value.length; i++) {
                const element = data_value[i];
                if(element.id){
                    await ServicesCategory.update({category : element.name},
                        {
                            where : {
                                id: element.id ,
                            }
                        }
                    )
                }else{
                    await ServicesCategory.create({category:element.name})
                }
            }
            await ServicesCategory.update({deleted_at : currentTime,updated_at:currentTime} ,{
                where : {
                    id:{
                        [Op.notIn]: ids
                    },
                    deleted_at : null
                }
            })
        }

        if(field_name && field_name == "affiliation_place"){
            for (let i = 0; i < data_value.length; i++) {
                const element = data_value[i];
                if(element.id){ 
                    await AffiliationPlace.update({place : element.name},
                        {
                            where : {
                                id: element.id ,
                            }
                        }
                    )
                } else{
                    await AffiliationPlace.create({place:element.name})
                }  
            }
            // await AffiliationPlace.destroy({
            //     where : {
            //         id:{
            //             [Op.notIn]: ids
            //         },
            //         deleted_at : null
            //     }
            // })
            await AffiliationPlace.update({deleted_at : currentTime,updated_at:currentTime} ,{
                where : {
                    id:{
                        [Op.notIn]: ids
                    },
                    deleted_at : null
                }
            })
        }
        if(field_name && field_name == "affiliation_services"){
            for (let i = 0; i < data_value.length; i++) {
                const element = data_value[i];
                    if(element.id){
                        await AffiliationServices.update({services : element.name},
                            {
                                where : {
                                    id: element.id ,
                                }
                            }
                        )
                    }else{
                        console.log("=calllllllllllll");
                        await AffiliationServices.create({services:element.name})
                    }
            }
            await AffiliationServices.update({deleted_at : currentTime,updated_at:currentTime} ,{
                where : {
                    id:{
                        [Op.notIn]: ids
                    },
                    deleted_at : null
                }
            })
        }
        if(field_name && field_name == "service_providers"){
            for (let i = 0; i < data_value.length; i++) {
                const element = data_value[i];
                if(element.id){
                    await ServiceProvider.update({provider : element.name},
                        {
                            where : {
                                id: element.id ,
                            }
                        }
                    )
                }else{
                    await ServiceProvider.create({provider:element.name})
                }
            }
            await ServiceProvider.update({deleted_at : currentTime,updated_at:currentTime} ,{
                where : {
                    id:{
                        [Op.notIn]: ids
                    },
                    deleted_at : null
                }
            })
        }

        if(field_name && field_name == "ad_type"){//pending
            for (let i = 0; i < data_value.length; i++) {
                const element = data_value[i];
                if(element.id){
                    await AdType.update({type : element.name},
                        {
                            where : {
                                id: element.id ,
                            }
                        }
                    )
                }else{
                    await AdType.create({type:element.name})
                }
            }
            await AdType.update({deleted_at : currentTime,updated_at:currentTime} ,{
                where : {
                    id:{
                        [Op.notIn]: ids
                    },
                    deleted_at : null
                }
            })
        }
        if(field_name && field_name == "utm_term"){
            let old_value_data = JSON.parse(old_value)
            if(old_value_data && old_value_data.length){
                for (let i = 0; i < old_value_data.length; i++) {
                    const element = old_value_data[i];
                    await AffilationData.update({utm_term : data_value[i].name},
                        {
                            where : {
                                utm_term: element.name ,
                            }
                        }
                    )
                }
            }
        
        }
        
        return res.send({
            staus:true,
            message:'Data updated successFully'
        })
    } catch (error) {
        console.log("-error", error);
        return res.json({
            status: false,
            message: "Something Went Wrong...!"
        })
    }
}

const getAffilationProgramData = async(req,res) => {
    try {
        const {service_category,is_home_slider,place_id } = req.body
        let affilation_data_list
        let default_affilation
        let affilation_ids
        let is_service
        let group_id
        if(!place_id){
            return res.send({
                status : false,
                message : 'Place id is required'
            })
        }
        if(service_category){
            const affilation_data = await Affilation.findAll({
                where:{
                    affiliation_place_id : place_id,
                    service_category_id : service_category
                },
                attributes : ['id']
            })
            affilation_ids = (affilation_data &&  affilation_data.length) ? affilation_data.map((s) => s.id) : []
            if(affilation_ids.length){
                affilation_data_list = await AffilationData.findAll({
                    where :{
                        deleted_at : null,
                        affiliate_id : {
                            [Op.in]:affilation_ids
                        },
                    },
                    group : ['group_id'],
                    attributes:['group_id','affiliate_id'],    
                    order : [['group_id','ASC']],
                }).then((rows) => {
                    if(rows){
                        return rows.map((r) => {
                            return r.dataValues;
                        });
                    }
                })
                if(affilation_data_list && affilation_data_list.length){
                    for (let i = 0; i < affilation_data_list.length; i++) {
                        let element = affilation_data_list[i];
                        let _affilation_data_result = await AffilationData.findAll({
                            where :{
                                is_default : 0,
                                affiliate_id : affilation_ids[0],
                                group_id : element.group_id,
                                deleted_at : null
                            }
                        })
                        element.affilation_data_list = _affilation_data_result
                        element.default_affilation = await AffilationData.findOne({
                            where :{
                                is_default : 1,
                                affiliate_id : element.affiliate_id,
                                group_id :element.group_id,
                                deleted_at : null
                            }
                        })
                    }
                    group_id = affilation_data_list[affilation_data_list.length-1].group_id
                }
                
            }
            is_service = true
        }else if(is_home_slider){
            const affilation_data = await Affilation.findAll({
                where:{
                    affiliation_place_id : place_id,
                },
                attributes : ['id']
            })
            affilation_ids =(affilation_data &&  affilation_data.length) ? affilation_data.map((s) => s.id) : []
            if(affilation_ids.length){
                affilation_data_list = await AffilationData.findAll({
                    where :{
                        deleted_at : null,
                        affiliate_id : {
                            [Op.in]:affilation_ids
                        },
                        is_default : 0,
                    },
                    attributes : ['group_id','affiliate_id'],
                    group : ['group_id'],
                    order : [['group_id','ASC']],
                }).then((rows) => {
                    if(rows){
                        return rows.map((r) => {
                            return r.dataValues;
                        });
                    }
                })
                
                if(affilation_data_list && affilation_data_list.length){
                    for (let i = 0; i < affilation_data_list.length; i++) {
                        let element = affilation_data_list[i];
                        let _affilation_data_result = await AffilationData.findAll({
                            where :{
                                is_default : 0,
                                affiliate_id : affilation_ids[0],
                                group_id : element.group_id,
                                deleted_at : null
                            }
                        })
                        element.affilation_data_list = _affilation_data_result
                        element.default_affilation = await AffilationData.findOne({
                            where :{
                                is_default : 1,
                                affiliate_id : element.affiliate_id,
                                group_id :element.group_id,
                                deleted_at : null
                            }
                        })
                    }
                    group_id = affilation_data_list[affilation_data_list.length-1].group_id
                }
            }
            is_service = true
        }else {
            const affilation_data = await Affilation.findAll({
                where:{
                    affiliation_place_id : place_id
                },
                attributes : ['id']
            })
            affilation_ids =(affilation_data &&  affilation_data.length) ? affilation_data.map((s) => s.id) : []
            if(affilation_ids.length){
                affilation_data_list = await AffilationData.findAll({
                    where :{
                        deleted_at : null,
                        affiliate_id : {
                            [Op.in]:affilation_ids
                        },
                        is_default : 0,
                    },
                    order : [['group_id','ASC']],
                })
            }
            default_affilation = await AffilationData.findOne({
                where:{
                    deleted_at : null,
                    is_default : 1,
                    affiliate_id : {
                        [Op.in]:affilation_ids
                    },
                }
            })
            is_service = false
        }
        let service_provider_data = await ServiceProvider.findAll({
            where :{
                deleted_at : null,
            },
            order:[['id','ASC']],
            attributes :['id','provider']
        })

        let affilation_service_data = await AffiliationServices.findAll({
            where :{
                deleted_at : null,
            },
            order:[['id','ASC']],
            attributes :['id','services']

        })
        let ad_type_data = await AdType.findAll({
            where :{
                deleted_at : null,
            },
            order:[['id','ASC']],
            attributes :['id','type']

        })
        let lable_utm_term = await AffilationData.findAll({
            where :{
                deleted_at :null,
            },
            attributes:['utm_term']

        })
        const unique_utm_terms = (lable_utm_term && lable_utm_term.length) && [...new Set(lable_utm_term.map(item => item.utm_term))];
        let language_data = await Language.findAll({
            where : {
                deleted_at :null,
            },
            attributes:['lable']
        })
        const find_place_name = await Affilation.findOne({
            where:{
                affiliation_place_id : place_id
            },
            include:[
                {
                    model: AffiliationPlace,
                    as:'get_affiliation_place',
                    attributes: ['id', 'place']
                }
            ]
        })
        let place_name = (find_place_name && find_place_name.get_affiliation_place) ? find_place_name.get_affiliation_place.place : null

        const _response = {
            place_name : place_name,
            affilation_data : affilation_data_list,
            // service_provider : service_provider_data,
            // affilation_service : affilation_service_data,
            // ad_type :ad_type_data,
            default_affilation : default_affilation,
            // utm_term : unique_utm_terms,
            // lable : language_data,
            is_service : is_service,
            last_group_id : group_id
        }
        return res.send({
            staus : true,
            message :'Data Found SuccessFully !',
            data : _response
        })
    } catch (error) {
        console.log("-error", error);
        return res.json({
            status: false,
            message: "Something Went Wrong...!"
        })
    }
}

const updateDefaultAffilation = async(req,res) => {
    try {
        const { id } = req.body.id
        if(!id){
            return res.send({
                staus : false,
                message : 'Id is required'
            })
        }
        const currentTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        await AffilationData.update({deleted_at: currentTime},{
            where:{
                id :id
            }
        })
        return res.send({
            status : true,
            message:'Data updated successfully'
        })
    } catch (error) {
        console.log("-error", error);
        return res.json({
            status: false,
            message: "Something Went Wrong...!"
        })
    }
}

const getAffilationDropDown = async(req,res) => {
    try {
        let service_provider_data = await ServiceProvider.findAll({
            where :{
                deleted_at : null,
            },
            order:[['id','ASC']],
            attributes :['id','provider']
        })

        let affilation_service_data = await AffiliationServices.findAll({
            where :{
                deleted_at : null,
            },
            order:[['id','ASC']],
            attributes :['id','services']

        })
        let ad_type_data = await AdType.findAll({
            where :{
                deleted_at : null,
            },
            order:[['id','ASC']],
            attributes :['id','type']

        })
        let lable_utm_term = await AffilationData.findAll({
            where :{
                deleted_at :null,
            },
            attributes:['utm_term']

        })
        const unique_utm_terms = (lable_utm_term && lable_utm_term.length) && [...new Set(lable_utm_term.map(item => item.utm_term))];
        let language_data = await Language.findAll({
            where : {
                deleted_at :null,
            },
            attributes:['lable']
        })
        const _response = {
            service_provider : service_provider_data,
            affilation_service : affilation_service_data,
            ad_type :ad_type_data,
            utm_term : unique_utm_terms,
            lable : language_data,
        }
        return res.send({
            staus : true,
            message :'Data Found SuccessFully !',
            data : _response
        })
    } catch (error) {
        console.log("-error", error);
        return res.json({
            status: false,
            message: "Something Went Wrong...!"
        })
    }
}

const addAffilationData = async(req,res) =>{
    try {
        const { affiliation_place_id,is_need_to_show,affilation_data,type } = req.body
        if(!affiliation_place_id){
            return res.send({
                status :false,
                message :'Affilation Place is required'
            })
        }
        const _affilation_data = JSON.parse(affilation_data)
        if(_affilation_data && _affilation_data.length){
            let service_category
            const _data = await getDropDownId(req.body)
            if(_data && _data.service_category && (_data.type == 'Service' || _data.type == 'service')){
                service_category = _data.service_category
            }else{
                service_category = null
            }


            let affilate = {
                service_category_id : service_category,
                affiliation_place_id : _data.affiliation_place_id,
                is_need_to_show : _data.is_need_to_show
            }
            
            let affilation_exist 
            if(_data.service_category && (_data.type == 'Service' || _data.type == 'service')){
                affilation_exist = await Affilation.findOne({
                    where :{
                        affiliation_place_id: _data.affiliation_place_id,
                        service_category_id : _data.service_category,
                    }
                })
            }else{
                affilation_exist = await Affilation.findOne({
                    where :{
                        affiliation_place_id: _data.affiliation_place_id,
                    }
                })
            }

            let new_affilation_data 
            if(affilation_exist){
                await Affilation.update(affilate,{
                    where :{
                        id : affilation_exist.id
                    }
                })
                new_affilation_data = affilation_exist
            }else{
                const _new_affilate = await Affilation.create(affilate).then(affilate_data => {
                    return affilate_data.id
                })
                .catch(error => {
                    console.log("--error",error);
                    console.error(error);
                    return null
                });
                if(_new_affilate){
                    new_affilation_data = await Affilation.findOne({
                        where:{
                            id : _new_affilate
                        }
                    })
                }
            }

            //delete data 
            // const deleted_data  =_affilation_data.length ? _affilation_data.filter((s) => {
            //     if(s.id){
            //         return s.id
            //     }
            // }) : []
            // let notdeletedIds =deleted_data.length ? deleted_data.map((s) => s.id) : []
            // const currentTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

            // await AffilationData.update({deleted_at : currentTime,updated_at:currentTime} ,{
            //     where : {
            //         id:{
            //             [Op.notIn]: notdeletedIds
            //         },
            //         deleted_at : null
            //     }
            // })
           
            //update affilation datas
            let position = 0
            for (let i = 0; i < _affilation_data.length; i++) {
                const element = _affilation_data[i];
                if(element.affiliation_services_id && element.service_provider_id){
                    let _updateData = {}
                    if(element.status == 1){
                        _updateData.position = position+=1
                    }

                    _updateData.is_priority = element.is_priority  ? element.is_priority : 0
                    _updateData.affiliate_id = new_affilation_data && new_affilation_data.id
                    _updateData.group_id = element.group_id
                    _updateData.is_default = element.is_default
                    _updateData.url = element.url
                    _updateData.utm_term = element.utm_term
                    _updateData.service_provider_id = element.service_provider_id
                    _updateData.affiliation_services_id = element.affiliation_services_id
                    _updateData.ad_type_id = element.ad_type_id
                    _updateData.lable = element.lable
                    _updateData.status = element.status
                    _updateData.title = element.title ? element.title : null
                    _updateData.description = element.description ? element.description : null
                    _updateData.action_button = element.action_button ? element.action_button : null

                    if(element.id){
                        //update data
                        if(req.files){
                            if(req.files[`banner_image_${element.id}`]){
                                const _imageResponse =  await uploadfiles.affilationEditFileUpload(req.files[`banner_image_${element.id}`],"affiliate",element.banner)
                                if(_imageResponse.status){
                                    _updateData.banner = _imageResponse.image
                                }
                            }
                        }
                        await AffilationData.update(_updateData,{
                            where : {
                                id : element.id
                            }
                        })
                    }else{
                        if(req.files){
                            if(req.files[`new_banner_image_${element.new_id}`]){
                                const _imageResponse =  await uploadfiles.fileUploadWithDigitalOcean(req.files[`new_banner_image_${element.new_id}`],"affiliate")
                                if(_imageResponse.status){
                                    _updateData.banner = _imageResponse.image
                                }
                            }
                        }
                        await AffilationData.create(_updateData)
                    }
                }
            }

            return res.send({
                staus : true,
                messge : 'Data Saved SuccessFully !',
                data : _affilation_data
            })
                
        }else{
            return res.send({
                staus : false,
                message : 'Please Add affilation_data'
            })
        }

    } catch (error) {
        console.log("-error", error);
        return res.json({
            status: false,
            error:error,
            message: "Something Went Wrong...!"
        })
    }
}

//update position affilation
const updateAffilationSort = async(req,res) =>{
    try {
        const position_data  = JSON.parse(req.body.position_data)
        if(position_data && position_data.length){
            if(!req.body.group_id){
                console.log("==Without group id");
                for (let i = 0; i < position_data.length; i++) {
                    const element = position_data[i];
                    await AffilationData.update({position : i + 1}, {
                        where : {
                            id :element.id
                        }
                    })
                }
            }

            if(req.body.group_id){
                const group_id  = req.body.group_id
                const positionIds = position_data.map((s) => s.id)
                const affilation_data  = await AffilationData.findAll({
                    where:{
                        id : {
                            [Op.in]:positionIds
                        },
                        group_id : group_id
                    },
                    order : [['position','ASC']]
                })
                if(affilation_data.length){
                    let position = affilation_data[0].position
                    for (let i = 0; i < position_data.length; i++) {
                        const element = position_data[i];
                        await AffilationData.update({position : position}, {
                            where : {
                                id :element.id
                            }
                        })
                        position += 1
                    }
                }
            }
           
            return res.send({
                staus :true,
                message : 'Update SuccessFully !'
            })
        }else{
            return res.send({
                staus : false,
                message : 'position data is required field'
            })
        }
        
    } catch (error) {
        console.log("-error", error);
        return res.json({
            status: false,
            error:error,
            message: "Something Went Wrong...!"
        })
    }
}

const getLanguage = async(req,res) =>{
    try {
        const offer_result = await AffilationData.findAll({
            attributes: ['lable'],
            where: {
                lable: {
                  [Op.not]: null
                },
                deleted_at : null
            },
            group: ['lable']
        })
        console.log("=offer_result",offer_result.length);
        if(offer_result && offer_result.length){
            for (let i = 0; i < offer_result.length; i++) {
                const element = offer_result[i];
                let language_data = await Language.findOne({
                    where :{
                        lable : element.lable
                    }
                })
                let _new_data = {
                    lable : element.lable,
                    type : 'affilation'
                }
                if(!language_data){
                    await Language.create(_new_data)
                }else{
                    await Language.update(_new_data,{
                        where : {
                            id  :language_data.id
                        }
                    })
                }
            }
        }

        // service category get
        let category = await ServiceCategory.findAll({
            attributes: ['category'],
            where: {
                category: {
                  [Op.not]: null
                },
                deleted_at : null
            },
            group: ['category']
        })
        if(category && category.length){
            for (let i = 0; i < category.length; i++) {
                const _category_element = category[i];
                let language_data = await Language.findOne({
                    where:{
                        lable : _category_element.category
                    }
                })
                let _new_data = {
                    lable : _category_element.category,
                    type : 'service'
                }
                if(!language_data){
                    await Language.create(_new_data)
                }else{
                    await Language.update(_new_data,{
                        where : {
                            id  :language_data.id
                        }
                    })
                }
            }
        }
        console.log("-category",category.length);

        // offer get
        const _offer_data = await Offer.findAll({
            where :{
                deleted_at : null
            }
        })

        if(_offer_data && _offer_data.length){
            for (let i = 0; i < _offer_data.length; i++) {
                const offer_element = _offer_data[i];

                //find label in language
                let language_data = await Language.findOne({
                    where:{
                        lable : offer_element.lable
                    }
                })
                let _new_data = {
                    lable : offer_element.lable,
                    type : 'offer_lable'
                }
                if(!language_data){
                    await Language.create(_new_data)
                }else{
                    await Language.update(_new_data,{
                        where : {
                            id  :language_data.id
                        }
                    })
                }


                //find description in language
                let description_language_data = await Language.findOne({
                    where:{
                        lable : offer_element.description
                    }
                })
                let description_new_data = {
                    lable : offer_element.description,
                    type : 'offer_description'
                }
                if(!description_language_data){
                    await Language.create(description_new_data)
                }else{
                    await Language.update(description_new_data,{
                        where : {
                            id  :description_language_data.id
                        }
                    })
                }


                //find perventage in language
                let percentage_language_data = await Language.findOne({
                    where:{
                        lable : offer_element.percentage
                    }
                })
                let percentage_new_data = {
                    lable : offer_element.percentage,
                    type : 'offer_percentage'
                }
                if(!percentage_language_data){
                    await Language.create(percentage_new_data)
                }else{
                    await Language.update(percentage_new_data,{
                        where : {
                            id  :percentage_language_data.id
                        }
                    })
                }

                 //find action button in language
                 let action_language_data = await Language.findOne({
                    where:{
                        lable : offer_element.action_button
                    }
                })
                let action_new_data = {
                    lable : offer_element.action_button,
                    type : 'offer_action_button'
                }
                if(!action_language_data){
                    await Language.create(action_new_data)
                }else{
                    await Language.update(action_new_data,{
                        where : {
                            id  :action_language_data.id
                        }
                    })
                }
            }
        }


        let language_list = await Language.findAll({
            where : {
                deleted_at : null,
            },
            order : [['created_at','DESC']]
        })

        return res.send({
            staus :true,
            message : "Data Found SuccessFully !",
            data : language_list
        })
    } catch (error) {
        console.log("-error", error);
        return res.json({
            status: false,
            message: "Something Went Wrong...!"
        })
    }
}

const getDropDownId = async(data) => {
    try {
        let _body = data
        if(_body.service_category){
            let service_category_data = await ServicesCategory.findOne({
                where:{
                    id : _body.service_category,
                    deleted_at : null
                }
            })
            if(service_category_data){
                _body.service_category = service_category_data.id
            }else{
                const new_category_data = await ServicesCategory.create({category : _body.service_category})
                .then(service => {
                    return service.id
                })
                .catch(error => {
                    console.log("--error",error);
                    console.error(error);
                    return null
                });
                if(new_category_data){
                    _body.service_category = new_category_data;
                }else{s
                    _body.service_category = null;
                }
            }   
        }else{
            _body.service_category = null
        }
        return _body
    } catch (error) {
        console.log("==error",error);
        return {
            staus : false
        }
    }
}

const deleteLanguageLable = async(req,res) => {
    try {
        const { lable,type,id } = req.body
        let label_count = 0
        if(!lable){
            return res.send({
                staus : false,
                message : 'Label is required !'
            })
        }
        if(type == 'affilation') {
            label_count = await AffilationData.count({
                where:{
                    lable : lable
                }
            })
        }
        if(type == 'service') {
            label_count = await AffilationData.count({
                where:{
                    category : lable
                }
            })
        }
        if(type != 'NA' && type != 'service' && type == 'affilation') {
            // label_count = await AffilationData.count({
            //     where:{
            //         lable : lable
            //     }
            // })
        }

        if(lable > 0){
            return res.send({
                status :false,
                message : "Lable Not deleted"
            })
        }else{
            const currentTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            await Language.update({deleted_at : currentTime,updated_at:currentTime},
                {
                    where : {
                        id : id
                    }
                }
            )
            return res.send({
                status :true,
                message : "Delete SuccessFully !"
            })
        }
    } catch (error) {
        console.log("-error", error);
        return res.json({
            status: false,
            message: "Something Went Wrong...!"
        })
    }
}

const addLanguageLabel = async(req,res) =>{
    try {
        const { label,type,old_value,gu,mr,ta,te,kn,hi,or,bn,ml,pa,id } = req.body
        if(!label){
            return res.send({
                status : false,
                message : "Label is reduired"
            })
        }
        if(type){
            if(type == 'affilation'){
                await AffilationData.update({lable : label},{
                    where : {
                        lable : old_value
                    }
                })
            }
            
            if(type == 'service'){
                await ServicesCategory.update({category : label},{
                    where : {
                        category : old_value
                    }
                })
            }
            if(type != 'NA' && type != 'service' && type != 'affilation'){
                let field = type.replace('offer_', '');
                await Offer.update({label : label},{
                    where : {
                        category : old_value
                    }
                })
            }
        }
        let temp = {}
        temp.gu = gu
        temp.mr = mr
        temp.ta = ta
        temp.te = te
        temp.kn = kn
        temp.hi = hi
        temp.or = or
        temp.bn = bn
        temp.ml = ml
        temp.pa = pa
        temp.lable = label
        if(id) {
            await Language.update(temp,{
                where:{
                    id : id,
                    deleted_at : null
                }
            })
            return res.send({
                staus : true,
                message : 'Data Update SuccessFully !'
            })
        }else{
            await Language.create(temp)
            return res.send({
                staus : true,
                message : 'Language create SuccessFully !'
            })
        }
    } catch (error) {
        console.log("-error", error);
        return res.json({
            status: false,
            message: "Something Went Wrong...!"
        })
    }
}


/************** Affilation Service City API **************/

const getAffilationState = async(req,res) => {
    try {
        const affilate_state = await AffilationState.findAll({
            where : {
                deleted_at : null
            },
            attributes : ['state'],
            group:['state']
        })
        return res.send({
            status : true,
            message : 'Data Found SuccessFully !',
            data : affilate_state
        })
    } catch (error) {
        console.log("-error", error);
        return res.json({
            status: false,
            message: "Something Went Wrong...!"
        })
    }
}

const getAffilationCityData = async(req,res) =>{
    try {
        const { state,search } = req.body
        let limit = req.body.limit ? req.body.limit : 25
        let page = req.body.page ? req.body.page : 1
        let offset = 0
        if(limit && limit > 0){
            offset =  (page - 1) * limit
        }
        let where = { deleted_at : null}
        if(state){
            where = { ...where ,  state : state}
        }
        if(search){
            where = { ...where ,   
                city :{
                    [Op.like] : `%${search}%`
                }
            }
        }
        const city_list = await AffilationState.findAll({
            limit,
            offset,
            where : {
                ...where
            }
        });
        const city_list_count = await AffilationState.count({ where : {
            ...where
        }})

        // Calculate the total number of pages
        const totalPages = Math.ceil(city_list_count / limit);
        const _response = {
            total_record : city_list_count,
            per_page : limit,
            total_page : totalPages,
            data:city_list
        }

        return res.send({
            staus : true,
            message : 'Data Found SuccessFully !',
            data : _response
        })
    } catch (error) {
        console.log("-error", error);
        return res.json({
            status: false,
            message: "Something Went Wrong...!"
        })
    }
}

const deleteAffilationCity = async(req,res) =>{
    try {
        const { id } = req.params
        if(!id){
            return res.send({
                staus : false,
                message : 'Id is required field'
            })
        }
        console.log("-id",id);
        const currentTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        await AffilationState.update({deleted_at : currentTime,updated_at:currentTime} ,{
            where : {
                id:id,
                deleted_at : null
            }
        })
        await AffilationCityPinCode.update({deleted_at : currentTime,updated_at:currentTime} ,{
            where : {
                affilation_city_id:id,
                deleted_at : null
            }
        })
        return res.send({
            staus :true,
            message : 'Delete Successfully...!'
        })
    } catch (error) {
        console.log("-error", error);
        return res.json({
            status: false,
            message: "Something Went Wrong...!"
        })
    }
}

const getAffilationCityIdWise = async(req,res) =>{
    try {
        const { id } = req.params
        if(!id){
            return res.send({
                staus :false,
                message : 'Id is required field !'
            })
        }
        const affilation_state_data =await AffilationState.findOne({
            where : {
                id : id,
            },
            include:[
                {
                    model : AffilationCityPinCode,
                    as : 'get_citywise_pincode_Data',
                    where :{
                        deleted_at : null
                    }
                }
            ]
        })

        return res.send({
            staus :true,
            message : 'Data Found SuccessFully !',
            data : affilation_state_data
        })

    } catch (error) {
        console.log("-error", error);
        return res.json({
            status: false,
            message: "Something Went Wrong...!"
        })
    }
}

const addAffilationCity = async(req,res) => {
    try {
        const { city,state,id } = req.body
        const _new_city_data = {
            city : city && city.toUpperCase(),
            state : state && state.toUpperCase(),
        }
        const pin_code_data_list = req.body.pin_code_data && JSON.parse(req.body.pin_code_data)
        if(id){
            await AffilationState.update(_new_city_data,{
                where : {
                    id : id
                }
            })
            if(pin_code_data_list && pin_code_data_list.length){ 
                const currentTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                const all_pincode_ids = pin_code_data_list.filter((s) => s.id)
                const notdeletedIds = all_pincode_ids.length && all_pincode_ids.map((s) => s.id)
                if(notdeletedIds.length){
                    await AffilationCityPinCode.update({deleted_at : currentTime,updated_at:currentTime} ,{
                        where : {
                            id:{
                                [Op.notIn]: notdeletedIds
                            },
                            affilation_city_id : id,
                            deleted_at : null
                        }
                    })
                }
                for (let i = 0; i < pin_code_data_list.length; i++) {
                    const pincode_element = pin_code_data_list[i];
                    const new_pincode_data = {
                        affilation_city_id : id,
                        area : pincode_element.area,
                        pincode : pincode_element.pincode
                    }
                    if(pincode_element.id){
                        await AffilationCityPinCode.update(new_pincode_data,{
                            where : {
                                id : pincode_element.id
                            }
                        })
                    }else{
                        await AffilationCityPinCode.create(new_pincode_data)
                    }
                   
                }                
            }
            return res.send({status : true,message : 'Data Update SuccessFully !'})
        }else{
            const new_state_data_id = await AffilationState.create(_new_city_data).then(state => {
                return state.id
            }).catch(error => {
                console.log("--error",error);
                return null
            });
            if(new_state_data_id){
                if(pin_code_data_list && pin_code_data_list.length){
                    for (let i = 0; i < pin_code_data_list.length; i++) {
                        const pincode_element = pin_code_data_list[i];
                        const new_pincode_data = {
                            affilation_city_id : new_state_data_id,
                            area : pincode_element.area,
                            pincode : pincode_element.pincode
                        }
                        await AffilationCityPinCode.create(new_pincode_data)
                    }
                }
            }
            return res.send({status : true,message : 'Data Create SuccessFully !'})
        }
    } catch (error) {
        console.log("-error", error);
        return res.json({
            status: false,
            message: "Something Went Wrong...!"
        })
    }
}


/************** Affilation Service Provider CityAPI **************/

const getServiceProviderCity = async(req,res) =>{
    try {
        let affilate_city_list = await ServiceCityList.findAll({
            where : {
                deleted_at : null
            }
        }).then((rows) => {
            if(rows){
                return rows.map((r) => {
                    return r.dataValues;
                });
            }
        })
        if(affilate_city_list && affilate_city_list.length) {
            for (let i = 0; i < affilate_city_list.length; i++) {
                let city_element = affilate_city_list[i];
                let city_list = city_element.city_id.split(',')
                let city_name
                if(city_element.city_id == "ALL"){
                    let city_name_result = await AffilationState.findAll({
                        where :{
                            deleted_at :null
                        },
                        attributes:['id','city'],
                    })
                    city_name = city_name_result
                }else{
                    let city_name_result = await AffilationState.findAll({
                        where :{
                            id:{
                                [Op.in]:city_list
                            },
                            deleted_at :null
                        },
                        attributes:['id','city'],
                    })
                    city_name = city_name_result
                }
                city_element.city_names = city_name
            }
        }
        return res.send({
            status : true,
            message : 'Data Found SuccessFully !',
            data : affilate_city_list
        })
    } catch (error) {
        console.log("-error", error);
        return res.json({
            status: false,
            message: "Something Went Wrong...!"
        })
    }
}

const getServiceWisePincodeData = async(req,res) => {
    try {
        const { id } = req.params
        if(!id){
            return res.send({
                staus : false,
                message : 'Id is required'
            })
        }
        const pincode_data = await AffilationCityPinCode.findAll({
            where :{
                affilation_city_id : id,
                deleted_at : null
            }
        }) 
        return res.send({
            staus : true,
            message :'Data Found SuccessFully !',
            data : pincode_data
        })

    } catch (error) {
        console.log("-error", error);
        return res.json({
            status: false,
            message: "Something Went Wrong...!"
        })
    }
}

const addServiceProviderCity = async(req,res) => {
    try {
        const { city_id_lable,service_provider_id,affiliation_services_id,id } = req.body
        console.log("=req.body.city_id_list",JSON.parse(req.body.city_id_list));
        let city_id_list = req.body.city_id_list &&  JSON.parse(req.body.city_id_list)
        console.log("=city_id_list",city_id_list);
        let pincode_list = req.body.pin_code_list && JSON.parse(req.body.pin_code_list) 
        let city_list_data = []
        let pincode_data = []

        if(!service_provider_id){
            return res.send({
                status :false,
                message : 'service_provider_id is required'
            })
        }
        if(!affiliation_services_id){
            return res.send({
                status :false,
                message : 'affiliation_services_id is required'
            })
        }
        if(city_id_lable && (city_id_lable == "ALL" || city_id_lable == "All" || city_id_lable == "all")){
            const affilation_city = await AffilationState.findAll({
                where : {
                    deleted_at : null
                },
                attributes : ['id']
            })  
            city_list_data = (affilation_city && affilation_city.length) ? affilation_city.map((s) => s.id) : []
        }else{
            if(city_id_list && city_id_list.length){
                const affilation_city = await AffilationState.findAll({
                    where : {
                        deleted_at : null,
                        id : {
                            [Op.in] : city_id_list.map((s) => s.id)
                        }
                    },
                    attributes : ['id']
                })
                city_list_data = (affilation_city && affilation_city.length) ? affilation_city.map((s) => s.id) : []
            }
        }

        if(pincode_list && pincode_list.length){
            const affilation_citywise_pincode = await AffilationCityPinCode.findAll({
                where : {
                    deleted_at : null,
                    id : {
                        [Op.in] : pincode_list.map((s) => s.id)
                    }
                },
                attributes : ['id']
            })  
            pincode_data = (affilation_citywise_pincode && affilation_citywise_pincode.length) ? affilation_citywise_pincode.map((s) => s.id) : []
            
        }

        let service_provider_data = await ServiceProvider.findOne({
            where :{
                id : service_provider_id,
                deleted_at : null
            },
            attributes:['id']
        })

        let affilation_service_data = await AffiliationServices.findOne({
            where:{
                id : affiliation_services_id,
                deleted_at : null
            },
            attributes:['id']
        })

        const add_new_data = {
            affiliation_services_id : affilation_service_data && affilation_service_data.id,
            service_provider_id : service_provider_data && service_provider_data.id,
            city_id:city_list_data.length && city_list_data.join(','),
            pincode_id : pincode_data.length && pincode_data.join(',')
        }
        if(id){
            // update Data
            await  ServiceCityList.update(add_new_data,{
                where :{
                    id : id
                }
            })
        }else{
            await ServiceCityList.create(add_new_data)
        }
       

        return res.send({
            staus : true,
            message : 'Data Save Successfully'
        });
        
    }  catch (error) {
        console.log("-error", error);
        return res.json({
            status: false,
            message: "Something Went Wrong...!"
        })
    }
}

const getServiceProviderDropDown = async(req,res) => {
    try {
        const affilation_city = await AffilationState.findAll(
            {
                where:{
                    deleted_at :null
                },
                attributes : ['id','city']
            }
        )
        const service_provider = await ServiceProvider.findAll(
            {
                where:{
                    deleted_at :null
                },
                attributes : ['provider','id']
            },
        )
        const affilation_service = await AffiliationServices.findAll(
            {
                where:{
                    deleted_at :null
                },
                attributes : ['services','id']
            },
        )
        const pincode = await AffilationCityPinCode.findAll({
            where :{
                deleted_at : null
            },
            attributes : ['id','affilation_city_id','pincode']
        })

        const _response = {
            affilation_city,
            service_provider,
            affilation_service,
            pincode
        }
        return res.send({
            status : true,
            message : 'Data Found SuccessFully !',
            data : _response
        })
    } catch (error) {
        console.log("-error", error);
        return res.json({
            status: false,
            message: "Something Went Wrong...!"
        })
    }
}
const deleteServiceProviderCity = async(req,res) =>{
    try {
        const { id } = req.params
        if(!id){
            return res.send({
                staus :false,
                message : 'Id is required'
            })
        }
        const currentTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        await ServiceCityList.update({deleted_at : currentTime,updated_at:currentTime} ,{
            where : {
                id:id,
                deleted_at : null
            }
        })

        return res.send({
            staus :true,
            message : 'Delete SuccessFully !'
        })
    } catch (error) {
        console.log("-error", error);
        return res.json({
            status: false,
            message: "Something Went Wrong...!"
        })
    }
}


const updatePincodeStatus = async(req,res) => {
    try {
        const { id } = req.body.id
    } catch (error) {
        console.log("-error", error);
        return res.json({
            status: false,
            message: "Something Went Wrong...!"
        })
    }
}

const getViewServiceProviderCity = async(req,res) => {
    try {
        const { id } = req.params
        if(!id){
            return res.send({
                staus : false,
                message : 'Id is required field'
            })
        }

        const _result = await ServiceCityList.findOne({
            where : {
                id : id,
                deleted_at : null
            }
        }).then(async(rows) => {
            if(rows){
                let element =  rows.dataValues
            }
        })
        console.log("=valll",_result);
        return res.send({
            status : true,
            message : 'Data Found SuccessFully !',
            data : _result
        })
    } catch (error) {
        console.log("-error", error);
        return res.json({
            status: false,
            message: "Something Went Wrong...!"
        })
    }
}

export default {
    getAffilationDashboard,
    getAffilationDashboardData,
    updateAffilationStatus,
    getAffilationData,
    getAffilationPlace,
    getPaginationAffilation,
    getAffilationById,
    getAffilationDataShow,
    updateAppStatus,
    getOfferData,
    addOfferData,
    deleteAffilationData,
    getDynamicDropDown,
    updateDynamicDropDown,
    getAffilationProgramData,
    updateDefaultAffilation,
    getAffilationDropDown,
    addAffilationData,
    getLanguage,
    deleteLanguageLable,
    addLanguageLabel,
    updateAffilationSort,
    getAffilationState,
    getAffilationCityData,
    deleteAffilationCity,
    getServiceProviderCity,
    getServiceWisePincodeData,
    deleteServiceProviderCity,
    addAffilationCity,
    getAffilationCityIdWise,
    addServiceProviderCity,
    updatePincodeStatus,
    getServiceProviderDropDown,
    getViewServiceProviderCity
};