import * as supertest from 'supertest';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

//define base url
const request = supertest(BASE_URL);
const queryParams:string = '?id=2';
const postIdVar = 1;

//describe block - explaining overall test
describe('POC Tests', ()=>{
    describe('GET REQUESTS',()=>{
        it('GET /posts', async ()=>{
            const response = await request.get('/posts');
            expect(response.statusCode).toBe(200);
            expect(response.body[0].title).toBe('sunt aut facere repellat provident occaecati excepturi optio reprehenderit');
            console.log('TEST TEST: :' + response.headers['content-type'])
        })
    
        it('GET /comments with query params', async ()=>{
            const response = await request.get('/comments'+queryParams);
            expect(response.body[0].id).toBe(2);
    
            //best way to do it - use .query() method, can add any paramters and values you need
            const responseTwo = await request.get('/comments').query({postId: postIdVar, limit:2});
            console.log(responseTwo)
            expect(responseTwo.body[0].postId).toBe(1);
            
        })
    })

    describe('POST REQUESTS', ()=>{
        const data = {title: "This is new!",body: "And I like it!",userId: 123,}
        it('POST /posts ', async ()=>{
            const response = await request.post('/posts').send(data).expect('Content-Type', /json/).expect(201);
    
            expect(response.body.body).toBe(data.body);
            console.log(response.body);
        })
    })

    describe('PUT METHODS', ()=>{
        const data = {title:"NEW TITLE TO UPDATE", body:"NEW BODY WHO DIS", userId:321};
        it('PUT /posts/{id} ', async ()=>{
            //do a get call for the data before PUT test - this is to later compare to ensure the values are not the same
            const getRes = await request.get('/posts/1');
            const beforeTitle = getRes.body.title;
            console.log(beforeTitle);

            const response = await request.put('/posts/1').send(data).expect(200);
            expect(beforeTitle).not.toBe(response.body.title);
            expect(response.body.title).toBe(data.title);

            //can potentially do another get call to ensure properly stored
        })
    })

    describe('PATCH REQUESTS', ()=>{
        it('PATCH /posts/{id}', async ()=>{
            const data = {title: "oh that's a cool title!"};
            
            const getRes = await request.get('/posts/1')
            const beforeBody = getRes.body;
            console.log(beforeBody.title);

            const response = await request.patch('/posts/1').send(data).expect(200);
            expect(response.body.title).not.toBe(beforeBody.title);
            expect(response.body.title).toBe(data.title);
            expect(response.body.body).toBe(beforeBody.body);
            console.log(response.body);
        })
    })

    describe('DELETE REQUEST', ()=>{
        const expected = {};
        it('DELETE /posts/{id}', async ()=>{
            const response = await request.delete('/posts/1').expect(200);
            expect(response.body).toEqual(expected)
            console.log(response.body)
        })
    })
})



