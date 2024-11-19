import {AppDataSource} from "../data-source";
import {Car} from "../entity/cars.entity";
import {buildQuery} from "../helpers/buildQuery";

interface CarRepositoryInterface {
    countCars(): Promise<number>;

    findAll(): Promise<Car[]>;

    save(car: Car): Promise<Car>;

    delete(car: Car): Promise<Car>;

    listByUserIds(userIds: string[]): Promise<Car[]>;

    findById(id: string): Promise<Car | null>;
}

const carRepository = AppDataSource.getRepository(Car);

const selectCarsSQL = `SELECT id, name, model, year, color, user_id, created_at, updated_at
                       FROM cars
                       WHERE true`;

const countCarsSQL = `SELECT COUNT(id)
                      FROM cars
                      WHERE true `;

export class CarRepository implements CarRepositoryInterface {
    async countCars(): Promise<number> {
        return await carRepository.query(countCarsSQL);
    }

    async findAll(): Promise<Car[]> {
        return await carRepository.query(`${selectCarsSQL} ORDER BY created_at DESC`);
    }

    async listByUserIds(userIds: string[]): Promise<Car[]> {
        let carParams: any[] = [];
        let currentIndex = 0;
        let args = "";
        //other args
        let {ParamArgs, CurrentIndex} = buildQuery.getQueryArgs(userIds, currentIndex)
        args += ParamArgs
        carParams.push(...userIds)
        currentIndex = CurrentIndex
        return await carRepository.query(`${selectCarsSQL} AND user_id IN (${args})`, carParams);
    }

    async save(car: Car): Promise<Car> {
        return await carRepository.save(car);
    }

    async delete(car: Car): Promise<Car> {
        await carRepository.delete(car.id);
        return car;
    }

    async findById(id: string): Promise<Car | null> {
        return await carRepository.findOne({where: {id: id}});
    }
}
