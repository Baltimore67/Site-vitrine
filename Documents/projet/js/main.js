/*  1. ANTI-SPAM : question maths */

var bonneReponse = 0;

function genererQuestion() {
    var a = Math.floor(Math.random() * 9) + 1;
    var b = Math.floor(Math.random() * 9) + 1;
    bonneReponse = a + b;
    document.getElementById('question-antispam').textContent = a + ' + ' + b;
}


/* 2. VALIDATION DU FORMULAIRE */

var formulaire = document.getElementById('formulaireContact');

if (formulaire) {
    formulaire.addEventListener('submit', function(event) {
        event.preventDefault();

        var nom       = document.getElementById('nom').value.trim();
        var email     = document.getElementById('email').value.trim();
        var telephone = document.getElementById('telephone').value.trim();
        var message   = document.getElementById('message').value.trim();
        var honeypot  = document.getElementById('honeypot').value;
        var antispam  = document.getElementById('antispam').value.trim();

        // --- Honeypot : si rempli c'est un robot, on ne fait rien ---
        if (honeypot !== '') {
            return;
        }

        // --- Vérification nom : doit contenir un espace (prénom + nom) ---
        if (nom === '') {
            alert('Veuillez saisir votre nom et prénom.');
            return;
        }
        if (!nom.includes(' ')) {
            alert('Veuillez saisir votre nom ET votre prénom (séparés par un espace).');
            return;
        }

        // --- Vérification email ---
        if (email === '') {
            alert('Veuillez saisir votre adresse email.');
            return;
        }

        // Vérification 1 : doit contenir exactement un @
        var nbArobase = 0;
        for (var i = 0; i < email.length; i++) {
            if (email[i] === '@') {
                nbArobase++;
            }
        }
        if (nbArobase !== 1) {
            alert("L'adresse email n'est pas valide : elle doit contenir un seul @.");
            return;
        }

        // Vérification 2 : on découpe autour du @
        var partieAvant = email.split('@')[0];  // ex: "jean.dupont"
        var partieApres = email.split('@')[1];  // ex: "gmail.com"

        // La partie avant le @ ne doit pas être vide
        if (partieAvant.length < 2) {
            alert("L'adresse email n'est pas valide : il manque quelque chose avant le @.");
            return;
        }

        // La partie après le @ doit contenir un point
        if (!partieApres.includes('.')) {
            alert("L'adresse email n'est pas valide : il manque un point après le @.");
            return;
        }

        // La partie après le dernier point doit faire au moins 2 caractères (ex: .fr .com)
        var dernierPoint = partieApres.lastIndexOf('.');
        var extension = partieApres.substring(dernierPoint + 1);
        if (extension.length < 2) {
            alert("L'adresse email n'est pas valide : l'extension est trop courte.");
            return;
        }

        // La partie après le @ ne doit pas commencer par un point
        if (partieApres[0] === '.') {
            alert("L'adresse email n'est pas valide.");
            return;
        }

        // --- Vérification téléphone : que des chiffres et espaces ---
        if (telephone !== '') {
            var telValide = true;
            for (var c = 0; c < telephone.length; c++) {
                var caractere = telephone[c];
                if (caractere !== ' ' && (caractere < '0' || caractere > '9')) {
                    telValide = false;
                }
            }
            if (!telValide) {
                alert('Le téléphone ne doit contenir que des chiffres.');
                return;
            }
        }

        // --- Vérification message ---
        if (message === '') {
            alert('Veuillez écrire un message.');
            return;
        }

        // --- Vérification anti-spam ---
        if (antispam === '') {
            alert('Veuillez répondre à la question de vérification.');
            return;
        }
        if (parseInt(antispam) !== bonneReponse) {
            alert('Mauvaise réponse ! Réessayez.');
            genererQuestion();
            document.getElementById('antispam').value = '';
            return;
        }

        // --- Tout est OK ---
        formulaire.style.display = 'none';
        document.getElementById('confirmation').style.display = 'block';
    });
}


/* . ANIMATION AU SCROLL */

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


/* On génère la question APRÈS que tout le HTML soit chargé */
window.onload = function() {
    genererQuestion();
};