if("serviceWorker" in navigator){
    navigator.serviceWorker.register(`/serviceworker.js`)
    .then(function(registeration){
      console.log("Service worker registered with the scope:"+registeration.scope);
    })
    .catch(function(err){
      console.log("Error while registering the serviceworker: "+err);
    });
}