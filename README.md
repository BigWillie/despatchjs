# despatchjs

A very basic JavaScript SDK for Despatch Bay SOAP API V16 Shipping Service

https://github.com/despatchbay/despatchbay-api-v16/wiki

https://github.com/despatchbay/despatchbay-api-v16/wiki/Shipping-Service


It's been a busy week at RHQ Zombie Co - the UK subsidiary of Reaper Miniatures. We book all our shipments through a third party shipping API. We send a lot of parcels to the EU. At the time of writing, the Shipping API does not handle the Brexit rules.

So we have switched to Despatch Bay for our UK and EU parcels. Despatch Bay is local to us and their API is Brexit ready.

This is a very think wrapper for Despatch Bay's Shipping Service SOAP API.

Very simple to use - POST a data object, and receive JSON.

The following Despatch Bay SOAP methods are supported:

- GetAvailableServices
- GetAvailableCollectionDates
- GetCollection
- GetShipment
- AddShipment
- BookShipments
- CancelShipment

Create a .env file containing your default sender address ID (location), your auth - encoded as base64 (eg: username:password), and your userAgent string.

eg:

````
SENDERADDRESSID=000000
DESPATCHBAYAUTH=Basic RMks...yNzg...CRj..Dg
USERAGENT=WhatEverIWantToBeKnownAs
````

Then, require `despatchjs` 
```javascript
    const despatchjs = require('./xml-templates')
```
*Please note* : index.js at the root is full of example code.

`despatchjs` exports an Object of methods for each SOAP method.
`despatchjs` method names match the SOAP Method names, but in camelCase - eg...`AddShipment` becomes `addShipment`.

Simply pass an object into the SOAP method:
```javascript
    return await await despatchjs.addShipment(data)
```
...and get JSON back!
 

Internally, destructuring and named parameters are used throughout should Despatch Bay update their API etc. in future.

Despatch Bay API calls should be made in the following order:

* 1. getAvailableServices
* 2. getAvailableCollectionDates (pass in the courier ID obtained from step 1)
* 3. addShipment (pass in the serviceID - obtained from step 1, and the collectionDate - obtained from step 2)
* 4. bookShipments (pass in the shipmentID - obtained from step 3. Bookshipments can also take an Array of * shipmentIDs should you wish to save on API calls)

Additional methods exist to cancel a shipment, get information about a parcel collection, and get information about a shipment.

***
### 1. getAvailableServices

```javascript
const data = {
      SenderAddressID: '000000',  // Sender Address not required as all methods default to SENDERADDRESSID in .env. Add ID if you want to override.
/* International: When sending outside the UK (Including the all EU destinations, Channel Islands, Republic of Ireland and Northern Ireland) all fields of `parcels` become mandatory. For `exportReason` Please see:
https://github.com/despatchbay/despatchbay-api-v16/wiki/Shipping-Service#export-reasons */
      parcels : [
          {
             currency: 'GBP',
             pWeight:1.0, // Float. The weight of the parcel in kg
             pLength: 20, // Float. The length of the parcel in cm (longest dimension)
             pWidth: 20, // Float. The width of the parcel in cm (second longest dimension)
             pHeight: 20, // Float. The height of the parcel in cm (shortest dimension)
             exportReason: 'SOLD', // String. Please see note. Only required for international
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
   recipientAddress : {
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
}

return await despatchjs.getAvailableServices(data)
````
 
```javascript
            {
              "status": 200,
              "statusText": "OK",
              "payload": [
                {
                  "ServiceID": 9992,
                  "Format": "PARCEL",
                  "Name": "Demo Economy",
                  "Cost": 3.13,
                  "Courier": {
                    "CourierID": 99,
                    "CourierName": "Demo Courier"
                  }
                },
                {
                  "ServiceID": 9991,
                  "Format": "PARCEL",
                  "Name": "Demo Express",
                  "Cost": 5.26,
                  "Courier": {
                    "CourierID": 99,
                    "CourierName": "Demo Courier"
                  }
                }
              ]
            }
````

### 2. getAvailableCollectionDates
```javascript
   const data = {
      SenderAddressID: '000000',  // Sender Address not required as all methods default to SENDERADDRESSID in .env. Add ID if you want to override.
      courierID: '99', // taken from getAvailableServices
   }
   return await despatchjs.getAvailableCollectionDates(data)
   
   ```

```javascript
            {
              "status": 200,
              "statusText": "OK",
              "payload": {
                "CollectionDate": "2021-01-18"
              }
            }
```

### 3. addShipment 
Note - adding a shipment does not book the shipment... Adding a shipment returns a shipment ID, which you need to commit through the bookShipments method.

```javascript
   const data = {
      SenderAddressID: '000000',  // Sender Address not required as all methods default to SENDERADDRESSID in .env. Add ID if you want to override.
      orderID: '12345',
      serviceID: '9992',  // Taken from getAvailableServices
      collectionDate: '2021-01-18', // taken from getAvailableCollectionDates
      followShipment: false, // Follow the shipment on the Despatch Bay dashboard (optional)
/* International: When sending outside the UK (Including the all EU destinations, Channel Islands, Republic of Ireland and Northern Ireland) all fields of `parcels` become mandatory. For `exportReason` Please see:
https://github.com/despatchbay/despatchbay-api-v16/wiki/Shipping-Service#export-reasons */
        parcels : [
          {
             currency: 'GBP',
             pWeight:1.0, // Float. The weight of the parcel in kg
             pLength: 20, // Float. The length of the parcel in cm (longest dimension)
             pWidth: 20, // Float. The width of the parcel in cm (second longest dimension)
             pHeight: 20, // Float. The height of the parcel in cm (shortest dimension)
             exportReason: 'SOLD', // String. Please see note. Only required for international
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
       ],
       recipientAddress = {
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
   }

   return await despatchjs.addShipment(data)

   
```


