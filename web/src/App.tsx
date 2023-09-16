import {useEffect, useRef, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
    const [count, setCount] = useState(0)
    const [isConnected, setIsConnected] = useState(false)
    const socket = useRef<WebSocket>()

    useEffect(() => {
        // @ts-ignore
        socket.current = new WebSocket(`ws://localhost:3000/chat`)

        const ws = socket.current as WebSocket

        ws.onopen = (ev) => {
            console.log("onopen", ev)
            setIsConnected(true)
            const message = {
                event: "connection",
                username: "lol",
                id: Date.now()
            }
            ws.send(JSON.stringify(message))
        }

        ws.onmessage = (ev) => {
            console.log("onmessage", ev)
        }

        ws.onclose = (ev) => {
            console.log("onclose", ev)
        }

        ws.onerror = (ev) => {
            console.log("onerror", ev)
        }
    }, [])

    return (
        <>
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo"/>
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo"/>
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    )
}

export default App
