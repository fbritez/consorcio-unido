
import axios from 'axios';
import SERVICE_URL from '../utils/constants';
import User from '../../model/user';

class UserService {

    constructor() {
        this.user = null
    }


    async getUser(email) {
        const user = await this.getUserData(email);
        return user
    }

    getLoggedUser() {
        debugger
        return this.user
    }

    async getUserData(email) {
        const userData = await axios.get(`${SERVICE_URL}/userData?userEmail=${email}`);
        return userData.data.user.map(data => this.createModel(data))[0]
    }

    createModel = (data) => {
        return new User(data.email, data.name)
    }

}

const userService = new UserService();

export default userService;