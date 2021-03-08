const doAjax = require('./ajax')
const escaper = require('./escaper')

module.exports = async ({courierID, SenderAddressID = process.env.SENDERADDRESSID }) => {
    const xml =  `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:despatchbay">
    <soapenv:Header/>
    <soapenv:Body>
        <urn:GetAvailableCollectionDates soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
            <SenderAddress xsi:type="urn:SenderAddressType">
                <SenderAddressID xsi:type="xsd:int">${escaper(SenderAddressID)}</SenderAddressID> 
            </SenderAddress>
            <CourierID xsi:type="xsd:int">${escaper(courierID)}</CourierID>
        </urn:GetAvailableCollectionDates>
    </soapenv:Body>
</soapenv:Envelope>`

const data = {
    xml,
    parserKey: 'getAvailableCollectionDates'
}
return await doAjax(data)

}