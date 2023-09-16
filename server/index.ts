const messages = []

const server = Bun.serve<{ username: string }>({
    fetch(req, server) {
        const url = new URL(req.url);
        if (url.pathname === "/chat") {
            console.log(`upgrade!`);
            const username = url.searchParams.get("username");
            const success = server.upgrade(req, {data: {username}});
            return success
                ? undefined
                : new Response("WebSocket upgrade error", {status: 400});
        }

        return new Response(url.pathname);
    },
    websocket: {
        open(ws) {
            const msg = {sender: "bot", text: `${ws.data.username} has entered the chat`};
            messages.push(msg)
            const messageToWeb = {event: "chatMessages", payload: messages}
            ws.send(JSON.stringify(messageToWeb));
            ws.subscribe("chatMessages");
            ws.publishText("chatMessages", JSON.stringify(messageToWeb))
        },
        message(ws, mess) {
            const message = JSON.parse(mess as string)

            if (message["event"] === "chat") {
                const messageToChat = {sender: message.username ?? "error", text: message.messageText ?? "error"}
                console.log("chat", messageToChat);
                messages.push(messageToChat)
                const messageToWeb = {event: "chatMessages", payload: messages}
                ws.send(JSON.stringify(messageToWeb));
                ws.publishText("chatMessages", JSON.stringify(messageToWeb))
            }
        },
        close(ws) {
            ws.unsubscribe("chatMessages");
            const msg = {sender: "bot", text: `${ws.data.username} has left the chat`};
            messages.push(msg)
            ws.publishText("chatMessages", JSON.stringify(messages));
        },
    },
});

console.log(`Listening on ${server.hostname}:${server.port}`);