
let deferredPrompt = null;
const installButton = document.querySelector('#install_button');
installButton.setAttribute('style', 'visibility: visible');

window.addEventListener('beforeinstallprompt', (evt) => {
    evt.preventDefault();
    deferredPrompt = evt;
    installButton.setAttribute('style', 'visibility: visible');
    installButton.addEventListener("click", installApp);
});

const installApp = (evt) => {
    installButton.setAttribute('style', 'visibility: hidden');
    deferredPrompt.prompt();
    deferredPrompt.userChoice
        .them(choiceResult => {
            if (choiceResult.outcome === "accepted") {
                console.log('PWA septup accepted');
            } else if (outcome === 'dismissed') {
                console.log('PWA setup rejected');
            }
            deferredPrompt = null;
        });
}

window.addEventListener("appinstalled", evt => {
    console.log("PWA installed!", evt);
});