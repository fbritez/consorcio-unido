
const detectActionClassName = (description) => {
    let ret;
    switch (description) {
        case "Agregar":
            ret = 'add-button'
            break
        case "Modificar":
            ret = 'update-button'
            break
        case "Eliminar":
            ret = 'remove-button'
            break
        default:
            ret = 'update-button'
    }

    return ret
}

export {
    detectActionClassName
} 