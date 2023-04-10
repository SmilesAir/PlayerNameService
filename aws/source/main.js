const AWS = require("aws-sdk")
const uuid = require("uuid")
let docClient = new AWS.DynamoDB.DocumentClient()
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3")
const s3Client = new S3Client({ region: process.region })

const Common = require("./common.js")

const infoKey = "info"
const cachedDataName = `AllPlayerData.json`

console.log(process)

module.exports.addPlayer = (e, c, cb) => { Common.handler(e, c, cb, async (event, context) => {
    let firstName = decodeURIComponent(event.pathParameters.firstName)
    let lastName = decodeURIComponent(event.pathParameters.lastName)
    let request = JSON.parse(event.body) || {}
    let membership = request.membership
    let country = request.country
    let gender = request.gender
    let aliasKey = request.aliasKey
    let fpaWebsiteId = request.fpaWebsiteId

    let newPlayerData = {
        key: uuid.v4(),
        firstName: firstName,
        lastName: lastName,
        createdAt: Date.now(),
        lastActive: Date.now(),
        membership: membership || 0,
        country: country,
        gender: gender,
        aliasKey: aliasKey,
        fpaWebsiteId: fpaWebsiteId
    }

    let putParams = {
        TableName : process.env.PLAYER_TABLE,
        Item: newPlayerData
    }
    await docClient.put(putParams).promise().catch((error) => {
        throw error
    })

    await setIsPlayerDataDirty(true)

    return {
        addedPlayer: newPlayerData
    }
})}

module.exports.getAllPlayers = (e, c, cb) => { Common.handler(e, c, cb, async (event, context) => {
    let allPlayers
    let isPlayerDataDirty = true
    let getInfoParams = {
        TableName : process.env.INFO_TABLE,
        Key: {
            key: infoKey
        }
    }
    await docClient.get(getInfoParams).promise().then((response) => {
        isPlayerDataDirty = response.Item === undefined || response.Item.isPlayerDataDirty
    }).catch((error) => {
        throw error
    })

    if (isPlayerDataDirty) {
        allPlayers = await scanPlayers()

        let putBucketParams = {
            Bucket: process.env.CACHE_BUCKET,
            Key: cachedDataName,
            Body: JSON.stringify(allPlayers)
        }

        await s3Client.send(new PutObjectCommand(putBucketParams)).catch((error) => {
            throw error
        })

        await setIsPlayerDataDirty(false)
    } else {
        const streamToString = (stream) =>
        new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
        });

        let getBucketParams = {
            Bucket: process.env.CACHE_BUCKET,
            Key: cachedDataName
        }
        allPlayers = await s3Client.send(new GetObjectCommand(getBucketParams)).then((response) => {
            return streamToString(response.Body)
        }).then((dataString) => {
            return allPlayers = JSON.parse(dataString)
        }).catch((error) => {
            throw error
        })
    }

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

    await setIsPlayerDataDirty(true)

    return {}
})}

module.exports.modifyPlayer = (e, c, cb) => { Common.handler(e, c, cb, async (event, context) => {
    let key = decodeURIComponent(event.pathParameters.key)
    let firstName = decodeURIComponent(event.pathParameters.firstName)
    let lastName = decodeURIComponent(event.pathParameters.lastName)
    let request = JSON.parse(event.body) || {}
    let membership = request.membership
    let country = request.country
    let gender = request.gender

    let modifiedPlayerData = {
        key: key,
        firstName: firstName,
        lastName: lastName,
        createdAt: Date.now(),
        lastActive: Date.now(),
        membership: membership || 0,
        country: country,
        gender: gender
    }

    let putParams = {
        TableName : process.env.PLAYER_TABLE,
        Item: modifiedPlayerData
    }
    await docClient.put(putParams).promise().catch((error) => {
        throw error
    })

    await setIsPlayerDataDirty(true)

    return {
        modifiedPlayer: modifiedPlayerData
    }
})}

module.exports.importFromAllData = (e, c, cb) => { Common.handler(e, c, cb, async (event, context) => {
    let request = JSON.parse(event.body) || {}
    const allData = request.allData

    if (allData === undefined || allData.playersData === undefined) {
        throw "Missing playersData"
    }

    let putRequests = []
    for (let playerDataKey in allData.playersData) {
        const playerData = allData.playersData[playerDataKey]
        let putPlayer = Object.assign({
            key: playerDataKey
        }, playerData)
        putRequests.push({
            PutRequest: {
                Item: putPlayer
            }
        })
    }

    console.log(putRequests)

    await batchPutItems(process.env.PLAYER_TABLE, putRequests)

    return {
        success: true,
        importedPlayersCount: putRequests.length
    }
})}

module.exports.assignAlias = (e, c, cb) => { Common.handler(e, c, cb, async (event, context) => {
    let aliasKey = decodeURIComponent(event.pathParameters.aliasKey)
    let request = JSON.parse(event.body) || {}
    let originalKey = request.originalKey

    if (originalKey === aliasKey) {
        throw "Error. Trying to assign alias to self"
    }

    if (aliasKey === undefined) {
        throw "Error. Invalid key"
    }

    if (originalKey !== undefined) {
        let updateParams = {
            TableName: process.env.PLAYER_TABLE,
            Key: {"key": aliasKey},
            UpdateExpression: "set aliasKey = :aliasKey",
            ExpressionAttributeValues: {
                ":aliasKey": originalKey
            },
            ReturnValues: "NONE"
        }
        await docClient.update(updateParams).promise().catch((error) => {
            throw error
        })
    } else {
        let updateParams = {
            TableName: process.env.PLAYER_TABLE,
            Key: {"key": aliasKey},
            UpdateExpression: "remove aliasKey",
            ReturnValues: "NONE"
        }
        await docClient.update(updateParams).promise().catch((error) => {
            throw error
        })
    }

    await setIsPlayerDataDirty(true)

    return {
        success: true
    }
})}

module.exports.assignFpaWebsiteId = (e, c, cb) => { Common.handler(e, c, cb, async (event, context) => {
    let key = decodeURIComponent(event.pathParameters.key)
    let fpaWebsiteId = parseInt(decodeURIComponent(event.pathParameters.fpaWebsiteId), 10)

    if (key === undefined) {
        throw "Error. Invalid key"
    }

    if (fpaWebsiteId === undefined) {
        throw "Error. Invalid fpaWebsiteId"
    }

    let updateParams = {
        TableName: process.env.PLAYER_TABLE,
        Key: {"key": key},
        UpdateExpression: "set fpaWebsiteId = :fpaWebsiteId",
        ExpressionAttributeValues: {
            ":fpaWebsiteId": fpaWebsiteId
        },
        ReturnValues: "NONE"
    }
    await docClient.update(updateParams).promise().catch((error) => {
        throw error
    })

    await setIsPlayerDataDirty(true)

    return {
        success: true
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

async function setIsPlayerDataDirty(isDirty) {
    let putInfoParams = {
        TableName : process.env.INFO_TABLE,
        Item: {
            key: infoKey,
            isPlayerDataDirty: isDirty
        }
    }
    await docClient.put(putInfoParams).promise().catch((error) => {
        throw error
    })
}

async function batchPutItems(tableName, putRequests) {
    for (let i = 0; i < putRequests.length; i += 25) {
        let params = {
            RequestItems: {
                [tableName]: putRequests.slice(i, i + 25)
            }
        }
        await docClient.batchWrite(params).promise().catch((error) => {
            throw error
        })
    }
}
