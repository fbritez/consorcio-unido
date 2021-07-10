import axios from 'axios';
import SERVICE_URL from '../utils/constants'

class SettingService{

    async getConsortiumSettings(consortium){
        const settingData = await axios.get(`${SERVICE_URL}//settings/get?type=consortium&id=${consortium.id}`);
        const settings = settingData.data
        settings.type = 'consortium'
        settings.id = consortium.id
        return settings
    }

    update = async selectedSettings => {
        try {
            const settingData = await axios.post(`${SERVICE_URL}/settings/update`, { applicationSettings: selectedSettings });
            return settingData
        } catch (error) {
            console.log(error)
            return Promise.reject()
        }
    }
}

export default new SettingService()