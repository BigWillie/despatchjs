const doAjax = require('./ajax')
const escaper = require('./escaper')

module.exports = async ({ serviceID, parcels, orderID, collectionDate, senderAddressID = process.env.SENDERADDRESSID, recipientAddress, followShipment, recipientEoriNumber }) => {


    const buildRecipientAddress = ({ recipientName, recipientTelephone, recipientEmail, companyName, street, locality, townCity, county, postalCode, countryCode }) => {
        return `<RecipientAddress xsi:type="urn:RecipientAddressType">
                    <RecipientName xsi:type="xsd:string">${escaper(recipientName)}</RecipientName>
                    <RecipientTelephone xsi:type="xsd:string">${escaper(recipientTelephone)}</RecipientTelephone>
                    <RecipientEmail xsi:type="xsd:string">${escaper(recipientEmail)}</RecipientEmail>
                    <RecipientAddress xsi:type="urn:AddressType">
                        ${companyName ? '<CompanyName xsi:type="xsd:string">' + escaper(companyName) + '</CompanyName>' : ''}
                        <Street xsi:type="xsd:string">${escaper(street)}</Street>
                        ${locality ? '<Locality xsi:type="xsd:string">' + escaper(locality) + '</Locality>' : ''}
                        <TownCity xsi:type="xsd:string">${escaper(townCity)}</TownCity>
                        ${county ? '<County xsi:type="xsd:string">' + escaper(county) + '</County>' : ''}
                        ${postalCode ? '<PostalCode xsi:type="xsd:string">' + escaper(postalCode) + '</PostalCode>' : ''}
                        <CountryCode xsi:type="xsd:string">${escaper(countryCode)}</CountryCode>
                    </RecipientAddress>
                </RecipientAddress>`
    }


    const buildParcelArray = (parcels) => {

        const parcelArray = parcels.map((x) => {

            const buildContentsArray = (contents) => {
                return contents.map((x) => {
                    return `<Content>
                    <Description>${escaper(x.description)}</Description>
                    <UnitQuantity>${escaper(x.unitQuantity)}</UnitQuantity>
                    <UnitWeight>${escaper(x.unitWeight)}</UnitWeight>
                    <UnitValue>${escaper(x.unitValue)}</UnitValue>
                    <!-- Optional for domestic -->
                    ${x.tariffCode ? '<TariffCode>' + escaper(x.tariffCode) + '</TariffCode>' : ''}
                    ${x.originCountryCode ? '<OriginCountryCode>' + escaper(x.originCountryCode) + '</OriginCountryCode>' : ''}
                </Content>`
                })
            }

            return `<Parcel>
                    <Currency>${escaper(x.currency)}</Currency>
                    <Length>${escaper(x.pLength)}</Length>
                    <Width> ${escaper(x.pWidth)}</Width>
                    <Height>${escaper(x.pHeight)}</Height>
                    <Weight>${escaper(x.pWeight)}</Weight>
                    <Contents xsi:type="urn:ArrayOfContentsType" soapenc:arrayType="urn:ContentsType[]">
                            ${buildContentsArray(x.contents)}
                    </Contents>
                    <!-- Optional for domestic -->
                    ${x.exportReason ? '<ExportReason>' + escaper(x.exportReason) + '</ExportReason>' : ''}
                </Parcel>`
        })

        return `<Parcels xsi:type="urn:ArrayOfParcelType" soapenc:arrayType="urn:ParcelType[]">${parcelArray}</Parcels>`
    }

    const xml = `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:despatchbay" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">
            <soapenv:Header/>
            <soapenv:Body>
                <urn:AddShipment soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
                    <Shipment xsi:type="urn:ShipmentRequestType">
                        <ServiceID>${escaper(serviceID)}</ServiceID>
                        ${buildParcelArray(parcels)}
                        <ClientReference xsi:type="xsd:string">${escaper(orderID)}</ClientReference>
                        <CollectionDate xsi:type="urn:CollectionDateType">
                            <CollectionDate xsi:type="xsd:string">${escaper(collectionDate)}</CollectionDate>
                        </CollectionDate>
                        <SenderAddress xsi:type="urn:SenderAddressType">
                            <SenderAddressID xsi:type="xsd:int">${escaper(senderAddressID)}</SenderAddressID>
                        </SenderAddress>
                        ${buildRecipientAddress(recipientAddress)}
                        ${followShipment ? '<FollowShipment xsi:type="xsd:boolean">' + followShipment + '</FollowShipment>' : ''}
                        ${recipientEoriNumber ? '<RecipientEoriNumber xsi:type="xsd:string">' + escaper(recipientEoriNumber) + '</RecipientEoriNumber>' : ''}
                        </Shipment>
                </urn:AddShipment>
            </soapenv:Body>
        </soapenv:Envelope>`

    const data = {
        xml,
        parserKey: 'addShipment'
    }

    return await doAjax(data)


}