import categoriesController from "../controller/categories.controller";
import authConfig from "../config/auth.config";
import { deleteCategory, getCategoryID, login} from "../utils/helper";



describe('Categories Tests', ()=>{
    const data = {
        name: 'Test Category Name: '+Math.floor(Math.random()*10000)
    }

    const loginData = {
        email: authConfig.email,
        password: authConfig.password
    }

    const putData = {
        name: 'Updated Name: ' +Math.floor(Math.random()*10000)
    }

    describe('Get categories', ()=>{
        let categoryID;
        let newCategory;
        let token;

        beforeAll(async ()=>{
            try{
                token = await login(loginData.email, loginData.password);
                newCategory = await categoriesController.postCategories(data).set("Authorization", `Bearer: ${token}`);
                categoryID = newCategory.body._id;
            }catch(e){
                console.log('Token was unable to be retrieved: '+e);
            }
        })

        afterAll(async ()=>{
            await deleteCategory(categoryID, token);
        })

        it('should return all categories - GET /categories', async ()=>{
            const response = await categoriesController.getCategories();
            expect(response.status).toEqual(200);
            expect(response.body.length).toBeGreaterThan(1);
            expect(response.headers['content-type']).toContain('application/json');
            expect(Object.keys(response.body[0])).toEqual(['_id', 'name']);
        })

        //should return an individual category by id = get categories by id
        it("should return an individual category by id = get categories by id", async ()=>{
            const response = await categoriesController.getCategoriesByID(categoryID);
            console.log(categoryID);
            console.log(response.body);
            expect(response.status).toEqual(200);
            expect(response.body._id).toEqual(categoryID);
            expect(response.body.name).toEqual(newCategory.body.name);
        })

        //should have a body of 3 properties - "_id", "name", "__v"

        //should throw 404 error if category is not found - get categories by wrong id

        //should throw (?) error if category is not a string

        //should throw (?) error if accept header is not application/json

    })

    describe('Create categories', ()=>{

        let token: string;

        beforeAll(async ()=>{
            try{
                token = await login(loginData.email, loginData.password);
            }catch(e){
                console.log('Token was unable to be retrieved: '+e);
            }
        })

        it('should return 200 and category name/id when category is created - POST /categories', async ()=>{
            const response = await categoriesController.postCategories(data).set('Authorization', `Bearer: ${token}`);
            // const response = await createNewCategory(data, token)
            console.log(response.body);

            expect(response.status).toEqual(200);
            expect(response.body).toHaveProperty("name", data.name);
            expect(response.body._id).toBeDefined();
            // expect(response.body).toHaveProperty

        })

        it('should return 403 and access denied error if authentication not provided - POST /categories', async ()=>{
            const response = await categoriesController.postCategories(data);
            expect(response.status).toEqual(403);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toEqual('Access denied. User does not have permissions.');
        })


        //should return 422 status code and already exist error if category already created

        //should return (?) status code & error if request header added that is not allowed

        //should return (?) status code & error if category name not minimum length

        //should return (?) status code & error if category name greater than maximum length

        //should return (?) status code & error if category "name" is not a string

        //should return (?) status code & error if category "name" is not defined

        //should return (?) status code & error if category properties more than just "name" 
    })

    describe('Update categories', ()=>{

        // let categoryBody;
        let token;
        let categoryID;

        beforeAll(async ()=>{
            //get token and creat/retrieve category ID
            try{
                token = await login(loginData.email, loginData.password);
                categoryID = await getCategoryID(token);
            }catch(e){
                console.log('Token was unable to be retrieved: '+e);
            }
        })
        //delete category
        afterAll(async ()=>{
            await deleteCategory(categoryID, token);
        })
        //should update categories id and assert category details "_id", "name", "__v"
        it('should update categories id and assert category details - PUT /categories/:id', async ()=>{
            const response = await categoriesController.putCategoriesByID(categoryID, putData).set("Authorization", `Bearer: ${token}`);
            expect(response.body.name).toEqual(putData.name);
            expect(response.body._id).toEqual(categoryID);
            expect(response.body.__v).toEqual(0);
        })

    })

    describe('Delete categories', ()=>{
                let token;
                let categoryID;
        
                beforeAll(async ()=>{
                    try{
                        token = await login(loginData.email, loginData.password);
                        categoryID = await getCategoryID(token);
                    }catch(e){
                        console.log('Token was unable to be retrieved: '+e);
                    }
                })
        
                //should update categories id and assert category details "_id", "name", "__v"
                it('should delete category by id and assert null response - DELETE /categories/:id', async ()=>{
                    const response = await deleteCategory(categoryID, token);
                    console.log(response.body)
                    expect(response.status).toEqual(200);
                })
    })

})