import {
    Op,
    Sequelize,
    where
} from "sequelize"
import UserRegistration from "../../models/UserRegistration.js";
import database from "../../config/database.js";
import RCReminder from "../../models/RCReminder.js";
import VehicleInformation from "../../models/VehicleInformation.js";
import UserVehicleDocument from "../../models/UserVehicleDocument.js"
import UserFcmToken from "../../models/UserFcmToken.js"
import utils from "../../helpers/utils.js"
import files from "../../helpers/fileUpload.js"
import moment from "moment";

let rcBlockStatus = false
const userVerification = async(req,res) => {
    try {
        let { type,email,mobile_number,apple_token,google_token,name,device_id,player_id,vahan_token,fcm_token,language_key,account_id,is_purchased,reg_number,is_subscribed,purchase_time,is_free_trial,no_of_days,sku } = req.body
        let version_code,old_num,mil,seconds,currentDate,numOfDay,expireDate,is_mobile,res_user
        if (type && type === 'ios'){
            version_code = 6.5
        }else{
            version_code = 9.1
        }
        let exist,num
        let new_num = []
        let input = {}
        if(email || mobile_number){
            if((type && type === 'ios') && ((!email || email === "" ))){
                console.log("=version_code",version_code);
                if(version_code >= 6.5){
                    if(apple_token && apple_token != ""){
                        exist = await UserRegistration.findOne({
                            where:{
                                apple_token : apple_token,
                                deleted_at : null
                            }
                        })
                    }else{
                        console.log("else paertsdss");
                        exist = await UserRegistration.findOne({
                            where:{
                                google_token : apple_token ? apple_token : '',
                                deleted_at : null
                            }
                        })
                        console.log("-exist",exist);
                    }
                }else{
                    exist = await UserRegistration.findOne({
                        where:{
                            apple_token : google_token ? google_token : '',
                            deleted_at : null
                        }
                    })
                }
            }else{
                exist = await UserRegistration.findOne({
                    where:{
                        email : email ,
                        deleted_at : null
                    }
                })
                if(!exist && email){
                    if(type == 'ios'){
                        if(version_code >= 6.5){
                            if(apple_token && apple_token != ""){
                                exist = await UserRegistration.findOne({
                                    where:{
                                        apple_token : apple_token,
                                        deleted_at : null
                                    }
                                })
                            }else{
                                exist = await UserRegistration.findOne({
                                    where:{
                                        google_token : apple_token ? apple_token : null,
                                        deleted_at : null
                                    }
                                })
                            }
                        }else{
                            exist = await UserRegistration.findOne({
                                where:{
                                    google_token : apple_token ? apple_token : '',
                                    deleted_at : null
                                }
                            })
                        }
                    }
                }
            }

            if(exist  && (email || (type === 'ios' && !email))){
                if(type && type === "ios"){
                    if(!name){
                        name = exist.name
                    }
                }

                input.name = name,
                input.device_id = device_id ? device_id : null,
                input.google_token = google_token ? google_token : null,
                input.player_id = player_id ? player_id : null,
                input.mobile_number  = mobile_number ? mobile_number : exist.mobile_number,
                input.vahan_token = vahan_token ? vahan_token : exist.vahan_token,
                input.account_id = account_id ? account_id : exist.account_id, 
                input.is_purchased = (is_purchased === 'true' || is_purchased == 'true' || is_purchased === true)? 1 : ((is_purchased === 'false' || is_purchased == 'false' || !is_purchased)? 0 : is_purchased)
                if(fcm_token){
                    input.fcm_token = fcm_token 
                }
                if(language_key){
                    input.language_key = language_key 
                }

                
                if(reg_number){
                    if(exist && exist.vehicle_number !== ""){
                        old_num = exist.vehicle_number.split(",");
                    }else{
                        old_num = []
                    }
                    new_num.push(reg_number);
                    num = [...new Set([...old_num,...new_num])];
                    if(!is_purchased || (is_purchased && is_purchased == 'flase')){
                        if(!is_subscribed || (is_subscribed &&  is_subscribed != 'true')){
                            if (!old_num.includes(reg_number)) {
                                if (num.length > 5 && req.body.version_code >= version_code) { 
                                    delete input.vehicle_number;
                                    delete input.language_key;
                                    const userArray = {};
                                    let jsonArray
                                    Object.assign(userArray, input);
                                    userArray.user_id = exist.id;
                                    userArray.email = exist.email;
                                    if (req.body.version_code >= 9.6 && type != 'ios') {
                                        jsonArray = {
                                          status: false,
                                          response_code: 200,
                                          response_message: '5', 
                                          data: userArray
                                        };
                                    } else {
                                        jsonArray = {
                                            status: false,
                                            response_code: 200,
                                            response_message: 'Max limit add to dashboard',
                                            data: userArray
                                        };
                                    }
                                    return res.send(jsonArray)
                                    // return res.send(jsonArray)
                                }
                            }
                              
                        }
                    }
                    input.vehicle_number = num.join(',');
                }
                
                if(is_subscribed && (is_subscribed == true || is_subscribed == 'true')){
                    if((exist && !exist.expiry_date) || (exist && exist.expiry_date == "")){
                        if(purchase_time){
                            mil  = purchase_time
                            seconds = Math.ceil(mil / 1000);
                            currentDate = new Date(seconds * 1000).toISOString().slice(0, -8);
                        }else{
                            currentDate = new Date().toISOString().slice(0, -8);
                        }


                        if(is_free_trial && (is_free_trial == "true")){
                            if(exist.is_free_trial != 1){
                                numOfDay = no_of_days
                                expireDate = new Date(Date.parse(currentDate) + numOfDay * 24 * 60 * 60 * 1000).toISOString().slice(0, -8);
    
                            }else{
                                currentDate = new Date().toISOString().slice(0, -8);
                                if (new Date(currentDate) > new Date(exist.expiry_date)) {
                                    if (exist && exist.sku.includes('yearly')) {
                                        numOfDay = 365;
                                        expireDate = new Date(Date.parse(currentDate) + numOfDay * 24 * 60 * 60 * 1000).toISOString().slice(0, -8);
                                    }
                                    if (exist && exist.sku.includes('monthly')) {
                                        numOfDay = 30;
                                        expireDate = new Date(Date.parse(currentDate) + numOfDay * 24 * 60 * 60 * 1000).toISOString().slice(0, -8);
                                    }
                                }else{
                                    numOfDay = exist.no_of_days
                                    expireDate = exist.expiry_date
                                }
    
                            }
                        }else{
                            if (sku && sku.length && sku.includes('yearly')) {
                                numOfDay = 365;
                                expireDate = new Date(Date.parse(currentDate) + numOfDay * 24 * 60 * 60 * 1000).toISOString().slice(0, -8);
                              }
                              if (sku && sku.length &&  sku.includes('monthly')) {
                                numOfDay = 30;
                                expireDate = new Date(Date.parse(currentDate) + numOfDay * 24 * 60 * 60 * 1000).toISOString().slice(0, -8);
                              }
                              
                        }
                    }else{
                        currentDate = new Date().toISOString().slice(0, -8);
                        if (new Date(currentDate) > new Date(exist.expiry_date)) {
                            if (exist && exist.sku.includes('yearly')) {
                                numOfDay = 365;
                                expireDate = new Date(Date.parse(currentDate) + numOfDay * 24 * 60 * 60 * 1000).toISOString().slice(0, -8);
                            }
                            if (exist && exist.sku.includes('monthly')) {
                                numOfDay = 30;
                                expireDate = new Date(Date.parse(currentDate) + numOfDay * 24 * 60 * 60 * 1000).toISOString().slice(0, -8);
                            }
                        } else {
                            expireDate = exist.expiry_date;
                            numOfDay = exist.no_of_days;
                        }
                    }
                    if (is_subscribed) {
                        input.is_subscribed = (is_subscribed || is_subscribed == 'true') ? 1 : 0;
                    } else {
                        input.is_subscribed = 0;
                    }
                    if (is_free_trial) {
                        input.is_free_trial = (is_free_trial || is_free_trial === 'true') ? 1 : 0;
                    } else {
                        input.is_free_trial = 0;
                    }
                    input.sku = sku || null;
                    input.purchase_time = purchase_time || null;
                    input.expiry_date = expireDate || null;
                    input.no_of_days = numOfDay || 0;
                  
                }else{
                    if (!exist.expiry_date) {
                        if (is_subscribed) {
                            input.is_subscribed = (is_subscribed || is_subscribed === 'true') ? 1 : 0;
                        } else {
                            input.is_subscribed = 0;
                        }
                        if (is_free_trial) {
                            input.is_free_trial = (is_free_trial || is_free_trial === 'true') ? 1 : 0;
                        } else {
                            input.is_free_trial = 0;
                        }
                        input.sku = sku || null;
                        input.purchase_time = purchase_time || null;
                        input.expiry_date = expireDate || null;
                        input.no_of_days = numOfDay || 0;
                    } else {
                        currentDate = new Date().toISOString().slice(0, -8);
                        if (new Date(currentDate) > new Date(exist.expiry_date)) {
                            if (is_subscribed) {
                                input.is_subscribed = (is_subscribed || is_subscribed === 'true') ? 1 : 0;
                            } else {
                                input.is_subscribed = 0;
                            }
                            if (is_free_trial) {
                                input.is_free_trial = (is_free_trial || is_free_trial === 'true') ? 1 : 0;
                            } else {
                                input.is_free_trial = 0;
                            }
                            input.sku = sku || null;
                            input.purchase_time = purchase_time || null;
                            input.expiry_date = expireDate || null;
                            input.no_of_days = numOfDay || 0;
                        }
                    }
                }
                
                await UserRegistration.update(input,{where : {
                    id : exist.id
                }});
                // console.log("=exist>>>>>>>>>",exist);

                // console.log("=exist",exist.id);
                delete input.vehicle_number;
                delete input.language_key;
                delete input.is_subscribed;
                delete input.sku;
                delete input.purchase_time;
                delete input.expiry_date;

                input.user_id = exist.id;
                input.email = exist.email;
            }else{
                if(mobile_number){
                    is_mobile = 1
                    res_user = await UserRegistration.findOne({
                        where:{
                            mobile_number: mobile_number
                        }
                    })
                }else{
                    is_mobile = 1
                    res_user = await UserRegistration.findOne({
                        where:{
                            device_id: device_id ? device_id :''
                        }
                    })
                }
                console.log("====res_userres_userres_userres_user",res_user);
                if(res_user){
                    input.google_token = google_token ? google_token : ''
                    input.player_id = player_id ? player_id : ''
                    input.mobile_number = mobile_number ? mobile_number : ''
                    input.vahan_token = vahan_token ? vahan_token : ''
                    input.account_id = account_id ? account_id : ''
                    if(fcm_token){
                        input.fcm_token = fcm_token 
                    }
                    if(language_key){
                        input.language_key = language_key 
                    }

                    if(is_mobile == 1){
                        if(type != 'ios'){
                            input.email = email
                            input.name = res_user ? res_user.name : ''
                        }
                    }else{
                        if(type != 'ios' && (email != "")){
                            input.email = email
                            input.name = name
                        }
                    }

                    input.is_purchased = (is_purchased || is_purchased == 'true') ? 1 : 0;

                    if(reg_number){
                        if (exist && exist.vehicle_number && exist.vehicle_number !== "") {
                            old_num = exist.vehicle_number.split(",");
                        } else {
                            old_num = [];
                        }
                        new_num.push(reg_number);
                        num = [...new Set([...old_num,...new_num])];
                        if(!is_purchased || (is_purchased && is_purchased == 'flase')){
                            if(!is_subscribed || (is_subscribed &&  is_subscribed != 'true')){
                                if (num.length > 5 && (req.body.version_code && req.body.version_code >= version_code)) { 
                                    delete input.vehicle_number;
                                    delete input.language_key;
                                    const userArray = {};
                                    let jsonArray
                                    Object.assign(userArray, input);
                                    if(res_user){
                                        userArray.name = res_user.name;
                                        userArray.device_id = res_user.device_id;
                                        userArray.user_id = res_user.id;
                                        userArray.email = res_user.email;
                                    }
                                    if (req.body.version_code && req.body.version_code >= 9.6 && type!== 'ios') {
                                        jsonArray = {
                                          status: false,
                                          response_code: 200,
                                          response_message: '5', 
                                          data: userArray
                                        };
                                    } else {
                                        jsonArray = {
                                            status: false,
                                            response_code: 200,
                                            response_message: 'Max limit add to dashboard',
                                            data: userArray
                                        };
                                    }
                                    return res.send(jsonArray)
                                    // return res.send(jsonArray)
                                }
                            }

                        }
                        input.vehicle_number = num.join(',');
                    }

                    if(is_subscribed && (is_subscribed == true || is_subscribed == 'true')){
                        
                        if(purchase_time){
                            mil  = purchase_time
                            seconds = Math.ceil(mil / 1000);
                            currentDate = new Date(seconds * 1000).toISOString().slice(0, -8);


                            if(is_free_trial && (is_free_trial == "true")){
                                numOfDay = no_of_days
                                expireDate = new Date(Date.parse(currentDate) + numOfDay * 24 * 60 * 60 * 1000).toISOString().slice(0, -8);
                            }else{
                                if (sku && sku.length && sku.includes('yearly')) {
                                    numOfDay = 365;
                                    expireDate = new Date(Date.parse(currentDate) + numOfDay * 24 * 60 * 60 * 1000).toISOString().slice(0, -8);
                                }
                                if (sku && sku.length &&  sku.includes('monthly')) {
                                    numOfDay = 30;
                                    expireDate = new Date(Date.parse(currentDate) + numOfDay * 24 * 60 * 60 * 1000).toISOString().slice(0, -8);
                                }
                                
                            }
                        }


                        if (is_subscribed) {
                            input.is_subscribed = (is_subscribed || is_subscribed == 'true') ? 1 : 0;
                        } else {
                            input.is_subscribed = 0;
                        }
                        if (is_free_trial) {
                            input.is_free_trial = (is_free_trial || is_free_trial === 'true') ? 1 : 0;
                        } else {
                            input.is_free_trial = 0;
                        }
                        
                        
                        input.sku = sku || null;
                        input.purchase_time = purchase_time || null;
                        input.expiry_date = expireDate || null;
                        input.no_of_days = numOfDay || 0;
                                          
                    }else{
                        if (exist && !exist.expiry_date) {
                            if (is_subscribed) {
                                input.is_subscribed = (is_subscribed || is_subscribed === 'true') ? 1 : 0;
                            } else {
                                input.is_subscribed = 0;
                            }
                            if (is_free_trial) {
                                input.is_free_trial = (is_free_trial || is_free_trial === 'true') ? 1 : 0;
                            } else {
                                input.is_free_trial = 0;
                            }
                            input.sku = request.sku || null;
                            input.purchase_time = request.purchase_time || null;
                            input.expiry_date = expireDate || null;
                            input.no_of_days = numOfDay || 0;
                        } else {
                            currentDate = new Date().toISOString().slice(0, -8);
                            if (new Date(currentDate) > new Date(exist && exist.expiry_date)) {
                                if (is_subscribed) {
                                    input.is_subscribed = (is_subscribed || is_subscribed === 'true') ? 1 : 0;
                                } else {
                                    input.is_subscribed = 0;
                                }
                                if (is_free_trial) {
                                    input.is_free_trial = (is_free_trial || is_free_trial === 'true') ? 1 : 0;
                                } else {
                                    input.is_free_trial = 0;
                                }
                                input.sku = sku || null;
                                input.purchase_time = purchase_time || null;
                                input.expiry_date = expireDate || null;
                                input.no_of_days = numOfDay || 0;
                            }
                        }
                    }
                    await UserRegistration.update(input,{where : {
                        id : res_user.id
                    }});
                    delete input.vehicle_number;
                    delete input.language_key;
                    delete input.is_subscribed;
                    delete input.sku;
                    delete input.purchase_time;
                    delete input.expiry_date;
                    input.name = res_user.name;
                    input.user_id = res_user.id;
                    input.device_id = res_user.device_id;
                    input.email = res_user.email;
                }else{
                    let store = req.body;
                    if(is_subscribed && req.body.version_code >= version_code){
                        store.is_subscribed =1
                    }

                    if(type == 'ios'){
                        if(store.google_token && store.google_token != ""){
                            store.apple_token = store.google_token
                        }
                        if(store.apple_token && store.apple_token != ""){
                            store.apple_token = store.apple_token
                        }
                    }

                    if(store.mobile_number){
                        store.mobile_number = store.mobile_number
                    }
                    if(store.vahan_token){
                        store.vahan_token = store.vahan_token
                    }
                    if(store.account_id){
                        store.account_id = store.account_id
                    }
                    if(store.email && store.email != false){
                        store.email = store.email
                    }else{
                        store.email = NULL
                    }

                    store.is_purchased = is_purchased ? (is_purchased || is_purchased == 'true') ? 1 : 0 : 0

                    //create User BAKIIIIIIIIIIIIIIIIIIIII
                   const responseUser =  UserRegistration.create(store)
                    .then(user => {
                      console.log("===Comparte",user.id);
                    })
                    .catch(error => {
                      console.log("--error",error);
                      console.error(error);
                    });
                    if(responseUser){
                        let user = await UserRegistration.findOne({
                            where : {
                                id:responseUser.id
                            },
                            attributes : [['id','user_id'], 'name', 'email', 'device_id', 'google_token', 'player_id','mobile_number','vahan_token','account_id']
                        })
                        input = user ? user : null
                    }
                }

            }

            let tempArrayData = []
            let tableName
            if(reg_number && reg_number != ''){
                tableName = reg_number.substring(0, 2);
                const checkState =!isNaN(tableName);
                if(checkState || checkState == "true"){
                    tableName = reg_number.substring(2, 4);

                    if(tableName != 'BH'){
                        let response ={
                            status :false,
                            response_code :404,
                            response_message : 'Data Not Found'
                        } 

                        return res.send(response)
                        // return res.send(response)

                    }
                }

                // RC DATABASE
                let responseResult = await database.Vehicle.query(`SELECT * FROM ${tableName} WHERE reg_no = :reg_no  LIMIT 1` , {  replacements: { reg_no: reg_number}, type: Sequelize.QueryTypes.SELECT})
                let responseExist = responseResult.length ? responseResult[0] : null

                if(responseExist){
                    delete responseExist.parivahan_json
                    delete responseExist.own_json
                    tempArrayData.push(responseExist)

                    if(responseExist.chasi_no!== "XXXXXXXX") {
                        responseExist.chasi_no = responseExist.chasi_no.slice(0, -4) + "XXXX";
                    }
                    if(responseExist.engine_no!== "XXXXXXXX") {
                        responseExist.engine_no = responseExist.engine_no.slice(0, -4) + "XXXX";
                    }

                    if(responseExist.regn_dt == null) {
                        responseExist.regn_dt = "0000-00-00";
                    }
                    
                    if(responseExist.updated_at == null) {
                        responseExist.updated_at = "0000-00-00";
                    }

                    if(responseExist.maker_modal != 'NA'){
                        let vehicle_variant = await VehicleInformation.findOne({
                            where:{
                                model_name :{
                                    [Op.like] : `%${responseExist.maker_modal}%`
                                }
                            }
                        })
                        if(vehicle_variant && vehicle_variant.image != 'NA'){
                            tempArrayData[0].image = vehicle_variant.image
                        }else{
                            tempArrayData[0].image = ''
                        }
                    }else{
                        tempArrayData[0].image = ''
                    }
                    responseExist.is_rc_block = rcBlockStatus

                }
                let reg_date_check = tempArrayData && tempArrayData.length &&  new Date(tempArrayData[0].regn_dt).getTime();
                let insurance_date_check =  tempArrayData && tempArrayData.length && new Date(tempArrayData[0].insUpto).getTime();
                if(reg_date_check == insurance_date_check){
                    if(tempArrayData.length){
                        tempArrayData[0].insUpto = 'NA'
                    }
                }
                if(tempArrayData.length){ 
                    tempArrayData[0].address = 'NA'
                }
                let userId = input.user_id

                if((userId && userId != "") && (req.body.version_code && req.body.version_code >= version_code)){
                    if(tempArrayData.length){  
                        tempArrayData[0].fitness_upto_reminder = false
                        tempArrayData[0].insurance_reminder = false
                        tempArrayData[0].puc_reminder = false
                        tempArrayData[0].is_dashboard = false
                    }
                

                    let userDocumentRemindar = await RCReminder.findAll({
                        where:{
                            user_id: userId,
                            reg_number:reg_number
                        }
                    })
                    for (let i = 0; i < userDocumentRemindar.length; i++) {
                        const element = array[i];
                        if(element.doc_type == 3){
                            tempArrayData.length &&  (tempArrayData[0].puc_reminder = true);
                        }
                        if(element.doc_type == 2){
                            tempArrayData.length &&  (tempArrayData[0].insurance_reminder = true);
                        }
                        if(element.doc_type == 2){
                            tempArrayData.length &&  (tempArrayData[0].fitness_upto_reminder = true);
                        }
                    }

                    let userDashboard = await UserRegistration.findOne({
                        attributes:['id','vehicle_number'],
                        where:{
                            id : userId
                        }
                    })

                    if(userDashboard){
                        tempArrayData.length &&  (tempArrayData[0].is_dashboard = true);
                    }   

                    let userDocument = await getUserDocument(reg_number,userId,userDashboard)
                    const response = {
                        status :true,
                        response_code : 200,
                        response_message : 'success',
                        data :input,
                        rc_data: tempArrayData ,
                        user_document : userDocument
                    }
                    return res.send(response)
                }
            }
            const response = {
                status :true,
                response_code : 200,
                response_message : 'success',
                data : input,
                rc_data : tempArrayData
            }
            return res.send(response)
        }else{
            const response = {
                status :false,
                response_code : 400,
                response_message : 'Email Id And Google token required',
            }
            return res.send(response)

        }



        

    } catch (error) {
        console.log("------error",error);
        return res.send({
            status: false,
            message: "Error Eccoured !"
        })
        // return res.send(utils.encrypt({
        //     status: false,
        //     message: "Error Eccoured !"
        // },req.body.hasOwnProperty('rto')))
    }
}