```javascript
            {
              "status": 200,
              "statusText": "OK",
              "payload": {
                "ShipmentID": "134876-1749"
              }
            }
````

### 4. bookShipments
```javascript
   const data = {
      shipmentID: '134876-1691',  // Taken from addShipment. You can also pass in an Array of shippingIDs if you wish
   }
   return await despatchjs.bookShipments(data)
        
```   
```javascript
            {
              "status": 200,
              "statusText": "OK",
              "payload": {
                "return": {
                  "item": {
                    "ShipmentID": "134876-1691",
                    "ShipmentDocumentID": "dsG4LieHmHh1G",
                    "CollectionID": "DE-301",
                    "CollectionDocumentID": "c2ahS2Jpxge6r",
                    "ServiceID": 9992,
                    "Parcels": {
                      "item": {
                        "Weight": 1,
                        "Length": 20,
                        "Width": 20,
                        "Height": 20,
                        "Contents": {
                          "item": {
                            "Description": "This is my description",
                            "UnitQuantity": 1,
                            "UnitWeight": 1,
                            "UnitValue": 12,
                            "OriginCountryCode": "GB"
                          }
                        },
                        "TrackingNumber": "DEMO28051348761691001"
                      }
                    },
                    "ClientReference": 12345,
                    "RecipientAddress": {
                      "RecipientName": "Joanna Dark",
                      "RecipientTelephone": 7555555555,
                      "RecipientEmail": "",
                      "RecipientAddress": {
                        "CompanyName": "",
                        "Street": "Buckingham Palace",
                        "Locality": "",
                        "TownCity": "London",
                        "County": "London",
                        "PostalCode": "SW1A 1AA",
                        "CountryCode": "GB"
                      }
                    },
                    "IsFollowed": false,
                    "IsDespatched": true,
                    "IsPrinted": true,
                    "IsDelivered": true,
                    "IsCancelled": false,
                    "LabelsURL": "https://api.despatchbay.com/documents/v1/labels/dsG4LieHmHh1G"
                  }
                }
              }
            }
````

## Additional Methods

### cancelShipping
```javascript
   const data = {
      shipmentID: '134876-1691'
   }
   return await despatchjs.cancelShipment(data)
   
```   
 ```javascript
            {
              "status": 200,
              "statusText": "OK",
              "payload": {
                "CancelShipmentResponse": {
                  "Response": false
                }
              }
            }
````

### getCollection
```javascript
   const data = {
      collectionID: 'DE-301',
   }
   return await despatchjs.getCollection(data)
   
```   
```javascript
            {
              "status": 200,
              "statusText": "OK",
              "payload": {
                "return": {
                  "CollectionID": "DE-301",
                  "CollectionDocumentID": "c2ahS2Jpxge6r",
                  "CollectionType": "ad-hoc",
                  "CollectionDate": {
                    "CollectionDate": "2021-01-18"
                  },
                  "SenderAddress": {
                    "SenderAddressID": "000000"
                  },
                  "Courier": {
                    "CourierID": 99,
                    "CourierName": "Demo Courier"
                  },
                  "LabelsURL": "https://api.despatchbay.com/documents/v1/labels/",
                  "ManifestURL": ""
                }
              }
            }
````

### getShipment
```javascript
   const data = {
      shipmentID: '134876-1691'
   }
   return await despatchjs.getShipment(data)
   
```   
```javascript
            {
              "status": 200,
              "statusText": "OK",
              "payload": {
                "return": {
                  "ShipmentID": "134876-1691",
                  "ShipmentDocumentID": "dsG4LieHmHh1G",
                  "CollectionID": "DE-301",
                  "CollectionDocumentID": "c2ahS2Jpxge6r",
                  "ServiceID": 9992,
                  "Parcels": {
                    "item": {
                      "Weight": 1,
                      "Length": 20,
                      "Width": 20,
                      "Height": 20,
                      "Contents": {
                        "item": {
                          "Description": "This is my description",
                          "UnitQuantity": 1,
                          "UnitWeight": 1,
                          "UnitValue": 12,
                          "OriginCountryCode": "GB"
                        }
                      },
                      "TrackingNumber": "DEMO28051348761691001"
                    }
                  },
                  "ClientReference": 12345,
                  "RecipientAddress": {
                    "RecipientName": "Joanna Dark",
                    "RecipientTelephone": 7555555555,
                    "RecipientEmail": "",
                    "RecipientAddress": {
                      "CompanyName": "",
                      "Street": "Buckingham Palace",
                      "Locality": "",
                      "TownCity": "London",
                      "County": "London",
                      "PostalCode": "SW1A 1AA",
                      "CountryCode": "GB"
                    }
                  },
                  "IsFollowed": false,
                  "IsDespatched": true,
                  "IsPrinted": true,
                  "IsDelivered": true,
                  "IsCancelled": false,
                  "LabelsURL": "https://api.despatchbay.com/documents/v1/labels/"
                }
              }
            }
````


MIT License

Copyright (c) 2021 Robert Willie

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

# despatchjs
