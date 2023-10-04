var sendButton = document.querySelector(".input-group-append")
var input = document.querySelector(".myInput")
var messagesBlock = document.querySelector(".mainMessagesBlock")

const timeOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric' };

document.querySelector(".msg_time").innerText = new Date().toLocaleDateString("ru",timeOptions).split(", ")[1]

sessionStorage.setItem("GPTHistory", "[]")


sendButton.addEventListener("click", () => {
    putMessage(input.value, "me")
    sendMessage(input.value)
})

input.addEventListener("keyup", function(event) {
    if (event.keyCode !== 13) return
    if (event.ctrlKey || event.shiftKey) return
    putMessage(input.value, "me")
    sendMessage()
});

function putMessage(msg, owner){
    if(owner !== "me"){
        var history = JSON.parse(this.sessionStorage.getItem("GPTHistory"))
        history.push({ role: "user", content: msg })
        this.sessionStorage.setItem("GPTHistory", JSON.stringify(history)) 
        messagesBlock.innerHTML +=
`
<div class="d-flex justify-content-start mb-4">
    <div class="img_cont_msg">
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/800px-ChatGPT_logo.svg.png" class="rounded-circle user_img_msg">
    </div>
    <div class="msg_cotainer">
        <pre class="msgBody"></pre>
        <span class="msg_time">${new Date().toLocaleDateString("ru",timeOptions).split(", ")[1]}</span>
    </div>
</div>
`
    } else {
        var history = JSON.parse(this.sessionStorage.getItem("GPTHistory"))
        history.push({ role: "system", content: msg })
        this.sessionStorage.setItem("GPTHistory", JSON.stringify(history))
        messagesBlock.innerHTML +=
`
    <div class="d-flex justify-content-end mb-4">
    <div class="msg_cotainer_send">
        <pre class="msgBody"></pre>
        <span class="msg_time_send">${new Date().toLocaleDateString("ru",timeOptions).split(", ")[1]}</span>
    </div>
</div>
        `
    }
    var textBlock = document.querySelectorAll(".msgBody")
    textBlock[textBlock.length-1].innerText = msg
    messagesBlock.scrollTop = messagesBlock.scrollHeight;
}

function sendMessage(){
    if(!checkLength()){
        alert("Your chat history is too long! Please, refresh the page in the nearest future")
    }
    var gptVersion = document.querySelector('input[name="chatGPTVersion"]:checked').value;
    fetch(window.location.href+"makeRequest", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        questionsHistory: JSON.parse(this.sessionStorage.getItem("GPTHistory")),
        gptVersion
      })
    })
    .then(response => {
      return response.json()
    })
    .then(res => {
        putMessage(res.answer, "bot")
    })
    .catch(err => {
        putMessage("Hoisting side ERROR(maybe your request took longer than 60s?)", "bot")
    })
    input.value = ""
}

function checkLength(){
    var history = JSON.parse(this.sessionStorage.getItem("GPTHistory"))
    var wordsLength = 0
    for(var i = 0; i < history.length; i++){
        wordsLength += history[i].content.split(" ").length
    }
    if(wordsLength > 3000){
        return false
    }
    return true
}