const userDocumentUpload = async(req,res) =>{
    try {
        let {user_id,vehicle_number,document_type,title,description,date,reminder_key,count,language_key} = req.body;
        let allowed_text = ['jpg','jpeg','png','gif','jfif'];
        let data={}
        if(!user_id){
            let message = await utils.translate('User_ID_Required',language_key)
            const response = {
                status:false,
                response_code:400,
                response_message : message
            }
            return res.send(response)
        }
        if(!vehicle_number){
            let message = await utils.translate('Enter_Vehicle_Number',language_key)
            const response = {
                status:false,
                response_code:400,
                response_message : message
            }
            return res.send(response)
        }


        if(req.files){
            if(req.files.image){
                let message = await utils.translate('Document_Type_Required',language_key)
                if(!document_type || document_type == ''){
                    const response = {
                        status:false,
                        response_code:400,
                        response_message : message
                    }
                    return res.send(response)
                }
                const extension = req.files.image.name.split(".")
                if(!allowed_text.includes(extension[extension.length - 1])){
                    let message = await utils.translate('File_not_Valid',language_key)
                    const response = {
                        status:false,
                        response_code:400,
                        response_message : message
                    }
                    return res.send(response)
                }else{
                    let currentDate = moment().format('DD-MM-YYYY')
                    data.user_id = user_id
                    data.vehicle_number = vehicle_number
                    data.title = title ? title : ' '
                    data.type = document_type
                    data.description = description ? description : ' '
                    data.date = date ? date :  currentDate
                    if(reminder_key && reminder_key != ''){
                        data.reminder_key = reminder_key;
                    }

                    if(user_id){
                        req.body.reg_number = vehicle_number
                        //function call store_user_vehicles
                        await utils.storeNewVehicle(req.body)
                    }

                    let documentCount = await UserVehicleDocument.count({
                        where:{
                            vehicle_number : vehicle_number,
                            user_id : user_id,
                            type:document_type
                        },
                    })
                    if(count){
                        if(documentCount == count){
                            const imageResult = await files.fileUploadWithDigitalOcean(req.files.image,"vehicle_document")
                            data.image = imageResult.status ? imageResult.image : null
                            await UserVehicleDocument.create(data)
                            await UserVehicleDocument.update({count : documentCount + 1},{
                                where:{
                                    vehicle_number : vehicle_number,
                                    user_id : user_id,
                                    type : document_type
                                }
                            })
                        }
                    }else{
                        data.count = 1
                        const imageResult = await files.fileUploadWithDigitalOcean(req.files.image,"vehicle_document")
                        data.image = imageResult.status ? imageResult.image : null
                        await UserVehicleDocument.create(data)
                    }
                }
            }
        }
   
        let response = {
            vehicle_driving_licence : [],
            vehicle_insurance :[],
            vehicle_pollution : [],
            vehicle_rc : [],
            vehicle_serviceLog : [],
            vehicle_other_document : [],
        }

        let documentData = await UserVehicleDocument.findAll({
            where:{
                vehicle_number : vehicle_number ? vehicle_number :''
            },
            attributes:['id','vehicle_number','image','title','description','date','count','type']
        })
        if(documentData && documentData.length){
            for (let i = 0; i < documentData.length; i++) {
                const element = documentData[i];
                if(element.type == 1){
                    response.vehicle_driving_licence.push(element)
                }
                if(element.type == 2){
                    response.vehicle_insurance.push(element)
                }
                if(element.type == 3){
                    response.vehicle_pollution.push(element)
                }
                if(element.type == 4){
                    response.vehicle_rc.push(element)
                }
                if(element.type == 5){
                    response.vehicle_serviceLog.push(element)
                }
                if(element.type == 6){
                    response.vehicle_other_document.push(element)
                }
            }
        }


        //rc block cache pendinfg
        // $rcBlock = \Cache::get('rcBlock',null);
        // if($rcBlock){
        //     $rcBlockData = $rcBlock;
        // }else{
        //     $rcBlockData = RcBlock::where('status', 1)->get()->toArray();
        //     \Cache::put('rcBlock',$rcBlockData, 1000);
        // }

        let rcBlockStatus = false
        // if(in_array($input['vehicle_number'], array_column($rcBlockData, 'reg_no'))) {
        //     $rcBlockStatus = true;
        // }
        let state = vehicle_number.substring(0, 2);
        const checkState =!isNaN(state);

        if(checkState == "true" || checkState){

            state = vehicle_number.substring(2, 2);
            if(state != 'BH'){
                const data3 = [];
                const jsonReponse = { 
                    status: false, 
                    response_code: 404, 
                    response_message: 'Data_Not_Found', 
                    data: data3 
                };
                return res.send(jsonReponse)
            }            
        }
        let dataResult = await database.Vehicle.query(`SELECT * FROM ${state} WHERE reg_no = :reg_no  LIMIT 1` , {  replacements: { reg_no: vehicle_number}, type: Sequelize.QueryTypes.SELECT})
        let isExist = dataResult.length ? dataResult[0] : null
        if(isExist){
            delete isExist.parivahan_json;
            delete isExist.own_json;
            delete isExist.created_at;
            delete isExist.updated_at;
        }

        if(!isExist){
            isExist = ''
        }
        let jsonResponse={
            status:true,
            response_code : 200,
            response_message : 'success',
            is_rc_block : rcBlockStatus,
            data:response,
            vehicle_data:isExist
        }

        res.send(jsonResponse)

    } catch (error) {
        console.log("------error",error);
        return res.send({
            status: false,
            message: "Error Eccoured !"
        })
    }
}


