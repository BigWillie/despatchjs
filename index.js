const despatchjs = require('./despatchjs')



const addShipment = async () => {

   const data = {
    //  SenderAddressID: '000000',  // Sender Address not required as defaults to ENV
    orderID: '12345',
      serviceID: '9992',
      collectionDate: '2021-01-18',
      followShipment: false // Follow the shipment on the Despatch Bay dashboard (optional)
   }

   // An Array of parcels
   // International: When sending outside the UK (Including the all EU destinations, Channel Islands, Republic of Ireland and Northern Ireland) all fields of ParcelContentType become mandatory.
  
   data.parcels = [
      {
         currency: 'GBP',
         pWeight:1.0, // Float. The weight of the parcel in kg
         pLength: 20, // Float. The length of the parcel in cm (longest dimension)
         pWidth: 20, // Float. The width of the parcel in cm (second longest dimension)
         pHeight: 20, // Float. The height of the parcel in cm (shortest dimension)
         exportReason: 'SOLD', // String. Only needed for Export. Please see https://github.com/despatchbay/despatchbay-api-v16/wiki/Shipping-Service#export-reasons
         contents: [
            {
               description: 'This is my description', // String. Description of the item
               unitQuantity: 1, // Int. The quantity of this item within the parcel
               unitWeight: 0.5, // Float. The weight of one unit of the item (in kg)
               unitValue: 12,   // Float. The value of one unit of the item (In the currency specified in the parent ParcelType
               tariffCode: 1234567890, // String. Only needed for Export. The HS Tariff Code / Commodity code of the item
               originCountryCode: 'GB' // String. The country of origin of the item (ISO 3166-1 alpha-2 code)
            }
         ]
      }
   ]

   data.recipientAddress = {
      recipientName: 'Joanna Dark', // String. The name of the recipient
      recipientTelephone: '07555555555', // String. The telphone number of the recipient (optional)
      recipientEmail: '', // String. The email address of the recipient (optional)
      companyName: '', // String. Company/Organisation name (optional)
      street: 'Buckingham Palace', // String. First line of street address
      locality: '', // String. Second line of street address (optional)
      townCity: 'London', // String. Town or city name
      county: 'London', // String. County
      postalCode: 'SW1A1AA', // String. Postal code (optional for countries without postcodes)
      countryCode: 'GB', // String. ISO 3166-1 alpha-2 code
   }

   return await despatchjs.addShipment(data)


}



const bookShipment = async () => {
   const data = {
      shipmentID: '134876-1691',  // will also take an array of IDs
   }
   return await despatchjs.bookShipments(data)

}


const cancelShipment = async () => {
   const data = {
      shipmentID: '134876-1691'
   }
   return await despatchjs.cancelShipment(data)
}


const getAvailableCollectionDates = async () => {
   const data = {
     // SenderAddressID: '000000',  // Sender Address not required as we only have one location - 288918
      courierID: '99',
   }
   return await despatchjs.getAvailableCollectionDates(data)
}



const getAvailableServices = async () => {

   const data = {
    //  SenderAddressID: '000000',  // Sender Address not required as defaults to ENV
   }


   // An Array of parcels
   // International: When sending outside the UK (Including the all EU destinations, Channel Islands, Republic of Ireland and Northern Ireland) all fields of ParcelContentType become mandatory.
  
   data.parcels = [
      {
         currency: 'GBP',
         pWeight:1.0, // Float. The weight of the parcel in kg
         pLength: 20, // Float. The length of the parcel in cm (longest dimension)
         pWidth: 20, // Float. The width of the parcel in cm (second longest dimension)
         pHeight: 20, // Float. The height of the parcel in cm (shortest dimension)
         exportReason: 'SOLD', // String. Please see https://github.com/despatchbay/despatchbay-api-v16/wiki/Shipping-Service#export-reasons
         contents: [
            {
               description: 'This is my description', // String. Description of the item
               unitQuantity: 1, // Int. The quantity of this item within the parcel
               unitWeight: 0.5, // Float. The weight of one unit of the item (in kg)
               unitValue: 12,   // Float. The value of one unit of the item (In the currency specified in the parent ParcelType
               tariffCode: 1234567890, // String. Only needed for Export. The HS Tariff Code / Commodity code of the item
               originCountryCode: 'GB' // String. The country of origin of the item (ISO 3166-1 alpha-2 code)
            }
         ]
      }
   ]

   data.recipientAddress = {
      recipientName: 'Joanna Dark', // String. The name of the recipient
      recipientTelephone: '07555555555', // String. The telphone number of the recipient (optional)
      recipientEmail: '', // String. The email address of the recipient (optional)
      companyName: '', // String. Company/Organisation name (optional)
      street: 'Buckingham Palace', // String. First line of street address
      locality: '', // String. Second line of street address (optional)
      townCity: 'London', // String. Town or city name
      county: 'London', // String. County
      postalCode: 'SW1A1AA', // String. Postal code (optional for countries without postcodes)
      countryCode: 'GB', // String. ISO 3166-1 alpha-2 code
   }

   return await despatchjs.getAvailableServices(data)
}



const getCollection = async () => {
   const data = {
      collectionID: 'DE-301',
   }
   return await despatchjs.getCollection(data)
}



const getShipment = async () => {
   const data = {
      shipmentID: '134876-1691'
   }
   return await despatchjs.getShipment(data)
}



/* Run the methods */


const testing = async () => {
   console.log("Test: Each SOAP Method's response as JSON. Please see data object in each test method to what is needed.")

   console.log('1. get available services')
   const availableServices = await getAvailableServices()
   console.log(JSON.stringify(availableServices, null, 2))

   console.log('2. get available collection dates')
   const availableCollectionDates = await getAvailableCollectionDates()
   console.log(JSON.stringify(availableCollectionDates, null, 2))

   console.log('3. add shipping')
   const AddShipment = await addShipment()
   console.log(JSON.stringify(AddShipment, null, 2))

   console.log('4. book shipping')
   const BookShipment = await bookShipment()
   console.log(JSON.stringify(BookShipment, null, 2))

   console.log('5. cancel shipping')
   const CancelShipment = await cancelShipment()
   console.log(JSON.stringify(CancelShipment, null, 2))

   console.log('6. get collection')
   const GetCollection = await getCollection()
   console.log(JSON.stringify(GetCollection, null, 2))

   console.log('7. get shipment')
   const GetShipment = await getShipment()
   console.log(JSON.stringify(GetShipment, null, 2))
}

testing()

