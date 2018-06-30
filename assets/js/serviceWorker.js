
function showMessage(msg) {
    const message = document.querySelector('#message')
    message.textContent = msg;
}

const registerServiceWorker = () => {
    if (!navigator.serviceWorker) {
        showMessage("service Worker Not Supported");
        return
    }


    navigator.serviceWorker.register('./sw.js').then(function (registration) {
        if (!navigator.serviceWorker.controller) {
            return;
        }
        showMessage("Registering Service Worker");

        if (registration.waiting) {
            updateReady(registration.waiting);
            return;
        }

        if (registration.installing) {
            trackInstalling(registration.installing);
            return;
        }

        registration.addEventListener('updatefound', function () {
            trackInstalling(registration.installing);
        });
    });

    // Ensure refresh is only called once.
    // This works around a bug in "force update on reload".
    var refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
    });
};

const trackInstalling = worker => {

    showMessage("installing Service Worker");
    worker.addEventListener('statechange', function () {
        if (worker.state == 'installed') {
            showMessage("Service Worker Installed");
            updateReady(worker);
        }
    });
};

const updateReady = worker => {
    showMessage("SERVICE WORKER UPDATE READY");
let value = confirm("New Update is Available, Do You Want to Update")
if (value) {
       worker.postMessage('skipWaiting');
    showMessage("UPDATING");

   }

};



registerServiceWorker();