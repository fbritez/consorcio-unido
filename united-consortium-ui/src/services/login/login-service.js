import axios from 'axios';
import SERVICE_URL from '../utils/constants'

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
        const result = await axios.post(`${SERVICE_URL}/setCredentials`, {user_email: email, password: password});
    }

    async authenticate(email, password){
        let result
        try{
            result = await axios.post(`${SERVICE_URL}/authenticate`, {user_email: email, password: password});
        }catch{
            result = {data: {success: false}}
        }
            
        debugger
        return result.data.success
    }
}

export default LoginService;