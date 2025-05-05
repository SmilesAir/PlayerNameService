const React = require("react")
const MobxReact = require("mobx-react")
const Dropdown = require("react-dropdown").default
const StringSimilarity = require("string-similarity")

const MainStore = require("./mainStore.js")

require("react-dropdown/style.css")
require("./playerNameWidget.less")

const awsPath = __STAGE__ === "DEVELOPMENT" ? "https://tkhmiv70u9.execute-api.us-west-2.amazonaws.com/development/" : "https://4wnda3jb78.execute-api.us-west-2.amazonaws.com/production/"
const countryCodes = [ "AFG", "ALA", "ALB", "DZA", "ASM", "AND", "AGO", "AIA", "ATA", "ATG", "ARG", "ARM", "ABW", "AUS", "AUT", "AZE", "BHS", "BHR", "BGD", "BRB", "BLR", "BEL", "BLZ", "BEN", "BMU", "BTN", "BOL", "BES", "BIH", "BWA", "BVT", "BRA", "IOT", "BRN", "BGR", "BFA", "BDI", "KHM", "CMR", "CAN", "CPV", "CYM", "CAF", "TCD", "CHL", "CHN", "CXR", "CCK", "COL", "COM", "COG", "COD", "COK", "CRI", "CIV", "HRV", "CUB", "CUW", "CYP", "CZE", "DNK", "DJI", "DMA", "DOM", "ECU", "EGY", "SLV", "GNQ", "ERI", "EST", "ETH", "FLK", "FRO", "FJI", "FIN", "FRA", "GUF", "PYF", "ATF", "GAB", "GMB", "GEO", "DEU", "GHA", "GIB", "GRC", "GRL", "GRD", "GLP", "GUM", "GTM", "GGY", "GIN", "GNB", "GUY", "HTI", "HMD", "VAT", "HND", "HKG", "HUN", "ISL", "IND", "IDN", "IRN", "IRQ", "IRL", "IMN", "ISR", "ITA", "JAM", "JPN", "JEY", "JOR", "KAZ", "KEN", "KIR", "PRK", "KOR", "XKX", "KWT", "KGZ", "LAO", "LVA", "LBN", "LSO", "LBR", "LBY", "LIE", "LTU", "LUX", "MAC", "MKD", "MDG", "MWI", "MYS", "MDV", "MLI", "MLT", "MHL", "MTQ", "MRT", "MUS", "MYT", "MEX", "FSM", "MDA", "MCO", "MNG", "MNE", "MSR", "MAR", "MOZ", "MMR", "NAM", "NRU", "NPL", "NLD", "NCL", "NZL", "NIC", "NER", "NGA", "NIU", "NFK", "MNP", "NOR", "OMN", "PAK", "PLW", "PSE", "PAN", "PNG", "PRY", "PER", "PHL", "PCN", "POL", "PRT", "PRI", "QAT", "SRB", "REU", "ROU", "RUS", "RWA", "BLM", "SHN", "KNA", "LCA", "MAF", "SPM", "VCT", "WSM", "SMR", "STP", "SAU", "SEN", "SYC", "SLE", "SGP", "SXM", "SVK", "SVN", "SLB", "SOM", "ZAF", "SGS", "SSD", "ESP", "LKA", "SDN", "SUR", "SJM", "SWZ", "SWE", "CHE", "SYR", "TWN", "TJK", "TZA", "THA", "TLS", "TGO", "TKL", "TON", "TTO", "TUN", "TUR", "XTX", "TKM", "TCA", "TUV", "UGA", "UKR", "ARE", "GBR", "USA", "UMI", "URY", "UZB", "VUT", "VEN", "VNM", "VGB", "VIR", "WLF", "ESH", "YEM", "ZMB", "ZWE" ]

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


let cachedPlayers = []

function getAllPlayers() {
    return getData(`${awsPath}getAllPlayers`).then((response) => {
        MainStore.playerData = response.players

        for (let playerKey in MainStore.playerData) {
            let player = MainStore.playerData[playerKey]
            cachedPlayers.push({
                key: player.key,
                firstName: (player.firstName || "").toLowerCase(),
                lastName: (player.lastName || "").toLowerCase(),
                fullName: `${(player.firstName || "").toLowerCase()} ${(player.lastName || "").toLowerCase()}`
            })
        }

        console.log(response)
    }).catch((error) => {
        console.error(error)
    })
}

