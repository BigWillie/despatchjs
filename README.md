# despatchjs

A very basic JavaScript SDK for Despatch Bay SOAP API V16 Shipping Service

https://github.com/despatchbay/despatchbay-api-v16/wiki

https://github.com/despatchbay/despatchbay-api-v16/wiki/Shipping-Service

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

Then, require `xmlTemplates` and the `doAjax` method
```javascript
    const xmlTemplates = require('./xml-templates')
    const doAjax = require('./ajax')
```

`xmlTemplates` exports an Object of methods used to generate an XML template for each SOAP method.
`xmlTemplate` method names match the SOAP Method names, but in camelCase - eg...`AddShipment` becomes `addShipment`.

To create an XML template, simply pass a data object to the chosen method.

    const xml = xmlTemplates.addShipment(data)
    return await doAjax({ xml, method: 'addShipment' })

To post to Desptach Bay, the XML and method name is passed to the `doAjax` method.

Destructuring and named parameters are used throughout should Desptach Bay update their API etc. in future.

Despatch Bay API calls should be made in the following order:

***
### 1. getAvailableServices

```javascript
const data = {
      SenderAddressID: '000000',  // Sender Address not required as all methods default to our location.
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

const xml = xmlTemplates.getAvailableServices(data)
return await doAjax({ xml, method: 'getAvailableServices' })
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
      SenderAddressID: '000000',  // Sender Address not required as defaults to our location
      courierID: '99', // taken from getAvailableServices
   }
   const xml = xmlTemplates.getAvailableCollectionDates(data)
   return await doAjax({ xml, method: 'getAvailableCollectionDates' })
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
      SenderAddressID: '000000',  // Sender Address not required as we only have one location - 288918
      orderID: '12345',
      serviceID: '9992',
      collectionDate: '2021-01-18',
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

   const xml = xmlTemplates.addShipment(data)

   return await doAjax({ xml, method: 'addShipment' })
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
      shipmentID: '134876-1691',  // will also take an array of IDs
   }
   const xml = xmlTemplates.bookShipments(data)
   return await doAjax({ xml, method: 'bookShipment' })
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

#### cancelShipping
```javascript
   const data = {
      shipmentID: '134876-1691'
   }
   const xml = xmlTemplates.cancelShipment(data)
   return await doAjax({ xml, method: 'cancelShipment' })
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
   const xml = xmlTemplates.getCollection(data)
   return await doAjax({ xml, method: 'getCollection' })
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

#### getShipment
```javascript
   const data = {
      shipmentID: '134876-1691'
   }
   const xml = xmlTemplates.getShipment(data)
   return await doAjax({ xml, method: 'getShipment' })
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
