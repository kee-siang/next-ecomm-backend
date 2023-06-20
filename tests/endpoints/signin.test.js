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

//Scenario 1//

//assume the user data is post to the database//
//create a mock user data//

//describe test suite//
describe("POST /user", () => {
    const user = {
    name: 'John',
    email: 'john9@example.com',
    password: 'insecure',
    }
  
beforeAll(async () => {
        await cleanupDatabase()
    })
    
afterAll(async () => {
        await cleanupDatabase()
    })

it("with valid data should return 200", async () => {
    const response = await request(app)
      .post("/user")
      .send(user)
      .set('Accept', 'application/json')
   });

//Mock test for testing sign in endpoint//
describe("POST /auth", () => {
    
  it("with valid data should return 200", async () => {
    user.email = 'john9@example.com'
    user.password = 'insecure'
    const response = await request(app)
      .post("/auth")
      .send(user)
      .set('Accept', 'application/json');
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeTruthy;
  });
 })
})

//Scenario 2//
describe("POST /user", () => {
  const user = {
      name: 'John12',
      email: 'john12@example.com',
      password: 'insecure'
  }
  
  beforeAll(async () => {
        await cleanupDatabase()
    })
    
  afterAll(async () => {
        await cleanupDatabase()
  })
  
  describe("POST /auth", () => {
    
    it("enter wrong email address should fail", async () => {
      user.email = "john14@example.com"
      user.password = "insecure"
      const response = await request(app)
        .post("/auth")
         //It allows you to include data when making a POST requests that require a request body.//
        .send(user)
        .set('Accept', 'application/json')
      //when want to print out the response, you can do it this way//
      //console.log(response)
      expect(response.statusCode).toBe(401);
      //checks if the accessToken is falsy, including undefined, null, false, 0, NaN, and an empty string.//
      expect(response.body.accessToken).toBeFalsy();
    });
  })
})

//Scenario 3//
describe("POST /user", () => {
    const user = {
    name: 'John15',
    email: 'john15@example.com',
    password: 'insecure',
    }
  
  beforeAll(async () => {
        await cleanupDatabase()
    })
    
  afterAll(async () => {
        await cleanupDatabase()
  })
  
  describe("POST /auth", () => {
    it("when user enter wrong password should fail", async () => {
      user.email = "john15@example.com"
      user.password = "123456789"
      const response = await request(app)
        .post("/auth")
        .send(user)
        .set('Accept', 'application/json')
      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBeTruthy;
    })
  })
})



