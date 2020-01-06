import SocketIOClient from 'socket.io-client'
import VueRouter from 'vue-router'

let didHandleSignin = false

const baseURL = window.location.port ? `http://${window.location.hostname}:8031` : 'https://trio.suzu.online'

export default {

	init (router: VueRouter) {
		if (router.currentRoute.query.token) {
			router.replace({ query: undefined })
			didHandleSignin = true
		}
	},

	getURL (path?: string) {
		return path ? `${baseURL}/${path}` : baseURL
	},

	connectTo (namespace: string, token: string | null, callbackToken: (token: string) => void, callbackUser: (user: string) => void, callbackReconnect: (reconnectAttempts: number | null) => void, callbackError: (error: string) => void) {
		if (!token) {
			const query = window.location.search
			if (query) {
				token = query.split('?token=')[1]
				if (token) {
					didHandleSignin = true
					callbackToken(token)
				}
			}
		}

		const socket = SocketIOClient(this.getURL(namespace), { query: { token } })

		socket.on('disconnect', () => {
			callbackReconnect(0)
		})
		socket.on('reconnecting', (attemptNumber: number) => {
			callbackReconnect(attemptNumber)
		})
		socket.on('reconnect', () => {
			callbackReconnect(null)
		})

		socket.on('local', callbackUser)

		socket.on('error', (error: string) => {
			if (!error) {
				return console.log('Undefined error')
			}
			if (error.startsWith('http')) {
				if (!didHandleSignin) {
					window.localStorage.clear()
					window.location.replace(`${error}?signin=1`)
				} else {
					console.log(error)
					window.alert('Unable to sign in')
				}
			} else {
				window.alert(error)
				callbackError(error)
			}
		})

		return socket
	},

}
