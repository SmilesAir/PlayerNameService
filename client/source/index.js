/* eslint-disable no-alert */
/* eslint-disable no-loop-func */
/* eslint-disable func-style */
/* eslint-disable no-nested-ternary */
"use strict"

const React = require("react")
const ReactDOM = require("react-dom")
const Mobx = require("mobx")
import { useForm, useField, splitFormProps } from "react-form"
const StringSimilarity = require("string-similarity")

require("./index.less")

const awsPath = __STAGE__ === "DEVELOPMENT" ? "https://tkhmiv70u9.execute-api.us-west-2.amazonaws.com/development/" : "https://4wnda3jb78.execute-api.us-west-2.amazonaws.com/production/"
const countryCodes = [ "AFG", "ALA", "ALB", "DZA", "ASM", "AND", "AGO", "AIA", "ATA", "ATG", "ARG", "ARM", "ABW", "AUS", "AUT", "AZE", "BHS", "BHR", "BGD", "BRB", "BLR", "BEL", "BLZ", "BEN", "BMU", "BTN", "BOL", "BES", "BIH", "BWA", "BVT", "BRA", "IOT", "BRN", "BGR", "BFA", "BDI", "KHM", "CMR", "CAN", "CPV", "CYM", "CAF", "TCD", "CHL", "CHN", "CXR", "CCK", "COL", "COM", "COG", "COD", "COK", "CRI", "CIV", "HRV", "CUB", "CUW", "CYP", "CZE", "DNK", "DJI", "DMA", "DOM", "ECU", "EGY", "SLV", "GNQ", "ERI", "EST", "ETH", "FLK", "FRO", "FJI", "FIN", "FRA", "GUF", "PYF", "ATF", "GAB", "GMB", "GEO", "DEU", "GHA", "GIB", "GRC", "GRL", "GRD", "GLP", "GUM", "GTM", "GGY", "GIN", "GNB", "GUY", "HTI", "HMD", "VAT", "HND", "HKG", "HUN", "ISL", "IND", "IDN", "IRN", "IRQ", "IRL", "IMN", "ISR", "ITA", "JAM", "JPN", "JEY", "JOR", "KAZ", "KEN", "KIR", "PRK", "KOR", "XKX", "KWT", "KGZ", "LAO", "LVA", "LBN", "LSO", "LBR", "LBY", "LIE", "LTU", "LUX", "MAC", "MKD", "MDG", "MWI", "MYS", "MDV", "MLI", "MLT", "MHL", "MTQ", "MRT", "MUS", "MYT", "MEX", "FSM", "MDA", "MCO", "MNG", "MNE", "MSR", "MAR", "MOZ", "MMR", "NAM", "NRU", "NPL", "NLD", "NCL", "NZL", "NIC", "NER", "NGA", "NIU", "NFK", "MNP", "NOR", "OMN", "PAK", "PLW", "PSE", "PAN", "PNG", "PRY", "PER", "PHL", "PCN", "POL", "PRT", "PRI", "QAT", "SRB", "REU", "ROU", "RUS", "RWA", "BLM", "SHN", "KNA", "LCA", "MAF", "SPM", "VCT", "WSM", "SMR", "STP", "SAU", "SEN", "SYC", "SLE", "SGP", "SXM", "SVK", "SVN", "SLB", "SOM", "ZAF", "SGS", "SSD", "ESP", "LKA", "SDN", "SUR", "SJM", "SWZ", "SWE", "CHE", "SYR", "TWN", "TJK", "TZA", "THA", "TLS", "TGO", "TKL", "TON", "TTO", "TUN", "TUR", "XTX", "TKM", "TCA", "TUV", "UGA", "UKR", "ARE", "GBR", "USA", "UMI", "URY", "UZB", "VUT", "VEN", "VNM", "VGB", "VIR", "WLF", "ESH", "YEM", "ZMB", "ZWE" ]
let allData = Mobx.observable({
    playerData: {},
    showAllPlayers: false,
    searchKeys: undefined
})

function validateKey(value) {
    if (!value) {
        return "Key required"
    }

    return false
}

function validateFirstName(value) {
    if (!value) {
        return "First name required"
    }

    return false
}

function validateLastName(value) {
    if (!value) {
        return "Last name required"
    }

    return false
}

function validateBulk(value) {
    if (!value) {
        return "Cannot be empty"
    }

    return false
}

function validateMembership(value) {
    if (value) {
        return Number.isInteger(parseInt(value, 10)) ? false : "Must be a number"
    }

    return false
}


