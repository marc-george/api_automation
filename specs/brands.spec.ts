import * as supertest from "supertest";
// import * as brands_data from '../test_data/brands_tests.json';
const brands_data = require("../test_data/brands_tests.json");

//define and set base url
const BASE_URL = 'https://practice-react.sdetunicorns.com/api/test';
const request = supertest(BASE_URL);

//create beforeAll() hook for: 
    //POST /brands - create brand
    //GET /brands/:id - pass the response data to other tests



describe('BRANDS TESTS - Optimizing flow + overview', ()=>{

    const noBrandID = '64b8871f49e85607248e2b46';
    const longBrandNamePut = {name: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ12345'};
    const nonStringBrandDescription = {name: "Description is not a string", description: 12345};
    let postBrandBody;

    describe('Create, Fetch, Update, and Delete Brands', ()=>{


        describe('POST /brands', ()=>{
            let postBrand;
            const postData_nameMissing = {
                'description': 'Test Brand Description'
            };
        
            const postData_nameEmpty = {
                'name': '',
                'description': 'Test Brand Description'
            };
        
            const postData_nameMinCharCheck = {
                'name': 'T',
                'description': 'Test Brand Description'
            };

            const data = {
                name: "For Testing "+Math.floor(Math.random()*100000),
                description: "New Brand For Testing"
            }

            beforeAll(async ()=>{
                postBrand = await request
                    .post('/brands')
                    .send(data);
            })

            afterAll(async ()=>{
                await request.delete(`/brands/${postBrand.body._id}`);
            })
            it('POST /brands to insert a new brand', async ()=>{
                //will do asserts on the beforeAll!
                //assert 200
                expect(postBrand.status).toEqual(200);
                //assert value for name
                expect(postBrand.body.name).toEqual(data.name);
                //property exists for 'createdAt'
                expect(postBrand.body).toHaveProperty('createdAt');

            })

            it('POST /brands request - name property is mandatory', async ()=>{
                const response = await request.post('/brands').send(postData_nameMissing);
                //expect 422
                expect(response.status).toEqual(422);
                expect(response.body).toHaveProperty('error');
                expect(response.body.error).toEqual("Name is required");
            })
    
            it('POST /brands request - name property cannot be empty', async ()=>{
                const response = await request.post('/brands').send(postData_nameEmpty);
                //expect 422
                expect(response.status).toEqual(422);
                expect(response.body).toHaveProperty('error');
                expect(response.body.error).toEqual("Name is required");
            })
    
            it('POST /brands request - name min char should be >1', async ()=>{
                const response = await request.post('/brands').send(postData_nameMinCharCheck);
                //expect 422
                expect(response.status).toEqual(422);
                expect(response.body).toHaveProperty('error');
                expect(response.body.error).toEqual("Brand name is too short");
            })

            it('POST /brands - duplicate entries not allowed', async ()=>{
                //second request
                const response = await request.post('/brands').send(data);
                expect(response.status).toEqual(422);
                expect(response.body).toHaveProperty('error');
                expect(response.body.error).toEqual(`${postBrand.body.name} already exists`);
            })
        })

        describe('GET /brand/:id', ()=>{
            let postBrand;

            beforeAll(async ()=>{
                const data = {
                    name: "For Testing "+Math.floor(Math.random()*100000),
                    description: "New Brand For Testing"
                }
            
                postBrand = await request
                    .post('/brands')
                    .send(data);

            })

            afterAll(async ()=>{
                await request.delete(`/brands/${postBrand.body._id}`);
            })  

            it('GET /brands by {id}', async ()=>{
                const response = await request.get(`/brands/${postBrand.body._id}`);
                //assert 200
                expect(response.status).toEqual(200);
                //assert name is as expected
                expect(response.body.name).toEqual(postBrand.body.name)
            })

            it('GET /brands/:id - throw error if brand does not exist', async ()=>{
                //brand not found error
                const firstResponse = await request.get(`/brands/${noBrandID}`);
                expect(firstResponse.status).toEqual(404);
                expect(firstResponse.body).toHaveProperty('error');
                expect(firstResponse.body.error).toEqual('Brand not found.');
                //unable to fetch brand error
                const secondResponse = await request.get(`/brands/${noBrandID}a`);
                expect(secondResponse.status).toEqual(422);
                expect(secondResponse.body).toHaveProperty('error');
                expect(secondResponse.body.error).toEqual('Unable to fetch brand');
            })

        })

        describe('PUT /brands/:id', ()=>{
            let postBrand;

            const data = {
                name: "For Testing "+Math.floor(Math.random()*100000),
                description: "New Brand For Testing"
            }

        
            const postData2 = {
                'name': 'Test Brand '+Math.floor(Math.random() * 1000000),
                'description': 'Test Brand Description'
            };
        
            const postData3 = {
                'name': 'Test Brand '+Math.floor(Math.random() * 1000000),
                'description': 'Test Brand Description'
            };
        
            const putData = {
                'name': data.name+': updated',
                'description': 'Test Brand Update'
            };

            beforeAll(async ()=>{

                postBrand = await request
                    .post('/brands')
                    .send(data);
            })
            afterAll(async ()=>{
                await request.delete(`/brands/${postBrand.body._id}`);
            })
            it('PUT /brands/{id}', async ()=>{
                const putRes = await request
                    .put(`/brands/${postBrand.body._id}`)
                    .send(putData);
                expect(putRes.status).toEqual(200);
                expect(putRes.body.name).not.toEqual(data.name);
                expect(putRes.body.name).toEqual(putData.name);
                expect(putRes.body.description).toEqual(putData.description);
                console.log(putRes.body);
            })

            it('PUT /brands - brand name > 30 chars is not accepted', async ()=>{
                //post request to add brand and grab ID
                const postResponse = await request.post('/brands').send(postData2);
                console.log(postResponse.body);
                expect(postResponse.status).toEqual(200);
                postBrandBody = postResponse.body;
                //put request to update brand name > 30 char
                const putResponse = await request.put(`/brands/${postBrandBody._id}`).send(longBrandNamePut);
                expect(putResponse.status).toEqual(422);
                expect(putResponse.body).toHaveProperty('error');
                expect(putResponse.body.error).toEqual('Brand name is too long');
            })
    
            it('PUT /brands - brand name must be a string', async ()=>{
                //post request to add brand and grab ID
                const postResponse = await request.post('/brands').send(postData3);
                console.log(postResponse.body);
                expect(postResponse.status).toEqual(200);
                postBrandBody = postResponse.body;
                
                const response = await request.put(`/brands/${postBrandBody._id}`).send(nonStringBrandDescription);
                expect(response.status).toEqual(422);
                expect(response.body).toHaveProperty('error');
                expect(response.body.error).toEqual('Brand description must be a string');
            })
    
            it('PUT /brands/:id - throw error when updating invalid brand', async ()=>{
                const responseFirst = await request.put(`/brands/${noBrandID}`).send(data);
                expect(responseFirst.status).toEqual(404);
                expect(responseFirst.body).toHaveProperty('error');
                expect(responseFirst.body.error).toEqual('Brand not found.');
    
                const responseSecond = await request.put(`/brands/${noBrandID}a`).send(data);
                expect(responseSecond.status).toEqual(422);
                expect(responseSecond.body).toHaveProperty('error');
                expect(responseSecond.body.error).toEqual('Unable to update brands');
            } )

        })

        describe('DELETE /brands/:id', ()=>{
            let postBrand;
            let deleteBrand;
            beforeAll(async ()=>{
                const data = {
                    name: "For Testing "+Math.floor(Math.random()*100000),
                    description: "New Brand For Testing"
                }
            
                postBrand = await request
                    .post('/brands')
                    .send(data);

            })
            // afterAll(async ()=>{
            //     deleteBrand = await request.delete(`/brands/${postBrand.body._id}`);
            //     expect(deleteBrand.body).toBeNull();
            // })
            it('DELETE /brands/{id}', async ()=>{
                //delete
                deleteBrand = await request.delete(`/brands/${postBrand.body._id}`);
                expect(deleteBrand.body).toBeNull();
            })

            it('DELETE /brands/:id - throw error when deleting invalid brand', async ()=>{
                const responseFirst = await request.delete(`/brands/${noBrandID}`);
                expect(responseFirst.status).toEqual(404);
                expect(responseFirst.body).toHaveProperty('error');
                expect(responseFirst.body.error).toEqual('Brand not found.');
    
                const responseSecond = await request.delete(`/brands/${noBrandID}a`);
                expect(responseSecond.status).toEqual(422);
                expect(responseSecond.body).toHaveProperty('error');
                expect(responseSecond.body.error).toEqual('Unable to delete brand');
            } )
        })
    })


//     describe.skip('Fetch Brands', ()=>{
//         //get brands - returns a list of all the brands
//         //assertions: 200 response, list items > 1, properties to include "_id" and "name"
//         it('GET /brands and verify response, list item count, and id/name properties', async ()=>{
//             const response = await request.get('/brands');
//             //200
//             expect(response.status).toBe(200);
//             //list items > 1
//             const responseBodyCount = response.body.length;
//             expect(responseBodyCount).toBeGreaterThan(1);
//             //properties to include "_id" and "name"
//             // expect(response.body[0]._id).toBeTruthy();
//             // expect(response.body[0].name2).toBeTruthy();
//             expect(Object.keys(response.body[0])).toEqual(['_id', 'name']);
//             // console.log(response.body[0]._id + " : " + response.body[0].name)
//         })

//         it('GET /brands by {id}', async ()=>{
//             const response = await request.get(`/brands/66ea389a986188d4dce4e8bc`);
//             //assert 200
//             expect(response.status).toEqual(200);
        
//             //assert name is as expected
//             //expect(response.body.name).toEqual(postData.name)
//         })
//     })


//     describe.skip('Update Brands', ()=>{
//         it('PUT /brands/{id} and delete /brands/{id}', async ()=>{
//             const getRes = await request.get(`/brands/${brands_data.get_data[0].id}`);
//             const getBody = getRes.body;
//             console.log(getBody);

//             const putRes = await request
//                 .put(`/brands/${brands_data.get_data[0].id}`)
//                 .send(brands_data.put_data);
//             expect(putRes.status).toEqual(200);
//             expect(putRes.body.name).not.toEqual(getBody.name);
//             expect(putRes.body.name).toEqual(brands_data.put_data.name);
//             expect(putRes.body.description).toEqual(brands_data.put_data.description);
//             console.log(putRes.body);
//         })
//     })


//     describe.skip('Delete Brands', ()=>{
//         it('DELETE /brands/{id}', async ()=>{
//             const putID = "66ea389a986188d4dce4e8bc"
//             //delete
//             const delRes = await request.delete(`/brands/${putID}`);
//             console.log(delRes.body);

//         })
//     })

// })

// describe('Schema Validation, Business Logic Validation, and Negative Tests', ()=>{

//     const postData_nameMissing = {
//         'description': 'Test Brand Description'
//     };

//     const postData_nameEmpty = {
//         'name': '',
//         'description': 'Test Brand Description'
//     };

//     const postData_nameMinCharCheck = {
//         'name': 'T',
//         'description': 'Test Brand Description'
//     };

//     const postData = {
//         'name': 'Test Brand '+Math.floor(Math.random() * 1000000),
//         'description': 'Test Brand Description'
//     };

//     const postData2 = {
//         'name': 'Test Brand '+Math.floor(Math.random() * 1000000),
//         'description': 'Test Brand Description'
//     };

//     const postData3 = {
//         'name': 'Test Brand '+Math.floor(Math.random() * 1000000),
//         'description': 'Test Brand Description'
//     };

//     const putData = {
//         'name': 'Test Brand '+Math.floor(Math.random() * 1000000),
//         'description': 'Test Brand Description'
//     };

//     const noBrandID = '64b8871f49e85607248e2b46';
//     const longBrandNamePut = {name: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ12345'};
//     const nonStringBrandDescription = {name: "Description is not a string", description: 12345};
//     let postBrandBody;


//     describe('Schema Validation', ()=>{
//         it('POST /brands request - name property is mandatory', async ()=>{
//             const response = await request.post('/brands').send(postData_nameMissing);
//             //expect 422
//             expect(response.status).toEqual(422);
//             expect(response.body).toHaveProperty('error');
//             expect(response.body.error).toEqual("Name is required");
//         })

//         it('POST /brands request - name property cannot be empty', async ()=>{
//             const response = await request.post('/brands').send(postData_nameEmpty);
//             //expect 422
//             expect(response.status).toEqual(422);
//             expect(response.body).toHaveProperty('error');
//             expect(response.body.error).toEqual("Name is required");
//         })

//         it('POST /brands request - name min char should be >1', async ()=>{
//             const response = await request.post('/brands').send(postData_nameMinCharCheck);
//             //expect 422
//             expect(response.status).toEqual(422);
//             expect(response.body).toHaveProperty('error');
//             expect(response.body.error).toEqual("Brand name is too short");
//         })

//     })

//     describe('Business Logic Validation', ()=>{
//         //checks if an API follows the apps core fules and requirements, making sur eit behaves as expected in real world scenarios

//         //duplicate brand entries not allowed
//         it('POST /brands - duplicate entires not allowed', async ()=>{
//             //first request
//             const firstResponse = await request.post('/brands').send(postData);
//             expect(firstResponse.status).toEqual(200);
//             //second request
//             const secondResponse = await request.post('/brands').send(postData);
//             expect(secondResponse.status).toEqual(422);
//             expect(secondResponse.body).toHaveProperty('error');
//             expect(secondResponse.body.error).toEqual(`${postData.name} already exists`);
//         })

//         it('GET /brands/:id - throw error if brand does not exist', async ()=>{
//             //brand not found error
//             const firstResponse = await request.get(`/brands/${noBrandID}`);
//             expect(firstResponse.status).toEqual(404);
//             expect(firstResponse.body).toHaveProperty('error');
//             expect(firstResponse.body.error).toEqual('Brand not found.');
//             //unable to fetch brand error
//             const secondResponse = await request.get(`/brands/${noBrandID}a`);
//             expect(secondResponse.status).toEqual(422);
//             expect(secondResponse.body).toHaveProperty('error');
//             expect(secondResponse.body.error).toEqual('Unable to fetch brand');
//         })
//     })

//     describe('Negative Testing Exercise', ()=>{

//         //Schema Validation - PUT /brands request
//         //Brand name > 30 chars is not accepted
//         //Brand description must be a string

//         it('PUT /brands - brand name > 30 chars is not accepted', async ()=>{
//             //post request to add brand and grab ID
//             const postResponse = await request.post('/brands').send(postData2);
//             console.log(postResponse.body);
//             expect(postResponse.status).toEqual(200);
//             postBrandBody = postResponse.body;
//             //put request to update brand name > 30 char
//             const putResponse = await request.put(`/brands/${postBrandBody._id}`).send(longBrandNamePut);
//             expect(putResponse.status).toEqual(422);
//             expect(putResponse.body).toHaveProperty('error');
//             expect(putResponse.body.error).toEqual('Brand name is too long');
//         })

//         it('PUT /brands - brand name must be a string', async ()=>{
//             //post request to add brand and grab ID
//             const postResponse = await request.post('/brands').send(postData3);
//             console.log(postResponse.body);
//             expect(postResponse.status).toEqual(200);
//             postBrandBody = postResponse.body;
            
//             const response = await request.put(`/brands/${postBrandBody._id}`).send(nonStringBrandDescription);
//             expect(response.status).toEqual(422);
//             expect(response.body).toHaveProperty('error');
//             expect(response.body.error).toEqual('Brand description must be a string');
//         })

//         it('PUT /brands/:id - throw error when updating invalid brand', async ()=>{
//             const responseFirst = await request.put(`/brands/${noBrandID}`).send(putData);
//             expect(responseFirst.status).toEqual(404);
//             expect(responseFirst.body).toHaveProperty('error');
//             expect(responseFirst.body.error).toEqual('Brand not found.');

//             const responseSecond = await request.put(`/brands/${noBrandID}a`).send(postData);
//             expect(responseSecond.status).toEqual(422);
//             expect(responseSecond.body).toHaveProperty('error');
//             expect(responseSecond.body.error).toEqual('Unable to update brands');
//         } )

//         it('DELETE /brands/:id - throw error when deleting invalid brand', async ()=>{
//             const responseFirst = await request.delete(`/brands/${noBrandID}`);
//             expect(responseFirst.status).toEqual(404);
//             expect(responseFirst.body).toHaveProperty('error');
//             expect(responseFirst.body.error).toEqual('Brand not found.');

//             const responseSecond = await request.delete(`/brands/${noBrandID}a`);
//             expect(responseSecond.status).toEqual(422);
//             expect(responseSecond.body).toHaveProperty('error');
//             expect(responseSecond.body.error).toEqual('Unable to delete brand');
//         } )

//     })

})
