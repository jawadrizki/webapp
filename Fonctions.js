/**
 * Created by jawad on 01/05/2017.
 */
// Cree un objet message 'messageObj' dans le body de tableau 'table' a la premiere place 'prepend'
let createMessageInTable = (messageObj, table) => {
    let c = ""
    if(messageObj.type == "Danger"){
        c = "alert alert-danger"
    }
    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");
    let td4 = document.createElement("td");
    let td5 = document.createElement("td");
    let checkbox = document.createElement("input");
    let button = document.createElement("button");
    checkbox.id = messageObj.id;
    checkbox.onclick = function () {
        checkedinput(checkbox)
    }
    checkbox.name = "checkmsg"
    checkbox.setAttribute("type","checkbox")
    button.onclick = function () {
        remove(button)
    }
    td1.appendChild(checkbox)
    td2.appendChild(document.createTextNode(messageObj.from))
    td3.appendChild(document.createTextNode(messageObj.to))
    td4.appendChild(document.createTextNode(messageObj.message))
    button.id = messageObj.id;
    button.setAttribute("class",'btn btn-danger glyphicon glyphicon-remove')
    td5.appendChild(button)
    tr.appendChild(td1)
    tr.appendChild(td2)
    tr.appendChild(td3)
    tr.appendChild(td4)
    tr.appendChild(td5)
    table.insertBefore(tr,table.firstChild)// inserer en haut de la table
}
//Cette fonction gere la visibilité de la button de supprission au cas de la suprission de plusieurs messages
function checkedinput(c) {
    var bnRA = document.getElementById("bnRA")
    let checkboxs = document.getElementsByName("checkmsg")
    if(c.checked) bnRA.setAttribute("style", "display:inline")
    else{
        let c= 0
        for (let i = 0; i < checkboxs.length; i++)
            if(checkboxs[i].checked) c++
        if(c == 0)
            bnRA.setAttribute("style", "display:none")
    }
}
//Cette fonction fais une armonie entre le checkbox en haut de la tableau aves les autres checkbox
function checkall() {
    var bnRA = document.getElementById("bnRA")
    var boxes= document.getElementsByName("checkmsg")
    if(document.getElementById("checkall").checked) {
        bnRA.setAttribute("style","display:display")
        for (let i = 0; i < boxes.length; i++) {
            boxes[i].checked = true
        }
    }else{
        bnRA.setAttribute("style","display:none")
        for (let i = 0; i < boxes.length; i++) {
            boxes[i].checked = false
        }
    }
}
// Supprimer un messge ayant l'identifiant 'id' de la base de donnees
function removeItemFromFirebase(id) {
    firebase.database().ref().child(id).remove()
}
// Supprimer toutes les message couché
function removeAll() {
    let checkboxs = document.getElementsByName("checkmsg")
    console.log(checkboxs)
    for (let i = 0; i < checkboxs.length; i++) {
        removeItemFromFirebase(checkboxs[i].id)
    }
}
// Definition de l'evenemnet click de la button 'send'
document.getElementById("bn").addEventListener('click',function () {
    let from = document.getElementById("from_input").value
    let to = document.getElementById("to_input").value
    let message = document.getElementById("message_area").value
    let type = document.querySelector('input[name=type]:checked').val()
    if(from !="" && to != "" && message!="") {
        let m = new Message();
        m.from = from
        m.message = message
        m.to = to
        m.type = type
        createMessageInTable(m,document.getElementById("table"))
        m.send()
    }else {
        document.getElementById("error").innerText = "Entere toutes les champs"
    }

})
// Supprimer toutes les tr dans le tableau 'table'
let clearTable = (table) => {
    while (table.hasChildNodes()) {
        table.removeChild(table.lastChild);
    }
};
// Supprimer un 'tr' selectionné et supprimer aussi le message a la base de données
function remove(b) {
    if(b.id != "")
        removeItemFromFirebase(b.id)
    $(b).parents("tr").remove()

}
// en cas de l'ajout ou suppression d'un element cet fonction est s'execute automatiquement
let DataBaseListnner = () =>{
    let ref = firebase.database().ref();
    ref.on('value',snap => {
        clearTable(document.getElementById("table"))// supprimer toutes les 'tr' du tableau
        let value = snap.val()
        // parcourir les valeurs dans snap.val() qui contient toutes les messsages
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                let m = new Message(value[key].message.from,value[key].message.to,value[key].message.message,value[key].message.type)
                m.id = key
                createMessageInTable(m,document.getElementById("table"))// cree le message dans le tableau
            }
        }
    })
}