function KeyField() {
    const {
        meta: { error, isTouched, isValidating },
        getInputProps
    } = useField("key", {
        validate: validateKey
    })

    return (
        <div>
            <input {...getInputProps()} />{" "}
            {isValidating ?
                <em>Validating...</em> :
                isTouched && error ?
                    <em>{error}</em> :
                    null}
        </div>
    )
}

function FirstNameField() {
    const {
        meta: { error, isTouched, isValidating },
        getInputProps
    } = useField("firstName", {
        validate: validateFirstName
    })

    return (
        <div>
            <input {...getInputProps()} />{" "}
            {isValidating ?
                <em>Validating...</em> :
                isTouched && error ?
                    <em>{error}</em> :
                    null}
        </div>
    )
}

function LastNameField() {
    const {
        meta: { error, isTouched, isValidating },
        getInputProps
    } = useField("lastName", {
        validate: validateLastName
    })

    return (
        <div>
            <input {...getInputProps()} />{" "}
            {isValidating ?
                <em>Validating...</em> :
                isTouched && error ?
                    <em>{error}</em> :
                    null}
        </div>
    )
}

function SearchNameField() {
    const {
        meta: { error, isTouched, isValidating },
        getInputProps
    } = useField("searchName", {
        validate: undefined
    })

    return (
        <div>
            <input {...getInputProps()} />{" "}
            {isValidating ?
                <em>Validating...</em> :
                isTouched && error ?
                    <em>{error}</em> :
                    null}
        </div>
    )
}

function OriginalPlayerKey() {
    const {
        meta: { error, isTouched, isValidating },
        getInputProps
    } = useField("originalKey", {
        validate: undefined
    })

    return (
        <div>
            <input {...getInputProps()} />{" "}
            {isValidating ?
                <em>Validating...</em> :
                isTouched && error ?
                    <em>{error}</em> :
                    null}
        </div>
    )
}

function AliasPlayerKey() {
    const {
        meta: { error, isTouched, isValidating },
        getInputProps
    } = useField("aliasKey", {
        validate: validateKey
    })

    return (
        <div>
            <input {...getInputProps()} />{" "}
            {isValidating ?
                <em>Validating...</em> :
                isTouched && error ?
                    <em>{error}</em> :
                    null}
        </div>
    )
}

function MembershipField() {
    const {
        meta: { error, isTouched, isValidating },
        getInputProps
    } = useField("membership", {
        validate: validateMembership
    })

    return (
        <div>
            <input {...getInputProps()} />{" "}
            {isValidating ?
                <em>Validating...</em> :
                isTouched && error ?
                    <em>{error}</em> :
                    null}
        </div>
    )
}

function SelectField(props) {
    const [ field, fieldOptions, { options, ...rest } ] = splitFormProps(props)

    const {
        value = "",
        setValue,
        meta: { error, isTouched }
    } = useField(field, fieldOptions)

    const handleSelectChange = (e) => {
        setValue(e.target.value)
    }

    return (
        <div>
            <select {...rest} value={value} onChange={handleSelectChange}>
                <option disabled value="" />
                {options.map((option) =>
                    <option key={option} value={option}>
                        {option}
                    </option>
                )}
            </select>{" "}
            {isTouched && error ? <em>{error}</em> : null}
        </div>
    )
}

function BulkField() {
    const {
        meta: { error, isTouched, isValidating },
        getInputProps
    } = useField("bulk", {
        validate: validateBulk
    })

    return (
        <div>
            <textarea {...getInputProps()} />{" "}
            {isValidating ?
                <em>Validating...</em> :
                isTouched && error ?
                    <em>{error}</em> :
                    null}
        </div>
    )
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
}

function PlayerSearchOutput() {
    if (allData.searchKeys === undefined) {
        return null
    }

    if (allData.searchKeys === "InProgress") {
        return <h3>Searching...</h3>
    }

    let rows = []
    if (allData.searchKeys.length > 0) {
        rows.push(
            <tr key="header">
                <td>Key - Click to Copy</td>
                <td>First Name</td>
                <td>Last Name</td>
                <td>FPA #</td>
                <td>Country</td>
                <td>Gender</td>
                <td>Created At</td>
                <td>Last Active</td>
                <td>FPA</td>
                <td>Alias Key</td>
            </tr>
        )
    }
    for (let playerKey of allData.searchKeys) {
        let player = allData.playerData[playerKey]
        rows.push(
            <tr key={player.key}>
                <td><button onClick={() => copyToClipboard(player.key)}>{player.key}</button></td>
                <td>{player.firstName}</td>
                <td>{player.lastName}</td>
                <td>{player.membership}</td>
                <td>{player.country}</td>
                <td>{player.gender}</td>
                <td>{player.createdAt}</td>
                <td>{player.lastActive}</td>
                <td>{player.fpaWebsiteId}</td>
                <td>{player.aliasKey}</td>
            </tr>
        )
    }

    return (
        <table>
            <thead>
                <tr>
                    <th colSpan="20">Results</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    )
}

