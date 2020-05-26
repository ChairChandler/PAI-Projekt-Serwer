// PUT USER/LOGIN
export namespace USER.LOGIN.PUT {
    export interface INPUT {
        email: string
        password: string
    }
}

// GET USER/LOGIN
export namespace USER.LOGIN.GET {
    export interface INPUT {
        email: string
    }
}

// POST USER/LOGIN/RESET
export namespace USER.LOGIN.RESET.POST {
    export interface INPUT {
        email: string,
        password: string
    }
}