import axios from 'axios';
import Consortium from '../../model/consortium'
import SERVICE_URL from '../utils/constants'

class ConsortiumService {

    getConsortiums = async user => {
        const consortiumsData =  await axios.get(`${SERVICE_URL}/consortiums?user_identifier=${user.email}`);
        return consortiumsData.data.consortiums.map( data => this.createModel(data))
    }

    createModel = (data) => {
        return new Consortium(data?.name, data?.address, data?.id, data?.members, data?.administrators);
    }

    createEmptyConsortium = () => this.createModel({});

    update = async (consortium) =>{
        try {
            debugger
            await axios.post(`${SERVICE_URL}/updateConsortium`, {updatedConsortium: consortium});
        }catch(error) {
            console.log(error)
        }
    }
}

export default ConsortiumService;