function PlayerOutput() {
    if (allData.showAllPlayers !== true) {
        return null
    }

    let rows = []
    for (let playerKey in allData.playerData) {
        let player = allData.playerData[playerKey]
        rows.push(
            <tr key={player.key}>
                <td>{player.key}</td>
                <td>{player.firstName}</td>
                <td>{player.lastName}</td>
                <td>{player.membership}</td>
                <td>{player.country}</td>
                <td>{player.gender}</td>
                <td>{player.createdAt}</td>
                <td>{player.lastActive}</td>
                <td>{player.aliasKey}</td>
            </tr>
        )
    }

    return (
        <table>
            <thead>
                <tr>
                    <th colSpan="20">Players</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    )
}

function getAllPlayersAndShow() {
    allData.showAllPlayers = true
    getAllPlayers()
}

function getAllPlayers() {
    return getData(`${awsPath}getAllPlayers`).then((response) => {
        allData.playerData = response.players

        console.log(response)

        render()
    }).catch((error) => {
        console.error(error)
    })
}

function importFromAllData(e) {
    console.log(e.target.value)

    const fileReader = new FileReader()
    fileReader.readAsText(e.target.files[0])
    fileReader.onload = (x) => {
        const jsonData = JSON.parse(x.target.result)
        console.log(jsonData)

        postData(`${awsPath}importFromAllData`, {
            allData: jsonData
        }).then((response) => {
            console.log(response)
            alert(`Imported ${response.importedPlayersCount} players`)
        }).catch((error) => {
            console.error(error)
        })
    }
}

function getSimilarPlayersByName(name) {
    let cachedPlayers = []
    for (let playerKey in allData.playerData) {
        let player = allData.playerData[playerKey]
        cachedPlayers.push({
            key: player.key,
            firstName: (player.firstName || "").toLowerCase(),
            lastName: (player.lastName || "").toLowerCase(),
            fullName: `${(player.firstName || "").toLowerCase()} ${(player.lastName || "").toLowerCase()}`
        })
    }

    let bestNames = []
    let searchName = name.toLowerCase()
    const maxCount = 10
    for (let cachedPlayer of cachedPlayers) {
        let similar = StringSimilarity.compareTwoStrings(searchName, cachedPlayer.firstName)
        similar = Math.max(similar, StringSimilarity.compareTwoStrings(searchName, cachedPlayer.lastName))
        similar = Math.max(similar, StringSimilarity.compareTwoStrings(searchName, cachedPlayer.fullName))
        if (similar > .4) {
            if (bestNames.length < maxCount || similar > bestNames[maxCount - 1].score) {
                let index = bestNames.findIndex((data) => data.score < similar)
                bestNames.splice(index >= 0 ? index : bestNames.length, 0, {
                    key: cachedPlayer.key,
                    score: similar
                })

                if (bestNames.length > maxCount) {
                    bestNames.pop()
                }
            }
        }
    }

    return bestNames.map((data) => data.key)
}

function checkAliasErrors(alertOnSuccess, playerKeyToUpdate, newAliasKey) {
    return getAllPlayers().then(() => {
        if (playerKeyToUpdate !== undefined) {
            allData.playerData[playerKeyToUpdate].aliasKey = newAliasKey
        }

        let loopErrors = findPlayerAliasLoops()
        let isError = loopErrors.length > 0
        let message = "No Errors"
        if (isError) {
            message = "Alias Loops Found:\n"
            for (let loop of loopErrors) {
                let line = ""
                for (let player of loop) {
                    line += player.key + ": " + player.firstName + " " + player.lastName + " -> "
                }
                message += line.slice(0, line.length - 4) + "\n\n"
            }
        }

        if (isError || alertOnSuccess) {
            alert(message)
        }

        return isError
    }).catch((error) => {
        console.error(error)

        return false
    })
}

function findPlayerAliasLoops() {
    let loops = []
    for (let playerKey in allData.playerData) {
        let player = allData.playerData[playerKey]
        let path = []
        let history = {}
        let current = player
        while (current !== undefined && current.aliasKey !== undefined) {
            if (history[current.key] !== undefined) {
                loops.push(path)
                break
            }

            path.push(current)
            history[current.key] = 1
            current = allData.playerData[current.aliasKey]
        }
    }
    return loops
}

