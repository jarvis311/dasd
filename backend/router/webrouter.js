import express from 'express';
const router = express.Router()
import DrivingSchoolwebController from '../controller/Webapi/DrivingSchoolwebController.js';
import AffilationAdminControllerAPI from '../controller/Webapi/AffilationAdminControllerAPI.js';
import ServiceCenterwebController from '../controller/Webapi/ServiceCenterwebController.js';
import { getNewsCategoryDataById, handleCreateNewsCategory, handleGetNewsCategory } from '../controller/Webapi/RTO-News/NewsCategory.controller.js';
import { handleCreatNewsHeadline, handleFetchNewsHeadline, handleGetBrandOptionsIdWise, handleGetCategoryOptions, handleGetNewsCategoryById, handleGetNewsHeadlinesCategoryOptions, handleUpdateNewsHeadlines } from '../controller/Webapi/RTO-News/NewsHeadline.controller.js';
import { CreateNewTags, GetAllTags, GetTagById, RemoveTag, UpdateTag } from '../controller/Webapi/RTO-News/NewsTag.controller.js';
import { CreateNewNews, GetAllNews, GetNewsById, RemoveNews, UpdateNews } from '../controller/Webapi/RTO-News/News.controller.js';

/**************Driving school state Nirmal 02-11-2023 *************************************/

router.post("/get_driving_school_state", DrivingSchoolwebController.get_driving_school_state)
router.post("/store_driving_school_state", DrivingSchoolwebController.store_driving_school_state)
router.post("/get_update_driving_school_state/:id", DrivingSchoolwebController.get_update_driving_school_state)
router.post("/update_driving_school_state/:id", DrivingSchoolwebController.update_driving_school_state)
router.post("/delete_driving_school_state/:id", DrivingSchoolwebController.delete_driving_school_state)
router.post("/driving_school_state_search", DrivingSchoolwebController.driving_school_state_search)
router.post("/get_all_driving_school_state", DrivingSchoolwebController.get_all_driving_school_state)


/**************Driving school city Nirmal 02-10-2023 **************************************/
router.post("/get_driving_school_city", DrivingSchoolwebController.get_driving_school_city)
router.post("/add_driving_school_city", DrivingSchoolwebController.add_driving_school_city)
router.post("/delete_driving_school_city/:id", DrivingSchoolwebController.delete_driving_school_city)
router.post("/update_driving_school_city/:id", DrivingSchoolwebController.update_driving_school_city)
router.post("/get_update_driving_school_city/:id", DrivingSchoolwebController.get_update_driving_school_city)
router.post("/driving_school_city_search", DrivingSchoolwebController.driving_school_city_search)
router.post("/get_all_driving_school_city", DrivingSchoolwebController.get_all_driving_school_city)



/***************Driving school area Nirmal 03-11-2023 **************************************/
router.post("/get_driving_school_area", DrivingSchoolwebController.get_driving_school_area)
router.post("/edit_driving_school_area/:id", DrivingSchoolwebController.edit_driving_school_area)
router.post("/update_driving_school_area/:id", DrivingSchoolwebController.update_driving_school_area)
router.post("/delete_driving_school_area/:id", DrivingSchoolwebController.delete_driving_school_area)
router.post("/store_driving_school_area", DrivingSchoolwebController.store_driving_school_area)
router.post("/driving_school_area_search", DrivingSchoolwebController.driving_school_area_search)
router.post("/get_all_area", DrivingSchoolwebController.get_all_area)


/**************Driving school Detail Nirmal 03-11-2023*************************************/
router.post("/get_driving_school_detail", DrivingSchoolwebController.get_driving_school_detail)
router.post("/add_driving_school_detail", DrivingSchoolwebController.add_driving_school_Detail)
router.post("/delete_driving_school_detail/:id", DrivingSchoolwebController.delete_driving_school_detail)
router.post("/edit_driving_school_detail/:id", DrivingSchoolwebController.edit_driving_school_detail)
router.post("/update_driving_school_detail/:id", DrivingSchoolwebController.update_driving_school_detail)
router.post("/changeStatusDSdetails", DrivingSchoolwebController.changeStatusDSdetails)
router.post("/driving_school_detail_search", DrivingSchoolwebController.driving_school_detail_search)
router.post("/get_all_details", DrivingSchoolwebController.get_all_details)



