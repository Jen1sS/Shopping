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

    if (sessionStorage.length > 1) {
        sessionStorage.removeItem("IsThisFirstTime_Log_From_LiveServer");
        console.log(sessionStorage)


        for (let i = 0; i < sessionStorage.length; i++) {
            if (sessionStorage.key(i) !== "" && !sessionStorage.key(i).startsWith("markers-")) create(sessionStorage.key(i));
            else sessionStorage.removeItem("");
        }


        for (let i = 0; i < sessionStorage.length; i++) if (!sessionStorage.key(i).startsWith("markers-")) {
                let elements = JSON.parse(sessionStorage.getItem(sessionStorage.key(i)));
                for (let j = 0; j < elements.length; j++) insert(elements[j], i, true);
        }

        for (let i = 0; i < sessionStorage.length; i++) if (sessionStorage.key(i).startsWith("markers-")){
            let elements = JSON.parse(sessionStorage.getItem(sessionStorage.key(i)));
            for (let j = 0; j < elements.length; j++) if (elements[j] === true) check(i-1+"."+j);
        }




    } else if (preload) {
        selected = 0;
        for (let i = 0; i < preload; i++) {
            create();
            insert(true);
        }
        selected = null;
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
        lists.innerHTML +=
            "<div class=\"list\" id=\"" + num + "\" onclick=\"setSelectedList(" + num + ")\">" +
                "<details id=\"d" + num + "\">" +
                    "<summary><h4 id=\"t" + num + "\">" + tool + "</h4></summary>" +
                    "<div id=\"p" + num + "\"><p class=\"listdetails\">Empty...</p></div>" +
                    "<button class=\"tool\" onclick=\"addElement('" + tool + "')\"><em class=\"tool\">aggiungi</em></button>" +
                "</details>" +
                "<div class=\"progressBar\">" +
                    "<div class=\"insideBar\" id=\"bar" + num + "\">" +
                        "<em class=\"progressBar\"  id=\"progress" + num + "\">0%</em>" +
                    "</div>" +
                "</div>" +
            "</div>";
        listEl[num] = [];
        listSel[num] = [];
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
            lists.innerHTML +=
                "<div class=\"list\" id=\"" + num + "\" onclick=\"setSelectedList(" + num + ")\">" +
                    "<details id=\"d" + num + "\">" +
                        "<summary><h4 id=\"t" + num + "\">" + value + "</h4></summary>" +
                    "<div id=\"p" + num + "\">" +
                        "<p class=\"listdetails\">Empty...</p>" +
                    "</div>" +
                        "<button class=\"tool\" onclick=\"addElement('" + value + "')\">" +
                            "<em class=\"tool\">aggiungi</em>" +
                        "</button>" +
                    "</details>" +
                    "<div class=\"progressBar\">" +
                        "<div class=\"insideBar\" id=\"bar" + num + "\">" +
                            "<em class=\"progressBar\"  id=\"progress" + num + "\">0%</em>" +
                        "</div>" +
                    "</div>" +
                "</div>";
            sessionStorage.setItem(lastTitle, listEl[selected])
        }
        lastTitle = value;
        document.getElementById("title").value = "";

        listEl[num] = [];
        listSel[num] = [];
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