function PlayerNamesApi() {
    // Use the useForm hook to create a form instance
    const AddPlayerForm = useForm({
        onSubmit: async(values, instance) => {
            postData(`${awsPath}addPlayer/${values.firstName}/lastName/${values.lastName}`, {
                membership: parseInt(values.membership, 10),
                country: values.country,
                gender: values.gender
            }).then((response) => {
                console.log(response)
            }).catch((error) => {
                console.error(error)
            })
        },
        debugForm: false
    })

    const AddBulkPlayerForm = useForm({
        onSubmit: async(values, instance) => {
            let lines = values.bulk.split("\n")
            for (let line of lines) {
                let infoPieces = line.split("\t")
                let names = infoPieces[0].split(" ")

                postData(`${awsPath}addPlayer/${names[0]}/lastName/${names[1]}`, {
                    country: infoPieces[1],
                    gender: infoPieces[2].toUpperCase()
                }).then((response) => {
                    console.log(response)
                }).catch((error) => {
                    console.error(error)
                })
            }
        },
        debugForm: false
    })

    const RemovePlayerForm = useForm({
        onSubmit: async(values, instance) => {
            postData(`${awsPath}removePlayer/${values.key.trim()}`, {}).then((response) => {
                console.log(response)
            }).catch((error) => {
                console.error(error)
            })
        },
        debugForm: false
    })

    const ModifyPlayerForm = useForm({
        onSubmit: async(values, instance) => {
            postData(`${awsPath}modifyPlayer/${values.key.trim()}/firstName/${values.firstName}/lastName/${values.lastName}`, {
                membership: parseInt(values.membership, 10),
                country: values.country,
                gender: values.gender
            }).then((response) => {
                console.log(response)
            }).catch((error) => {
                console.error(error)
            })
        },
        debugForm: false
    })

    const ModifyMembershipBulkForm = useForm({
        onSubmit: async(values, instance) => {
            getData(`${awsPath}getAllPlayers`).then((getResp) => {
                let lines = values.bulk.split("\n")
                for (let line of lines) {
                    let infoPieces = line.split("\t")
                    if (infoPieces[2] !== undefined) {
                        let membership = parseInt(infoPieces[2].replace("#", ""), 10)
                        console.log(infoPieces[0], infoPieces[1], membership)

                        for (let guid in getResp.players) {
                            let player = getResp.players[guid]
                            if (player.firstName === infoPieces[0] && player.lastName === infoPieces[1]) {
                                console.log("found player " + player.firstName + " " + player.lastName + ": " + membership)

                                postData(`${awsPath}modifyPlayer/${player.key}/firstName/${player.firstName}/lastName/${player.lastName}`, {
                                    membership: membership,
                                    country: player.country,
                                    gender: player.gender
                                }).then((response) => {
                                    console.log(response)
                                }).catch((error) => {
                                    console.error(error)
                                })
                            }
                        }
                    }
                }
            }).catch((error) => {
                console.error(error)
            })
        },
        debugForm: false
    })

    const FindPlayerForm = useForm({
        onSubmit: async(values, instance) => {
            allData.searchKeys = "InProgress"
            getAllPlayers().then(() => {
                allData.searchKeys = getSimilarPlayersByName(values.searchName)
                render()
            }).catch((error) => {
                console.error(error)
            })
        },
        debugForm: false
    })

    const AssignAliasForm = useForm({
        onSubmit: async(values, instance) => {
            let originalKey = values.originalKey && values.originalKey.trim().length > 0 ? values.originalKey.trim() : undefined
            let aliasKey = values.aliasKey.trim()
            checkAliasErrors(false, aliasKey, originalKey).then((isError) => {
                if (!isError || originalKey === undefined) {
                    postData(`${awsPath}assignAlias/${aliasKey}`, {
                        originalKey: originalKey
                    }).then((response) => {
                        console.log(response)
                    }).catch((error) => {
                        console.error(error)
                    })

                    getAllPlayers()
                }
            }).catch((error) => {
                console.error(error)
            })
        },
        debugForm: false
    })

    return (
        <div>
            <FindPlayerForm.Form>
                <a href="https://github.com/SmilesAir/PlayerNameService?tab=readme-ov-file#troubleshooting" target="_blank" rel="noopener noreferrer">Instructions/README</a>
                <h1>
                    Find Player
                </h1>
                <div className="formField">
                    <label>
                        First or Last Name: <SearchNameField />
                    </label>
                </div>
                <button type="submit">
                    Find Players
                </button>
            </FindPlayerForm.Form>
            <PlayerSearchOutput />
            <AssignAliasForm.Form>
                <h1>
                    Assign Alias
                </h1>
                <div className="formField">
                    <label>
                        Original Player Key: <OriginalPlayerKey />
                    </label>
                    <label>
                        Alias Player Key: <AliasPlayerKey />
                    </label>
                </div>
                <button type="submit">
                    Assign Alias
                </button>
                <button type="errorChecking" onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    checkAliasErrors(true)
                }}>
                    Check for Errors
                </button>
            </AssignAliasForm.Form>
            <h1>
                Get All Players
            </h1>
            <div>
                <button onClick={getAllPlayersAndShow}>Get</button>
                <PlayerOutput />
            </div>
            <h1>
                Import From All Data
            </h1>
            <div>
                <input type="file" accept=".json" onChange={(e) => importFromAllData(e)}/>
            </div>
            <AddPlayerForm.Form>
                <h1>
                    Add New Player
                </h1>
                <div className="formField">
                    <label>
                        *First Name: <FirstNameField />
                    </label>
                </div>
                <div className="formField">
                    <label>
                        *Last Name: <LastNameField />
                    </label>
                </div>
                <div className="formField">
                    <label>
                        FPA Membership #: <MembershipField />
                    </label>
                </div>
                <div className="formField">
                    <label>
                        Country: {""}
                        <SelectField
                            field="country"
                            options={countryCodes}
                        />
                    </label>
                </div>
                <div className="formField">
                    <label>
                        Gender: {""}
                        <SelectField
                            field="gender"
                            options={[ "M", "F", "X" ]}
                        />
                    </label>
                </div>
                <div>
                    <button type="submit" disabled={!AddPlayerForm.meta.canSubmit}>
                        Add Player
                    </button>
                </div>
            </AddPlayerForm.Form>
            <AddBulkPlayerForm.Form>
                <h1>
                    Add Player Bulk
                </h1>
                <div className="formField">
                    <label>
                        *Bulk Players: <BulkField />
                    </label>
                </div>
                <div>
                    <button type="submit" disabled={!AddBulkPlayerForm.meta.canSubmit}>
                        Add Players
                    </button>
                </div>
            </AddBulkPlayerForm.Form>
            <RemovePlayerForm.Form>
                <h1>
                    Remove Player
                </h1>
                <div className="formField">
                    <label>
                        *Key: <KeyField />
                    </label>
                </div>
                <div>
                    <button type="submit" disabled={!RemovePlayerForm.meta.canSubmit}>
                        Remove Player
                    </button>
                </div>
            </RemovePlayerForm.Form>
            <ModifyPlayerForm.Form>
                <h1>
                    Modify Player
                </h1>
                <div className="formField">
                    <label>
                        *Key: <KeyField />
                    </label>
                </div>
                <div className="formField">
                    <label>
                        *First Name: <FirstNameField />
                    </label>
                </div>
                <div className="formField">
                    <label>
                        *Last Name: <LastNameField />
                    </label>
                </div>
                <div className="formField">
                    <label>
                        FPA Membership #: <MembershipField />
                    </label>
                </div>
                <div className="formField">
                    <label>
                        Country: {""}
                        <SelectField
                            field="country"
                            options={countryCodes}
                        />
                    </label>
                </div>
                <div className="formField">
                    <label>
                        Gender: {""}
                        <SelectField
                            field="gender"
                            options={[ "M", "F", "X" ]}
                        />
                    </label>
                </div>
                <div>
                    <button type="submit" disabled={!ModifyPlayerForm.meta.canSubmit}>
                        Modify Player
                    </button>
                </div>
            </ModifyPlayerForm.Form>
            <ModifyMembershipBulkForm.Form>
                <h1>
                    Modify Membership Bulk
                </h1>
                <div className="formField">
                    <label>
                        *Bulk Membership: <BulkField />
                    </label>
                </div>
                <div>
                    <button type="submit" disabled={!ModifyMembershipBulkForm.meta.canSubmit}>
                        Modify Player
                    </button>
                </div>
            </ModifyMembershipBulkForm.Form>
        </div>
    )
}

function postData(url, data) {
    return fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then((response) => {
        return response.json()
    })
}

function getData(url) {
    return fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response) => {
        return response.json()
    })
}

function render() {
    ReactDOM.render(
        <PlayerNamesApi />,
        document.getElementById("mount")
    )
}

render()
