
import axios from 'axios';
import SERVICE_URL from '../utils/constants'

const  download = (data, filename) => {
    const element = document.createElement("a");
    const file = new Blob([data], {type: 'image/png'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
}

class ImageService {

    async downloadImage(file_id){
        try {
            const image = await axios.get(`${SERVICE_URL}/getTicket?file_id=${file_id}`, {responseType:'blob'})
            download(image.data, file_id.split('/')[1])    
        } catch (error) {    
            console.log(error)
        }
    }

    async save(imageFile){
        if(imageFile){
            let formData = new FormData();
            formData.append("file", imageFile.filename, imageFile.name);
            await axios.post(`${SERVICE_URL}/storeTicket`, formData);   
        }
    }
}

export default new ImageService();