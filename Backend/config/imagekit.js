const Imagekit=require('imagekit');
 const imagekit=new Imagekit({
     publicKey:process.env.PUBLIC_KEY,
     privateKey:process.env.PRIVATE_KEY,
     urlEndpoint:process.env.URL_endpoint
 })

 module.exports=imagekit;
