// ==========================================================================
// TERMINAL DES DOTATIONS - RETRIBUTORS
// Architecture reprise du terminal des Forges (Modele / Vue / Controleur)
//
// Le referentiel tient en deux tableaux :
//   FORMATIONS : les Compagnies et corps, avec leurs roles.
//   ARMURERIE  : un equipement = une seule entree, qui porte la liste des
//                roles autorises a le percevoir (ses "tags").
// La vue par role est reconstruite au chargement par construireDotations().
// Consequence : un nom d'arme n'existe qu'a un seul endroit du fichier, donc
// aucune divergence d'orthographe possible et aucun doublon dans l'index.
// ==========================================================================

// --- Echelle des autorites d'autorisation ---
const AUTORITES = {
    aucune: 0,
    sergent: 1,
    lieutenant: 2,
    capitaine: 3,
    maitre: 4
};

const AUTORITES_LABEL = {
    aucune: "Aucune",
    sergent: "Sergent",
    lieutenant: "Lieutenant",
    capitaine: "Capitaine",
    maitre : "Maitre de Spécialité"
};

// --- Types de dotation (sert aux filtres, aux tags et a la legende) ---
const TYPES = {
    initial: {
        label: "Équipement initial",
        court: "INIT",
        desc: "Dotation basique et obligatoire."
    },
    optionnel: {
        label: "Équipement optionnel",
        court: "OPT",
        desc: "Disponible en permanence, sous réserve de l'autorisation indiquée."
    },
    pret: {
        label: "Équipement de prêt",
        court: "PRET",
        desc: "Prêté pour la mission, à rendre aux Forges au retour."
    },
    veteran: {
        label: "Équipement Vétéran",
        court: "VET",
        desc: "Accessible à partir du statut de Vétéran, avec autorisation."
    },
    honorifique: {
        label: "Équipement honorifique",
        court: "HON",
        desc: "Décerné en récompense par l'autorité compétente. Permanent."
    }
};

const ORDRE_TYPES = ["initial", "optionnel", "pret", "veteran", "honorifique"];

// ==========================================================================
// FORMATIONS : Compagnies, corps de spécialistes et leurs rôles.
// L'identifiant d'un role est ce que l'armurerie reference.
// ==========================================================================
const FORMATIONS = [
    {
        id: "c4",
        code: "4e",
        nav: "4e Compagnie",
        titre: "DOTATIONS - 4E COMPAGNIE",
        intro: "Impulsors, Assauts, Devastators et Vétérans de la Compagnie.",
        note: "Équipement optionnel disponible en permanence sous autorisation d'un Officier de la Compagnie. Les autorisations de Vétéran sont accordées selon les faits d'armes et l'importance au sein de la Compagnie.",
        roles: [
            { id: "impulsor", nom: "IMPULSOR", court: "Impulsor" },
            { id: "assaut", nom: "ASSAUT", court: "Assaut" },
            { id: "devastator", nom: "DEVASTATOR", court: "Devastator" },
            {
                id: "c4-veteran",
                nom: "TOUTES SPÉCIALISATIONS // À PARTIR DE VÉTÉRAN",
                court: "Vétéran",
                commun: true,
                titresSections: {
                    veteran: "Sur demande, dotation permanente",
                    honorifique: "Récompense, dotation permanente"
                }
            }
        ]
    },
    {
        id: "c10",
        code: "10e",
        nav: "10e Compagnie",
        titre: "DOTATIONS - 10E COMPAGNIE",
        intro: "Néophytes, Frères sans spécialisation, Longstrikes, Incursors et Vétérans.",
        note: "Équipement optionnel laissé à l'appréciation du Frère, sauf mention d'autorisation. Les autorisations de Vétéran sont accordées selon les faits d'armes et l'importance au sein de la Compagnie.",
        roles: [
            { id: "neophyte", nom: "NÉOPHYTE", court: "Néophyte" },
            { id: "frere", nom: "FRÈRE DE BATAILLE (SANS SPÉCIALISATION)", court: "Frère de Bataille" },
            { id: "longstrike", nom: "LONGSTRIKE (TIREUR D'ÉLITE)", court: "Longstrike" },
            { id: "incursor", nom: "INCURSOR (AVANT-GARDE)", court: "Incursor" },
            {
                id: "c10-veteran",
                nom: "TOUTES SPÉCIALISATIONS // À PARTIR DE VÉTÉRAN",
                court: "Vétéran",
                commun: true,
                titresSections: {
                    veteran: "Sur demande, dotation permanente",
                    honorifique: "Récompense, dotation permanente"
                }
            }
        ]
    },
    {
        id: "apothicaires",
        code: "APO",
        nav: "Apothicaires",
        titre: "DOTATIONS - APOTHICARION",
        intro: "Apothicaires des différentes Compagnies.",
        note: "Note des Forges : tout équipement non présent ou non conforme à cette liste dans l'inventaire d'un Frère Apothicaire lui sera confisqué. L'équipement honorifique est décerné par le Maître Apothicaire.",
        roles: [
            { id: "apo-novice", nom: "APOTHICAIRE NOVICE", court: "Novice" },
            { id: "apo-confirme", nom: "APOTHICAIRE CONFIRMÉ", court: "Confirmé" },
            { id: "apo-veteran", nom: "APOTHICAIRE VÉTÉRAN", court: "Vétéran", limite: "Effectif maximal : 2" }
        ]
    },
    {
        id: "chapelains",
        code: "REC",
        nav: "Chapelains",
        titre: "DOTATIONS - RECLUSIAM",
        intro: "Judicars et Chapelains des différentes Compagnies.",
        note: "Note des Forges : tout équipement non présent ou non conforme à cette liste dans l'inventaire d'un Frère Chapelain lui sera confisqué. L'équipement honorifique est décerné par le Réclusiarque.",
        roles: [
            { id: "judicar", nom: "JUDICAR", court: "Judicar" },
            { id: "chapelain", nom: "CHAPELAIN", court: "Chapelain" }
        ]
    },
    {
        id: "archivistes",
        code: "LIB",
        nav: "Archivistes",
        titre: "DOTATIONS - LIBRARIUS",
        intro: "Archivistes des différentes Compagnies.",
        note: "Note des Forges : tout équipement non présent ou non conforme à cette liste dans l'inventaire d'un Frère Archiviste lui sera confisqué. L'équipement honorifique est décerné par le Maître Archiviste.",
        roles: [
            { id: "arch-initie", nom: "INITIÉ", court: "Initié" },
            { id: "arch-confirme", nom: "ARCHIVISTE CONFIRMÉ", court: "Confirmé" }
        ]
    }
];

