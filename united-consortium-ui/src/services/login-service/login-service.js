import axios from 'axios';
import SERVICE_URL from '../utils/constants';
import CryptoJS from 'crypto-js';

const encrypt = value => {
    //return CryptoJS.AES.encrypt(value, "Secret Passphrase").toString();
    return value
}

class LoginService {

    async validateEmail(email){

        let validEmail = false
        let firstLogin = false

        try {
            const response =  await axios.get(`${SERVICE_URL}/validateUserEmail?user_email=${email}`);   
            firstLogin = response.data 
            validEmail = true
        } catch (error) {
        }

        return {
            validEmail,
            firstLogin
        }
    }

    async setCredentials( email, password){
        const encryptedPassword = encrypt(password)
        
        const result = await axios.post(`${SERVICE_URL}/setCredentials`, {user_email: email, password: encryptedPassword});
        
        return result
    }

    async authenticate(email, password){
        let result
        const encryptedPassword = encrypt(password)
        try{
            result = await axios.post(`${SERVICE_URL}/authenticate`, {user_email: email, password: encryptedPassword});
        }catch{
            result = {data: {success: false}}
        }
        return result.data.success
    }
}

export default LoginService;