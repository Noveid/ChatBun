import {useEffect, useRef, useState} from 'react'
import './App.css'

type Message = { sender: string, text: string }

function App() {
    const [count, setCount] = useState(0)
    const [messages, setMessages] = useState<Message[]>([])
    const [username, setUsername] = useState("")
    const [usernameInput, setUsernameInput] = useState("")
    const [messageText, setMessageText] = useState("go")
    const [isConnected, setIsConnected] = useState(false)
    const socket = useRef<WebSocket>()

    useEffect(() => {
        if (!username) {
            return
        }
        // @ts-ignore
        socket.current = new WebSocket(`ws://192.168.0.165:3000/chat?username=${username}`)

        const ws = socket.current as WebSocket

        ws.onopen = (ev) => {
            console.log("onopen", ev)
            setIsConnected(true)
            const message = {
                event: "connection",
                username,
                id: Date.now()
            }
            ws.send(JSON.stringify(message))
        }

        ws.onmessage = (ev) => {
            console.log("onmessage", ev)
            const {event, payload} = JSON.parse(ev.data) as { event: string, payload: Message[] }
            if (event === "chatMessages") {
                setMessages(payload)
            }
        }

        ws.onclose = (ev) => {
            console.log("onclose", ev)
        }

        ws.onerror = (ev) => {
            console.log("onerror", ev)
        }

        return () => {
            ws.close()
        }
    }, [username])

    const changeName = () => {
        setUsername(usernameInput)
    }

    const sendMessage = () => {
        if ("send" in socket.current) {
            const message = {
                event: "chat",
                username,
                messageText
            }
            socket.current.send(JSON.stringify(message))
            setMessageText("")
        }
    }

    return (
        <>
            <div>
                <span>Your nickname: </span>
                <input type="text" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)}/>
                <button onClick={changeName}>{username ? "change name" :"set your name"}</button>
            </div>
            <br/>
            <div style={{marginBottom:"10px"}}>
                <span>Your message: </span>
                <input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)}/>
            </div>
            <div>
                <button onClick={sendMessage}>Send message</button>
            </div>
            <br/>
            {messages.length > 0 ? <div>
                {messages.map(message => {
                    return <div>
                        <div>{`${message.sender}: `} {message.text}</div>
                    </div>
                })}
            </div> : username ? "No messages" : "Pls login"}
        </>
    )
}

export default App
