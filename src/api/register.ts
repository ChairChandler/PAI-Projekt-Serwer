// POST USER/REGISTER
export namespace Register {
    export interface Input {
        name: string
        lastname: string
        email: string
        password: string
    }
}

// GET USER/REGISTER/VERIFY
export namespace Verify {
    export interface Input {
        id: string
        email: string
    }
}