// Index des roles : identifiant -> { court, nom, code, formation }
const ROLES = new Map();
FORMATIONS.forEach(f => f.roles.forEach(r => ROLES.set(r.id, {
    court: r.court,
    nom: r.nom,
    code: f.code,
    formationId: f.id,
    formation: f.nav
})));

// ==========================================================================
// ARMURERIE : une entree par equipement, quel que soit le nombre de roles.
//
// nom       : libelle unique, tel qu'affiche partout.
// classe    : famille d'arme, sert au tri et a la recherche.
// note      : precision affichee sous l'entree (optionnel).
// dotations : a quel titre les roles y ont droit.
//             { type: "initial" | "optionnel" | "pret" | "veteran" | "honorifique",
//               aut: "sergent" | "lieutenant" | "capitaine" (optionnel),
//               roles: [identifiants de roles] }
//
// Pour ajouter une arme : une entree ici. Pour la donner a un role de plus :
// un identifiant de plus dans le tableau roles concerne.
// ==========================================================================
const ARMURERIE = [

    // --- Mêlée ---
    {
        nom: "Couteau Astartes",
        classe: "Mêlée",
        dotations: [
            { type: "initial", roles: ["neophyte"] },
            { type: "optionnel", roles: ["frere", "longstrike", "incursor", "impulsor", "devastator", "assaut"] }
        ]
    },
    {
        nom: "Double Couteau Astartes",
        classe: "Mêlée",
        dotations: [
            { type: "optionnel", roles: ["frere", "longstrike", "incursor", "impulsor", "devastator", "assaut"] }
        ]
    },
    {
        nom: "Épée Tronçonneuse Mk I",
        classe: "Mêlée",
        dotations: [
            { type: "initial", roles: [
                "assaut", "devastator", "frere", "longstrike", "incursor", "apo-novice",
                "arch-initie"
            ] }
        ]
    },
    {
        nom: "Double Épée Tronçonneuse Mk I",
        classe: "Mêlée",
        dotations: [
            { type: "optionnel", roles: [
                "assaut", "devastator", "frere", "longstrike", "incursor", "apo-novice",
                "arch-initie"
            ] }
        ]
    },
    {
        nom: "Épée Tronçonneuse Lourde Mk I",
        classe: "Mêlée",
        dotations: [
            { type: "optionnel", roles: [
                "assaut", "devastator", "frere", "longstrike", "incursor", "apo-novice",
                "arch-initie"
            ] }
        ]
    },
    {
        nom: "Hache Tronçonneuse Mk I",
        classe: "Mêlée",
        dotations: [
            { type: "optionnel", roles: ["frere", "longstrike", "incursor", "apo-novice", "arch-initie", "assaut", "devastator", "impulsor"] }
        ]
    },
    {
        nom: "Hache Tronçonneuse Lourde Mk I",
        classe: "Mêlée",
        dotations: [
            { type: "optionnel", roles: ["frere", "longstrike", "incursor", "apo-novice", "arch-initie", "assaut", "devastator", "impulsor"] }
        ]
    },
    {
        nom: "Double Hache Tronçonneuse Mk I",
        classe: "Mêlée",
        dotations: [
            { type: "optionnel", roles: ["frere", "longstrike", "incursor", "apo-novice", "arch-initie", "assaut", "devastator", "impulsor"] }
        ]
    },
    {
        nom: "Épée Tronçonneuse & Bouclier Mk I",
        classe: "Mêlée",
        dotations: [
            { type: "initial", roles: ["impulsor"] },
            { type: "optionnel", roles: ["frere", "longstrike", "incursor", "apo-novice", "arch-initie", "assaut", "devastator"] }
        ]
    },
    {
        nom: "Hache Tronçonneuse & Bouclier Mk I",
        classe: "Mêlée",
        dotations: [
            { type: "optionnel", roles: ["frere", "longstrike", "incursor", "apo-novice", "arch-initie", "assaut", "devastator", "impulsor"] }
        ]
    },
    {
        nom: "Épée Énergétique Mk I",
        classe: "Mêlée",
        dotations: [
            { type: "initial", roles: ["apo-confirme", "arch-confirme"] },
            { type: "veteran", aut: "lieutenant", roles: ["c4-veteran", "c10-veteran"] }
        ]
    },
    {
        nom: "Épée Énergétique Lourde Mk I",
        classe: "Mêlée",
        dotations: [
            { type: "initial", roles: ["apo-confirme", "judicar", "arch-confirme"] },
            { type: "veteran", aut: "lieutenant", roles: ["c4-veteran"] },
            { type: "veteran", aut: "capitaine", roles: ["c10-veteran"] }
        ]
    },
    {
        nom: "Hache Énergétique Mk I",
        classe: "Mêlée",
        dotations: [
            { type: "optionnel", roles: ["arch-confirme"] },
            { type: "veteran", aut: "lieutenant", roles: ["c4-veteran", "c10-veteran"] }
        ]
    },
    {
        nom: "Hache Énergétique Lourde Mk I",
        classe: "Mêlée",
        dotations: [
            { type: "optionnel", roles: ["arch-confirme"] },
            { type: "veteran", aut: "lieutenant", roles: ["c4-veteran"] },
            { type: "veteran", aut: "capitaine", roles: ["c10-veteran"] }
        ]
    },
    {
        nom: "Épée Énergétique & Bouclier Mk I",
        classe: "Mêlée",
        dotations: [
            { type: "veteran", aut: "lieutenant", roles: ["c4-veteran"] },
            { type: "veteran", aut: "capitaine", roles: ["c10-veteran"] }
        ]
    },
    {
        nom: "Hache Énergétique & Bouclier Mk I",
        classe: "Mêlée",
        dotations: [
            { type: "veteran", aut: "lieutenant", roles: ["c4-veteran"] },
            { type: "veteran", aut: "capitaine", roles: ["c10-veteran"] }
        ]
    },
    {
        nom: "Thunder Hammer",
        classe: "Mêlée",
        dotations: [
            { type: "veteran", aut: "capitaine", roles: ["c4-veteran", "c10-veteran"] }
        ]
    },
    {
        nom: "Crozius",
        classe: "Mêlée",
        dotations: [
            { type: "initial", roles: ["chapelain"] }
        ]
    },
        {
        nom: "Crozius & Bouclier",
        classe: "Mêlée",
        dotations: [
            { type: "optionnel", aut: "maitre", roles: ["chapelain"] }
        ]
    },

    // --- Bolter ---
    {
        nom: "Fusil Bolter Mk II",
        classe: "Bolter",
        dotations: [
            { type: "initial", roles: [
                "impulsor", "frere", "incursor", "apo-novice", "apo-confirme",
                "apo-veteran"
            ] },
            { type: "optionnel", roles: ["judicar", "chapelain", "arch-initie", "arch-confirme"] },
            { type: "optionnel", roles: ["assaut"] }
        ]
    },
    {
        nom: "Fusil Bolter Lourd Mk II",
        classe: "Bolter",
        dotations: [
            { type: "optionnel", roles: [
                "frere", "incursor", "apo-novice", "apo-confirme", "apo-veteran", "judicar",
                "chapelain"
            ] },
            { type: "optionnel", roles: ["impulsor", "assaut"] }
        ]
    },
    {
        nom: "Bolter Lourd Mk II",
        classe: "Bolter",
        dotations: [
            { type: "initial", roles: ["devastator"] }
        ]
    },
    {
        nom: "Bolter Modèle Godwin",
        classe: "Bolter",
        dotations: [
            { type: "optionnel", roles: ["apo-novice", "apo-confirme", "apo-veteran", "judicar", "chapelain"] }
        ]
    },
    {
        nom: "Bolter Néophyte",
        classe: "Bolter",
        dotations: [
            { type: "initial", roles: ["neophyte"] }
        ]
    },
    {
        nom: "Storm Bolter",
        classe: "Bolter",
        dotations: [
            { type: "veteran", aut: "lieutenant", roles: ["c4-veteran", "c10-veteran"] },
            { type: "optionnel", aut: "maitre", roles: ["chapelain"]}
        ]
    },
    {
        nom: "Sniper Bolter",
        classe: "Bolter",
        dotations: [
            { type: "initial", roles: ["longstrike"] },
        ]
    },

    // --- Carabine ---
    {
        nom: "Carabine Bolter Standart Mk II",
        classe: "Carabine",
        dotations: [
            { type: "initial", roles: ["assaut"] },
            { type: "optionnel", roles: [
                "frere", "incursor", "apo-novice", "apo-confirme", "apo-veteran", "judicar",
                "chapelain"
            ] },
            { type: "optionnel", roles: ["impulsor"] }
        ]
    },
    {
        nom: "Carabine Bolter Marksman Mk II",
        classe: "Carabine",
        dotations: [
            { type: "optionnel", roles: [
                "longstrike", "incursor", "apo-novice", "apo-confirme", "apo-veteran",
                "judicar", "chapelain"
            ] },
            { type: "optionnel", roles: ["impulsor", "assaut"] }
        ]
    },
    {
        nom: "Carabine Bolter Infiltrator Mk II",
        classe: "Carabine",
        dotations: [
            { type: "optionnel", roles: [
                "longstrike", "incursor", "apo-novice", "apo-confirme", "apo-veteran",
                "judicar", "chapelain"
            ] },
            { type: "optionnel", roles: ["impulsor", "assaut"] }
        ]
    },
    {
        nom: "Carabine Bolter Oculus Mk II",
        classe: "Carabine",
        dotations: [
            { type: "optionnel", roles: [
                "longstrike", "incursor", "apo-novice", "apo-confirme", "apo-veteran",
                "judicar", "chapelain"
            ] },
            { type: "optionnel", roles: ["impulsor", "assaut"] }
        ]
    },

    // --- Pistolet ---
    {
        nom: "Pistolet Bolter Mk II",
        classe: "Pistolet",
        dotations: [
            { type: "initial", roles: [
                "assaut", "devastator", "frere", "longstrike", "incursor", "apo-novice",
                "judicar", "chapelain", "arch-initie"
            ] },
            { type: "optionnel", roles: ["apo-confirme", "apo-veteran"] }
        ]
    },
    {
        nom: "Pistolet Bolter Lourd Mk II",
        classe: "Pistolet",
        dotations: [
            { type: "initial", roles: ["apo-confirme", "arch-confirme"] },
            { type: "optionnel", roles: ["frere", "longstrike", "incursor", "apo-veteran", "judicar", "chapelain"] },
            { type: "optionnel", roles: ["assaut", "devastator"] }
        ]
    },
    {
        nom: "Pistolet Bolter Bouclier Mk II",
        classe: "Pistolet",
        dotations: [
            { type: "initial", roles: ["impulsor"] }
        ]
    },
    {
        nom: "Pistolet Plasma Mk II",
        classe: "Pistolet",
        dotations: [
            { type: "initial", roles: ["apo-veteran"] },
            { type: "optionnel", aut: "maitre", roles: ["apo-confirme", "arch-confirme", "chapelain"] },
            { type: "honorifique", aut: "lieutenant", roles: ["c4-veteran", "c10-veteran"] }
        ]
    },
    {
        nom: "Pistolet Inferno Mk II",
        classe: "Pistolet",
        dotations: [
            { type: "optionnel", roles: ["apo-veteran", "chapelain"] },
            { type: "optionnel", aut: "maitre", roles: ["apo-confirme", "arch-confirme", "chapelain"] },
            { type: "honorifique", aut: "lieutenant", roles: ["c4-veteran", "c10-veteran"] }
        ]
    },
    {
        nom: "Pistolet Neo-Volkite",
        classe: "Pistolet",
        dotations: [
            { type: "veteran", aut: "lieutenant", roles: ["longstrike", "incursor"] },
            { type: "optionnel", aut: "maitre", roles: ["apo-confirme", "apo-veteran", "chapelain"] },
            { type: "honorifique", aut: "capitaine", roles: ["c4-veteran", "c10-veteran"] }
        ]
    },
    {
        nom: "Pistolet Lance-Flamme Mk I",
        classe: "Pistolet",
        dotations: [
            { type: "optionnel", roles: ["chapelain"] },
            { type: "optionnel", aut: "maitre", roles: ["apo-confirme", "apo-veteran", "arch-confirme"] },
            { type: "honorifique", aut: "lieutenant", roles: ["c4-veteran", "c10-veteran"] }
        ]
    },

    // --- Arme spéciale ---
    {
        nom: "Fusil Melta Mk II",
        classe: "Arme spéciale",
        dotations: [
            { type: "pret", roles: ["impulsor", "assaut", "frere", "incursor"] },
            { type: "veteran", aut: "lieutenant", roles: ["c4-veteran", "c10-veteran"] }
        ]
    },
    {
        nom: "Lance-Flamme Mk I",
        classe: "Arme spéciale",
        dotations: [
            { type: "initial", roles: ["judicar", "chapelain"] },
            { type: "pret", roles: ["impulsor", "assaut", "frere", "incursor"] }
        ]
    },
    {
        nom: "Plasma Néophyte",
        classe: "Arme spéciale",
        dotations: [
            { type: "pret", roles: ["neophyte"] }
        ]
    },
    {
        nom: "Melta Néophyte",
        classe: "Arme spéciale",
        dotations: [
            { type: "pret", roles: ["neophyte"] }
        ]
    },
    {
        nom: "Neo-Shotgun",
        classe: "Arme spéciale",
        dotations: [
            { type: "optionnel", aut: "sergent", roles: ["neophyte"] }
        ]
    },
    {
        nom: "LongLas",
        classe: "Arme spéciale",
        dotations: [
            { type: "optionnel", aut: "sergent", roles: ["neophyte"] }
        ]
    },
    {
        nom: "LasSniper",
        classe: "Arme spéciale",
        dotations: [
            { type: "optionnel", aut: "sergent", roles: ["longstrike"] }
        ]
    },

    // --- Arme lourde ---
    {
        nom: "Multi Melta Lourd Mk II",
        classe: "Arme lourde",
        dotations: [
            { type: "pret", roles: ["devastator"] }
        ]
    },
    {
        nom: "Incinérateur Plasma Lourd Mk II",
        classe: "Arme lourde",
        dotations: [
            { type: "pret", roles: ["devastator"] }
        ]
    },
    {
        nom: "Canon Laser Mk II",
        classe: "Arme lourde",
        dotations: [
            { type: "pret", roles: ["devastator"] }
        ]
    },

    // --- Module ---
    {
        nom: "Module de Céramite Lourde",
        classe: "Module",
        dotations: [
            { type: "initial", roles: ["devastator"] },
            { type: "optionnel", aut: "sergent", roles: ["impulsor", "assaut", "incursor", "longstrike"] }
        ]
    },
    {
        nom: "Module de Céramite Légère",
        classe: "Module",
        dotations: [
            { type: "initial", roles: ["apo-novice", "apo-confirme", "apo-veteran", "arch-confirme"] },
            { type: "optionnel", aut: "sergent", roles: ["impulsor", "assaut", "devastator", "longstrike", "incursor"] }
        ]
    },
    {
        nom: "Module de Vision Nocturne",
        classe: "Module",
        dotations: [
            { type: "optionnel", aut: "sergent", roles: ["impulsor", "assaut", "devastator", "longstrike", "incursor"] }
        ]
    },
    {
        nom: "Module de Camouflage",
        classe: "Module",
        dotations: [
            { type: "initial", roles: ["longstrike", "incursor"] }
        ]
    },
    {
        nom: "Module de Scanner Tactique",
        classe: "Module",
        dotations: [
            { type: "optionnel", aut: "sergent", roles: ["longstrike", "incursor"] }
        ]
    },

    // --- Équipement ---
    {
        nom: "Jump Pack",
        classe: "Équipement",
        dotations: [
            { type: "initial", roles: ["assaut"] }
        ]
    },
    {
        nom: "Grappin Astartes",
        classe: "Équipement",
        dotations: [
            { type: "initial", roles: ["longstrike", "incursor"] }
        ]
    },
    {
        nom: "Matériel de spécialité",
        classe: "Équipement",
        note: "Selon la mission et le commandant de mission (jump-pack, grappin, etc.). Armes de spécialité exclues.",
        dotations: [
            { type: "pret", roles: ["apo-novice", "apo-confirme", "apo-veteran", "chapelain"] }
        ]
    },
];

