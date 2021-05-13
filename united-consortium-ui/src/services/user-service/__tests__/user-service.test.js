import User from "../../../model/user";
import axios from 'axios';
import userService from "../user-service";
import SERVICE_URL from "../../utils/constants";

const email = 'some@email.com';
const expectedName =  'some name';
const expectedData = {data : { user : [{name: expectedName, email: email}]}};
const user = new User(email, expectedName);

jest.mock('axios', () => ({
    post: jest.fn(),
    get: jest.fn()
}));

describe('eUser service tests', () => {

    it('service get user', async () => {
        axios.get.mockReturnValueOnce(expectedData);
        const result = await userService.getUser(email);
        expect(axios.get).toHaveBeenCalledWith(`${SERVICE_URL}/userData?userEmail=${email}`);
        expect(result).toEqual(user);
    })
})