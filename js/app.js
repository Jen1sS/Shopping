let infos;
let lists;

let categories = [];

let num = 0;
let noName = 1;
let removedElements = 0;
let removedLists = 0;

let selected = null;
let selectedElement = null;
let place;

let listEl = [];
let listSel = []

let lastTitle = "";

let editing;


function setup(preload) {
    infos = document.getElementById("info").style;
    lists = document.getElementById("lists");
    place = document.getElementById("edit").style;

    sessionStorage.removeItem("")
    sessionStorage.removeItem("IsThisFirstTime_Log_From_LiveServer");
    console.log(sessionStorage)


    if (sessionStorage.length > 0) {

        for (let i = 0; i < sessionStorage.length; i++) create(sessionStorage.key(i));

        let counter = 0;
        for (let i = 0; i < sessionStorage.length; i++) {
            let elements = JSON.parse(sessionStorage.getItem(sessionStorage.key(i)));
            for (let j = 0; j < elements.length; j++){
                insert(elements[j], counter, true, elements[j]["status"]);
            }
            counter++;

        }

        /*counter = 0;
        let counterEl;

        for (let i = 0; i < sessionStorage.length; i++) if (sessionStorage.key(i).startsWith("markers-")){
            let elements = JSON.parse(sessionStorage.getItem(sessionStorage.key(i)));
            for (let j = 0; j < elements.length; j++){ 
                counterEl = 0;
                console.log(elements[j]+" "+j+" "+i)
                if (elements[j] === true) check(counter+"."+counterEl); 
                counterEl++;
            }
            counter++;
        }*/

    } else if (preload) {
        selected = 0;
        for (let i = 0; i < preload; i++) {
            create();
            insert(true);
        }
        selected = null;
    }

    let a = document.getElementsByTagName("select");
    for (let i = 0; i < a.length; i++) {
        a[i].addEventListener("change", function() {filter()});        
    }
}


function info() {
    if (infos.display === "block") infos.display = "none";
    else infos.display = "block";
}

function create(tool) {
    if (tool === true) {
        document.getElementById("creationLTool").style.display = "block";
        document.getElementsByTagName("h3")[0].innerHTML = "Create"
        document.getElementById("title").placeholder = "List Title";
        document.getElementById("LBTool").innerHTML = " <em class=\"tool\">Create</em>";
    } else if (tool !== undefined) {
        lists.innerHTML += listCreation(tool)
        listEl[num] = [];
        //listSel[num] = [];
        num++;
    } else {
        document.getElementById("creationLTool").style.display = "none";

        let value = "NoName" + noName;
        if (document.getElementById("title").value !== "") value = document.getElementById("title").value;
        else noName++;

        if (document.getElementById("LBTool").innerHTML.substring(18).startsWith("Change")) {
            sessionStorage.removeItem(document.getElementById("t" + selected).innerHTML)
            document.getElementById("t" + selected).innerHTML = value;
            sessionStorage.setItem(document.getElementById("t" + selected).innerHTML, JSON.stringify(listEl[selected]))


        } else {
            lists.innerHTML += listCreation(value)
            sessionStorage.setItem(lastTitle, listEl[selected])
        }
        lastTitle = value;
        document.getElementById("title").value = "";

        listEl[num] = [];
        //listSel[num] = [];
        num++;
    }
}

function addElement(name) {
    setSelectedElement(null);

    document.getElementById("creationETool").style.display = "block";
    document.getElementById("ETool").innerHTML = "Inserisci - " + name;
    document.getElementById("EBTool").innerHTML = "<em class=\"tool\">Create</em>";
}

function setSelectedList(identifier) {
    selected = identifier;
}

function setSelectedElement(identifier) {
    if ((selectedElement !== null || selectedElement === identifier) && identifier !== null) {
        createInput(window.event)
    }
    if (selectedElement !== identifier) {

        if (selectedElement !== null) {
            try {
                document.getElementById(selectedElement).style.color = "white";
                document.getElementById(selectedElement).style.fontWeight = "initial";
            } catch (error) {
                console.log("Questo elemento non esiste più")
            }

            hideInput();
        }

        if (identifier !== null) {
            document.getElementById(identifier).style.color = "blue";
            document.getElementById(identifier).style.fontWeight = "bolder";
        }
        selectedElement = identifier;
    }
}


