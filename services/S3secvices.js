const AWS = require("aws-sdk");
require('dotenv').config();

exports.uploadToS3 = async (data, filename)=>{

    try{ 
         
    const bucketName = process.env.BUCKET_NAME;
  
    let s3Bucket = new AWS.S3({
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    });
  
    var params = {
      Bucket: bucketName,
      Key: filename,
      Body: data,
      ACL: "public-read",
    };
  
    return new Promise((resolve, reject) => {
      s3Bucket.upload(params, (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(res.Location);
        }
      });
    });
    }
    catch(err){
        console.log(err);
    }
}