const userDocumentDelete =  async(req,res) => {
    try {   
        const { document_id , user_id, language_key } = req.body
        let responseDelete
        if(!document_id){
            let message = await utils.translate('Document_Id_Required',language_key)
            const response = {
                status:false,
                response_code:400,
                response_message : message
            }
            return res.send(response)
        }

        if(!user_id){
            let message = await utils.translate('User_ID_Required',language_key)
            const response = {
                status:false,
                response_code:400,
                response_message : message
            }
            return res.send(response)
        }

        let response = await UserVehicleDocument.findOne({
            where:{
                id : document_id,
                user_id:user_id
            }
        })
        if(response){
            if(response.image.indexOf('https://dairylock.sgp1.digitaloceanspaces.com') !== -1){
                responseDelete = await files.fileDeleteDigitalOcean(response.image)
            }else if(response.image.indexOf('https://rtoapplication.sgp1.cdn.digitaloceanspaces.com') !== -1){
                responseDelete = await files.fileDeleteDigitalOceanNew(response.image)
            }else{
                responseDelete = await files.fileDeleteDigitalOcean(response.image)
            }
            if(responseDelete){
                await UserVehicleDocument.destroy({
                    where: {
                        id: document_id,
                        user_id:user_id
                    },
                  });

                const jsonResponse = {
                    status:true,
                    response_code:200,
                    response_message : 'success',
                    data:[]
                }

                return res.send(jsonResponse)
            }else{
                let message = await utils.translate('Document_Not_Delete,_Please_try_again',language_key)
                const jsonResponse = {
                    status:false,
                    response_code:400,
                    response_message : message,
                    data:[]
                }

                return res.send(jsonResponse)
            }
        }else{
            const jsonResponse = {
                status:true,
                response_code:200,
                response_message : 'success',
                data:[]
            }

            return res.send(jsonResponse)
        }

        
    } catch (error) {
        console.log("------error",error);
        return res.send({
            status: false,
            message: "Error Eccoured !"
        })
    }
}


