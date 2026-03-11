/*
    Body Fit — main.js
    BTS SIO 1ère année — 2026

    Ce fichier gère :
    1. La validation du formulaire de contact
    2. Les animations d'apparition au scroll
*/


/* ==============================
   1. VALIDATION DU FORMULAIRE
============================== */

var formulaire = document.getElementById('formulaireContact');

if (formulaire) {
    formulaire.addEventListener('submit', function(event) {
        event.preventDefault();

        var nom     = document.getElementById('nom').value.trim();
        var email   = document.getElementById('email').value.trim();
        var message = document.getElementById('message').value.trim();

        if (nom === '') {
            alert('Veuillez saisir votre nom et prénom.');
            return;
        }

        if (email === '') {
            alert('Veuillez saisir votre adresse email.');
            return;
        }

        if (!email.includes('@') || !email.includes('.')) {
            alert("L'adresse email n'est pas valide.");
            return;
        }

        if (message === '') {
            alert('Veuillez écrire un message.');
            return;
        }

        // Tout est OK : on affiche le message de confirmation
        formulaire.style.display = 'none';
        document.getElementById('confirmation').style.display = 'block';
    });
}


/* ==============================
   2. ANIMATION AU SCROLL
============================== */

var elements = document.querySelectorAll('.carte, .avantage');

for (var i = 0; i < elements.length; i++) {
    elements[i].style.opacity = '0';
    elements[i].style.transform = 'translateY(20px)';
    elements[i].style.transition = 'opacity 0.5s ease, transform 0.5s ease';
}

window.addEventListener('scroll', function() {
    for (var i = 0; i < elements.length; i++) {
        var position = elements[i].getBoundingClientRect().top;
        if (position < window.innerHeight - 80) {
            elements[i].style.opacity = '1';
            elements[i].style.transform = 'translateY(0)';
        }
    }
});