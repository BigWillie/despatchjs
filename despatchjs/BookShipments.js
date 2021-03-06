const doAjax = require('./ajax')
const escaper = require('./escaper')

module.exports = async ({ shipmentID }) => {

    let shipmentIDs; // mutation - gross....

    if (Array.isArray(shipmentID)) {
        // Shipments is an array - so we need to fill 
        shipmentIDs = shipments.map((x) => {
            return `<ShipmentID xsi:type="xsd:string">${escaper(x)}</ShipmentID>`
        })
    } else {
        shipmentIDs = `<ShipmentID xsi:type="xsd:string">${escaper(shipmentID)}</ShipmentID>`
    }

    const xml = `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:despatchbay" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">
    <soapenv:Header/>
    <soapenv:Body>
        <urn:BookShipments soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
            <ShipmentIDs xsi:type="urn:ArrayOfShipmentID" soapenc:arrayType="xsd:string[]">
               ${shipmentIDs}
            </ShipmentIDs>
        </urn:BookShipments>
    </soapenv:Body>
</soapenv:Envelope>`

    const data = {
        xml,
        parserKey: 'bookShipments'
    }
    return await doAjax(data)

}