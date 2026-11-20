export interface LoginCredentials {
    email: string
    password: string
}

export interface AuthUser {
    id: number
    email: string
    firstName: string
    lastName: string
    role: string
}

export interface AuthResponse {
    token: string
    user: AuthUser
}
