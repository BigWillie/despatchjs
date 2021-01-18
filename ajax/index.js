require('dotenv').config();

const axios = require('axios')
const parser = require("fast-xml-parser");
const he = require('he');

// used to turn our XML into JSON
const xmlParserOptions = {
   attributeNamePrefix : "@_",
   attrNodeName: "attr", //default is 'false'
   textNodeName : "#text",
   ignoreAttributes : true,
   ignoreNameSpace : true,
   allowBooleanAttributes : false,
   parseNodeValue : true,
   parseAttributeValue : false,
   trimValues: true,
   cdataTagName: "__cdata", //default is 'false'
   cdataPositionChar: "\\c",
   parseTrueNumberOnly: false,
   arrayMode: false, //"strict"
   attrValueProcessor: (val, attrName) => he.decode(val, {isAttributeValue: true}),//default is a=>a
   tagValueProcessor : (val, tagName) => he.decode(val), //default is a=>a
   stopNodes: ["parse-me-as-string"]
};


const dataPlucker = ({data, method}) => {
   const SOAPMethods = {
      getAvailableServices() {
         return data.Envelope.Body.GetAvailableServicesResponse.return.item
      },
      getAvailableCollectionDates() {
         // Returns the next available date
         return data.Envelope.Body.GetAvailableCollectionDatesResponse.return.item[0]
      },
      addShipment() {
         // Add a shipment - returns shipmentID. At this stage, shipment is not booked
         // must book shipment with ID to book it.
         return data.Envelope.Body.AddShipmentResponse
      },
      bookShipment() {
         return data.Envelope.Body.BookShipmentsResponse
      },
      cancelShipment() {
         return data.Envelope.Body
      },
      getCollection() {
         return data.Envelope.Body.GetCollectionResponse
      },
      getShipment() {
         return data.Envelope.Body.GetShipmentResponse
      }
   }
   if (typeof SOAPMethods[method] === 'undefined') {
      return data
   }
   return SOAPMethods[method]()
}



// a single method to post the XML, and parse it
module.exports = async ({method, xml}) => {

    const url = 'https://api.despatchbay.com/soap/v16/shipping?wsdl';

    const headers = {
       'Authorization': process.env.DESPATCHBAYAUTH,
       'user-agent':  process.env.USERAGENT,
       'Content-Type': 'text/xml',
    };
  
    try {
       const response = await axios.post(url, xml, { headers} )
       const tObj = parser.getTraversalObj(response.data, xmlParserOptions)
       const jsonObj = parser.convertToJson(tObj, xmlParserOptions)
       const data = {
          status: response.status,
          statusText: response.statusText,
          payload: dataPlucker( {data : jsonObj , method})
       }
       return data
    } catch(err) {
       const tObj = parser.getTraversalObj(err.response.data, xmlParserOptions)
       const jsonObj = parser.convertToJson(tObj, xmlParserOptions)
       const data = {
          status: err.response.status,
          message: jsonObj.Envelope.Body.Fault.faultstring,
          payload: JSON.stringify(jsonObj),
          postedXML: err.response.config.data
       }
       return data
    }
 
 
 }
 