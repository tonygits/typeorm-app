import {Request, Response} from "express";
import {CarRepository} from "../repositories/car.repository";
import {customRequest} from "../interfaces/request.interface";
import {UserRepository} from "../repositories/user.repository";
import HttpStatus from "http-status"
import {Car} from "../entity/cars.entity";
import {User} from "../entity/user.entity";

export class carController {
    static async findAll(req: Request, res: Response) {
        try {
            const carRepo = new CarRepository();
            const cars = await carRepo.findAll();
            res.status(HttpStatus.OK).json(cars);
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: error});
        }
    }

    static async create(req: customRequest, res: Response) {
        try {
            const carRepo = new CarRepository();
            const userRepo = new UserRepository();

            const carReq = req.body
            const user = await userRepo.findUserInfo(req.currentUser.id);

            const newCar = new Car();
            newCar.name = carReq.name;
            newCar.model = carReq.model;
            newCar.year = carReq.year;
            newCar.color = carReq.color;
            newCar.user_id = user?.id as string;
            newCar.user = user as User;
            const car = await carRepo.create(newCar);
            res.status(HttpStatus.CREATED).json({
                car,
            });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: error});
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const carRepo = new CarRepository();
            const carToUpdate = await carRepo.findById(req.params.id);
            if (!carToUpdate) {
                throw new Error("Car not found");
            }
            const carReq = req.body
            carToUpdate.model = carReq.model;
            carToUpdate.year = carReq.year;
            carToUpdate.color = carReq.color;
            const car = await carRepo.update(carToUpdate);
            res.status(HttpStatus.OK).json(car);
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: error});
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const carRepo = new CarRepository();
            const carToDelete = await carRepo.findById(req.params.id);
            if (!carToDelete) {
                throw new Error("Car not found");
            }
            const car = await carRepo.delete(carToDelete);
            res.status(HttpStatus.OK).json(car);
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: error});
        }
    }

    static async findById(req: Request, res: Response) {
        try {
            const carRepo = new CarRepository();
            const car = await carRepo.findById(req.params.id);
            res.status(HttpStatus.OK).json(car);
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: error});
        }
    }
}
