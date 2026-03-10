/**
 * ================================================================
 * Projet   : Body Fit — Site vitrine coach sportif Wissembourg
 * Fichier  : js/main.js
 * Auteur   : [Prénom NOM] – BTS SIO – Promo 20xx
 *
 * Ce fichier gère 3 comportements distincts :
 *   1. Menu burger (ouverture/fermeture sur mobile)
 *   2. Header (effet de fond au scroll)
 *   3. Animations d'apparition des sections (IntersectionObserver)
 *   4. Validation du formulaire de contact côté client
 *
 * On utilise du JavaScript vanilla (ES6+), sans bibliothèque externe.
 * ================================================================
 */


/* ================================================================
   1. MENU BURGER — navigation mobile
   Le menu est caché par défaut (CSS). On gère l'affichage via
   la classe CSS .ouvert et l'attribut aria-expanded pour
   l'accessibilité (lecteurs d'écran).
================================================================ */

const btnBurger       = document.getElementById('btnBurger');
const menuPrincipal   = document.getElementById('menuPrincipal');

if (btnBurger && menuPrincipal) {

    // Clic sur le bouton hamburger
    btnBurger.addEventListener('click', function () {
        // On lit l'état actuel pour basculer
        const estOuvert = this.getAttribute('aria-expanded') === 'true';

        // On met à jour l'attribut ARIA (important pour l'accessibilité)
        this.setAttribute('aria-expanded', String(!estOuvert));

        // On ajoute ou retire la classe qui rend le menu visible
        menuPrincipal.classList.toggle('ouvert');
    });

    // Fermer le menu quand on clique sur un lien
    // (sur mobile on reste sur la même page, donc il faut fermer manuellement)
    const liensNav = menuPrincipal.querySelectorAll('.nav-principale__lien');

    liensNav.forEach(function (lien) {
        lien.addEventListener('click', function () {
            menuPrincipal.classList.remove('ouvert');
            btnBurger.setAttribute('aria-expanded', 'false');
        });
    });

    // Fermer le menu si on appuie sur Échap (accessibilité clavier)
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menuPrincipal.classList.contains('ouvert')) {
            menuPrincipal.classList.remove('ouvert');
            btnBurger.setAttribute('aria-expanded', 'false');
            btnBurger.focus(); // on replace le focus sur le bouton
        }
    });
}


/* ================================================================
   2. HEADER AU SCROLL
   On ajoute la classe .header--defile dès que l'utilisateur fait
   défiler la page de plus de 50px, ce qui déclenche le fond
   semi-opaque défini dans le CSS.
================================================================ */

const header = document.querySelector('.header');

if (header) {
    // { passive: true } améliore les performances sur mobile
    window.addEventListener('scroll', function () {
        header.classList.toggle('header--defile', window.scrollY > 50);
    }, { passive: true });
}


/* ================================================================
   3. ANIMATIONS D'APPARITION AU SCROLL
   On utilise l'IntersectionObserver : une API moderne qui détecte
   quand un élément entre dans la zone visible de l'écran.
   C'est plus performant qu'un listener sur l'événement scroll.
================================================================ */

// On sélectionne tous les éléments à animer
const elementsAAnimer = document.querySelectorAll(
    '.carte-service, .pilier, .carte-temoignage, .chiffres-cles__item'
);

// Configuration de l'observer :
// threshold: 0.12 = l'animation se déclenche quand 12% de l'élément est visible
const observerOptions = {
    threshold: 0.12
};

const observerScroll = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            // On ajoute la classe qui déclenche la transition CSS
            entry.target.classList.add('visible');
            // On arrête d'observer l'élément une fois animé (pas besoin de rejouer)
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// On attache l'observer à chaque élément ciblé
elementsAAnimer.forEach(function (el) {
    observerScroll.observe(el);
});


/* ================================================================
   4. VALIDATION DU FORMULAIRE DE CONTACT
   On intercepte la soumission pour vérifier les champs avant
   l'envoi. Les erreurs sont affichées dans les balises <span>
   prévues dans le HTML (id="erreur-...").
================================================================ */

const formulaire = document.getElementById('formulaireContact');

