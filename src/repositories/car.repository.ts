import {AppDataSource} from "../database/config";
import {Car} from "../entity/cars.entity";

export interface CarRepositoryInterface {
    findAll(): Promise<Car[]>;

    create(car: Car, user_id: string): Promise<Car>;

    update(car: Car): Promise<Car>;

    delete(car: Car): Promise<Car>;

    listByUserIds(userIds: string[]): Promise<Car[]>;

    findById(id: string): Promise<Car | null>;
}

const carRepository = AppDataSource.getRepository(Car);

export class CarRepository implements CarRepositoryInterface {
    async findAll(): Promise<Car[]> {
        return await carRepository.find();
    }

    async create(car: Car): Promise<Car> {
        return await carRepository.save(car);
    }

    async listByUserIds(userIds: string[]): Promise<Car[]> {
        let params: any[] = [];
        params.push(...userIds)
        let currentIndex = 0;
        let args: string = "";
        userIds.forEach(userId => {
            if (currentIndex > 0) {
                args += ", ";
            }
            args += "$" + (currentIndex + 1);
            currentIndex++;
        })
        return await carRepository.query(`SELECT *
                                          FROM cars
                                          WHERE user_id IN (${args})`, params);
    }

    async update(car: Car): Promise<Car> {
        return await carRepository.save(car);
    }

    async delete(car: Car): Promise<Car> {
        await carRepository.delete(car);
        return car;
    }

    async findById(id: string): Promise<Car | null> {
        return await carRepository.findOneBy({id: id});
    }
}