function marked(id, autoset) {

    if (typeof selectedElement !== Number) selectedElement = id.substring(2);
    if (typeof selected !== Number) selected = id.substring(0,1);

    let text = document.getElementById(id).style;

    if (autoset){
        selected = id.substring(0,1);
        selectedElement = id.substring(2);
    }

    if (text.textDecorationLine.startsWith("line-through")) {
        text.textDecorationLine = "none";
        listEl[selected][selectedElement]["status"] = false;
    } else {
        text.textDecorationLine = "line-through";
        listEl[selected][selectedElement]["status"] = true;
    }

    document.getElementById("progress" + selected).innerHTML = parseInt((countSelected() / listEl[selected].length) * 100) + "%"
    document.getElementById("bar" + selected).style.width = (countSelected() / listEl[selected].length) * 100 + "%";


    
    sessionStorage.removeItem(document.getElementById("t" + selected).innerHTML)
    sessionStorage.setItem(document.getElementById("t" + selected).innerHTML, JSON.stringify(listEl[selected]))

    if (autoset) {
        selected = undefined;
        selectedElement = null;
    }
}

function insert(debug, position, setup, isMarked) {

    if (debug) {
        if (setup) {
            selected = position;
            document.getElementById("quantity").value = debug["quantity"];
            document.getElementById("price").value = debug["price"];
            document.getElementById("name").value = debug["name"];
            document.getElementById("product").value = debug["type"];            
        } else {
            document.getElementById("quantity").value = "69";
            document.getElementById("price").value = "1.50";
            document.getElementById("name").value = "Banane";
        }
    }

    let quantity = parseInt(document.getElementById("quantity").value);
    let price = parseFloat(document.getElementById("price").value);
    let name = document.getElementById("name").value;
    let type = document.getElementById("product").value;

    if (!document.getElementById("type").innerHTML.includes(type)){
        document.getElementById("type").innerHTML+= "<option value="+type+">"   
        for (let i = 0; i < document.getElementsByClassName("categorie").length; i++) document.getElementsByClassName("categorie")[i].innerHTML += "<option value="+type+">"+type+"</option>" 
    }
    
    if (!Object.is(parseInt(type), NaN)) document.getElementById("product").value = ""
    if (Object.is(quantity, NaN) || quantity <= 0) document.getElementById("quantity").value = "";
    if (Object.is(price, NaN) || price <= 0) document.getElementById("price").value = "";
    if (!Object.is(parseInt(name), NaN)) document.getElementById("name").value = "";


    if (document.getElementById("quantity").value !== "" && document.getElementById("price").value !== "" && document.getElementById("name").value !== "" && document.getElementById("product").value !== "" ) {

        if (document.getElementById("EBTool").innerHTML.substring(17).startsWith("Change")) {

            document.getElementById(selectedElement).innerHTML = "Product Name: " + name + " | Quantity: " + quantity + " | Price: " + price + "£";
            listEl[selected][parseInt(selectedElement.substring(2))] = {
                "name": name,
                "price": price,
                "quantity": quantity,
                "type": type,
                "status": false
            };
        } else {

            document.getElementById("p" + selected).innerHTML +=
                "<div class=\"marked\">" +
                    "<p class=\"listdetails\" id=\"" + selected + "." + listEl[selected].length + "\" onclick=setSelectedElement(\"" + selected + "." + listEl[selected].length + "\")>" +
                        "Product Name: " + name + " | Quantity: " + quantity + " | Price: " + price + "£" +
                    "</p>" + 
                    "<input type=\"checkbox\" class=\"marked\" id=\"checked"+selected + "." + listEl[selected].length+"\" onclick=marked(\"" + selected + "." + listEl[selected].length + "\")>" +
                "</div>";

            listEl[selected].push({
                "name": name,
                "price": price,
                "quantity": quantity,
                "type": type,
                "status": isMarked
            });

            //listSel[selected].push(false);
        }

        document.getElementById("progress" + selected).innerHTML = parseInt((countSelected() / listEl[selected].length) * 100) + "%"
        document.getElementById("bar" + selected).style.width = (countSelected() / listEl[selected].length) * 100 + "%";

        sessionStorage.removeItem(document.getElementById("t" + selected).innerHTML)
        sessionStorage.setItem(document.getElementById("t" + selected).innerHTML, JSON.stringify(listEl[selected]))
        //if (sessionStorage.getItem("markers-"+document.getElementById("t" + selected).innerHTML)===null) sessionStorage.setItem("markers-"+document.getElementById("t" + selected).innerHTML, JSON.stringify(listSel[selected]))


        document.getElementById("creationETool").style.display = "none";
        document.getElementById("quantity").value = "";
        document.getElementById("price").value = "";
        document.getElementById("name").value = "";
        document.getElementById("product").value = "";
    }

    if (setup){
        if (setup && debug && isMarked) {
            const id = selected + "." + (listEl[selected].length-1)
            document.getElementById("checked"+id).checked = true;
        
            marked(id,true);
        }

        selected = null;
    }
}

