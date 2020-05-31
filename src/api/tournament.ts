// GET TOURNAMENT/LIST/GENERAL
export namespace TOURNAMENT.LIST.GENERAL.GET {
    export interface INPUT {
        amount: number | null
    }

    export type OUTPUT = {id: number, name: string}[]
}

export namespace TOURNAMENT.LIST.CONTESTANT.GET {
    export type OUTPUT = {
        tournament_name: string
        description: string | null
        organizer: string
        datetime: Date
        localization_lat: number //latitude
        localization_lng: number //longitude
        participants_limit: number | null
        joining_deadline: Date
        current_contestants_amount: number
        logos: {id: number, data: Uint8ClampedArray}[]
    }[]
}

// GET TOURNAMENT/INFO
export namespace TOURNAMENT.INFO.GET {
    export interface INPUT {
        tournament_id: number
    }

    export interface OUTPUT {
        tournament_name: string
        description: string | null
        organizer: string
        datetime: Date
        localization_lat: number //latitude
        localization_lng: number //longitude
        participants_limit: number | null
        joining_deadline: Date
        current_contestants_amount: number
        logos: {id: number, data: Uint8ClampedArray}[]
    }
}

// POST TOURNAMENT/INFO
export namespace TOURNAMENT.INFO.POST {
    export interface INPUT {
        tournament_name: string
        description: string | null
        datetime: Date
        localization_lat: number //latitude
        localization_lng: number //longitude
        participants_limit: number | null
        joining_deadline: Date
        logos: {id: number, data: Uint8ClampedArray}[]
    }
}

// PUT TOURNAMENT/INFO
export namespace TOURNAMENT.INFO.PUT {
    export interface INPUT {
        tournament_id: number
        tournament_name: string | undefined
        description: string | undefined
        datetime: Date | undefined
        localization_lat: number | undefined //latitude
        localization_lng: number | undefined //longitude
        participants_limit: number | undefined
        joining_deadline: Date | undefined
        logos: {id: number | undefined, data: Uint8ClampedArray}[] | undefined
    }
}