import * as supertest from 'supertest';
import baseConfig from '../config/base.config';
const request = supertest(baseConfig.BASE_URL);

class CategoriesController{

    getCategories(){
        return request.get('/categories');
    }

    getCategoriesByID(id: string){
        return request.get(`/categories/${id}`);
    }
    /**
     * 
     * THIS REQUIRES AUTHENTICATION
     */
    postCategories(data: {[key: string]: string | number}){
        return request
        .post('/categories')
        .send(data);
    }
    /**
     * 
     * THIS REQUIRES AUTHENTICATION
     */
    putCategoriesByID(id: string, data: {[key: string]: string | number}){
        return request
        .put(`/categories/${id}`)
        .send(data);
    }
        /**
     * 
     * THIS REQUIRES AUTHENTICATION
     */
    deleteCategoriesByID(id: string){
        return request.delete(`/categories/${id}`);
    }

}

export default new CategoriesController;