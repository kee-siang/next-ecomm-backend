import { PrismaClient, Prisma } from '@prisma/client'
import request from "supertest"
import app from "../../app.js"

async function cleanupDatabase() {
  const prisma = new PrismaClient();
  const modelNames = Prisma.dmmf.datamodel.models.map((model) => model.name);

  return Promise.all(
    modelNames.map((modelName) => prisma[modelName.toLowerCase()].deleteMany())
  );
}

//create a mock data//
describe("POST /user", () => {
  const user = {
    name: 'John13',
    email: 'john13@example.com',
    password: 'insecure',
  }

   beforeAll(async () => {
    await cleanupDatabase()
   })
    
   afterAll(async () => {
    await cleanupDatabase()
   })
  
  
  //Mock test for testing create user endpoint//
   it("with valid data should return 200", async () => {
    const response = await request(app)
      .post("/user")
      .send(user)
      .set('Accept', 'application/json')
    expect(response.statusCode).toBe(200);
    /*This assertion is likely used to verify that the sign-in process successfully generates 
    an id value for the user.If the id property exists and has a truthy
    value(e.g., a non - empty string or a non - zero number), it indicates that the sign -in
    was successful and the user has been assigned a unique identifier.*/
    expect(response.body.id).toBeTruthy;
    expect(response.body.name).toBe(user.name);
    expect(response.body.email).toBe(user.email);
    expect(response.body.password).toBe(undefined);
   });
  
  //Mock test for email testing failed//
   it("with same email should fail", async () => {
    const response = await request(app)
      .post("/user")
      .send(user)
      .set('Accept', 'application/json')
    expect(response.statusCode).toBe(500);
    /*just means that there is an error and the value is not null. 
    This means an error was returned the process you are testing is unsuccessful.*/
    expect(response.body.error).toBeTruthy;
    expect(response.body.error.email).toBe('email already taken');
   });
  
  //Mock test for password create failed//
  it("with invalid password should fail", async () => {
    user.email = "unique@example.com"
    user.password = "short"
    const response = await request(app)
      .post("/user")
      .send(user)

      /*In the context of API testing, 
      setting the Accept header to 'application/json' typically means that the 
      client expects to receive JSON - formatted responses from the server.
      This header informs the server that the client prefers to receive JSON data rather 
      than other formats like XML or plain text.*/
      .set('Accept', 'application/json') 
    expect(response.statusCode).toBe(400);
      //evaluate whether the error is true//
    expect(response.body.error).toBeTruthy;
    expect(response.body.error.password).toBe('should be at least 8 characters');
  });

  //Mock test when user enter invalid email format//
  it("with invalid email address should fail", async () => {
    user.email = "unique_example.com"
    const response = await request(app)
      .post("/user")
      .send(user)
      .set('Accept', 'application/json')
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBeTruthy;
    expect(response.body.error.email).toBe('is invalid');
  })

  //Mock test when user enter blank name//
  it("with the name blank should fail", async () => {
    user.name = ""
    const response = await request(app)
      .post("/user")
      .send(user)
      .set('Accept', 'application/json')
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBeTruthy;
    expect(response.body.error.name).toBe('cannot be blank')
  })
})