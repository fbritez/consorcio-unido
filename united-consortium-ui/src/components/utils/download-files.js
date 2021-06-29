import imageService from '../../services/image-service/image-service'

const downloadTicket = file_id => {
    imageService.downloadImage(file_id)
}

export {
    downloadTicket
}