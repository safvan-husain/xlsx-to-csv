const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');

module.exports = async function sendFiles(directoryPath, apiUrl) {
   const files = fs.readdirSync(directoryPath);
   const form = new FormData();

   files.forEach((file) => {
       const filePath = path.join(directoryPath, file);
       form.append('file', fs.createReadStream(filePath)); 
   });

   try {
       const result = await axios.post(apiUrl, form, {
           headers: form.getHeaders(),
       });
    
    //    console.log(result.response.status);
    
       return result.data;
   } catch (error) {
    console.log(error); 
   }
}
