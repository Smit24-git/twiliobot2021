import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.24.0/firebase-app.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.24.0/firebase-database.js";
import "https://cdnjs.cloudflare.com/ajax/libs/pouchdb/7.2.2/pouchdb.min.js";

// Your web app's Firebase configuration
import firebaseConfig from "./firebase-auth.js";

firebase.initializeApp(firebaseConfig);

window.saveOrderOnline = (shipping, order) => {
    firebase.database().ref('shop/orders').push({
        order: order,
        shipping: shipping
    }).then(() => {
        alert("Saved Online");
        window.saveOrderOffline(shipping, order);
    }).catch(e => {
        alert(e.toString());
    });
}

window.saveOrderOffline = (shipping, order) => {
    const db = new PouchDB('shop');

    db.put({
        _id: order.sNumber,
        order: order,
        shipping: shipping
    }).then((res) => {
        alert("Saved Offline");
        window.open("", "_self");
        window.close(); 
    }).catch(e => {
        alert(e.toString());
        window.open("", "_self");
        window.close(); 
    });
}
// firebase.database().ref('todos/' + todoID).set({
//     name: $$("#todo_item").val()
// }).then(() => {
//     $$("#todo_item").val("");
// }).catch(e => {
//     console.log(e.toString());
// });