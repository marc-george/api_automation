import * as supertest from "supertest";
import config from '../config/base.config'
//const BASE_URL = 'https://practice-react.sdetunicorns.com/api/test';
const request = supertest(config.BASE_URL);

//setup brand controller methods

class BrandController{

    getBrands(){
        return request.get('/brands');
    }

    getBrandById(id: string){
        return request.get(`/brands/${id}`);
    }

    postBrands(data: {[key: string]: string}){
        return request
        .post('/brands')
        .send(data);
    }

    putBrands(id: string, data: {[key: string]: string | number}){
        return request
        .put(`/brands/${id}`)
        .send(data);
    }

    deleteBrands(id: string){
        return request.delete(`/brands/${id}`)
    }
}

export default new BrandController();