// ==========================================================================
// RECONSTRUCTION DE LA VUE PAR ROLE
// L'armurerie est organisee par equipement, l'affichage par role : on
// retourne la table une fois au chargement.
// ==========================================================================
function construireDotations() {
    const parRole = new Map();
    ROLES.forEach((infos, id) => parRole.set(id, new Map()));

    ARMURERIE.forEach(item => {
        item.dotations.forEach(dot => {
            dot.roles.forEach(rid => {
                const sections = parRole.get(rid);
                if (!sections) {
                    console.warn("Rôle inconnu dans l'armurerie : " + rid + " (" + item.nom + ")");
                    return;
                }
                if (!sections.has(dot.type)) sections.set(dot.type, []);
                const entree = { nom: item.nom, classe: item.classe };
                if (dot.aut) entree.aut = dot.aut;
                if (item.note) entree.note = item.note;
                sections.get(dot.type).push(entree);
            });
        });
    });

    return FORMATIONS.map(f => ({
        id: f.id,
        code: f.code,
        nav: f.nav,
        titre: f.titre,
        intro: f.intro,
        note: f.note,
        roles: f.roles.map(r => {
            const sections = parRole.get(r.id);
            return {
                id: r.id,
                nom: r.nom,
                court: r.court,
                commun: r.commun,
                limite: r.limite,
                sections: ORDRE_TYPES
                    .filter(t => sections.has(t))
                    .map(t => ({
                        type: t,
                        titre: r.titresSections ? r.titresSections[t] : undefined,
                        items: sections.get(t)
                    }))
            };
        })
    }));
}

