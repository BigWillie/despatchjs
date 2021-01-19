module.exports = ({shipmentID}) => {
    const xml = `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:despatchbay">
            <soapenv:Header/>
            <soapenv:Body>
                <urn:GetShipment soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
                    <ShipmentID xsi:type="xsd:string">${shipmentID}</ShipmentID>
                </urn:GetShipment>
            </soapenv:Body>
        </soapenv:Envelope>`

        return {
            xml,
            parserKey: 'getShipment'
        }
}