const userDocumentEdit = async(req,res) =>{
    try {
        let { user_id,language_key,document_id,title,vehicle_number,description,date,reminder_key} = req.body
        let allowed_text = ['jpg','jpeg','png','gif','jfif'];
        if(!user_id){
            let message = await utils.translate('User_ID_Required',language_key)
            const response = {
                status:false,
                response_code:400,
                response_message : message
            }
            return res.send(response)
        }
        if(!document_id){
            let message = await utils.translate('Document_Id_Required',language_key)
            const response = {
                status:false,
                response_code:400,
                response_message : message
            }
            return res.send(response)
        }
        let response = await UserVehicleDocument.findOne({
            where : {
                id : document_id,
                user_id : user_id
            }
        })
        let data = {}
        if(response){
            if(req.files && req.files.image){
                const extension = req.files.image.name.split(".")
                if(!allowed_text.includes(extension[extension.length - 1])){
                    let message = await utils.translate('File_not_Valid',language_key)
                    const response = {
                        status:false,
                        response_code:400,
                        response_message : message
                    }
                    return res.send(response)
                }else{
                    if(response.image.indexOf('https://dairylock.sgp1.digitaloceanspaces.com') !== -1){
                        const _result = await files.fileEditDigitaOcean(req.files.image,'vehicle_document',response.image)
                        data.image =  _result.status ? _result.image : response.image
                    }else if(response.image.indexOf('https://rtoapplication.sgp1.cdn.digitaloceanspaces.com') !== -1){
                        const _result = await files.fileEditDigitaOceanNew(req.files.image,'vehicle_document',response.image)
                        data.image =  _result.status ? _result.image : response.image
                    }else{
                        const _result= await files.fileEditDigitaOcean(req.files.image,'vehicle_document',response.image)
                        data.image =  _result.status ? _result.image : response.image
                    }
                }
            }else{
                data.image = response.image
            }
            data.user_id = user_id ? user_id : response.user_id
            data.vehicle_number = vehicle_number ? vehicle_number : response.vehicle_number
            data.title = title ? title : response.title
            data.description = description ? description : response.description
            data.date = date ? date : response.date
            if(reminder_key && reminder_key != ""){
                data.reminder_key = reminder_key
            }
            await UserVehicleDocument.update(data,{
                where : {
                    id : document_id,
                }
            })
            data.id = response.id
            data.type = response.type
            data.count = response.count
            const _response = {
                status :true,
                response_code :200,
                response_message : 'success',
                data : data
            }
            return res.send(_response)
        }else{
            let message = await utils.translate('Document_Not_Found',language_key)
            const response = {
                status:false,
                response_code:400,
                response_message : message
            }
            return res.send(response)
        }
    } catch (error) {
        console.log("------error",error);
        return res.send({
            status: false,
            message: "Error Eccoured !"
        })
    }
}
const userDocumentDeleteByNumber = async(req,res) =>{
    try {
        const {reg_number,user_id,language_key} = req.body


        if(reg_number){
            req.body.vehicle_number = reg_number
        }

        if(!req.body.vehicle_number){
            let message = await utils.translate('Vehicle_Number_Required',language_key)
            const response = {
                status : false,
                response_code : 400,
                response_message : message
            }

           return res.send(response)
        }
        const vehicle_number = req.body.vehicle_number
        if(!user_id){
            let message = await utils.translate('User_ID_Required',language_key)
            const response = {
                status : false,
                response_code : 400,
                response_message : message
            }

            return res.send(response)
        }


        let user = await UserRegistration.findOne({
            where:{
                id : user_id,
                vehicle_number : {
                    [Op.like]:`%${vehicle_number}%`
                }
            }
        })

        if(!user){
            let message = await utils.translate('Data_Not_Found',language_key)
            const response = {
                status : false,
                response_code : 400,
                response_message : message
            }
            return res.send(response)
        }
        const elpode = user.vehicle_number.split(',');
        const index = elpode.indexOf(vehicle_number);
        if (index !== -1) {
            elpode.splice(index, 1);
            const data = elpode.join(',');
            await UserRegistration.update({ vehicle_number: data },{
                where:{
                    id : user_id
                }
            });
        }

        let userDocumentResult = await UserVehicleDocument.findAll({
            where:{
                user_id : user_id,
                vehicle_number : {
                    [Op.like]:`%${vehicle_number}%`
                }
            }
        })

        if(userDocumentResult && userDocumentResult.length){
            for (let i = 0; i < userDocumentResult.length; i++) {
                const element = userDocumentResult[i];
                
                
                //digital ocean file delete 
                
                if(element.image.indexOf('https://dairylock.sgp1.digitaloceanspaces.com') !== -1){
                    await files.fileDeleteDigitalOcean(element.image)
                }else if(element.image.indexOf('https://rtoapplication.sgp1.cdn.digitaloceanspaces.com') !== -1){
                    await files.fileDeleteDigitalOceanNew(element.image)
                }else{
                    await files.fileDeleteDigitalOcean(element.image)
                }
            }
        }

        await UserVehicleDocument.destroy({
            where: {
                id : user_id,
                vehicle_number : {
                    [Op.like]:`%${vehicle_number}%`
                }
            },
        });
        await RCReminder.destroy({
            where: {
                reg_number : vehicle_number,
                user_id : user_id
            },
        });

        const response = {
            status : true,
            response_code: 200,
            response_message : 'Record delete successfully'
        }

        return res.send(response)

    } catch (error) {
        console.log("------error",error);   
        return res.send({
            status: false,
            message: "Error Eccoured !"
        })
    }
}

