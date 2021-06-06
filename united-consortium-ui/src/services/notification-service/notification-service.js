import axios from 'axios';
import SERVICE_URL from '../utils/constants'

class NotificationService {

    notificationFor = async consortium => {
        const notificationsData = await axios.get(`${SERVICE_URL}/notification/notificationFor?consortiumID=${consortium.id}`);
        return notificationsData.data.notifications
    }

    save = async (consortium, message, filename) => {
        const notification = { consortium_id: consortium.id, message: message, filename: filename}
        try {
            const response = await axios.post(`${SERVICE_URL}/notification/update`, { notification: notification});
            return response
        } catch (error) {
            console.log(error)
            return Promise.reject()
        }
    }
}

export default NotificationService;