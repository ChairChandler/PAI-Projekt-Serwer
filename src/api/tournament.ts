// GET TOURNAMENT/LIST/GENERAL
export namespace TournamentGeneral {
    export interface Input {
        amount: number | null
    }

    export interface Output {
        tournaments: {
            id: number,
            name: string
        }[]
    }
}

// GET TOURNAMENT/INFO
export namespace TournamentInfo {
    export interface Input {
        id: number
    }

    export interface Output {
        name: string
        description: string | null
        organizer: string
        time: Date
        localization_lat: number //latitude
        localization_lng: number //longitude
        participants_limit: number | null
        joining_deadline: Date
        current_contestants_amount: number
        logos: Uint8ClampedArray[]
    }
}