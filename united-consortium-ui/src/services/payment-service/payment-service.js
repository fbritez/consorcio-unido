import axios from 'axios';
import SERVICE_URL from '../utils/constants';

class PaymentsService {

    async setCredentials( email, password){
        const encryptedPassword =''
        
        const result = await axios.post(`${SERVICE_URL}/setCredentials`, {user_email: email, password: encryptedPassword});
        
        return result
    }

}

export default new PaymentsService();