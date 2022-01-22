# player-name-server

This is a microservice that manages data associated with players. ie. Name, Country, Gender, FPA Membership Number

Example **getAllPlayers** call in [jsbin](https://jsbin.com/pezakarora/edit?js,console)

## Interface
**getAllPlayers** - GET. Returns a JSON object containing all known players.  
URL: https://tkhmiv70u9.execute-api.us-west-2.amazonaws.com/development/getAllPlayers

Return:
{
    players: allPlayerData
}

The allPlayerData schema
| Property    | Type | Description |
| --- | --- | --- |
| Key | string | GUID shared across all microservices |
| firstName | string | First Name |
| lastName | string | Last Name |
| createdAt | number | Time in MS when this entry was created |
| lastActive | number | Time in MS when this entry last modified |
| membership | number | FPA Membership Number |
| country | string | 3 letter country abbreviation |
| gender | string | M, F, X |

**removePlayer** - POST. Removes a player  
URL: https://tkhmiv70u9.execute-api.us-west-2.amazonaws.com/development/removePlayer/{key}  
key: The GUID key of the player to remove

**modifyPlayer** - POST. Modify a player's data by key  
URL: https://tkhmiv70u9.execute-api.us-west-2.amazonaws.com/development/modifyPlayer/{key}/firstName/{firstName}/lastName/{lastName}  
key: The GUID key of the player to modify  
firstName: First Name  
lastName: Last Name  
body: Optional. JSON string containing optional fields:
| Property    | Type | Description |
| --- | --- | --- |
| membership | number | FPA Membership Number |
| country | string | 3 letter country abbreviation |
| gender | string | M, F, X |
