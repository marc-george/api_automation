import uploadsController from "../controller/uploads.controller";

describe('File upload tests', ()=>{
    
    const pngFile = 'SFR.png';
    const txtFile = 'test.txt';
    const fileArray = [pngFile,txtFile];
    describe('Single file upload', ()=>{
        //should send 200 OK and mimetype "image/png", filename "name_of_file", size "size_of_file", "_id", "__v",
        it("should upload png file and return 200 OK and four properties 'mimetype, filename, size, _id' - POST /upload/single", async ()=>{
            const response = await uploadsController.postUploadSingle(pngFile);
            console.log(response.body);
            expect(response.status).toEqual(200);
            expect(Object.keys(response.body)).toEqual(['mimetype', 'filename', 'size', '_id', '__v']);
            expect(response.body.filename).toEqual(pngFile);
            expect(response.body.size).toEqual("6683");
        })

        it("should upload txt file and return 200 OK and four properties 'mimetype, filename, size, _id' - POST /upload/single", async ()=>{
            const response = await uploadsController.postUploadSingle(txtFile);
            console.log(response.body);
            expect(response.status).toEqual(200);
            expect(Object.keys(response.body)).toEqual(['mimetype', 'filename', 'size', '_id', '__v']);
            expect(response.body.filename).toEqual(txtFile);
            expect(response.body.size).toEqual("0");
        })

        //should send back error if content type not multipart/form-data
    })

    describe('Multiple file upload', ()=>{
                //should send 200 OK and mimetype "image/png", filename "name_of_file", size "size_of_file", "_id", "__v",
                it("should upload png file and return 200 OK and four properties 'mimetype, filename, size, _id' - POST /upload/single", async ()=>{
                    const response = await uploadsController.postUploadMultiple(fileArray);
                    console.log(response.body);
                    expect(response.status).toEqual(200);
                    expect(Object.keys(response.body[0])).toEqual(['mimetype', 'filename', 'size', '_id', '__v']);
                    expect(response.body.length).toEqual(2)
                    expect(response.body[0].filename).toEqual(fileArray[0]);
                    expect(response.body[1].filename).toEqual(fileArray[1]);
                    expect(response.body[0].size).toEqual("6683");
                    expect(response.body[1].size).toEqual("0");
                })
    })
})