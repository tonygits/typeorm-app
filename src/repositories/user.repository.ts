import {AppDataSource} from "../data-source";
import {User} from "../entity/user.entity";
import {buildQuery} from "../helpers/buildQuery";

interface UserRepositoryInterface {
    countUsers(): Promise<number>;

    findAll(): Promise<User[]>;

    save(user: User): Promise<User>;

    delete(user: User): Promise<User>;

    findById(id: string): Promise<User | null>;

    findUserInfo(id: string): Promise<User | null>;

    listByIds(userIDs: string[]): Promise<User[]>;

    findByEmail(email: string): Promise<User | null>;
}

const userRepository = AppDataSource.getRepository(User);

const selectUsersSQL = `SELECT id, name, email, created_at, updated_at
                        FROM users
                        WHERE true`;

const countUsersSQL = `SELECT COUNT(id)
                       FROM users
                       WHERE true `;

export class UserRepository implements UserRepositoryInterface {
    async countUsers(): Promise<number> {
        const [count] = await userRepository.query(countUsersSQL);
        return count.count;
    }

    async findAll(): Promise<User[]> {
        return await userRepository.query(`${selectUsersSQL} ORDER BY created_at DESC`);
    }

    async save(user: User): Promise<User> {
        return await userRepository.save(user);
    }

    async delete(user: User): Promise<User> {
        await userRepository.delete(user.id);
        return user;
    }

    async findById(id: string): Promise<User | null> {
        const queryRes = await userRepository.query(`${selectUsersSQL} AND id=$1`, [id])
        return queryRes[0];
    }

    async findUserInfo(id: string): Promise<User | null> {
        return await userRepository.findOne({where: {id: id}, cache: 6000});
    }

    async listByIds(userIds: string[]): Promise<User[]> {
        let userParams: any[] = [];
        let currentIndex = 0;
        let args = "";
        //other args
        let {ParamArgs, CurrentIndex} = buildQuery.getQueryArgs(userIds, currentIndex)
        args += ParamArgs
        userParams.push(...userIds)
        currentIndex = CurrentIndex
        return await userRepository.query(`${selectUsersSQL} AND id IN (${args})`, userParams);
    }

    async findByEmail(email: string): Promise<User | null> {
        const queryRes = await userRepository.query('SELECT id, name, email, password, created_at, updated_at  FROM users WHERE email=$1', [email])
        return queryRes[0];
    }
}
