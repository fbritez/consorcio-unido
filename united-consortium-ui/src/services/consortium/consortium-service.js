import axios from 'axios';
import Consortium from '../../model/consortium'
import SERVICE_URL from '../utils/constants'

class ConsortiumService {

    getConsortiums = async () => {
        const consortiumsData =  await axios.get(`${SERVICE_URL}/consortiums`);
        return consortiumsData.data.consortiums.map( data => this.createModel(data))
    }

    createModel = (data) => {
        return new Consortium(data.name, data.address)
    }
}

export default ConsortiumService;