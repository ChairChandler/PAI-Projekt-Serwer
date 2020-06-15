// GET TOURNAMENT/LIST/GENERAL
export namespace TOURNAMENT.LIST.GENERAL.GET {
    export interface INPUT {
        amount: number | null
    }

    export type OUTPUT = { id: number, name: string, date: Date, finished: boolean }[]
}

//GET TOURNAMENT/LIST/CONTESTANT
export namespace TOURNAMENT.LIST.CONTESTANT.GET {
    export type OUTPUT = {
        tournament_id: number
        tournament_name: string
        description: string | null
        organizer: string
        datetime: Date
        localization_lat: number //latitude
        localization_lng: number //longitude
        participants_limit: number | null
        joining_deadline: Date
        current_contestants_amount: number
        logos: { id: number, data: string }[]
        finished: boolean
        started: boolean
    }[]
}

// GET TOURNAMENT/INFO
export namespace TOURNAMENT.INFO.GET {
    export interface INPUT {
        tournament_id: number
    }

    export interface OUTPUT {
        tournament_id: number
        owner_id: number
        tournament_name: string
        description: string | null
        organizer: string
        datetime: Date
        localization_lat: number //latitude
        localization_lng: number //longitude
        participants_limit: number | null
        joining_deadline: Date
        current_contestants_amount: number
        logos: { id: number, data: string }[]
        finished: boolean
        started: boolean
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
        logos: { data: string }[]
    }
}

// PUT TOURNAMENT/INFO
export namespace TOURNAMENT.INFO.PUT {
    export interface INPUT {
        tournament_id: number
        tournament_name?: string
        description?: string
        datetime?: Date
        localization_lat?: number //latitude
        localization_lng?: number //longitude
        participants_limit?: number
        joining_deadline?: Date
        logos?: { id?: number, data?: string }[]
        /*
        Logo create: {data}
        Logo update: {id, data}
        Logo remove: {id} 
        */
    }
}

// GET TOURNAMENT/LADDER
export namespace TOURNAMENT.LADDER.GET {
    export interface INPUT {
        tournament_id: number
    }

    export interface OUTPUT {
        lastNode: number
        contestants: { id: number, name: string, node_id: number, defeated: boolean | null }[] //node_id min 0
    }
}

// PUT TOURNAMENT/LADDER
export namespace TOURNAMENT.LADDER.PUT {
    export interface INPUT {
        tournament_id: number
        user_id: number
        winner: boolean
    }
}