const userSearchedByNumberStore = async(req,res) =>{
    try {
        const { user_id ,reg_number, is_purchased,is_subscribed,type,language_key,fcm_token } = req.body
        let version_code
        if(type && type == 'ios'){
            version_code = 6.5
        }else{
            version_code = 9.1
        }

        if(!user_id){
            const _response = {
                status : false,
                response_code : 400,
                response_message : 'user_id Field Required'
            }
            return res.send(_response)
        }

        if(!reg_number){
            const _response = {
                status : false,
                response_code : 400,
                response_message : 'reg_number Field Required'
            }
            return res.send(_response)
        }

        let user = await UserRegistration.findOne({
            where : {
                id : user_id
            }
        })

        if(!user){
            let message = await utils.translate('Data_Not_Found',language_key)
            const _response = {
                status : false,
                response_code : 400,
                response_message :message
            }
            return res.send(_response)
        }
        let old_num
        let new_num = []
        if(user && user.vehicle_number && user.vehicle_number != ""){
            old_num = user.vehicle_number ? user.vehicle_number.toUpperCase().split(",") : []
        }else{
            old_num = []
        }
        new_num.push(reg_number.toUpperCase());
        let num = [...new Set([...old_num,...new_num])];
        if(!is_purchased || (is_purchased && is_purchased == 'flase')){
            if(!is_subscribed || (is_subscribed &&  is_subscribed != 'true')){
                if (!old_num.includes(reg_number)) {
                    if (num.length > 5 &&  (req.body.version_code  && req.body.version_code >= version_code)) { 

                        if(req.body.version_code   && req.body.version_code   >= 9.6 && type != 'ios'){
                            const _response = {
                                status : false,
                                response_code : 200,
                                response_message :'5'
                            }
                            return res.send(_response)
                        }else{
                            let message = await utils.translate('max_limit_add_to_dashboard',language_key)
                            const _response = {
                                status : false,
                                response_code : 200,
                                response_message : message
                            }
                            return res.send(_response)
                        }
                    }
                }
                  
            }
        }


        if(((is_subscribed && is_subscribed == 'true') || (is_subscribed && is_subscribed == true)) ||  ((is_purchased && is_purchased == 'true') || (is_purchased && is_purchased == true)) && (req.body.version_code & req.body.version_code >= version_code && fcm_token)){
            let user_token = await UserFcmToken.findOne({
                where :{
                    user_id: user_id,
                    fcm_token:fcm_token
                }
            })
            if(!user_token){
                const store = {
                    user_id: user_id,
                    fcm_token : fcm_token
                }
                await UserFcmToken.create(store)
            }
        }


        console.log("caolllll");
        let vehicle_number = num.join(',');
        await UserRegistration.update({vehicle_number : vehicle_number},{
            where:{
                id : user_id
            }
        })

        let tableName = reg_number.substring(0, 2);
        let checkState =!isNaN(tableName);

        if (checkState) {
            tableName = reg_number.substring(2, 4);
        }
        let dataResult = await database.Vehicle.query(`SELECT * FROM ${tableName} WHERE reg_no = :reg_number  LIMIT 1` , {  replacements: { reg_number: reg_number}, type: Sequelize.QueryTypes.SELECT})
        let isExist = dataResult.length ? dataResult[0] : null
        let tempArrayData = []
        if(isExist){
            delete isExist.parivahan_json
            delete isExist.own_json
            let _response = {}
            tempArrayData.push(isExist)

            if(isExist.chasi_no!== "XXXXXXXX") {
                isExist.chasi_no = isExist.chasi_no.slice(0, -4) + "XXXX";
            }
            if(isExist.engine_no!== "XXXXXXXX") {
                isExist.engine_no = isExist.engine_no.slice(0, -4) + "XXXX";
            }

            if(isExist.regn_dt == null) {
                isExist.regn_dt = "0000-00-00";
            }
            
            if(isExist.updated_at == null) {
                isExist.updated_at = "0000-00-00";
            }

            if(isExist.maker_modal != 'NA'){
               
                let category

                if('M-CYCLE/SCOOTER (2WN),M-Cycle/Scooter(2WN),Moped(2WN)'.toLowerCase().indexOf(isExist.vh_class.toLowerCase()) !== -1 ){
                    category = 1
                }else if('Motor Car(LMV)'.toLowerCase().indexOf(isExist.vh_class.toLowerCase()) !== -1){
                    category = 2
                }else{
                    category = 3
                }


                let vehicleVariant  = await VehicleInformation.findOne({
                    where: { 
                        category_id : category,
                        model_name :{
                            [Op.like] : `%${isExist.maker_modal}%`
                        }
                    }
                })

                if(vehicleVariant && vehicleVariant.image != 'NA'){
                    tempArrayData[0].image = vehicleVariant.image
                }else{
                    tempArrayData[0].image = ''
                }
            }else{
                tempArrayData[0].image = ''
            }
            isExist.is_rc_block = rcBlockStatus
            let registaration_date = moment(tempArrayData[0].regn_dt,'DD-Mon-YYYY').format()
            let insurance_date = moment(tempArrayData[0].insUpto,'DD-Mon-YYYY').format()
            const reg_date_check = tempArrayData.length &&  moment(registaration_date).unix();
            const insurance_date_check = tempArrayData.length && moment(insurance_date).unix();
            
            if(reg_date_check == insurance_date_check){
                tempArrayData[0].insUpto = "NA"
            }
            tempArrayData[0].address = "NA"
            if(user_id && user_id != "" && req.body.version_code && req.body.version_code >= version_code){
                tempArrayData[0].fitness_upto_reminder = false
                tempArrayData[0].insurance_reminder = false
                tempArrayData[0].puc_reminder = false
                tempArrayData[0].is_dashboard = false
                let userDocumentReminder = await RCReminder.findAll({
                    where : {
                        user_id : user_id,
                        reg_number : reg_number
                    }
                })
                if(userDocumentReminder && userDocumentReminder.length){
                    for (let i = 0; i < userDocumentReminder.length; i++) {
                        const element = userDocumentReminder[i];
                        if(element.doc_type == 3){
                            tempArrayData[0].puc_reminder = true
                        }
                        if(element.doc_type == 2){
                            tempArrayData[0].insurance_reminder = true
                        }
                        if(element.doc_type == 7){
                            tempArrayData[0].fitness_upto_reminder = true
                        }
                    }
                }

                let userDashboard  = await UserRegistration.findOne({
                    where: {
                      id: user_id,
                      vehicle_number: {
                        [Op.contains]: reg_number
                      }
                    },
                    attributes: ['id', 'vehicle_number']
                });
                if(userDashboard){
                    tempArrayData[0].is_dashboard = true
                }

                let userDocument = await getUserDocument(reg_number,user_id,userDashboard)
                _response ={
                    status:true,
                    response_code : 200,
                    response_message :"already exist",
                    data : tempArrayData,
                    user_document : userDocument
                }
                
            }else{
                _response = {
                    status:true,
                    response_code : 200,
                    response_message :"already exist",
                    data : tempArrayData,
                }
            }
            return res.send(_response)
        }
        let _response = {
            status:true,
            response_code : 200,
            response_message :"already exist",
            data : tempArrayData,
        }
        return res.send(_response)
    } catch (error) {
        console.log("------error",error);   
        return res.send({
            status: false,
            message: "Error Eccoured !"
        })
    }
}

