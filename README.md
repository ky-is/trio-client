# trio-client

Conform a client to the Trio socket server.

## Setup

`init(router: VueRouter)`: Call after creating the Vue app instance (`new Vue(...)`).

`connectTo (namespace: string, token: string | null, callbackToken: (token: string) => void, callbackUser: (user: string) => void, callbackReconnect: (reconnectAttempts: number | null) => void, callbackError: (error: string) => void)`: Create a socket connection to a Trio namespace.

## Usage

`getURL (path?: string)`: Creates an absolute URL to a Trio resource.
