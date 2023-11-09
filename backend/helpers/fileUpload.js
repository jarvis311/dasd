import AWS from 'aws-sdk'

//upload file digitalocean
async function fileUploadWithDigitalOceanOld(file,foldername) {
    try {
        const extension = file.name.split(".")
        const fileName = `${Math.floor(Math.random() * 9000000000) + 1000000000}${Date.now()}.${extension[extension.length - 1]}`;
        const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT);
        const s3 = new AWS.S3({
            endpoint: spacesEndpoint,
            accessKeyId: process.env.DO_SPACES_KEY,
            secretAccessKey: process.env.DO_SPACES_SECRET,
        });
    
        let destination
        if (foldername == "") {
            destination = `${process.env.DO_SPACE_FOLDER_DIGITAL}/${fileName}`
        }
        else {
            destination = `${process.env.DO_SPACE_FOLDER_DIGITAL}/${foldername}/${fileName}`
        }
        const digiCridential = {
            Bucket: process.env.DO_SPACES_BUCKET,
            folder: process.env.DO_SPACE_FOLDER_DIGITAL,
            Key: destination,
            Body: file.data,
            ACL: "public-read",
            region: process.env.DO_SPACES_REGION
        }
        const dataLoc = await s3.upload(digiCridential).promise()
        if(dataLoc){
            return {
                status : true,
                image : dataLoc.Location
            }
        }else{
            return {
                status : false,
            }
        }
    } catch (error) {
        if(error){
            return {
                status : false
            }
        }
        return error
    }

}
async function fileUploadWithDigitalOcean(file,foldername) {
    try {
        const fileName = Math.floor(Math.random() * 100000) + Date.now() + "." + file.name.split(".").pop();
        const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT_NEW);
        const s3 = new AWS.S3({
            endpoint: spacesEndpoint,
            accessKeyId: process.env.DO_SPACES_KEY_NEW,
            secretAccessKey: process.env.DO_SPACES_SECRET_NEW,
        });
    
        let destination
        if (foldername == "") {
            destination = `${process.env.DO_SPACE_FOLDER_NEW}/${fileName}`
        }
        else {
            destination = `${process.env.DO_SPACE_FOLDER_NEW}/${foldername}/${fileName}`
        }
        const digiCridential = {
            Bucket: process.env.DO_SPACES_BUCKET_NEW,
            folder: process.env.DO_SPACE_FOLDER_NEW,
            Key: destination,
            Body: file.data,
            ACL: "public-read",
            region: process.env.DO_SPACES_REGION_NEW
        }
        const dataLoc = await s3.upload(digiCridential).promise()
        if(dataLoc){
            return {
                status : true,
                image : (dataLoc.Location).replace("https://rtoapplication.sgp1.digitaloceanspaces.com/",process.env.DO_SPACES_BASE_URL_NEW)
            }
        }else{
            return {
                status : false,
            }
        }
    } catch (error) {
        if(error){
            return {
                status : false
            }
        }
        return error
    }

}


// delete file digitalOcean
async function fileDeleteDigitalOceanNew(image) {
    const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT_NEW);
    const s3 = new AWS.S3({
        endpoint: spacesEndpoint,
        accessKeyId: process.env.DO_SPACES_KEY_NEW,
        secretAccessKey: process.env.DO_SPACES_SECRET_NEW,
    });
    const folder = "vehicle_document"
    if (folder == "") {
        var filename = image.split("/")
        var destination = `${process.env.DO_SPACE_FOLDER_NEW}/${filename[filename.length - 1]}`
    }
    else {
        var filename = image.split("/")
        var destination = `${process.env.DO_SPACE_FOLDER_NEW}/${folder}/${filename[filename.length - 1]}`
    }
    const digiCridential = {
        Bucket: process.env.DO_SPACES_BUCKET_NEW,
        Key: destination,
    }
    // const dataLoc = await s3.deleteObject(digiCridential).promise()
    const _result = await s3.deleteObject(digiCridential, function(deleteErr, data) {
        if (deleteErr) {
            return false
        }
        else {
            console.log('Successfully deleted the item');
            return true
        }
      });
    return _result
}

