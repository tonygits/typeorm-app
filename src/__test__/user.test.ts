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

describe("get test environment", () => {
    it("check environment", async () => {
        console.log(`we are in ${process.env.DB_NAME} ${process.env.NODE_ENV} environment`)
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
