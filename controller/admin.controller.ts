import * as supertest from 'supertest';
import baseConfig from '../config/base.config';
const request = supertest(baseConfig.BASE_URL);

class AdminController{


    postAdminLogin(data: {[key: string]: string | number}){
        return request
        .post('/admin/login')
        .send(data);
    }

}

export default new AdminController;