module.exports = @MobxReact.observer class PlayerNameWidget extends React.Component {
    constructor(props) {
        super(props)

        getAllPlayers()

        this.state = {
            searchText: "",
            selectedResultIndex: undefined,
            selectedResultAliasIndex: undefined,
            selectedPlayerAliasesIndex: undefined,
            selectedPlayerDataDirty: false,
            selectedPlayerFirstName: "",
            selectedPlayerLastName: "",
            selectedPlayerFpaNumber: 0,
            selectedPlayerCountry: "",
            selectedPlayerGender: "",
            searchResults: [],
            selectedPlayerAliases: [],
            isSelectingAlias: false,
            aliasSearchText: "",
            aliasSearchResults: []
        }
    }

    getSimilarPlayersByName(name) {
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

        return bestNames.map((data) => MainStore.playerData[data.key])
    }

    findAliasesForPlayer(playerKey) {
        if (playerKey === undefined || playerKey === "") {
            return []
        }

        let aliases = Object.values(MainStore.playerData).filter((value) => {
            if (value.aliasKey === playerKey) {
                return true
            }

            return false
        })
        aliases = aliases.map((data) => data.key)

        return aliases
    }

    onSearchTextChange(e) {
        this.state.searchResults = []
        this.state.searchText = e.target.value
        this.state.selectedResultIndex = undefined

        if (e.target.value !== "") {
            let playerDatas = this.getSimilarPlayersByName(this.state.searchText)
            this.state.searchResults = this.state.searchResults.concat(playerDatas)
        }

        this.setState(this.state)
    }

    getSearchWidget() {
        return (
            <div className="searchWidget">
                <label>Search:</label>
                <input type="text" placeholder="Player Name" value={this.state.searchText} onChange={(e) => this.onSearchTextChange(e)} />
            </div>
        )
    }

    onAliasSearchTextChange(e) {
        this.state.aliasSearchText = e.target.value
        this.setState(this.state)
        console.log(this.state.aliasSearchText)
    }

    getAliasSearchWidget() {
        let originalPlayerName = `${this.state.selectedPlayerFirstName} ${this.state.selectedPlayerLastName}`
        return (
            <div>
                <div className="aliasInstructions">
                    {`Search for the alias that should be connected to '${originalPlayerName}'. Aliases are alternate names for a player.`}
                </div>
                <div className="searchWidget">
                    <label>Alias Search:</label>
                    <input type="text" placeholder="Alias Name" value={this.state.aliasSearchText} onChange={(e) => this.onAliasSearchTextChange(e)} />
                </div>
            </div>
        )
    }

    findOriginalPlayerDataFromAlias(aliasKey) {
        let playerData = MainStore.playerData[aliasKey]
        if (playerData === undefined) {
            return undefined
        }

        for (let i = 0; i < 100; ++i) {
            if (playerData.aliasKey === undefined || playerData.aliasKey.length === 0) {
                return playerData
            }
        }

        return undefined
    }

    onPlayerSearchResultClick(index) {
        this.state.selectedPlayerAliasesIndex = undefined
        this.state.selectedResultIndex = index
        let playerData = this.state.searchResults[index]
        let selectedAliasKey = undefined
        if (playerData.aliasKey !== undefined && playerData.aliasKey.length > 0) {
            selectedAliasKey = playerData.key
            playerData = this.findOriginalPlayerDataFromAlias(playerData.aliasKey)
        }
        this.state.selectedPlayerFirstName = playerData.firstName || ""
        this.state.selectedPlayerLastName = playerData.lastName || ""
        this.state.selectedPlayerFpaNumber = playerData.membership || 0
        this.state.selectedPlayerCountry = playerData.country || ""
        this.state.selectedPlayerGender = playerData.gender || ""

        this.state.selectedPlayerAliases = this.findAliasesForPlayer(playerData.key)
        if (selectedAliasKey !== undefined) {
            this.state.selectedPlayerAliasesIndex = this.state.selectedPlayerAliases.findIndex((key) => key === selectedAliasKey)
            console.log(this.state.selectedPlayerAliasesIndex, selectedAliasKey, this.state.selectedPlayerAliases)
        }
        this.setState(this.state)
    }

    getSearchResultsWidget() {
        let results = this.state.searchResults.map((data, index) => {
            let className = "playerSearchResult"
            if (index === this.state.selectedResultIndex) {
                className += " selected"
            }
            let aliasTag = data.aliasKey !== undefined ? " (Alias)" : ""
            return (
                <div key={data.key} className={className} onClick={() => this.onPlayerSearchResultClick(index)}>
                    {`${data.firstName} ${data.lastName}${aliasTag}`}
                </div>
            )
        })
        if (results.length === 0) {
            if (this.state.searchText.length < 2) {
                results.push(<div>Search above for Players by Name</div>)
            } else {
                results.push(<div>No Players Found</div>)
            }
        }
        return (
            <div className="searchResults">
                <div className="headerText">Search Results</div>
                {results}
            </div>
        )
    }

    onDetailsUpdate() {
        console.log("update")
    }

    getSelectedResultWidget() {
        let details = []
        if (this.state.selectedResultIndex === undefined && this.state.searchResults.length > 0) {
            details.push(<div key="search">Select Name in Search Results</div>)
        } else if (this.state.selectedResultIndex !== undefined) {
            details.push(
                <div key="firstName" className="detail">
                    <label>First Name:</label>
                    <input type="text" value={this.state.selectedPlayerFirstName} onChange={(e) => {
                        this.state.selectedPlayerDataDirty = true
                        this.state.selectedPlayerFirstName = e.target.value
                        this.setState(this.state)
                    }}/>
                </div>
            )
            details.push(
                <div key="lastName" className="detail">
                    <label>Last Name:</label>
                    <input type="text" value={this.state.selectedPlayerLastName} onChange={(e) => {
                        this.state.selectedPlayerDataDirty = true
                        this.state.selectedPlayerLastName = e.target.value
                        this.setState(this.state)
                    }}/>
                </div>
            )
            details.push(
                <div key="fpaNumber" className="detail">
                    <div>FPA #:</div>
                    <input type="text" value={this.state.selectedPlayerFpaNumber} onChange={(e) => {
                        this.state.selectedPlayerDataDirty = true
                        this.state.selectedPlayerFpaNumber = parseInt(e.target.value, 10)
                        this.setState(this.state)
                    }}/>
                </div>
            )
            details.push(
                <div key="country" className="detail">
                    <label>Country:</label>
                    <Dropdown options={countryCodes} value={this.state.selectedPlayerCountry} placeholder="Select Country" onChange={(e) => {
                        this.state.selectedPlayerDataDirty = true
                        this.state.selectedPlayerCountry = e.value
                        this.setState(this.state)
                    }}/>
                </div>
            )
            details.push(
                <div key="gender" className="detail">
                    <label>Gender:</label>
                    <Dropdown options={[ "M", "F", "X" ]} value={this.state.selectedPlayerGender} placeholder="Select Gender" onChange={(e) => {
                        this.state.selectedPlayerDataDirty = true
                        this.state.selectedPlayerGender = e.value
                        this.setState(this.state)
                    }}/>
                </div>
            )

            details.push(<button key="update" disabled={!this.state.selectedPlayerDataDirty} onClick={() => this.onDetailsUpdate()}>Update</button>)
        }

        return (
            <div className="selectedDetails">
                <div className="headerText">Player Details</div>
                {details}
            </div>
        )
    }

    onRemoveAlias(index) {
        this.state.selectedPlayerAliases.splice(index, 1)
        this.setState(this.state)
        console.log(index)
    }

    onAddAliasClick() {
        this.state.aliasSearchResults = []
        this.state.isSelectingAlias = true
        this.state.aliasSearchText = ""
        this.setState(this.state)
    }

    getAliasWidget() {
        let aliases = []
        if (Object.keys(MainStore.playerData).length > 0) {
            if (this.state.selectedResultIndex !== undefined) {
                if (this.state.selectedPlayerAliases.length === 0) {
                    aliases.push(<div key="alias">No Aliases</div>)
                } else {
                    aliases = this.state.selectedPlayerAliases.map((data, index) => {
                        let playerData = MainStore.playerData[data]
                        let className = `alias ${this.state.selectedPlayerAliasesIndex !== undefined && this.state.selectedPlayerAliasesIndex === index ? "selected" : ""}`
                        return (
                            <div key={data} className={className}>
                                <div>{`${playerData.firstName} ${playerData.lastName}`}</div>
                                <button onClick={() => this.onRemoveAlias(index)}>X</button>
                            </div>
                        )
                    })
                }

                if (!this.state.isSelectingAlias) {
                    aliases.push(<button key="add" onClick={() => this.onAddAliasClick()}>Add Alias</button>)
                }
            }
        }

        return (
            <div className="aliasWidget">
                <div className="headerText">Aliases</div>
                {aliases}
            </div>
        )
    }

    getResultsWidget() {
        return (
            <div className="resultsWidget">
                {this.getSearchResultsWidget()}
                {this.getSelectedResultWidget()}
                {this.getAliasWidget()}
            </div>
        )
    }

    getAliasResultsWidget() {
        if (Object.keys(MainStore.playerData).length === 0) {
            return null
        }

        let results = this.state.aliasSearchResults.map((data) => {
            let playerData = MainStore.playerData[data]
            return (
                <div key={data} className="playerSearchResult">
                    {`${playerData.firstName} ${playerData.lastName}`}
                    <button className="setAliasButton">Set Alias</button>
                </div>
            )
        })
        return (
            <div className="resultsWidget">
                <div className="searchResults">
                    <div className="headerText">Search Results</div>
                    {results}
                </div>
                {this.getAliasWidget()}
            </div>
        )
    }

    onFinishAliasEditing() {
        this.state.isSelectingAlias = false
        this.setState(this.state)
    }

    render() {
        return (
            <div className="playerNameWidget">
                <div className="title">Player Data Tool</div>
                {this.state.isSelectingAlias ? this.getAliasSearchWidget() : this.getSearchWidget()}
                {this.state.isSelectingAlias ? this.getAliasResultsWidget() : this.getResultsWidget()}
                {this.state.isSelectingAlias ? <button className="finishAliasButton" onClick={() => this.onFinishAliasEditing()}>Finshed Alias Editing</button> : null}
            </div>
        )
    }
}
