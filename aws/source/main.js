const AWS = require("aws-sdk")
const uuid = require("uuid")
let docClient = new AWS.DynamoDB.DocumentClient()

const Common = require("./common.js")

// GetAllPlayers, AddPlayer, AddPlayerAlias, RemovePlayer, RemovePlayerAlias, GetPlayerById, GetPlayersByAlias, SetDisplayAlias

module.exports.addPlayer = (e, c, cb) => { Common.handler(e, c, cb, async (event, context) => {
    let firstName = decodeURIComponent(event.pathParameters.firstName)
    let lastName = decodeURIComponent(event.pathParameters.lastName)
    let request = JSON.parse(event.body) || {}
    let membership = request.membership
    let country = request.country

    let newPlayerData = {
        key: uuid.v4(),
        firstName: firstName,
        lastName: lastName,
        createdAt: Date.now(),
        lastActive: Date.now(),
        membership: membership || 0,
        country: country
    }

    let putParams = {
        TableName : process.env.PLAYER_TABLE,
        Item: newPlayerData
    }
    await docClient.put(putParams).promise().catch((error) => {
        throw error
    })

    return {
        addedPlayer: newPlayerData
    }
})}

module.exports.getAllPlayers = (e, c, cb) => { Common.handler(e, c, cb, async (event, context) => {

    let allPlayers = await scanPlayers()

    return {
        players: allPlayers
    }
})}

module.exports.removePlayer = (e, c, cb) => { Common.handler(e, c, cb, async (event, context) => {
    let key = decodeURIComponent(event.pathParameters.key)

    let deleteParams = {
        TableName : process.env.PLAYER_TABLE,
        Key: {
            key: key
        }
    }

    await docClient.delete(deleteParams).promise().catch((error) => {
        throw error
    })

    return {}
})}

module.exports.modifyPlayer = (e, c, cb) => { Common.handler(e, c, cb, async (event, context) => {
    let key = decodeURIComponent(event.pathParameters.key)
    let firstName = decodeURIComponent(event.pathParameters.firstName)
    let lastName = decodeURIComponent(event.pathParameters.lastName)
    let request = JSON.parse(event.body) || {}
    let membership = request.membership
    let country = request.country

    let modifiedPlayerData = {
        key: key,
        firstName: firstName,
        lastName: lastName,
        createdAt: Date.now(),
        lastActive: Date.now(),
        membership: membership || 0,
        country: country
    }

    let putParams = {
        TableName : process.env.PLAYER_TABLE,
        Item: modifiedPlayerData
    }
    await docClient.put(putParams).promise().catch((error) => {
        throw error
    })

    return {
        modifiedPlayer: modifiedPlayerData
    }
})}

async function scanPlayers() {
    let allPlayers = {}

    let scanParams = {
        TableName : process.env.PLAYER_TABLE
    }
    let items
    do {
        items = await docClient.scan(scanParams).promise().catch((error) => {
            throw error
        })
        for (let player of items.Items) {
            allPlayers[player.key] = player
        }

        scanParams.ExclusiveStartKey = items.LastEvaluatedKey;
    } while (items.LastEvaluatedKey !== undefined)

    return allPlayers
}

