import {Request, Response} from "express";
import {UserRepository} from "../repositories/user.repository";
import bcrypt from "bcrypt";
import HttpStatus from "http-status"
import {encrypt} from "../helpers/encrypt";
import {CarRepository} from "../repositories/car.repository";
import {Car} from "../entity/cars.entity";
import {User} from "../entity/user.entity";

export class userControllers {
    static async findAll(req: Request, res: Response) {
        try {
            const userRepo = new UserRepository();
            const users = await userRepo.findAll();
            const userIds: string[] = [];
            users.forEach((user) => {
                userIds.push(user.id);
            });

            let map1 = new Map<string, any>;
            if (userIds.length > 0) {
                const carsRepo = new CarRepository();
                const cars = await carsRepo.listByUserIds(userIds)
                cars.forEach((car) => {
                    if (map1.has(car.user_id)) {
                        map1.get(car.user_id).push(car)
                    } else {
                        let mapCars: Car[] = [];
                        mapCars.push(car);
                        map1.set(car.user_id, mapCars);
                    }
                })
            }
            users.forEach((user) => {
                user.cars = [];
                if (map1.has(user.id)) {
                    user.cars = map1.get(user.id)
                }
            })
            return res.status(HttpStatus.OK).json({users: users});
        } catch (err: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: err.message});
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const userRepo = new UserRepository();
            const userReq = req.body;
            const userExists = await userRepo.findByEmail(userReq.email);
            if (userExists) {
                return res.status(HttpStatus.CONFLICT).json({error: "user with email already exists"});
            }
            const hashedPass = await encrypt.encryptPassword(userReq.password);
            const newUser = new User();
            newUser.name = userReq.name;
            newUser.email = userReq.email;
            newUser.password = hashedPass;
            const user = await userRepo.save(newUser);
            return res.status(HttpStatus.CREATED).json({
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                }
            });
        } catch (err: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: err.message});
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const userRepo = new UserRepository();
            const id = req.params.id;
            const userReq = req.body;
            const userToUpdate = await userRepo.findById(id);
            if (!userToUpdate) {
                return res.status(HttpStatus.NOT_FOUND).json({error: "User not found"});
            }
            userToUpdate.name = userReq.name;
            userToUpdate.email = userReq.email;
            userToUpdate.password = userReq.password;
            const user = await userRepo.save(userToUpdate);
            return res.status(HttpStatus.OK).json({
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                }
            });
        } catch (err: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: err.message});
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const userRepo = new UserRepository();
            const userToDelete = await userRepo.findById(req.params.id);
            if (!userToDelete) {
                return res.status(HttpStatus.NOT_FOUND).json({error: "User not found"});
            }
            const user = await userRepo.delete(userToDelete);
            return res.status(HttpStatus.OK).json({
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                }
            });
        } catch (err: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: err.message});
        }
    }

    static async findById(req: Request, res: Response) {
        try {
            const userRepo = new UserRepository();
            const user = await userRepo.findUserInfo(req.params.id);
            if (!user) {
                return res.status(HttpStatus.NOT_FOUND).json({error: "User not found"});
            }
            return res.status(HttpStatus.OK).json({user: user});
        } catch (err: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: err.message});
        }
    }

    static async findByEmail(req: Request, res: Response) {
        try {
            const userRepo = new UserRepository();
            const user = await userRepo.findByEmail(req.params.email);
            if (!user) {
                return res.status(HttpStatus.NOT_FOUND).json({error: "User not found"});
            }
            return res.status(HttpStatus.OK).json({
                user: {
                    id: user?.id,
                    email: user?.email,
                    name: user?.name,
                    created_at: user?.created_at,
                    updated_at: user?.updated_at,
                }
            });
        } catch (err: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: err.message});
        }
    }

    static async login(req: Request, res: Response) {
        const {email, password} = req.body;

        const userRepo = new UserRepository();
        const user = await userRepo.findByEmail(email);
        if (!user) {
            return res.status(HttpStatus.NOT_FOUND).json({error: "User not found"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(HttpStatus.UNAUTHORIZED).json({error: "Invalid credentials"});
        }
        // generate token
        const token = encrypt.generateToken({id: user.id});
        res.setHeader("token", token);
        res.setHeader("Content-Type", "application/json");
        return res.status(HttpStatus.OK).json({
            message: "Login successful", user: {
                id: user.id,
                email: user.email,
                name: user.name,
                created_at: user.created_at,
                updated_at: user.updated_at,
            }
        });
    }
}
