// POST USER/REGISTER
export namespace USER.REGISTER.POST {
    export interface INPUT {
        name: string
        lastname: string
        email: string
        password: string
    }
}

// GET USER/REGISTER/VERIFY
export namespace USER.REGISTER.VERIFY.GET {
    export interface INPUT {
        id: string
        email: string
    }
}