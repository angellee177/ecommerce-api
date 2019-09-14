const success = ( results, message ) => {
    return {
        success: true,
        message: message,
        result: results
    }
}

const errorMessage = (err) => {
    return {
        success: false,
        message: err
    }
}


module.exports = { success, errorMessage }



