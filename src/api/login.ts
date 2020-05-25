// PUT USER/LOGIN
export namespace Login {
    export interface Input {
        email: string
        password: string
    }

    export interface Output {
        auth: boolean
        token: string
    }
}

// GET USER/LOGIN
export namespace RemindPassword {
    export interface Input {
        email: string
    }
}

// POST USER/LOGIN/RESET
export namespace ChangePassword {
    export interface Input {
        email: string,
        password: string
    }
}