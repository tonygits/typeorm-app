import {AppDataSource} from "../data-source";
import {User} from "../entity/user.entity";

export interface UserRepositoryInterface {
    findAll(): Promise<User[]>;

    create(user: User): Promise<User>;

    update(user: User): Promise<User>;

    delete(user: User): Promise<User>;

    findById(id: string): Promise<User | null>;

    findUserInfo(id: string): Promise<User | null>;

    findByEmail(email: string): Promise<User | null>;
}

const userRepository = AppDataSource.getRepository(User);

export class UserRepository implements UserRepositoryInterface {
    async findAll(): Promise<User[]> {
        return await userRepository.query('SELECT id, name, email, created_at, updated_at FROM users ORDER BY created_at DESC');
    }

    async create(user: User): Promise<User> {
        return await userRepository.save(user);
    }

    async update(user: User): Promise<User> {
        return await userRepository.save(user);
    }

    async delete(user: User): Promise<User> {
        await userRepository.delete(user);
        return user;
    }

    async findById(id: string): Promise<User | null> {
        const queryRes = await userRepository.query('SELECT * FROM users WHERE id=$1', [id])
        return queryRes[0];
    }

    async findUserInfo(id: string): Promise<User | null> {
        return await userRepository.findOneBy({id: id});
    }

    async findByEmail(email: string): Promise<User | null> {
        const queryRes = await userRepository.query('SELECT * FROM users WHERE email=$1', [email])
        return queryRes[0];
    }
}
