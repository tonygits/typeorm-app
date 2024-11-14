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
            return res.status(HttpStatus.OK).json(cars);
        } catch (error: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: error.message});
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
            const car = await carRepo.save(newCar);
            return res.status(HttpStatus.CREATED).json(car);
        } catch (error: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: error.message});
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const carRepo = new CarRepository();
            const carToUpdate = await carRepo.findById(req.params.id);
            if (!carToUpdate) {
                return res.status(HttpStatus.NOT_FOUND).json({error: "Car not found"});
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
            const carRepo = new CarRepository();
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
            const carRepo = new CarRepository();
            const car = await carRepo.findById(req.params.id);
            return res.status(HttpStatus.OK).json(car);
        } catch (error: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: error.message});
        }
    }
}