async function fileDeleteDigitalOcean(image) {
    const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT);
    const s3 = new AWS.S3({
        endpoint: spacesEndpoint,
        accessKeyId: process.env.DO_SPACES_KEY,
        secretAccessKey: process.env.DO_SPACES_SECRET,
    });
    const folder = "vehicle_document"
    const filename = image.split("/")
    const destination = `${process.env.DO_SPACE_FOLDER_DIGITAL}/${folder}/${filename[filename.length - 1]}`
    const digiCridential = {
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: destination,
    }
    const _result = await s3.deleteObject(digiCridential, function(deleteErr, data) {
        if (deleteErr) {
            return false
        }
        else {
            console.log('Successfully deleted the item');
            return true
        }
      });
    return _result
    
}

// edit file digitalOcean
async function fileEditDigitaOcean(image,folder,oldFile) {
    if(oldFile){
        const _deleteImage = await fileDeleteDigitalOcean(oldFile)
    }
    const _imageUpload = await fileUploadWithDigitalOceanOld(image,folder)
    return _imageUpload
}

async function fileEditDigitaOceanNew(image,folder,oldFile) {
    if(oldFile){
        const _deleteImage = await fileDeleteDigitalOceanNew(oldFile)
    }
    const _imageUpload = await fileUploadWithDigitalOcean(image,folder)
    return _imageUpload;
}

async function affilationEditFileUpload(image,folder,oldFile){
    if(oldFile && oldFile !=""){
        const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT_NEW);
        const s3 = new AWS.S3({
            endpoint: spacesEndpoint,
            accessKeyId: process.env.DO_SPACES_KEY_NEW,
            secretAccessKey: process.env.DO_SPACES_SECRET_NEW,
        });
        let destination
        if (folder == "") {
            const filename = oldFile.split("/")
            destination = `${process.env.DO_SPACE_FOLDER_NEW}/${filename[filename.length - 1]}`
        }
        else {
            const filename = oldFile.split("/")
            destination = `${process.env.DO_SPACE_FOLDER_NEW}/${folder}/${filename[filename.length - 1]}`
        }
        const digiCridential = {
            Bucket: process.env.DO_SPACES_BUCKET_NEW,
            Key: destination,
        }
        const dataLoc = await s3.deleteObject(digiCridential).promise()
    }
    const fileName = Math.floor(Math.random() * 100000) + Date.now() + "." + image.name.split(".").pop();
    const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT_NEW);
    const s3 = new AWS.S3({
        endpoint: spacesEndpoint,
        accessKeyId: process.env.DO_SPACES_KEY_NEW,
        secretAccessKey: process.env.DO_SPACES_SECRET_NEW,
    });

    let destination
    if (folder == "") {
        destination = `${process.env.DO_SPACE_FOLDER_NEW}/${fileName}`
    }
    else {
        destination = `${process.env.DO_SPACE_FOLDER_NEW}/${folder}/${fileName}`
    }
    const digiCridential = {
        Bucket: process.env.DO_SPACES_BUCKET_NEW,
        folder: process.env.DO_SPACE_FOLDER_NEW,
        Key: destination,
        Body: image.data,
        ACL: "public-read",
        region: process.env.DO_SPACES_REGION_NEW
    }
    const dataLoc = await s3.upload(digiCridential).promise()
    if(dataLoc){
        return {
            status : true,
            image : (dataLoc.Location).replace("https://rtoapplication.sgp1.digitaloceanspaces.com/",process.env.DO_SPACES_BASE_URL_NEW)
        }
    }else{
        return {
            status : false,
        }
    }
}
export default {
    fileUploadWithDigitalOcean,
    fileDeleteDigitalOcean,
    fileDeleteDigitalOceanNew,
    fileEditDigitaOcean,
    fileEditDigitaOceanNew,
    fileUploadWithDigitalOceanOld,
    affilationEditFileUpload
}