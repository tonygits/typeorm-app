import request from "supertest";
import {User} from "../entity/user.entity";
import app from "../index";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {AppDataSource} from "../data-source";
import {Car} from "../entity/cars.entity";

beforeAll(async () => {
    await AppDataSource.initialize().then(() => {
        console.log("test database connected");
    }).catch((err) => {
        console.log(err);
    });
    await AppDataSource.synchronize();
});

const userRepo = AppDataSource.getRepository(User);
const carRepo = AppDataSource.getRepository(Car);
afterEach(async () => {
    try {
        await carRepo.query('DROP TABLE cars');
        await userRepo.query('DROP TABLE users');
    } catch (err) {
        console.error("Error during cleanup: ", err);
    }
});

afterAll(async () => {
    await AppDataSource.destroy();
});

beforeEach(async () => {
    await AppDataSource.synchronize();
});

describe("GET test environment", () => {
    it("check environment", async () => {
        console.log(`we are using ${process.env.DB_NAME} database in ${process.env.NODE_ENV} environment`)
    });
});

describe("POST /api/users", () => {
    it("should register a new user and return 201 status", async () => {
        const response = await request.agent(app).post("/api/users").send({
            email: "test@gmail.com",
            name: "test12",
            password: "testpassword"
        });

        console.log("register response status", response.body);
        expect(response.status).toBe(201);
        expect(response.body.user.email).toEqual("test@gmail.com");
    });
});

describe("POST /api/users/login", () => {
    it("should allow user to login by email and password and return 200 status", async () => {

        const hashedPassword = await bcrypt.hashSync("testpassword", 12);
        const user = await userRepo.save({email: "test@gmail.com", name: "test12", password: hashedPassword});
        expect(user.id.length).toBeGreaterThan(0);
        const response = await request.agent(app).post("/api/users/login").send({
            email: "test@gmail.com",
            password: "testpassword",
        });

        console.log("login response status", response.status);
        expect(response.status).toBe(200);
        expect(response.body.user.name).toEqual(user.name);
    });
});

describe("GET /api/users/:id", () => {
    it("should return the profile information for the user", async () => {
        const hashedPassword = await bcrypt.hash("testpassword", 12);
        const user = await userRepo.save({
            email: "test@gmail.com",
            password: hashedPassword,
            name: "test12",
        });

        const token = jwt.sign({id: user.id}, String(process.env.JWT_SECRET), {
            expiresIn: "1y",
        });

        const userId = String(user.id);

        const response = await request.agent(app)
            .get(`/api/users/${userId}`)
            .set("Authorization", `Bearer ${token}`);

        console.log("get user profile response status", response.status);
        expect(response.status).toBe(200);
        expect(response.body.user.id).toEqual(user.id);
        expect(response.body.user.email).toEqual(user.email);
        expect(response.body.user.name).toEqual(user.name);
    });
});

describe("GET /api/users", () => {
    it("should list added users", async () => {
        const hashedPassword = await bcrypt.hash("testpassword", 12);
        const user1 = await userRepo.save({
            email: "test1@gmail.com",
            password: hashedPassword,
            name: "test1",
        });

        await userRepo.save({
            email: "test2@gmail.com",
            password: hashedPassword,
            name: "test2",
        });

        await userRepo.save({
            email: "test3@gmail.com",
            password: hashedPassword,
            name: "test3",
        });

        const user1Token = jwt.sign({id: user1.id}, String(process.env.JWT_SECRET), {
            expiresIn: "1y",
        });

        const response = await request.agent(app)
            .get("/api/users")
            .set("Authorization", `Bearer ${user1Token}`);

        console.log("get users response status", response.status);
        expect(response.status).toBe(200);
        expect(response.body.users.length).toBe(3);
    });
});

describe("PUT /api/users/:id", () => {
    it("should update user and return update information", async () => {
        const hashedPassword = await bcrypt.hash("testpassword", 12);
        const user = await userRepo.save({
            email: "test@gmail.com",
            password: hashedPassword,
            name: "test12",
        });

        const token = jwt.sign({id: user.id}, String(process.env.JWT_SECRET), {
            expiresIn: "1y",
        });
        const userId = String(user.id);
        const response = await request.agent(app).put(`/api/users/${userId}`)
            .send({
                name: "test12updated",
            })
            .set("Authorization", `Bearer ${token}`)

        console.log("get updated user response status", response.status);
        expect(response.status).toBe(200);
        expect(response.body.user.name).toEqual("test12updated");
    });
});

describe("DELETE /api/users/:id", () => {
    it("should delete user and return user information", async () => {
        const hashedPassword = await bcrypt.hash("testpassword", 12);
        const user = await userRepo.save({
            email: "test@gmail.com",
            password: hashedPassword,
            name: "test12",
        });

        const token = jwt.sign({id: user.id}, String(process.env.JWT_SECRET), {
            expiresIn: "1y",
        });
        let response = await request.agent(app).delete(`/api/users/${user.id}`)
            .send({
                name: "test12updated",
            })
            .set("Authorization", `Bearer ${token}`)

        console.log("delete user response status", response.status);
        expect(response.status).toBe(200);
        expect(response.body.user.name).toEqual("test12");

        response = await request.agent(app)
            .get(`/api/users/${user.email}/email`)
            .set("Authorization", `Bearer ${token}`);

        console.log("user info", response.body)
        console.log("get user response status", response.status);
        expect(response.status).toBe(404);
        expect(response.body.error).toEqual("User not found");
    });
});