const userSearchedNumberRemove = async(req,res) =>{
    try {
        const { user_id ,reg_number,language_key } = req.body
        if(!user_id){
            const response = {
                status : false,
                response_code : 400,
                response_message : 'User Id Field Required'
            }
            return res.send(response)
        }
        if(!reg_number){
            const response = {
                status : false,
                response_code : 400,
                response_message : 'Reg_numbers Field Required'
            }
            return res.send(response)
        }

        let user = await UserRegistration.findOne({
            where:{
                id : user_id
            }
        })
        if(!user){
            let message = await utils.translate('Data_Not_Found',language_key)
            const response = {
                status : false,
                response_code : 400,
                response_message : message
            }
            return res.send(response)
        }

        const old_num = user.vehicle_number.split(',');
        const new_num = old_num.filter(num => num !== reg_number);
        const vehicle_number = new_num.length > 0 ? new_num.join(',') : null;
        await UserRegistration.update({vehicle_number : vehicle_number},
            { 
                where:{
                    id : user_id
                }
            }
        )
        const response = {
            status: true,
            response_code: 200,
            response_message : 'Data Update Successfully'
        }

       return res.send(response)
    } catch (error) {
        console.log("------error",error);   
        return res.send({
            status: false,
            message: "Error Eccoured !"
        })
    }
}