const DOTATIONS = construireDotations();

// ==========================================================================
// OUTILS
// ==========================================================================

// Echappement HTML (les donnees sont statiques, mais la recherche est saisie)
function esc(txt) {
    return String(txt)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

// Normalisation pour la recherche (insensible aux accents et a la casse)
function norm(txt) {
    return String(txt)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

// Controle de coherence du referentiel. A lancer dans la console apres une
// modification : auditReferentiel().
function auditReferentiel() {
    const inconnus = [];
    const servis = new Set();

    ARMURERIE.forEach(item => {
        if (!item.dotations || item.dotations.length === 0) {
            inconnus.push("Équipement sans dotation : " + item.nom);
        }
        (item.dotations || []).forEach(dot => dot.roles.forEach(rid => {
            if (!ROLES.has(rid)) inconnus.push("Rôle inconnu : " + rid + " (" + item.nom + ")");
            else servis.add(rid);
        }));
    });

    ROLES.forEach((infos, id) => {
        if (!servis.has(id)) inconnus.push("Rôle sans équipement : " + id);
    });

    console.log("Équipements : " + ARMURERIE.length + " | Rôles : " + ROLES.size);
    if (inconnus.length === 0) console.log("Référentiel cohérent.");
    else inconnus.forEach(l => console.warn(l));
    return inconnus;
}

// ==========================================================================
// MODELE (Donnees + etat de l'interface)
// ==========================================================================
class DataModel {
    constructor() {
        this.currentView = "home";
        this.categories = DOTATIONS;

        // Etat des filtres, partage entre toutes les pages
        this.filtres = {
            types: {
                initial: true,
                optionnel: true,
                pret: true,
                veteran: true,
                honorifique: true
            },
            formations: {},             // utilise par l'index general
            autorite: "capitaine",      // autorite maximale dont dispose le Frere
            masquerVerrouille: false,   // masquer plutot que griser les entrees hors portee
            recherche: ""
        };
        FORMATIONS.forEach(f => { this.filtres.formations[f.id] = true; });

        // Roles masques : cle "categorieId|nomDuRole"
        this.rolesMasques = new Set();

        // Fiche de dotation en cours de composition : cle -> objet descriptif
        this.fiche = new Map();
    }

    getCategorie(id) {
        return this.categories.find(c => c.id === id);
    }

    niveauAutorite() {
        return AUTORITES[this.filtres.autorite];
    }

    // Une entree est verrouillee si l'autorite requise depasse celle selectionnee
    estVerrouille(item) {
        if (!item.aut) return false;
        return AUTORITES[item.aut] > this.niveauAutorite();
    }

    roleMasque(catId, role) {
        return this.rolesMasques.has(catId + "|" + role.nom);
    }

    basculerRole(catId, nomRole, actif) {
        const cle = catId + "|" + nomRole;
        if (actif) {
            this.rolesMasques.delete(cle);
        } else {
            this.rolesMasques.add(cle);
        }
    }

    // Construit la liste filtree d'une categorie
    // Retour : [{ role, sections: [{ type, titre, entrees: [{ item, verrouille, cle }] }] }]
    filtrer(cat) {
        const q = norm(this.filtres.recherche.trim());
        const resultat = [];

        cat.roles.forEach(role => {
            if (this.roleMasque(cat.id, role)) return;

            const roleCorrespond = q !== "" && norm(role.nom).includes(q);
            const sections = [];

            role.sections.forEach(section => {
                if (!this.filtres.types[section.type]) return;

                const entrees = [];
                section.items.forEach(item => {
                    if (q !== "" && !roleCorrespond && !norm(item.nom).includes(q) && !norm(item.classe || "").includes(q)) return;

                    const verrouille = this.estVerrouille(item);
                    if (verrouille && this.filtres.masquerVerrouille) return;

                    entrees.push({
                        item: item,
                        verrouille: verrouille,
                        cle: [cat.id, role.nom, section.type, item.nom].join("|")
                    });
                });

                if (entrees.length > 0) {
                    sections.push({ type: section.type, titre: section.titre, entrees: entrees });
                }
            });

            if (sections.length > 0) {
                resultat.push({ role: role, sections: sections });
            }
        });

        return resultat;
    }

    // Index general : une ligne par equipement, filtree par la recherche,
    // les types de dotation actifs et les formations cochees.
    indexGlobal() {
        const q = norm(this.filtres.recherche.trim());
        const lignes = [];

        ARMURERIE.forEach(item => {
            const acces = [];

            item.dotations.forEach(dot => {
                if (!this.filtres.types[dot.type]) return;

                const roles = dot.roles.filter(rid => {
                    const infos = ROLES.get(rid);
                    return infos && this.filtres.formations[infos.formationId];
                });
                if (roles.length === 0) return;

                acces.push({ type: dot.type, aut: dot.aut || null, roles: roles });
            });

            if (acces.length === 0) return;

            if (q !== "") {
                const cible = [item.nom, item.classe].concat(
                    acces.reduce((liste, a) => liste.concat(a.roles.map(rid => {
                        const infos = ROLES.get(rid);
                        return infos.court + " " + infos.nom + " " + infos.formation;
                    })), [])
                ).join(" ");
                if (!norm(cible).includes(q)) return;
            }

            lignes.push({ nom: item.nom, classe: item.classe, acces: acces });
        });

        return lignes;
    }

    basculerFiche(cle, actif, infos) {
        if (actif) {
            this.fiche.set(cle, infos);
        } else {
            this.fiche.delete(cle);
        }
    }

    viderFiche() {
        this.fiche.clear();
    }

    // Genere le texte de la fiche, pret a coller sur Discord
    ficheTexte() {
        if (this.fiche.size === 0) return "";

        // Regroupement categorie > role > type
        const arbre = new Map();
        this.fiche.forEach(infos => {
            if (!arbre.has(infos.categorie)) arbre.set(infos.categorie, new Map());
            const roles = arbre.get(infos.categorie);
            if (!roles.has(infos.role)) roles.set(infos.role, new Map());
            const types = roles.get(infos.role);
            if (!types.has(infos.type)) types.set(infos.type, []);
            types.get(infos.type).push(infos);
        });

        const lignes = [];
        lignes.push("**FICHE DE DOTATION**");
        lignes.push("> Autorité disponible : " + AUTORITES_LABEL[this.filtres.autorite]);
        lignes.push("");

        arbre.forEach((roles, categorie) => {
            lignes.push("**__" + categorie + "__**");
            roles.forEach((types, role) => {
                lignes.push("**" + role + "**");
                ORDRE_TYPES.forEach(t => {
                    if (!types.has(t)) return;
                    lignes.push("__" + TYPES[t].label + " :__");
                    types.get(t).forEach(infos => {
                        let ligne = "> - " + infos.nom;
                        if (infos.aut) ligne += " (Autorisation -> Min. " + AUTORITES_LABEL[infos.aut] + ")";
                        lignes.push(ligne);
                    });
                });
                lignes.push("");
            });
        });

        return lignes.join("\n").trim();
    }
}

// ==========================================================================
// VUE (Affichage)
// ==========================================================================
class AppView {
    constructor() {
        this.appRoot = document.getElementById("app-root");
    }

    render(viewName, model) {
        this.appRoot.innerHTML = "";

        if (viewName === "home") {
            this.renderHome();
            return;
        }

        if (viewName === "index") {
            this.renderIndex(model);
            return;
        }

        const cat = model.getCategorie(viewName);
        if (cat) {
            this.renderDotation(model, cat);
        }
    }

    // ---------------------------------------------------------- Accueil
    renderHome() {
        const legende = ORDRE_TYPES.map(t => `
            <li>
                <span class="tag tag--${t}">${TYPES[t].court}</span>
                <strong>${TYPES[t].label}</strong> : ${TYPES[t].desc}
            </li>
        `).join("");

        this.appRoot.innerHTML = `
            <h2>&gt; REGISTRE DES DOTATIONS DU CHAPITRE</h2>
            <p>&gt; [BASE DE DONNÉES] : SYNCHRONISÉE.</p>
            <p>&gt; [PIÈCES RÉPERTORIÉES] : ${ARMURERIE.length}.</p>
            <p>&gt; [AUTORITÉ DE RÉDACTION] : FORGES DES RETRIBUTORS.</p>
            <br>

            <h3>&gt; UTILISATION DU TERMINAL</h3>
            <p>Choisis une Compagnie ou un corps de spécialistes dans le menu. Chaque page liste les rôles de la formation et leur dotation réglementaire.</p>
            <ul class="liste-simple">
                <li>Les cases de la colonne de gauche filtrent l'affichage par type de dotation et par rôle.</li>
                <li>Le sélecteur d'autorité grise les entrées qui dépassent l'autorisation dont tu disposes.</li>
                <li>Coche une entrée dans la liste pour la verser à la fiche de dotation, copiable en un clic.</li>
                <li>L'index général liste chaque pièce une seule fois, avec les rôles qui peuvent la percevoir.</li>
            </ul>
            <br>

            <h3>&gt; LÉGENDE DES DOTATIONS</h3>
            <ul class="legende">${legende}</ul>
            <br>

            <h3>&gt; ÉCHELLE DES AUTORISATIONS</h3>
            <p>Sergent &lt; Lieutenant &lt; Capitaine. L'autorisation se donne selon les faits d'armes et l'importance du Frère au sein de sa formation.</p>
            <br>

            <p class="center">
            AVE DEUS MECHANICUS, NOSTRI DOMINUS ET DEUS.<br>
            CE QUI A ÉTÉ FORGÉ SERA PRÉSERVÉ.<br>
            CE QUI A ÉTÉ CONFIÉ SERA RENDU.
            </p>
        `;
    }

    // ------------------------------------------------- Page d'une categorie
    renderDotation(model, cat) {
        this.appRoot.innerHTML = `
            <div class="dot-layout">
                <aside class="dot-filters">${this.htmlFiltres(model, cat)}</aside>
                <section class="dot-content">
                    <h2>&gt; ${esc(cat.titre)}</h2>
                    <p class="dot-intro">${esc(cat.intro)}</p>
                    ${cat.note ? `<p class="dot-note">&gt; ${esc(cat.note)}</p>` : ""}
                    <div id="dot-results">${this.htmlResultats(model, cat)}</div>
                </section>
            </div>
        `;
    }

    htmlCasesTypes(model) {
        return ORDRE_TYPES.map(t => `
            <label class="chk">
                <input type="checkbox" data-filtre-type="${t}" ${model.filtres.types[t] ? "checked" : ""}>
                <span class="box"></span>
                <span class="tag tag--${t}">${TYPES[t].court}</span> ${TYPES[t].label}
            </label>
        `).join("");
    }

    htmlFiltres(model, cat) {
        const roles = cat.roles.map(role => `
            <label class="chk">
                <input type="checkbox" data-filtre-role="${esc(role.nom)}" ${model.roleMasque(cat.id, role) ? "" : "checked"}>
                <span class="box"></span> ${esc(role.nom)}
            </label>
        `).join("");

        const autorites = Object.keys(AUTORITES).map(a => `
            <option value="${a}" ${model.filtres.autorite === a ? "selected" : ""}>${AUTORITES_LABEL[a]}</option>
        `).join("");

        return `
            <div class="filtre-groupe">
                <h3>&gt; RECHERCHE</h3>
                <input type="text" id="filtre-recherche" class="champ" autocomplete="off"
                       placeholder="Équipement, classe ou rôle" value="${esc(model.filtres.recherche)}">
            </div>

            <div class="filtre-groupe">
                <h3>&gt; TYPE DE DOTATION</h3>
                ${this.htmlCasesTypes(model)}
            </div>

            <div class="filtre-groupe">
                <h3>&gt; AUTORITÉ DISPONIBLE</h3>
                <select id="filtre-autorite" class="champ">${autorites}</select>
                <label class="chk">
                    <input type="checkbox" id="filtre-verrouille" ${model.filtres.masquerVerrouille ? "checked" : ""}>
                    <span class="box"></span> Masquer les entrées hors portée
                </label>
            </div>

            <div class="filtre-groupe">
                <h3>&gt; RÔLES</h3>
                ${roles}
                <div class="filtre-actions">
                    <button id="btn-roles-tous" class="btn-mini">Tout</button>
                    <button id="btn-roles-aucun" class="btn-mini">Aucun</button>
                </div>
            </div>

            <div class="filtre-groupe fiche-panneau">
                <h3>&gt; FICHE DE DOTATION [<span id="fiche-compteur">${model.fiche.size}</span>]</h3>
                <div id="fiche-liste">${this.htmlFiche(model)}</div>
                <div class="filtre-actions">
                    <button id="btn-fiche-copier" class="btn-mini">Copier</button>
                    <button id="btn-fiche-vider" class="btn-mini">Vider</button>
                </div>
                <p id="fiche-statut" class="fiche-statut"></p>
            </div>
        `;
    }

    htmlFiche(model) {
        if (model.fiche.size === 0) {
            return `<p class="vide">Aucune entrée retenue. Coche un équipement dans la liste pour composer ta fiche.</p>`;
        }
        const lignes = [];
        model.fiche.forEach(infos => {
            lignes.push(`<li><span class="tag tag--${infos.type}">${TYPES[infos.type].court}</span> ${esc(infos.nom)}</li>`);
        });
        return `<ul class="fiche-items">${lignes.join("")}</ul>`;
    }

    htmlResultats(model, cat) {
        const donnees = model.filtrer(cat);

        if (donnees.length === 0) {
            return `<p class="vide">&gt; AUCUNE ENTRÉE NE CORRESPOND AUX FILTRES ACTIFS.</p>`;
        }

        return donnees.map(bloc => {
            const role = bloc.role;
            const total = bloc.sections.reduce((n, s) => n + s.entrees.length, 0);

            const sections = bloc.sections.map(section => {
                const items = section.entrees.map(entree => {
                    const item = entree.item;
                    const coche = model.fiche.has(entree.cle) ? "checked" : "";
                    const badge = item.aut
                        ? `<span class="auth${entree.verrouille ? " auth--verrou" : ""}">AUT. PAR ${AUTORITES_LABEL[item.aut].toUpperCase()}</span>`
                        : "";
                    const note = item.note ? `<span class="item-note">${esc(item.note)}</span>` : "";

                    return `
                        <li class="item${entree.verrouille ? " item--verrou" : ""}">
                            <label class="chk">
                                <input type="checkbox" data-cle="${esc(entree.cle)}"
                                       data-nom="${esc(item.nom)}" data-type="${section.type}"
                                       data-role="${esc(role.nom)}" data-cat="${esc(cat.nav)}"
                                       data-aut="${item.aut || ""}" ${coche}>
                                <span class="box"></span>
                                <span class="item-nom">${esc(item.nom)}</span>
                            </label>
                            ${badge}
                            ${note}
                        </li>
                    `;
                }).join("");

                return `
                    <div class="section-bloc">
                        <h4>
                            <span class="tag tag--${section.type}">${TYPES[section.type].court}</span>
                            ${esc(section.titre || TYPES[section.type].label)}
                            <span class="compteur">${section.entrees.length}</span>
                        </h4>
                        <ul class="items">${items}</ul>
                    </div>
                `;
            }).join("");

            return `
                <article class="role-bloc${role.commun ? " role-bloc--commun" : ""}">
                    <h3>&gt; ${esc(role.nom)} <span class="compteur">${total} entrées</span></h3>
                    ${role.limite ? `<p class="dot-note">&gt; ${esc(role.limite)}</p>` : ""}
                    ${sections}
                </article>
            `;
        }).join("");
    }

    // ------------------------------------------------------ Index general
    renderIndex(model) {
        const formations = FORMATIONS.map(f => `
            <label class="chk">
                <input type="checkbox" data-filtre-formation="${f.id}" ${model.filtres.formations[f.id] ? "checked" : ""}>
                <span class="box"></span> ${esc(f.nav)}
            </label>
        `).join("");

        this.appRoot.innerHTML = `
            <h2>&gt; INDEX GÉNÉRAL DE L'ARMURERIE</h2>
            <p class="dot-intro">Une ligne par pièce d'équipement. Les tags indiquent quel rôle peut la percevoir et à quel titre.</p>
            <div class="filtre-barre">
                <div class="colonne colonne--large">
                    <h3>&gt; RECHERCHE</h3>
                    <input type="text" id="index-recherche" class="champ" autocomplete="off"
                           placeholder="Ex : melta, bouclier, module, incursor" value="${esc(model.filtres.recherche)}">
                </div>
                <div class="colonne">
                    <h3>&gt; TYPE DE DOTATION</h3>
                    ${this.htmlCasesTypes(model)}
                </div>
                <div class="colonne">
                    <h3>&gt; FORMATION</h3>
                    ${formations}
                </div>
            </div>
            <div id="index-resultats">${this.htmlIndex(model)}</div>
        `;
    }

    htmlIndex(model) {
        const lignes = model.indexGlobal();

        if (lignes.length === 0) {
            return `<p class="vide">&gt; AUCUNE OCCURRENCE DANS LE REGISTRE.</p>`;
        }

        const corps = lignes.map(ligne => {
            const acces = ligne.acces.map(a => {
                const chips = a.roles.map(rid => {
                    const infos = ROLES.get(rid);
                    return `<span class="chip" title="${esc(infos.formation)} - ${esc(infos.nom)}"><span class="chip-form">${esc(infos.code)}</span>${esc(infos.court)}</span>`;
                }).join("");
                const aut = a.aut ? `<span class="auth">AUT. PAR ${AUTORITES_LABEL[a.aut].toUpperCase()}</span>` : "";
                return `
                    <div class="acces-bloc">
                        <span class="tag tag--${a.type}">${TYPES[a.type].court}</span>
                        <span class="acces-roles">${chips}</span>
                        ${aut}
                    </div>
                `;
            }).join("");

            return `
                <tr>
                    <td>${esc(ligne.nom)}</td>
                    <td>${esc(ligne.classe || "-")}</td>
                    <td>${acces}</td>
                </tr>
            `;
        }).join("");

        return `
            <p class="compteur-global">&gt; ${lignes.length} pièces sur ${ARMURERIE.length} répertoriées.</p>
            <table class="index-table">
                <thead>
                    <tr>
                        <th>Équipement</th>
                        <th>Classe</th>
                        <th>Accès</th>
                    </tr>
                </thead>
                <tbody>${corps}</tbody>
            </table>
        `;
    }
}

// ==========================================================================
// CONTROLEUR
// ==========================================================================
class AppController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.updateView("home");

        document.querySelectorAll("nav button").forEach(button => {
            button.addEventListener("click", (e) => {
                const cible = e.currentTarget.getAttribute("data-target");
                this.model.filtres.recherche = "";
                this.updateView(cible);
                document.querySelectorAll("nav button").forEach(btn => btn.classList.remove("active"));
                e.currentTarget.classList.add("active");
            });
        });

        // Delegation d'evenements : la vue est reconstruite, les ecouteurs restent
        const root = document.getElementById("app-root");
        root.addEventListener("change", (e) => this.onChange(e));
        root.addEventListener("input", (e) => this.onInput(e));
        root.addEventListener("click", (e) => this.onClick(e));
    }

    updateView(viewName) {
        this.model.currentView = viewName;
        this.view.render(viewName, this.model);
    }

    catCourante() {
        return this.model.getCategorie(this.model.currentView);
    }

    // Ne redessine que la zone de resultats de la page courante, pour que le
    // focus et l'etat des filtres soient conserves.
    rafraichir() {
        const cat = this.catCourante();
        const zoneDot = document.getElementById("dot-results");
        if (cat && zoneDot) {
            zoneDot.innerHTML = this.view.htmlResultats(this.model, cat);
            return;
        }
        const zoneIndex = document.getElementById("index-resultats");
        if (zoneIndex) zoneIndex.innerHTML = this.view.htmlIndex(this.model);
    }

    rafraichirFiche() {
        const liste = document.getElementById("fiche-liste");
        const compteur = document.getElementById("fiche-compteur");
        if (liste) liste.innerHTML = this.view.htmlFiche(this.model);
        if (compteur) compteur.textContent = this.model.fiche.size;
    }

    onChange(e) {
        const el = e.target;

        // Filtres par type de dotation
        if (el.dataset.filtreType) {
            this.model.filtres.types[el.dataset.filtreType] = el.checked;
            this.rafraichir();
            return;
        }

        // Filtres par formation (index general)
        if (el.dataset.filtreFormation) {
            this.model.filtres.formations[el.dataset.filtreFormation] = el.checked;
            this.rafraichir();
            return;
        }

        // Filtres par role
        if (el.dataset.filtreRole) {
            const cat = this.catCourante();
            if (cat) this.model.basculerRole(cat.id, el.dataset.filtreRole, el.checked);
            this.rafraichir();
            return;
        }

        // Autorite disponible
        if (el.id === "filtre-autorite") {
            this.model.filtres.autorite = el.value;
            this.rafraichir();
            return;
        }

        // Masquage des entrees hors portee
        if (el.id === "filtre-verrouille") {
            this.model.filtres.masquerVerrouille = el.checked;
            this.rafraichir();
            return;
        }

        // Selection d'une entree pour la fiche
        if (el.dataset.cle) {
            this.model.basculerFiche(el.dataset.cle, el.checked, {
                nom: el.dataset.nom,
                type: el.dataset.type,
                role: el.dataset.role,
                categorie: el.dataset.cat,
                aut: el.dataset.aut || null
            });
            this.rafraichirFiche();
        }
    }

    onInput(e) {
        if (e.target.id === "filtre-recherche" || e.target.id === "index-recherche") {
            this.model.filtres.recherche = e.target.value;
            this.rafraichir();
        }
    }

    onClick(e) {
        const el = e.target;
        const cat = this.catCourante();

        if (el.id === "btn-roles-tous" && cat) {
            cat.roles.forEach(r => this.model.basculerRole(cat.id, r.nom, true));
            this.view.render(cat.id, this.model);
            return;
        }

        if (el.id === "btn-roles-aucun" && cat) {
            cat.roles.forEach(r => this.model.basculerRole(cat.id, r.nom, false));
            this.view.render(cat.id, this.model);
            return;
        }

        if (el.id === "btn-fiche-vider") {
            this.model.viderFiche();
            this.rafraichirFiche();
            this.rafraichir();
            this.statutFiche("Fiche vidée.");
            return;
        }

        if (el.id === "btn-fiche-copier") {
            this.copierFiche();
        }
    }

    statutFiche(message) {
        const zone = document.getElementById("fiche-statut");
        if (!zone) return;
        zone.textContent = message;
        clearTimeout(this._statutTimer);
        this._statutTimer = setTimeout(() => { zone.textContent = ""; }, 3000);
    }

    copierFiche() {
        const texte = this.model.ficheTexte();
        if (!texte) {
            this.statutFiche("Rien à copier : la fiche est vide.");
            return;
        }

        // Presse-papier moderne, avec repli pour les ouvertures en file://
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(texte)
                .then(() => this.statutFiche("Fiche copiée dans le presse-papier."))
                .catch(() => this.copierRepli(texte));
        } else {
            this.copierRepli(texte);
        }
    }

    copierRepli(texte) {
        const zone = document.createElement("textarea");
        zone.value = texte;
        zone.setAttribute("readonly", "");
        zone.style.position = "fixed";
        zone.style.opacity = "0";
        document.body.appendChild(zone);
        zone.select();
        let ok = false;
        try {
            ok = document.execCommand("copy");
        } catch (err) {
            ok = false;
        }
        document.body.removeChild(zone);
        this.statutFiche(ok ? "Fiche copiée dans le presse-papier." : "Copie refusée par le navigateur.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const model = new DataModel();
    const view = new AppView();
    new AppController(model, view);
    const homeBtn = document.querySelector('nav button[data-target="home"]');
    if (homeBtn) homeBtn.classList.add("active");
});
