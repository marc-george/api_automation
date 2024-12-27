import adminController from "../controller/admin.controller";
import categoriesController from "../controller/categories.controller";

export const login = async (email: string, password: string) => {
    const body = {
        email: email,
        password: password
    }

    const response = await adminController.postAdminLogin(body);
    return response.body.token;
}


export const getCategoryID = async (token: string)=>{

    const body = {name: 'Category Name: ' +Math.floor(Math.random()*10000)}
    const res = await categoriesController
        .postCategories(body)
        .set("Authorization", `Bearer: ${token}`);

    return res.body._id;
}

export const deleteCategory = async (categoryID: string, token: string) =>{
    return await categoriesController
        .deleteCategoriesByID(categoryID)
        .set("Authorization", `Bearer: ${token}`);
}

