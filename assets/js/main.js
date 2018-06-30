
const API_BASE_URL = 'https://free.currencyconverterapi.com/api/v5/';

const allInput = document.querySelectorAll('input');
const allSelect = document.querySelectorAll('select');


//Event Listeners


allInput.forEach(input => input.addEventListener('keyup', handleConversion))
allSelect.forEach(select => select.addEventListener('change', handleConversion))






//functions


var dbPromise = idb.open('CC-db', 1, function (upgradeDb) {
    switch (upgradeDb.oldVersion) {
        case 0:
            var keyValStore = upgradeDb.createObjectStore('queryStore', { keyPath: 'query' });
    }
});



const readQueryFromDB = (query) => {
    // read "query" from "QueryStore and return a promise"
    return dbPromise.then(function (db) {
        var tx = db.transaction('queryStore');
        var queryStore = tx.objectStore('queryStore');
        return queryStore.get(query);
    })
}

const saveQueryToDB = (query, value) => {

    // save "query" in "QueryStore and return a promise"
    return dbPromise.then(function (db) {
        var tx = db.transaction('queryStore', 'readwrite');
        var queryStore = tx.objectStore('queryStore');
        queryStore.put(query, value);
        return tx.complete;
    });


}





function convert(inverse) {

    const [fromInput, toInput] = allInput;
    let fromInputValue = fromInput.value;
    let toInputValue = toInput.value;


    const [fromSelect, toSelect] = allSelect;
    let fromSelectValue = fromSelect.value;
    let toSelectValue = toSelect.value;
    let url, query;
    if (inverse) {
        query = `${fromSelectValue}_${toSelectValue}`;
        url = API_BASE_URL + `convert?q=${query}&compact=ultra`;
    } else {
        query = `${toSelectValue}_${fromSelectValue}`;
        url = API_BASE_URL + `convert?q=${query}&compact=ultra`;
    }


    //check if already fetch in db

    readQueryFromDB(query).then(data => {
        //dont use the internet
        if (data) {

            if (inverse) {
                currencyValue = data.response[`${fromSelectValue}_${toSelectValue}`];

            } else {
                currencyValue = data.response[`${toSelectValue}_${fromSelectValue}`];
            }

            display(currencyValue, inverse);
            showMessage("updated");

        } else {
            showMessage("loading");

            fetch(url)
                .then((response) => {
                    return response.json();
                })
                .then((json) => {
                    saveQueryToDB({ query, response: json });
                    let currencyValue;
                    if (inverse) {
                        currencyValue = json[`${fromSelectValue}_${toSelectValue}`];

                    } else {
                        currencyValue = json[`${toSelectValue}_${fromSelectValue}`];
                    }

                    display(currencyValue, inverse);
                    showMessage("updated");

                })
                .catch((e) => {
                    showMessage(e)
                })


        }
    }
    )





    function display(value, inverse) {
const fromScreen = document.getElementById('from')
const toScreen = document.getElementById('to')
        if (inverse) {
            let newValue = roundOff(value * fromInputValue);
            toInput.value = newValue;
            // screen display 
            let screenText1 = `${fromInputValue} ${fromSelect.options[fromSelect.selectedIndex].text} equals`;
          fromScreen.innerText = screenText1;
            let screenText2 = `${newValue} ${toSelect.options[toSelect.selectedIndex].text}`;
            toScreen.innerText = screenText2;
            
         

            //TODO polyfil round off
        } else {
            let newValue = roundOff(toInputValue * value);
            fromInput.value = newValue;

            let screenText1 = `${newValue} ${fromSelect.options[fromSelect.selectedIndex].text} equals`;
            fromScreen.innerText = screenText1;
            let screenText2 = `${toInputValue} ${toSelect.options[toSelect.selectedIndex].text}`;
            toScreen.innerText = screenText2;

           
            
        }
    }




}


//inprogress
const roundOff = (num) => {
    return +(Math.round(num + "e+4") + "e-4");
}



function handleConversion(event) {
    const type = event.target.name;

    switch (type) {
        case "to_input":
            convert(false);
            break;
        case "from_input":
            convert(true);
            break;
        case "to_select":
            convert(true);
            break;
        case "from_select":
            convert(true);
            break;
        default:
            break;

    }

}



function showMessage(msg) {
    const message = document.querySelector('#message')
    message.textContent = msg;
    setTimeout(() => message.textContent = "_", 6000);
}

//fetch Currency from API to Select Options
function fetchCurrency() {
    const allSelect = document.querySelectorAll('select');
    fetch(`${API_BASE_URL}currencies`)
        .then((response) => {
            //convert response to Json
            return response.json();
        })
        .then((json) => {
            const currencies = json.results;
            //add currencies to Select Options
            for (let key in currencies) {
                addOptionNodes(currencies[key].id, currencies[key].currencyName);
            }
        })
        .catch((e) => {
            showMessage(e)
        })

}

const addOptionNodes = (id, name) => {
    for (let select of allSelect) {
        select.innerHTML += `<option value='${id}'>${name}</option>`;
    }

}



















fetchCurrency();