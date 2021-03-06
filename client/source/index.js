/* eslint-disable no-loop-func */
/* eslint-disable func-style */
/* eslint-disable no-nested-ternary */
"use strict"

const React = require("react")
const ReactDOM = require("react-dom")
const Mobx = require("mobx")
import { useForm, useField, splitFormProps } from "react-form"

require("./index.less")

const countryCodes = ["AFG", "ALA", "ALB", "DZA", "ASM", "AND", "AGO", "AIA", "ATA", "ATG", "ARG", "ARM", "ABW", "AUS", "AUT", "AZE", "BHS", "BHR", "BGD", "BRB", "BLR", "BEL", "BLZ", "BEN", "BMU", "BTN", "BOL", "BES", "BIH", "BWA", "BVT", "BRA", "IOT", "BRN", "BGR", "BFA", "BDI", "KHM", "CMR", "CAN", "CPV", "CYM", "CAF", "TCD", "CHL", "CHN", "CXR", "CCK", "COL", "COM", "COG", "COD", "COK", "CRI", "CIV", "HRV", "CUB", "CUW", "CYP", "CZE", "DNK", "DJI", "DMA", "DOM", "ECU", "EGY", "SLV", "GNQ", "ERI", "EST", "ETH", "FLK", "FRO", "FJI", "FIN", "FRA", "GUF", "PYF", "ATF", "GAB", "GMB", "GEO", "DEU", "GHA", "GIB", "GRC", "GRL", "GRD", "GLP", "GUM", "GTM", "GGY", "GIN", "GNB", "GUY", "HTI", "HMD", "VAT", "HND", "HKG", "HUN", "ISL", "IND", "IDN", "IRN", "IRQ", "IRL", "IMN", "ISR", "ITA", "JAM", "JPN", "JEY", "JOR", "KAZ", "KEN", "KIR", "PRK", "KOR", "XKX", "KWT", "KGZ", "LAO", "LVA", "LBN", "LSO", "LBR", "LBY", "LIE", "LTU", "LUX", "MAC", "MKD", "MDG", "MWI", "MYS", "MDV", "MLI", "MLT", "MHL", "MTQ", "MRT", "MUS", "MYT", "MEX", "FSM", "MDA", "MCO", "MNG", "MNE", "MSR", "MAR", "MOZ", "MMR", "NAM", "NRU", "NPL", "NLD", "NCL", "NZL", "NIC", "NER", "NGA", "NIU", "NFK", "MNP", "NOR", "OMN", "PAK", "PLW", "PSE", "PAN", "PNG", "PRY", "PER", "PHL", "PCN", "POL", "PRT", "PRI", "QAT", "SRB", "REU", "ROU", "RUS", "RWA", "BLM", "SHN", "KNA", "LCA", "MAF", "SPM", "VCT", "WSM", "SMR", "STP", "SAU", "SEN", "SYC", "SLE", "SGP", "SXM", "SVK", "SVN", "SLB", "SOM", "ZAF", "SGS", "SSD", "ESP", "LKA", "SDN", "SUR", "SJM", "SWZ", "SWE", "CHE", "SYR", "TWN", "TJK", "TZA", "THA", "TLS", "TGO", "TKL", "TON", "TTO", "TUN", "TUR", "XTX", "TKM", "TCA", "TUV", "UGA", "UKR", "ARE", "GBR", "USA", "UMI", "URY", "UZB", "VUT", "VEN", "VNM", "VGB", "VIR", "WLF", "ESH", "YEM", "ZMB", "ZWE"]
let allData = Mobx.observable({
    playerData: {}
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

function PlayerOutput() {
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

function getAllPlayers() {
    getData("https://tkhmiv70u9.execute-api.us-west-2.amazonaws.com/development/getAllPlayers").then((response) => {
        allData.playerData = response.players

        console.log(response)

        render()
    }).catch((error) => {
        console.error(error)
    })
}

function PlayerNamesApi() {
    // Use the useForm hook to create a form instance
    const AddPlayerForm = useForm({
        onSubmit: async(values, instance) => {
            postData(`https://tkhmiv70u9.execute-api.us-west-2.amazonaws.com/development/addPlayer/${values.firstName}/lastName/${values.lastName}`, {
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

                postData(`https://tkhmiv70u9.execute-api.us-west-2.amazonaws.com/development/addPlayer/${names[0]}/lastName/${names[1]}`, {
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
            postData(`https://tkhmiv70u9.execute-api.us-west-2.amazonaws.com/development/removePlayer/${values.key.trim()}`, {}).then((response) => {
                console.log(response)
            }).catch((error) => {
                console.error(error)
            })
        },
        debugForm: false
    })

    const ModifyPlayerForm = useForm({
        onSubmit: async(values, instance) => {
            postData(`https://tkhmiv70u9.execute-api.us-west-2.amazonaws.com/development/modifyPlayer/${values.key.trim()}/firstName/${values.firstName}/lastName/${values.lastName}`, {
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
            getData("https://tkhmiv70u9.execute-api.us-west-2.amazonaws.com/development/getAllPlayers").then((getResp) => {
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

                                postData(`https://tkhmiv70u9.execute-api.us-west-2.amazonaws.com/development/modifyPlayer/${player.key}/firstName/${player.firstName}/lastName/${player.lastName}`, {
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

    return (
        <div>
            <h1>
                Get All Players
            </h1>
            <div>
                <button onClick={getAllPlayers}>Get</button>
                <PlayerOutput />
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
