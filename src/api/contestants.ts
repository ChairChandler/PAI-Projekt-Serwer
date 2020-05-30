// POST TOURNAMENT/CONTESTANTS
export namespace TOURNAMENT.CONTESTANTS.POST {
    export interface INPUT {
        tournament_id: number
        license_id: string
        ranking_pos: number
    }
}

// GET TOURNAMENT/CONTESTANTS
export namespace TOURNAMENT.CONTESTANTS.GET {
    export interface INPUT {
        tournament_id: number
    }

    export type OUTPUT = {user_id: number, name: string, lastname: string}[]
}