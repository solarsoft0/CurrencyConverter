


const registerServiceWorker = () => {
    if (!navigator.serviceWorker) return;


    navigator.serviceWorker.register('./sw.js').then(function (reg) {
        if (!navigator.serviceWorker.controller) {
            return;
        }

        if (reg.waiting) {
            updateReady(reg.waiting);
            return;
        }

        if (reg.installing) {
            trackInstalling(reg.installing);
            return;
        }

        reg.addEventListener('updatefound', function () {
            trackInstalling(reg.installing);
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

    console.log("inside trACKINSTALLING");

    worker.addEventListener('statechange', function () {
        if (worker.state == 'installed') {
            updateReady(worker);
        }
    });
};

const updateReady = worker => {

    console.log("UPDATE READY");

};



registerServiceWorker();