function insert(debug, position, setup) {

    if (debug) {
        if (setup) {
            selected = position;
            document.getElementById("quantity").value = debug["quantity"];
            document.getElementById("price").value = debug["price"];
            document.getElementById("name").value = debug["name"];
        } else {
            document.getElementById("quantity").value = "69";
            document.getElementById("price").value = "1.50";
            document.getElementById("name").value = "Banane";
        }
    }

    let quantity = parseInt(document.getElementById("quantity").value);
    let price = parseFloat(document.getElementById("price").value);
    let name = document.getElementById("name").value;

    if (Object.is(quantity, NaN) || quantity <= 0) document.getElementById("quantity").value = "";
    if (Object.is(price, NaN) || price <= 0) document.getElementById("price").value = "";
    if (!Object.is(parseInt(name), NaN)) document.getElementById("name").value = "";


    if (document.getElementById("quantity").value !== "" && document.getElementById("price").value !== "" && document.getElementById("name").value !== "") {

        if (document.getElementById("EBTool").innerHTML.substring(17).startsWith("Change")) {
            document.getElementById(selectedElement).innerHTML = "Product Name: " + name + " | Quantity: " + quantity + " | Price: " + price + "£";
            listEl[selected][parseInt(selectedElement.substring(2))] = {
                "name": name,
                "price": price,
                "quantity": quantity
            };

        } else {
            if (document.getElementById("p" + selected).innerHTML === "<p class=\"listdetails\">Empty...</p>") document.getElementById("p" + selected).innerHTML = "";
            document.getElementById("p" + selected).innerHTML +=
                "<div class=\"marked\">" +
                    "<p class=\"listdetails\" id=\"" + selected + "." + listEl[selected].length + "\" onclick=setSelectedElement(\"" + selected + "." + listEl[selected].length + "\")>" +
                        "Product Name: " + name + " | Quantity: " + quantity + " | Price: " + price + "£" +
                    "</p>" + 
                    "<input type=\"checkbox\" class=\"marked\" id=\"checked"+selected + "." + listEl[selected].length+"\" onclick=marked(\"" + selected + "." + listEl[selected].length + "\")>" +
                "</div>";

            listEl[selected].push({"name": name, "price": price, "quantity": quantity});
            listSel[selected].push(false);
        }

        document.getElementById("progress" + selected).innerHTML = parseInt((countSelected() / listEl[selected].length) * 100) + "%"
        document.getElementById("bar" + selected).style.width = (countSelected() / listEl[selected].length) * 100 + "%";

        sessionStorage.removeItem(document.getElementById("t" + selected).innerHTML)
        sessionStorage.setItem(document.getElementById("t" + selected).innerHTML, JSON.stringify(listEl[selected]))

        document.getElementById("creationETool").style.display = "none";
        document.getElementById("quantity").value = "";
        document.getElementById("price").value = "";
        document.getElementById("name").value = "";
    }

    if (setup) selected = null;

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
}

function removeElement() {
    listEl[selected].splice(parseInt(selectedElement.substring(2)), 1);
    sessionStorage.removeItem(document.getElementById("t" + selected).innerHTML)
    sessionStorage.setItem(document.getElementById("t" + selected).innerHTML, JSON.stringify(listEl[selected]))


    if (document.getElementById(selected + "." + listEl[selected].length).style.textDecorationLine.startsWith("line-through")) listSel[selected][selectedElement] = false;

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
}

function marked(id, autoset) {

    if (typeof selectedElement !== Number) selectedElement = id.substring(2);

    let text = document.getElementById(id).style;

    if (autoset){
        selected = id.substring(0,1);
        selectedElement = id.substring(2);
    }

    if (text.textDecorationLine.startsWith("line-through")) {
        text.textDecorationLine = "none";
        listSel[selected][selectedElement] = false;
    } else {
        text.textDecorationLine = "line-through";
        listSel[selected][selectedElement] = true;
    }

    document.getElementById("progress" + selected).innerHTML = parseInt((countSelected() / listEl[selected].length) * 100) + "%"
    document.getElementById("bar" + selected).style.width = (countSelected() / listEl[selected].length) * 100 + "%";

    sessionStorage.removeItem("markers-"+document.getElementById("t" + selected).innerHTML)
    sessionStorage.setItem("markers-"+document.getElementById("t" + selected).innerHTML, JSON.stringify(listSel[selected]))

    if (autoset!==true) console.log(sessionStorage)
    if (autoset) {
        selected = undefined;
        selectedElement = null;
    }
}

function countSelected(){
    let sel = 0;
    for (let i=0;i<listSel[selected].length;i++){
        try {
            if(document.getElementById("checked"+selected+"."+i).checked) sel++;
            else if (document.getElementById(selected+"."+i).style.textDecorationLine.startsWith("line")) document.getElementById("checked"+selected+"."+i).checked = true   
        } catch (error) {}
    }
    return sel;
}

function check(id){
    document.getElementById("checked"+id).checked = true;
    marked(id,true)
}

