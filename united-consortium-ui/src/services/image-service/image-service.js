
import axios from 'axios';
import SERVICE_URL from '../utils/constants'

const  download = (data, filename) => {
    debugger
    const element = document.createElement("a");
    const file = new Blob([data], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
}

class ImageService {

    async downloadImage(file_id){
        try {
            const image = await axios.get(`${SERVICE_URL}/getTicket?file_id=${file_id}`)
            download(image.data, file_id.split('/')[1])    
        } catch (error) {    
            console.log(error)
        }
            
        
    }
}

export default ImageService;