if (formulaire) {

    formulaire.addEventListener('submit', function (event) {
        // On annule l'envoi natif du formulaire pour valider d'abord
        event.preventDefault();

        // On remet à zéro les éventuelles erreurs précédentes
        reinitialiserErreurs();

        // On valide chaque champ et on récupère si le formulaire est valide
        const formulaireValide = validerFormulaire();

        if (formulaireValide) {
            // Tout est OK : ici on enverrait les données au serveur
            // (via fetch() ou en soumettant réellement le formulaire)
            afficherConfirmation();
        }
    });

    // Validation en temps réel : on efface l'erreur quand l'utilisateur
    // commence à corriger le champ concerné
    const champsObligratoires = formulaire.querySelectorAll('[aria-required="true"]');
    champsObligratoires.forEach(function (champ) {
        champ.addEventListener('input', function () {
            // On récupère l'id du span d'erreur associé à ce champ
            const idErreur = this.getAttribute('aria-describedby');
            if (idErreur) {
                document.getElementById(idErreur).textContent = '';
                this.classList.remove('formulaire__champ--erreur');
            }
        });
    });
}

/**
 * Remet tous les messages d'erreur à vide et retire les classes d'erreur.
 */
function reinitialiserErreurs () {
    const zonesErreur = formulaire.querySelectorAll('.formulaire__erreur');
    zonesErreur.forEach(function (zone) {
        zone.textContent = '';
    });

    const champsEnErreur = formulaire.querySelectorAll('.formulaire__champ--erreur');
    champsEnErreur.forEach(function (champ) {
        champ.classList.remove('formulaire__champ--erreur');
    });
}

/**
 * Vérifie les champs obligatoires.
 * Retourne true si tout est valide, false sinon.
 * @returns {boolean}
 */
function validerFormulaire () {
    let valide = true;

    // Vérification du nom
    const champNom = document.getElementById('champ-nom');
    if (!champNom.value.trim()) {
        afficherErreur(champNom, 'erreur-nom', 'Veuillez saisir votre nom et prénom.');
        valide = false;
    }

    // Vérification de l'email avec une regex simple
    const champEmail = document.getElementById('champ-email');
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!champEmail.value.trim()) {
        afficherErreur(champEmail, 'erreur-email', 'Veuillez saisir votre adresse email.');
        valide = false;
    } else if (!regexEmail.test(champEmail.value)) {
        afficherErreur(champEmail, 'erreur-email', 'L\'adresse email saisie n\'est pas valide.');
        valide = false;
    }

    // Vérification du select objectif
    const champObjectif = document.getElementById('champ-objectif');
    if (!champObjectif.value) {
        afficherErreur(champObjectif, 'erreur-objectif', 'Veuillez choisir un objectif dans la liste.');
        valide = false;
    }

    return valide;
}

/**
 * Affiche un message d'erreur pour un champ donné.
 * @param {HTMLElement} champ     - Le champ en erreur
 * @param {string}      idErreur  - L'id du <span> d'erreur dans le DOM
 * @param {string}      message   - Le texte à afficher
 */
function afficherErreur (champ, idErreur, message) {
    champ.classList.add('formulaire__champ--erreur');
    document.getElementById(idErreur).textContent = message;
    // On déplace le focus sur le premier champ en erreur pour l'accessibilité
    // (on ne le fait qu'une fois : quand on trouve la première erreur)
    if (!document.querySelector('.formulaire__champ--erreur:focus')) {
        champ.focus();
    }
}

/**
 * Affiche un message de confirmation après l'envoi réussi.
 * Dans un vrai projet, cette fonction serait appelée après la réponse
 * du serveur (dans un .then() de fetch), pas avant.
 */
function afficherConfirmation () {
    // On cache le formulaire
    formulaire.style.display = 'none';

    // On crée un message de succès dynamiquement
    const msgSucces = document.createElement('div');
    msgSucces.setAttribute('role', 'alert'); // annoncé par les lecteurs d'écran
    msgSucces.style.cssText = `
        padding: 32px;
        text-align: center;
        font-family: 'Oswald', sans-serif;
        background: #27272d;
        border: 1px solid #35353d;
        border-radius: 18px;
    `;
    msgSucces.innerHTML = `
        <p style="font-size:2.5rem; font-weight:700; color:#e85d26; margin-bottom:12px;">✓ Envoyé !</p>
        <p style="color:#ddd5c8; font-size:0.97rem; line-height:1.7;">
            Merci pour votre message. Je vous recontacte dans les 24h pour convenir d'un bilan téléphonique.
        </p>
    `;

    // On insère le message à la place du formulaire
    formulaire.parentNode.insertBefore(msgSucces, formulaire);
}