function createInput(event) {

    place.display = "flex";

    const x = event.clientX;
    const y = event.clientY;

    place.position = "fixed";
    place.left = x + "px";
    place.top = y + 15 + "px";

    setTimeout(hideInput, 1500);
}

function hideInput() {
    let element = document.getElementById("edit");
    if (element.parentNode.querySelector(":hover") == element) setTimeout(hideInput, 1000);
    else place.display = "none";
}

function editElement() {
    document.getElementById("creationETool").style.display = "block";

    document.getElementById("ETool").innerHTML = "Edit";
    document.getElementById("EBTool").innerHTML = "<em class=\"tool\">Change</em>";


    document.getElementById("name").value = listEl[selected][parseInt(selectedElement.substring(2))]["name"];
    document.getElementById("quantity").value = listEl[selected][parseInt(selectedElement.substring(2))]["quantity"];
    document.getElementById("price").value = listEl[selected][parseInt(selectedElement.substring(2))]["price"];
    document.getElementById("product").value = listEl[selected][parseInt(selectedElement.substring(2))]["type"];

}

function removeElement() {
    listEl[selected].splice(parseInt(selectedElement.substring(2)), 1);
    sessionStorage.removeItem(document.getElementById("t" + selected).innerHTML)
    sessionStorage.setItem(document.getElementById("t" + selected).innerHTML, JSON.stringify(listEl[selected]))


    if (document.getElementById(selected + "." + listEl[selected].length).style.textDecorationLine.startsWith("line-through")) listEl[selected][selectedElement]["status"] = false;

    document.getElementById(selectedElement).remove();
    document.getElementById("checked"+selectedElement).remove();

    if (listEl[selected].length > 0){
        document.getElementById("progress" + selected).innerHTML = parseInt((countSelected() / listEl[selected].length) * 100) + "%"
        document.getElementById("bar" + selected).style.width = (countSelected() / listEl[selected].length) * 100 + "%";
    } else {
        document.getElementById("progress" + selected).innerHTML = "0%";
        document.getElementById("bar" + selected).style.width = "0%";
    }
}

function remove() {
    sessionStorage.removeItem(document.getElementById("t" + selected).innerHTML);
    document.getElementById(selected).remove();
}

function modify() {
    document.getElementById("creationLTool").style.display = "block";
    document.getElementsByTagName("h3")[0].innerHTML = "Modifica Titolo"
    document.getElementById("title").placeholder = "New Title...";
    document.getElementById("LBTool").innerHTML = " <em class=\"tool\">Change</em>";
}

function clearData() {
    console.log("Data cleared")
    sessionStorage.clear()
    window.location.reload(false); 
}

function countSelected(){
    let sel = 0;
    for (let i=0;i<listEl[selected].length;i++){
        try {
            if(document.getElementById("checked"+selected+"."+i).checked) sel++;
            else if (document.getElementById(selected+"."+i).style.textDecorationLine.startsWith("line")) document.getElementById("checked"+selected+"."+i).checked = true   
        } catch (error) {}
    }
    return sel;
}

