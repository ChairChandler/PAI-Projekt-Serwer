// POST USER/LOGIN
export namespace USER.LOGIN.POST {
    export interface INPUT {
        email: string
        password: string
    }
}

// DELETE USER/LOGIN
// EMPTY BODY

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