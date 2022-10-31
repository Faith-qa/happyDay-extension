const {Jimp} = require("jimp");

const {fs} = require('fs')
//import axios, {AxiosResponse} from 'axios'
  const filterImageUrl = async(imageurl) =>{
    try {
        const imagedata = await axios({
            method: "get",
            url: imageurl,
            responseType: "arraybuffer"
        });

        const photo = await Jimp.read(imagedata.data);
        const outpath =
          "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
        await photo
          .resize(256, 256) // resize
          .quality(60) // set JPEG quality
          .greyscale() // set greyscale
          .write(__dirname + outpath, (img) => {
            resolve(__dirname + outpath);
          });

    
    }catch(error) {
        console.log(error);

    }
  }
  
  const deleteLocalFiles = async (files) => {
    for (let file of files) {
        fs.unlink(file)
    }
  }
 

  module.exports= {
    filterImageUrl,
    deleteLocalFiles,
  }