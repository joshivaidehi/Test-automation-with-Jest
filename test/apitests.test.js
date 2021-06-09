const supertest = require("supertest");
const host = "http://localhost:3000";
const request = supertest(host);

describe("User API test suite", () =>{
    it("should get all users", async() => {
        const response = await request.get("/users");
        // console.log(response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body).not.toBeNull();
    });

    it("should get single user by id", async() => {
        const response = await request.get("/users/2");

        expect(response.statusCode).toBe(200);
        expect(response.body[0].name).toContain("Vaidehi Joshi");
    });

    it("should create user", async() => {
        const users = await request.get("/users");
        const countBefore = users.body.length;
        const response = await request.post("/users").send({
            name: "Ivan Hung",
            email: "ivan@yahoo.com",
            department: "research"
        });

        expect(response.statusCode).toBe(201);
        expect(response.body.length).toEqual(countBefore+1);
    });

    it("should update single user by id", async() => {
        const response = await request.put("/users/2").send({
            department: "Design"
        })

        expect(response.statusCode).toBe(200);
        expect(response.body.user.department).toEqual("Design");
    });

    it("should delete user", async() => {
        const response = await request.delete("/users/3");

        expect(response.statusCode).toBe(200);
        response.body.users.forEach(user => {
            if(user.name === "Ivan"){
                throw new Error("user was not deleted successfully");
            }
        });
    });

    it("should return 404 getting user with invalid id", async() => {
        const response = await request.get("/users/x")

        expect(response.statusCode).toBe(404);
       
    });

    it("should return 404 update user with invalid id", async() => {
        const response = await request.put("/users/x").send({
            department: "design"
        })
        expect(response.statusCode).toBe(404);       
    });

    it("should return 400 creating user with invalid body", async() => {
        const response = await request.post("/users").send({
            abcd: "blah"
        })
        expect(response.statusCode).toBe(400);       
    });

    it("should return 404 deleting user with invalid body", async() => {
        const response = await request.delete("/users/x")
        expect(response.statusCode).toBe(404);       
    });
});