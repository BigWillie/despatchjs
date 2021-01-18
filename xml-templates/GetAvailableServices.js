module.exports = ({ parcels, senderAddressID = process.env.SENDERADDRESSID, recipientAddress}) => {
	
	// JS doesn't have private methods - so encapsulate these here

    const buildRecipientAddress = ({ recipientName, recipientTelephone, recipientEmail, companyName, street, locality, townCity, county, postalCode, countryCode }) => {
        return `<RecipientAddress xsi:type="urn:RecipientAddressType">
    <RecipientName xsi:type="xsd:string">${recipientName}</RecipientName>
    <RecipientTelephone xsi:type="xsd:string">${recipientTelephone}</RecipientTelephone>
    <RecipientEmail xsi:type="xsd:string">${recipientEmail}</RecipientEmail>
    <RecipientAddress xsi:type="urn:AddressType">
        ${companyName ? '<CompanyName xsi:type="xsd:string">' + companyName + '</CompanyName>' : ''}
        <Street xsi:type="xsd:string">${street}</Street>
        ${locality ? '<Locality xsi:type="xsd:string">' + locality + '</Locality>' : ''}
        <TownCity xsi:type="xsd:string">${townCity}</TownCity>
        ${county ? '<County xsi:type="xsd:string">' + county + '</County>' : ''}
        ${postalCode ? '<PostalCode xsi:type="xsd:string">' + postalCode + '</PostalCode>' : ''}
        <CountryCode xsi:type="xsd:string">${countryCode}</CountryCode>
    </RecipientAddress>
</RecipientAddress>`
    }

    const buildParcelArray = (parcels) => {

        const parcelArray = parcels.map((x) => {

            const buildContentsArray = (contents) => {
                return contents.map((x) => {
                    return `<Content>
                    <Description>${x.description}</Description>
                    <UnitQuantity>${x.unitQuantity}</UnitQuantity>
                    <UnitWeight>${x.unitQuantity}</UnitWeight>
                    <UnitValue>${x.unitValue}</UnitValue>
                    <!-- Optional for domestic -->
                    ${x.tariffCode ? '<TariffCode>' + x.tariffCode + '</TariffCode>' : ''}
                    ${x.originCountryCode ? '<OriginCountryCode>' + x.originCountryCode + '</OriginCountryCode>' : ''}
                </Content>`
                })
            }

            return `<Parcel>
                    <Currency>${x.currency}</Currency>
                    <Length>${x.pLength}</Length>
                    <Width> ${x.pWidth}</Width>
                    <Height>${x.pHeight}</Height>
                    <Weight>${x.pWeight}</Weight>
                    <Contents xsi:type="urn:ArrayOfContentsType" soapenc:arrayType="urn:ContentsType[]">
                            ${buildContentsArray(x.contents)}
                    </Contents>
                    <!-- Optional for domestic -->
                    ${x.exportReason ? '<ExportReason>' + x.exportReason + '</ExportReason>' : ''}
                </Parcel>`
        })

        return `<Parcels xsi:type="urn:ArrayOfParcelType" soapenc:arrayType="urn:ParcelType[]">${parcelArray}</Parcels>`
    }


	return `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:despatchbay" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">
    <soapenv:Header/>
    <soapenv:Body>
        <urn:GetAvailableServices soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
            <Shipment xsi:type="urn:ShipmentRequestType">
			${buildParcelArray(parcels)}
                <SenderAddress xsi:type="urn:SenderAddressType">
					<SenderAddressID xsi:type="xsd:int">${senderAddressID}</SenderAddressID>
                </SenderAddress>
				${buildRecipientAddress(recipientAddress)}
            </Shipment>
        </urn:GetAvailableServices>
    </soapenv:Body>
</soapenv:Envelope>`




}

