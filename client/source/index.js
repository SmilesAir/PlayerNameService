/* eslint-disable func-style */
/* eslint-disable no-nested-ternary */
"use strict"

const React = require("react")
const ReactDOM = require("react-dom")
const Mobx = require("mobx")
import { useForm, useField, splitFormProps } from "react-form"

require("./index.less")

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
                country: values.country
            }).then((response) => {
                console.log(response)
            }).catch((error) => {
                console.error(error)
            })
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
                country: values.country
            }).then((response) => {
                console.log(response)
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
                            options={[ "US", "IT", "DE", "CZ", "CO" ]}
                        />
                    </label>
                </div>
                <div>
                    <button type="submit" disabled={!AddPlayerForm.meta.canSubmit}>
                        Add Player
                    </button>
                </div>
            </AddPlayerForm.Form>
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
                            options={[ "US", "IT", "DE", "CZ", "CO" ]}
                        />
                    </label>
                </div>
                <div>
                    <button type="submit" disabled={!AddPlayerForm.meta.canSubmit}>
                        Modify Player
                    </button>
                </div>
            </ModifyPlayerForm.Form>
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
