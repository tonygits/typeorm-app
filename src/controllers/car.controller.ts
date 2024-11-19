import {Request, Response} from "express";
import {CarRepository} from "../repositories/car.repository";
import {customRequest} from "../interfaces/request.interface";
import {UserRepository} from "../repositories/user.repository";
import HttpStatus from "http-status"
import {Car} from "../entity/cars.entity";
import {User} from "../entity/user.entity";
import {AppDataSource} from "../data-source";
import {encrypt} from "../helpers/encrypt";

const carRepo = new CarRepository();
const userRepo = new UserRepository();

export class carController {
    static async findAll(req: Request, res: Response) {
        try {
            const cars = await carRepo.findAll();
            let userIds: string[] = [];
            cars.forEach((car) => {
                userIds.push(car.user_id);
            });
            const users = await userRepo.listByIds(userIds);
            let map2 = new Map<string, User>;
            users.forEach((user) => {
                map2.set(user.id, user);
            });
            cars.forEach((car) => {
                if (map2.has(car.user_id)) {
                    car.user = map2.get(car.user_id) as User;
                }
            });
            return res.status(HttpStatus.OK).json(cars);
        } catch (error: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: error.message});
        }
    }

    static async createCarUserTransaction(req: customRequest, res: Response) {
        try {
            await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
                let user1 = new User();
                user1.name = "John7";
                user1.email = "john7@example.com";
                user1.password = await encrypt.encryptPassword("password23")

                const car1 = new Car();
                car1.name = "VW Golf 2.0L";
                car1.model = "VW";
                car1.year = "2012";
                car1.color = "black";

                // execute some operations on this transaction:
                const userTxnRepo = transactionalEntityManager.getRepository(User);
                const userRes = await userRepo.findByEmail('john7@example.com') //query('SELECT * FROM users WHERE email=$1', ['john7@example.com']);
                if (userRes) {
                    return res.status(HttpStatus.CONFLICT).json({error: "User already exists"});
                }
                const user1Result = await userTxnRepo.save(user1);
                car1.user_id = user1Result.id;

                const carTxnRepo = transactionalEntityManager.getRepository(Car);
                const carResult = await carTxnRepo.save(car1)
                return res.status(HttpStatus.OK).json({car: carResult});
            })
        } catch (error: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: "error performing action"});
        }
    }

    static async create(req: customRequest, res: Response) {
        try {
            const user = await userRepo.findUserInfo(req.currentUser.id);
            if (!user) {
                return res.status(HttpStatus.FORBIDDEN).json({error: "User not allowed to make this request"});
            }

            const carReq = req.body
            const newCar = new Car();
            newCar.name = carReq.name;
            newCar.model = carReq.model;
            newCar.year = carReq.year;
            newCar.color = carReq.color;
            newCar.user_id = user.id as string;
            newCar.user = user as User;
            const car = await carRepo.save(newCar);
            return res.status(HttpStatus.CREATED).json(car);
        } catch (error: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: error.message});
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const carToUpdate = await carRepo.findById(req.params.id);
            if (!carToUpdate) {
                return res.status(HttpStatus.NOT_FOUND).json({error: "car not found"});
            }
            const carReq = req.body
            carToUpdate.model = carReq.model;
            carToUpdate.year = carReq.year;
            carToUpdate.color = carReq.color;
            const car = await carRepo.save(carToUpdate);
            return res.status(HttpStatus.OK).json(car);
        } catch (error: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: error.message});
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const carToDelete = await carRepo.findById(req.params.id);
            if (!carToDelete) {
                return res.status(HttpStatus.NOT_FOUND).json({error: "Car not found"});
            }
            const car = await carRepo.delete(carToDelete);
            return res.status(HttpStatus.OK).json(car);
        } catch (error: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: error.message});
        }
    }

    static async findById(req: Request, res: Response) {
        try {
            const car = await carRepo.findById(req.params.id);
            return res.status(HttpStatus.OK).json(car);
        } catch (error: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: error.message});
        }
    }
}