/*function check(id){
    console.log(id)
    document.getElementById("checked"+id).checked = true;
    marked(id,true)
}*/

function filter(){
    let filt = document.getElementById(selected+"selected").value;
    let div = document.getElementById("p"+selected);


    let sort = true;

    if (filt.includes("PrezzoD")) listEl[selected].sort((a,b)=>{return (a["price"]-b["price"])*-1});
    else if (filt.includes("PrezzoC")) listEl[selected].sort((a,b)=>{return (a["price"]-b["price"])});
    else if (filt.includes("QuantitàD")) listEl[selected].sort((a,b)=>{return (a["quantity"]-b["quantity"])*-1});
    else if (filt.includes("QuantitàC")) listEl[selected].sort((a,b)=>{return (a["quantity"]-b["quantity"])});
    else if (filt.includes("Nome")) listEl[selected].sort((a,b)=>{return a["name"].localeCompare(b["name"]);});
    else if (filt.includes("any"));
    else sort = false;

    div.innerHTML = "";

    for (let i=0;i<listEl[selected].length;i++) if (listEl[selected][i]["type"].startsWith(filt) || sort) {
        let prod = listEl[selected][i];
        document.getElementById("p" + selected).innerHTML +=
        "<div class=\"marked\">" +
            "<p class=\"listdetails\" id=\"" + selected + "." + i + "\" onclick=setSelectedElement(\"" + selected + "." + i + "\")>" +
                "Product Name: " + prod["name"] + " | Quantity: " + prod["quantity"] + " | Price: " + prod["price"] + "£" +
            "</p>" + 
            "<input type=\"checkbox\" class=\"marked\" id=\"checked"+selected + "." + i+"\" onclick=marked(\"" + selected + "." + i + "\")>" +
        "</div>";

        if (listEl[selected][i]["status"]){
            document.getElementById(selected+"."+i).style.textDecorationLine = "line-through";
            document.getElementById("checked"+selected+"."+i).checked = true ;
        }
    }
}


function listCreation(value){
    return "<div class=\"list\" id=\"" + num + "\" onclick=\"setSelectedList(" + num + ")\">" +
    "<details id=\"d" + num + "\">" +
        "<summary><h4 id=\"t" + num + "\">" + value + "</h4></summary>" +
            "<label class=\"selects\">Filtra per:</label> <select name=\"cars\" list=\"type\" class=\"select\" id=\""+num+"selected\">"+
                "<optgroup label=\"Non Filtrare\">"+
                "<option value=\"any\"> Non Filtrare </option>"+    
                "</optgroup>"+

                "<optgroup label=\"Ordinamenti\">"+
                    "<option value=\"PrezzoDecr\"> Prezzo (decr.) </option>"+
                    "<option value=\"PrezzoCres\"> Prezzo (cresc.) </option>"+

                    "<option value=\"QuantitàDecr\"> Quantità (decr.) </option>"+
                    "<option value=\"QuantitàCres\"> Quantità (cresc.) </option>"+

                    "<option value=\"Nome\"> Nome </option>"+
                "</optgroup>"+

                "<optgroup label=\"Categorie\" class=\"categorie\">"+
                    "<option value=\"Alimentari\"> Alimentari </option>"+
                    "<option value=\"Casa\"> Casa </option>"+
                    "<option value=\"Informatica\"> Informatica </option>"+
                    "<option value=\"Giochi\"> Giochi </option>"+
                    "<option value=\"Altro\"> Altro </option>"+
                "</optgroup>"+
            "</select>"+
            "<div id=\"p" + num + "\"></div>" +
        "<button class=\"tool\" onclick=\"addElement('" + value + "')\"><em class=\"tool\">aggiungi</em></button>" +
    "</details>" +
    "<div class=\"progressBar\">" +
        "<div class=\"insideBar\" id=\"bar" + num + "\">" +
            "<em class=\"progressBar\"  id=\"progress" + num + "\">0%</em>" +
        "</div>" +
    "</div>" +
"</div>";
}