/**************Service center state Nirmal 03-11-2023******************************************/
router.post("/get_service_center_state", ServiceCenterwebController.get_service_center_state)
router.post("/store_service_center_state", ServiceCenterwebController.store_service_center_state)
router.post("/delete_service_center_state/:id", ServiceCenterwebController.delete_service_center_state)
router.post("/edit_driving_school_state/:id", ServiceCenterwebController.edit_driving_school_state)
router.post("/update_service_center_state/:id", ServiceCenterwebController.update_service_center_state)
router.post("/get_all_service_state", ServiceCenterwebController.get_all_service_state)
router.post("/Servicestatuschange", ServiceCenterwebController.Servicestatuschange)


/*************service center city Nirmal 04-11-2023**********************************************/
router.post("/get_Service_center_city", ServiceCenterwebController.get_Service_center_city)
router.post("/store_service_center_city", ServiceCenterwebController.store_service_center_city)
router.post("/delete_service_center_city/:id", ServiceCenterwebController.delete_service_center_city)
router.post("/edit_service_center_city/:id", ServiceCenterwebController.edit_service_center_city)
router.post("/update_service_center_city/:id", ServiceCenterwebController.update_service_center_city)
router.post("/service_center_city_search", ServiceCenterwebController.service_center_city_search)
router.post("/Citystatuschange", ServiceCenterwebController.Citystatuschange)
router.post("/getAllcity", ServiceCenterwebController.getAllcity)

/*************service center brand Nirmal 07-11-2023***********************************************/
router.post("/get_Service_center_Brand", ServiceCenterwebController.get_Service_center_Brand)
router.post("/SearchBrand", ServiceCenterwebController.SearchBrand)
router.post("/statuschangeBrand", ServiceCenterwebController.statuschangeBrand)
router.post("/edit_service_center_Brand/:id", ServiceCenterwebController.edit_service_center_Brand)
router.post("/store_service_Brand", ServiceCenterwebController.store_service_Brand)
router.post("/update_Service_center_Brand/:id", ServiceCenterwebController.update_Service_center_Brand)
router.post("/getallBrand", ServiceCenterwebController.getallBrand)
router.post("/deletebrand/:id", ServiceCenterwebController.deletebrand)

/*******************service center data api Nirmal 07-11-2023**************************************/
router.post("/getAll_service_center_data", ServiceCenterwebController.getAll_service_center_data)
router.post("/searchservicedata", ServiceCenterwebController.searchservicedata)
router.post("/changefeature", ServiceCenterwebController.changefeature)
router.post("/changestatus", ServiceCenterwebController.changestatus)
router.post("/add_service_center_data", ServiceCenterwebController.add_service_center_data)
router.post("/edit_service_center_data/:id", ServiceCenterwebController.edit_service_center_data)
router.post("/deleteservicedata/:id", ServiceCenterwebController.deleteservicedata)
router.post("/update_service_center/:id", ServiceCenterwebController.update_service_center)
router.post("/get_all_service_center_data", ServiceCenterwebController.get_all_service_center_data)
router.post("/get_service_center_brand_option", ServiceCenterwebController.getSeviceCenterBrandOption)

/*****************service dealer data api Nirmal 08-11-2023**************************************/
router.post("/get_all_service_dealer", ServiceCenterwebController.get_all_service_dealer)
router.post("/change_featured", ServiceCenterwebController.change_featured)
router.post("/change_status", ServiceCenterwebController.change_status)
router.post("/search_dealer", ServiceCenterwebController.search_dealer)
router.post("/store_service_dealer", ServiceCenterwebController.store_service_dealer)
router.post("/delete_service_dealer/:id", ServiceCenterwebController.delete_service_dealer)
router.post("/getalldealer", ServiceCenterwebController.getalldealer)
router.post("/update_service_dealer/:id", ServiceCenterwebController.update_service_dealer)
router.post("/get_service_dealer/:id", ServiceCenterwebController.edit_service_deler_data)


/*****************News Category data api Jignesh Patel 08-11-2023**************************************/
router.post("/get-news-category", handleGetNewsCategory)
router.post("/create-news-category", handleCreateNewsCategory)
router.post("/get-news-category_by_id/:id", getNewsCategoryDataById)


/*****************News Headlines data api Jignesh Patel 08-11-2023**************************************/
router.post("/get-news-headlines", handleFetchNewsHeadline)
router.post("/get-news-headline/:id", handleGetNewsCategoryById)
router.post("/create-news-headline", handleCreatNewsHeadline)
router.post("/get-news-headline-category-dropdown", handleGetNewsHeadlinesCategoryOptions)
router.post("/get-news-category-dropdown", handleGetCategoryOptions)
router.post("/get-news-brand-dropdown", handleGetBrandOptionsIdWise)
router.post("/update-news-headline/:id", handleUpdateNewsHeadlines)

