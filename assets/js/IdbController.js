
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

