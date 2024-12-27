import * as supertest from 'supertest'
import baseConfig from '../config/base.config'

const request = supertest(baseConfig.BASE_URL);
const fileFolder = './upload_files/';

class UploadsController{


    postUploadSingle(filePath: string){
        //.attach(FIELD: this is the -F parameter in swagger (single), FILEPATH)
        return request.post('/upload/single').attach('single',fileFolder+filePath);
    }

    postUploadSingleWrongContentType(filePath: string){
        //.attach(FIELD: this is the -F parameter in swagger (single), FILEPATH)
        return request.post('/upload/single').attach('single',fileFolder+filePath,'application/json');
    }

    postUploadMultiple(filePaths: string[]){

        //store base post method into const req variable
        const req = request.post('/upload/multiple');
        //loop through each item of the array and make a .attach() call against the req variable
        filePaths.forEach(file =>{
            req.attach('multiple',fileFolder+file);
        })

        return req;

    }

}

export default new UploadsController();