/*****************Tags data api Jignesh Patel 08-11-2023**************************************/
router.post("/get-tags", GetAllTags)
router.post("/get-tag/:id", GetTagById)
router.post("/create-tag", CreateNewTags)
router.post("/detete-tag/:id", RemoveTag)
router.post("/update-tag/:id", UpdateTag)

/*****************Tags data api Jignesh Patel 08-11-2023**************************************/
router.post("/get-news", GetAllNews)
router.post("/get-news/:id", GetNewsById)
router.post("/create-news", CreateNewNews)
router.post("/detete-news/:id", RemoveNews)
router.post("/update-news/:id", UpdateNews)



/************* Affilation Admin API************** 
************** Mansi  ************** 
************** 02-11-23 ************** 
************** affilation dashboard Admin API **************/
router.get("/affilation_dashboard", AffilationAdminControllerAPI.getAffilationDashboard)
router.post("/affilation_dashboard_data", AffilationAdminControllerAPI.getAffilationDashboardData)
router.post('/affilation_dashboard_update_status', AffilationAdminControllerAPI.updateAffilationStatus)

/************** affilation Program Admin API **************/
router.get('/affilation', AffilationAdminControllerAPI.getAffilationData)
router.get('/affiliation_place', AffilationAdminControllerAPI.getAffilationPlace)
router.post('/pagination_affiliate', AffilationAdminControllerAPI.getPaginationAffilation)
router.get('/view_affilation/:id', AffilationAdminControllerAPI.getAffilationById)
router.post('/affilation_data_show', AffilationAdminControllerAPI.getAffilationDataShow)
router.post('/update_app_status', AffilationAdminControllerAPI.updateAppStatus)
router.post('/get_affilation_data', AffilationAdminControllerAPI.getAffilationProgramData)
router.post('/clear_default_affilation', AffilationAdminControllerAPI.updateDefaultAffilation)
router.get('/get_affilation_dropdown', AffilationAdminControllerAPI.getAffilationDropDown)
router.post('/add_affilation', AffilationAdminControllerAPI.addAffilationData)

/************** affilation Program Offer Data API **************/
router.get('/offer_data', AffilationAdminControllerAPI.getOfferData)
router.post('/add_offer', AffilationAdminControllerAPI.addOfferData)
router.delete('/delete_affilation/:id', AffilationAdminControllerAPI.deleteAffilationData)
router.post('/update_position_affilation', AffilationAdminControllerAPI.updateAffilationSort)


/************** Affilation Data API **************/
router.get('/dynamic_dropdown', AffilationAdminControllerAPI.getDynamicDropDown)
router.post('/edit_dynamic_dropdown', AffilationAdminControllerAPI.updateDynamicDropDown)

/************** Affilation Data Language API **************/
router.get('/get_language', AffilationAdminControllerAPI.getLanguage)
router.post('/store_language_lable', AffilationAdminControllerAPI.addLanguageLabel)
router.post('/delete_language_lable', AffilationAdminControllerAPI.deleteLanguageLable)


/************** Affilation Service City List **************/
router.get('/affilation_state', AffilationAdminControllerAPI.getAffilationState)
router.post('/affilation_city_data', AffilationAdminControllerAPI.getAffilationCityData)
router.get('/get_affilation_city/:id', AffilationAdminControllerAPI.getAffilationCityIdWise)
router.post('/add_affilation_city', AffilationAdminControllerAPI.addAffilationCity)
router.delete('/delete_affilation_city/:id', AffilationAdminControllerAPI.deleteAffilationCity)
router.get('/get_service_provider_city', AffilationAdminControllerAPI.getServiceProviderCity)
router.get('/get_service_provider_dropdown', AffilationAdminControllerAPI.getServiceProviderDropDown)
router.get('/get_service_city_wise_pincode/:id', AffilationAdminControllerAPI.getServiceWisePincodeData)
router.get('/view_service_provider_city/:id', AffilationAdminControllerAPI.getViewServiceProviderCity)
router.post('/add_service_provider_city', AffilationAdminControllerAPI.addServiceProviderCity)
router.post('/update_pincode_status', AffilationAdminControllerAPI.updatePincodeStatus)
router.delete('/delete_service_provider_city/:id', AffilationAdminControllerAPI.deleteServiceProviderCity)










export default router;
