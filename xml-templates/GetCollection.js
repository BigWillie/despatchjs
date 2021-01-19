module.exports = ({collectionID}) => {

    const xml =  `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:despatchbay">
    <soapenv:Header/>
    <soapenv:Body>
        <urn:GetCollection soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
            <CollectionID xsi:type="xsd:string">${collectionID}</CollectionID>
        </urn:GetCollection>
    </soapenv:Body>
</soapenv:Envelope>`

    return {
        xml,
        parserKey: 'getCollection'
    }

}