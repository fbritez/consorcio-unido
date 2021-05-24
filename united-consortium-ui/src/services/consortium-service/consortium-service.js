import axios from 'axios';
import Consortium from '../../model/consortium'
import SERVICE_URL from '../utils/constants'

class ConsortiumService {

    getConsortiums = async user => {
        const consortiumsData = await axios.get(`${SERVICE_URL}/consortiums?user_identifier=${user.email}`);
        return consortiumsData.data.consortiums.map(data => this.createModel(data))
    }

    createModel = data => new Consortium(data?.name, data?.address, data?.id, data?.members, data?.administrators);

    createEmptyConsortium = () => this.createModel({ name: '', address: '', id: '', members: [], administrators: [] });

    update = async consortium => {
        try {
            debugger
            return await axios.post(`${SERVICE_URL}/updateConsortium`, { updatedConsortium: consortium });
        } catch (error) {
            console.log(error)
            return Promise.reject()
        }
    }

    isAdministrator = async user => {
        const consortiums = await this.getConsortiums(user);
        const p = consortiums.some(consortium => consortium.isAdministrator(user));
        debugger
        return p
    }
}

export default ConsortiumService;