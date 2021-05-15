
import axios from 'axios';
import LoginService from "../login-service";
import SERVICE_URL from "../../utils/constants";
import CryptoJS from 'crypto-js';


const validEmailResponse = {data: true};
const email = 'some@email.com';
const password = '123456789';

function FormDataMock() {
    this.append = jest.fn();
}
global.FormData = FormDataMock

jest.mock('axios', () => ({
    get: jest.fn(),
    post: jest.fn()
}));

jest.mock('crypto-js', () => ({
        AES: {
            encrypt: () => password
        }
}));


describe('login tests', () => {

    const service = new LoginService();

    it('call validateEmail to the backend', async () => {
        axios.get.mockReturnValueOnce(validEmailResponse)
        const result = await service.validateEmail(email);
        expect(result.validEmail).toEqual(true);
        expect(result.firstLogin).toEqual(validEmailResponse.data);
        expect(axios.get).toHaveBeenCalledWith(`${SERVICE_URL}/validateUserEmail?user_email=${email}`)
    })

    it('call validateEmail with an invalid email', async () => {
        axios.get.mockImplementation(() => {
            throw new Error();
          });
        const result = await service.validateEmail(email);
        expect(result.validEmail).toEqual(false);
        expect(result.firstLogin).toEqual(false);
        expect(axios.get).toHaveBeenCalledWith(`${SERVICE_URL}/validateUserEmail?user_email=${email}`)
    })

    it('setCredentials', async () => {
        const result = await service.setCredentials(email, password);
        expect(axios.post).toHaveBeenNthCalledWith(1, `${SERVICE_URL}/setCredentials`, {user_email: email, password: password})  
    })

    it('call authenticate', async () => {
        const expectedResponse = {data : {success: true}}
        axios.post.mockReturnValueOnce(expectedResponse)
        const result = await service.authenticate(email, password);
        expect(axios.post).toHaveBeenNthCalledWith(1, `${SERVICE_URL}/authenticate`, {user_email: email, password: password})  
        expect(result).toEqual(true);
    })

    it('authenticate fails', async () => {
        axios.post.mockImplementation(() => {
            throw new Error();
          });
        const result = await service.authenticate(email, password);
        expect(axios.post).toHaveBeenNthCalledWith(1, `${SERVICE_URL}/authenticate`, {user_email: email, password: password})  
        expect(result).toEqual(false);
    })
})