const useSubscription = async(req,res) => {
    try {
        const { user_id ,is_subscribed,sku,purchase_time,is_free_trial,no_of_days,is_purchased } = req.body
        let currentDate
        if(!user_id){
            const response = {
                status :false,
                response_code : 400,
                response_message : 'User Id Field Required'
            }
            return res.send(response)
        }

        let exists = await UserRegistration.findOne({
            where : {
                id : user_id
            }
        })
        let data = {}
        let expiredate,numOfDay,expire
        if(exists){
            if(is_subscribed && is_subscribed == 'true' || is_subscribed && is_subscribed == true){
                if(sku && sku != 'com.rto.lifetime'){
                    if(!exists.expiry_date){
                        if(purchase_time){
                            let mil = purchase_time
                            let seconds = Math.ceil(mil / 1000);
                            currentDate = moment.unix(seconds).format('DD-MM-YYYY HH:mm:ss')
                        }else{      
                            currentDate = moment().format('DD-MM-YYYY HH:mm:ss')
                        }   
                        if((is_free_trial && is_free_trial == 'true' )|| (is_free_trial && is_free_trial == true)){
                            if(exists.is_free_trial != 1){
                                numOfDay = no_of_days;
                                if(!numOfDay){
                                    expiredate = moment(currentDate, 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY HH:mm:ss');
                                }else{
                                    expiredate = moment(currentDate, 'DD-MM-YYYY HH:mm:ss').add(numOfDay, 'days').format('DD-MM-YYYY HH:mm:ss');
                                }
                            }else{
                                currentDate = moment().format('DD-MM-YYYY HH:mm:ss');
                                if (moment(currentDate,'DD-MM-YYYY HH:mm:ss').unix()  > moment(exists.expiry_date,'DD-MM-YYYY HH:mm:ss').unix()) {
                                    if (exists.sku.indexOf('yearly') !== -1) {
                                        numOfDay = 365;
                                        expiredate =  moment(currentDate, 'DD-MM-YYYY HH:mm:ss').add(numOfDay, 'days').format('DD-MM-YYYY HH:mm:ss');
                                    }
                                    if (exists.sku.indexOf('monthly') !== -1) {
                                        numOfDay = 30;
                                        expiredate = moment(currentDate, 'DD-MM-YYYY HH:mm:ss').add(numOfDay, 'days').format('DD-MM-YYYY HH:mm:ss');
                                    }
                                } else {
                                    numOfDay = exists.no_of_days;
                                    expiredate = exists.expiry_date;
                                }
                            }
                        }else{
                            if (exists.sku.indexOf('yearly') !== -1) {
                                numOfDay = 365;
                                expiredate = moment(currentDate, 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY HH:mm:ss');
                            }
                            if (exists.sku.indexOf('monthly') !== -1) {
                                numOfDay = 30;
                                expiredate = moment(currentDate, 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY HH:mm:ss');
                            }
                        }
                    }else{
                        currentDate = moment().format('DD-MM-YYYY HH:mm:ss')
                        if (moment(currentDate,'DD-MM-YYYY HH:mm:ss').unix()  > moment(exists.expiry_date,'DD-MM-YYYY HH:mm:ss').unix()) {
                            console.log("=currentDate",currentDate);
                            if(exists.sku.indexOf('yearly') !== -1){
                                numOfDay = 365
                                expiredate = moment(currentDate, 'DD-MM-YYYY HH:mm:ss').add(numOfDay, 'days').format('DD-MM-YYYY HH:mm:ss');
                            }
                            if(exists.sku.indexOf('monthly') !== -1){
                                numOfDay = 365
                                expiredate = moment(currentDate, 'DD-MM-YYYY HH:mm:ss').add(numOfDay, 'days').format('DD-MM-YYYY HH:mm:ss');
                            }
                        }else{
                            expiredate = exists.expiry_date
                            numOfDay = exists.no_of_days
                        }
                    }
                }

                is_subscribed ? is_subscribed === "true" ? data.is_subscribed = 1 : data.is_subscribed = 0 : data.is_subscribed = 0
                is_free_trial ? is_free_trial === "true" ? data.is_free_trial = 1 : data.is_free_trial = 0 : data.is_free_trial = 0
                if(sku) {
                    data.sku = sku ? sku : null
                }else{
                    currentDate = moment().format('DD-MM-YYYY HH:mm:ss');
                    if (moment(currentDate,'DD-MM-YYYY HH:mm:ss').unix()  > moment(exists.expiry_date,'DD-MM-YYYY HH:mm:ss').unix()) {
                        expire = 1
                    }else{
                        data.sku = exists.sku
                    }
                }

                if(purchase_time){
                    data.purchase_time  = purchase_time ? purchase_time : null
                }else{
                    currentDate =  moment().format('DD-MM-YYYY HH:mm:ss');
                    if (moment(currentDate,'DD-MM-YYYY HH:mm:ss').unix()  > moment(exists.expiry_date,'DD-MM-YYYY HH:mm:ss').unix()) {
                        expire = 1
                    }else{
                        data.purchase_time = exists.purchase_time
                    }
                }
                data.expiry_date = expiredate ? expiredate :null
                data.no_of_days = numOfDay ? numOfDay : 0;

                if(expire){
                    data.is_subscribed = 0
                    data.is_free_trial = 0
                    data.sku = sku ? sku : null,
                    data.purchase_time = purchase_time ? purchase_time : null,
                    data.expiry_date = null

                }
            }else{
                if(exists.expiry_date){
                    is_subscribed ? is_subscribed === "true" ? data.is_subscribed = 1 : data.is_subscribed = 0 : data.is_subscribed = 0
                    is_free_trial ? is_free_trial === "true" ? data.is_free_trial = 1 : data.is_free_trial = 0 : data.is_free_trial = 0
                    data.sku = sku ? sku :null
                    data.purchase_time = purchase_time ? purchase_time : null
                    data.expiry_date = expiredate ? expiredate : null
                    data.no_of_days = numOfDay  ? numOfDay : 0
                }else{
                    currentDate =  moment().format('DD-MM-YYYY HH:mm:ss');
                    if (moment(currentDate,'DD-MM-YYYY HH:mm:ss').unix()  > moment(exists.expiry_date,'DD-MM-YYYY HH:mm:ss').unix()) {
                        is_subscribed ? is_subscribed === "true" ? data.is_subscribed = 1 : data.is_subscribed = 0 : data.is_subscribed = 0
                        is_free_trial ? is_free_trial === "true" ? data.is_free_trial = 1 : data.is_free_trial = 0 : data.is_free_trial = 0
                        data.sku = sku ? sku : null
                        data.purchase_time = purchase_time ? purchase_time : null
                        data.expiry_date = expiredate ? expiredate : null
                        data.no_of_days = numOfDay  ? numOfDay : 0
                    }
                }
            }
        }else{
            const response = {
                status: false,
                response_code : 400,
                response_message : 'User Not Register'
            }
            return res.status(200).send(response);
        }


        if (is_purchased && is_purchased === 'true') {
            data.is_purchased = 1;
        } else if (is_purchased === 'false') {
            data.is_purchased = 0;
        } else {
            data.is_purchased = 0;
        }

        if(data){
           return  res.send(data)
            console.log("==update data",data);
            await UserRegistration.update(data,{
                where :{ 
                    id : user_id
                }
            })
        }

        const _response  = {
            status : true,
            response_code : 200,
            response_message : 'Subscription Successfully'
        }
        return res.send(_response)

    } catch (error) {
        console.log("------error",error);   
        return res.send({
            status: false,
            message: "Error Eccoured !"
        })
    }
}



const deleteUserRecord = async(req,res) =>{
    try {
        const { user_id,language_key } = req.body
        if(!user_id){
            let message = await utils.translate('User_ID_Required',language_key)
            const response = {
                status :false,
                response_code : 400,
                response_message : message
            }
            return res.send(response)
        }

        let data = {}
        data.vehicle_number = null
        await UserRegistration.update(data,{
            where:{
                id : user_id
            }
        })

        let userDocument = await UserVehicleDocument.findAll({
            where:{
                user_id : user_id
            }
        })
        if(userDocument && userDocument.length){
            for (let i = 0; i < userDocument.length; i++) {
                const element = userDocument[i];
                if(element.image.indexOf('https://dairylock.sgp1.digitaloceanspaces.com') !== -1){
                    await files.fileDeleteDigitalOcean(element.image)
                }else if(element.image.indexOf('https://rtoapplication.sgp1.cdn.digitaloceanspaces.com') !== -1){
                    await files.fileDeleteDigitalOceanNew(element.image)
                }else{
                    await files.fileDeleteDigitalOcean(element.image)
                }
            }
        }

        await UserVehicleDocument.destroy({
            where:{
                user_id : user_id
            }
        });

        await RCReminder.destroy({
            where:{
                user_id : user_id
            }
        })

        const response = {
            status :true,
            response_code : 200,
            response_message : 'Record delete successfully'
        }

        return res.send(response)
    } catch (error) {
        console.log("------error",error);   
        return res.send({
            status: false,
            message: "Error Eccoured !"
        })
    }
}
const getData = async(req,res) => {
    try {
        // const response = await database.Vehicle.query("SELECT * FROM `ad_type`", { type: Sequelize.QueryTypes.SELECT})
        // const result = await AdType.findAll({})
        const tableName = "ad_type"
        const response = await database.Vehicle.query(`SELECT * FROM ${tableName} WHERE reg_no = :reg_no  LIMIT 1` , {  replacements: { reg_no: 'active' }, type: Sequelize.QueryTypes.SELECT})
        
        return res.json(response)
        // const response = await database.Vehicle.query("SELECT * FROM `ad_type`", { type: Sequelize.QueryTypes.SELECT})
    } catch (error) {
        console.log("===error",error);
    }
}

async function getUserDocument(regNumber,userId,userDashboard) {
    let res = {
        vehicle_driving_licence : [],
        vehicle_insurance: [],
        vehicle_pollution : [],
        vehicle_rc : [],
        vehicle_serviceLog : [],
        vehicle_other_document : []
    }

    let responseDocument = await UserVehicleDocument.findAll({
        where:{
            vehicle_number:regNumber,
            user_id:userId
        },
        attributes:['id','vehicle_number','image','title','description','date','count','type']
    })
    if((!userDashboard)){
        res = null
    }else{
        for (let i = 0; i < responseDocument.length; i++) {
            const element = responseDocument[i];
            if(element.type == 1){
                res.vehicle_driving_licence.push(element)
            }
            if(element.type == 2){
                res.vehicle_insurance.push(element)
            }
            if(element.type == 3){
                res.vehicle_pollution.push(element)
            }
            if(element.type == 4){
                res.vehicle_rc.push(element)
            }
            if(element.type == 5){
                res.vehicle_serviceLog.push(element)
            }
            if(element.type == 6){
                res.vehicle_other_document.push(element)
            }
        }
    }
    return res
}
// getData()
export default { 
    userVerification,
    getData,
    userDocumentUpload,
    userDocumentDelete,
    userDocumentEdit,
    userDocumentDeleteByNumber,
    userSearchedByNumberStore,
    userSearchedNumberRemove,
    useSubscription,
    deleteUserRecord 
}