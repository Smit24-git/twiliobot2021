
const cachedPages = [
    "/index-offline.html"
    // "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css",
    // "/css/gih-offline.css",
    // "/img/jumbo-background-sm.jpg",
    // "img/logo-header.png"
];

self.addEventListener('install',(event) => {
    event.waitUntil(caches.open("gih-cache")
         .then(cache => cache.addAll(cachedPages)));
});
self.addEventListener("fetch", (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request)
            .then((response) => {
                if (response)
                {
                    return response;
                }
                else
                {
                    return caches.match("/index-offline.html");
                }
            });
        })
    );
});
self.addEventListener('fetch',(event)=>{
    console.log("Fetch Event for: "+event.request.url);
    //event.respondWith(fetch(event.request).catch(()=>caches.match("/index-offline.html")));
    // event.respondWith(
    //     fetch(event.request).catch(()=>caches.match("/index-offline.html").then(
    //         (res)=>{
    //             if(res){return res;}else{return caches.match("/index-offline.html");}})));

    
        // event.respondWith(
        //     fetch(event.request).catch(()=>{
        //       return new Response(`
        //         <!doctype html>
        //         <html>
        //             <head>
        //             <meta name="viewport" content="width=device-width, initial-scale=1.0">
        //             <style>
        //                 body{
        //                     text-align:center;
        //                 }
        //             </style>
        //             </head>
        //             <body style="background-color:black; color:white; margin-top:10%">
        //                 <h1 style="text-align:center">Gotham Imperial Hotel </h1>
        //                 <p>There seems to be a problem with your connection.</p>
        //                 <p>Come visit us at 1 Imperial Plaza, Gotham City for free WiFi.</p>
        //             </body>
        //         </html>`,
        //         {
        //           headers: {
        //               "Content-Type": "text/html"
        //           }
        //       });  
        //     }));
            //if(event.request.url.includes("bootstrap.min.css")){
                // event.respondWith(
                //new Response(
                    // ".hotel-slogan {background:green !important;} nav {display:none}",
                    // {
                    //     headers: {
                    //         "Content-Type":"text/css"
                    //     }
                    // }
                //))
            //}
        
    
});