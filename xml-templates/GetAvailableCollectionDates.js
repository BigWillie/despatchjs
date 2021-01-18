module.exports = ({courierID, SenderAddressID = process.env.SENDERADDRESSID }) => {
    return `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:despatchbay">
    <soapenv:Header/>
    <soapenv:Body>
        <urn:GetAvailableCollectionDates soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
            <SenderAddress xsi:type="urn:SenderAddressType">
                <SenderAddressID xsi:type="xsd:int">${SenderAddressID}</SenderAddressID> 
            </SenderAddress>
            <CourierID xsi:type="xsd:int">${courierID}</CourierID>
        </urn:GetAvailableCollectionDates>
    </soapenv:Body>
</soapenv:Envelope>`

}