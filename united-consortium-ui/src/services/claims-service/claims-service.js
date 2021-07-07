import axios from 'axios';
import SERVICE_URL from '../utils/constants'

class ClaimsService {

    claimsFor = async (consortium, member_name) => {
        const claimsData = await axios.get(`${SERVICE_URL}/claims/claimsFor?consortiumID=${consortium.id}&member=${member_name}`);
        return claimsData.data.claims
    }

    getClaims = async consortium => {
        const claimsData = await axios.get(`${SERVICE_URL}/claims/all/claims?consortiumID=${consortium.id}`);
        return claimsData.data.claims
    }

    save = async claim => {
        try {
            const response = await axios.post(`${SERVICE_URL}/claims/update`, { claim: claim});
            return response
        } catch (error) {
            console.log(error)
            return Promise.reject()
        }
    }
}

export default new ClaimsService();