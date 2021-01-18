const addShipment = require("./AddShipment")
const bookShipments = require("./BookShipments.js")
const cancelShipment = require("./CancelShipment")
const getAvailableCollectionDates = require("./GetAvailableCollectionDates")
const getAvailableServices = require("./GetAvailableServices")
const getCollection = require("./GetCollection")
const getShipment = require("./GetShipment")

module.exports = {
    addShipment,
    bookShipments,
    cancelShipment,
    getAvailableCollectionDates,
    getAvailableServices,
    getCollection,
    getShipment
}
