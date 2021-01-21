const axios = require('axios')

module.exports = async ({shipmentDocumentID}) => {

    // Returns a customs document
    return await axios.get('https://api.despatchbay.com/documents/v1/customs/' + shipmentDocumentID)

}

