// PUT USER/LOGIN
export namespace Login {
    export interface Input {
        email: string
        password: string
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