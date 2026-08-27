// ==========================================================================
// TERMINAL DES DOTATIONS - RETRIBUTORS
// Architecture reprise du terminal des Forges (Modele / Vue / Controleur)
// ==========================================================================

// --- Echelle des autorites d'autorisation ---
const AUTORITES = {
    aucune: 0,
    sergent: 1,
    lieutenant: 2,
    capitaine: 3
};

const AUTORITES_LABEL = {
    aucune: "Aucune",
    sergent: "Sergent",
    lieutenant: "Lieutenant",
    capitaine: "Capitaine"
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
// DONNEES : REFERENTIEL DES DOTATIONS
// Chaque objet : { nom, aut (optionnel), note (optionnel) }
// ==========================================================================
const DOTATIONS = [
    // ---------------------------------------------------------------- 4e
    {
        id: "c4",
        nav: "4e Compagnie",
        titre: "DOTATIONS - 4E COMPAGNIE",
        intro: "Impulsors, Assauts, Devastators et Vétérans de la Compagnie.",
        note: "Équipement optionnel disponible en permanence sous autorisation d'un Officier de la Compagnie. Les autorisations de Vétéran sont accordées selon les faits d'armes et l'importance au sein de la Compagnie.",
        roles: [
            {
                nom: "IMPULSOR",
                sections: [
                    {
                        type: "initial",
                        items: [
                            { nom: "Épée tronçonneuse avec bouclier" },
                            { nom: "Fusil Bolter" },
                            { nom: "Pistolet Bolter Mk2 avec bouclier" }
                        ]
                    },
                    {
                        type: "optionnel",
                        items: [
                            { nom: "Carabine Bolter (tous les types)", aut: "sergent" },
                            { nom: "Fusil Bolter Lourd", aut: "sergent" },
                            { nom: "Modules (tous les types)", aut: "sergent" }
                        ]
                    },
                    {
                        type: "pret",
                        items: [
                            { nom: "Fusil Melta Mk2" }
                        ]
                    }
                ]
            },
            {
                nom: "ASSAUT",
                sections: [
                    {
                        type: "initial",
                        items: [
                            { nom: "Épée tronçonneuse" },
                            { nom: "Carabine Bolter" },
                            { nom: "Pistolet Bolter Mk2" },
                            { nom: "Jump Pack" }
                        ]
                    },
                    {
                        type: "optionnel",
                        items: [
                            { nom: "Carabine Bolter (tous les types)", aut: "sergent" },
                            { nom: "Fusil Bolter Lourd", aut: "sergent" },
                            { nom: "Fusil Bolter", aut: "sergent" },
                            { nom: "Pistolet Bolter Lourd Mk2", aut: "sergent" },
                            { nom: "Modules (tous les types)", aut: "sergent" }
                        ]
                    },
                    {
                        type: "pret",
                        items: [
                            { nom: "Fusil Melta Mk2" }
                        ]
                    }
                ]
            },
            {
                nom: "DEVASTATOR",
                sections: [
                    {
                        type: "initial",
                        items: [
                            { nom: "Épée tronçonneuse" },
                            { nom: "Bolter Lourd Mk2" },
                            { nom: "Pistolet Bolter Mk2" },
                            { nom: "Module de Céramite Lourde" }
                        ]
                    },
                    {
                        type: "optionnel",
                        items: [
                            { nom: "Pistolet Bolter Lourd Mk2", aut: "sergent" },
                            { nom: "Modules (tous les types)", aut: "sergent" }
                        ]
                    },
                    {
                        type: "pret",
                        items: [
                            { nom: "Multi Melta Lourd Mk2" },
                            { nom: "Incinérateur Plasma Lourd Mk2" },
                            { nom: "Canon Laser Mk2" }
                        ]
                    }
                ]
            },
            {
                nom: "TOUTES SPÉCIALISATIONS // À PARTIR DE VÉTÉRAN",
                commun: true,
                sections: [
                    {
                        type: "veteran",
                        titre: "Sur demande, dotation permanente",
                        items: [
                            { nom: "Épée Énergétique Mk1", aut: "sergent" },
                            { nom: "Hache Énergétique Mk1", aut: "sergent" },
                            { nom: "Thunder Hammer", aut: "capitaine" },
                            { nom: "Fusil Melta Mk2", aut: "sergent" },
                            { nom: "Storm Bolter", aut: "lieutenant" }
                        ]
                    },
                    {
                        type: "honorifique",
                        titre: "Récompense, dotation permanente",
                        items: [
                            { nom: "Pistolet Plasma Mk2", aut: "lieutenant" },
                            { nom: "Pistolet Inferno", aut: "lieutenant" },
                            { nom: "Pistolet Neo-Volkite", aut: "lieutenant" },
                            { nom: "Toutes les armes bouclier", aut: "lieutenant" }
                        ]
                    }
                ]
            }
        ]
    },

    // --------------------------------------------------------------- 10e
    {
        id: "c10",
        nav: "10e Compagnie",
        titre: "DOTATIONS - 10E COMPAGNIE",
        intro: "Néophytes, Frères sans spécialisation, Longstrikes, Incursors et Vétérans.",
        note: "Équipement optionnel laissé à l'appréciation du Frère, sauf mention d'autorisation. Les autorisations de Vétéran sont accordées selon les faits d'armes et l'importance au sein de la Compagnie.",
        roles: [
            {
                nom: "NÉOPHYTE",
                sections: [
                    {
                        type: "initial",
                        items: [
                            { nom: "Couteau Astartes" },
                            { nom: "Bolter Néophyte" }
                        ]
                    },
                    {
                        type: "optionnel",
                        items: [
                            { nom: "LongLas", aut: "sergent" },
                            { nom: "Neo-Shotgun", aut: "sergent" }
                        ]
                    },
                    {
                        type: "pret",
                        items: [
                            { nom: "Plasma Néophyte" },
                            { nom: "Melta Néophyte" }
                        ]
                    }
                ]
            },
            {
                nom: "FRÈRE DE BATAILLE (SANS SPÉCIALISATION)",
                sections: [
                    {
                        type: "initial",
                        items: [
                            { nom: "Épée tronçonneuse" },
                            { nom: "Fusil Bolter" },
                            { nom: "Pistolet Bolter Mk2" }
                        ]
                    },
                    {
                        type: "optionnel",
                        items: [
                            { nom: "Couteau Astartes" },
                            { nom: "Carabine Bolter" },
                            { nom: "Fusil Bolter Lourd" },
                            { nom: "Pistolet Bolter Lourd" }
                        ]
                    },
                    {
                        type: "pret",
                        items: [
                            { nom: "Fusil Melta Mk2" }
                        ]
                    }
                ]
            },
            {
                nom: "LONGSTRIKE (TIREUR D'ÉLITE)",
                sections: [
                    {
                        type: "initial",
                        items: [
                            { nom: "Épée tronçonneuse" },
                            { nom: "Fusil Bolter" },
                            { nom: "Pistolet Bolter Mk2" },
                            { nom: "Module de Camouflage" },
                            { nom: "Grappin Astartes" }
                        ]
                    },
                    {
                        type: "optionnel",
                        items: [
                            { nom: "Couteau Astartes" },
                            { nom: "Hache Tronçonneuse" },
                            { nom: "Carabine Bolter Occulus" },
                            { nom: "Carabine Bolter Infiltrator" },
                            { nom: "Carabine Bolter Marksman" },
                            { nom: "Sniper Bolter" },
                            { nom: "Lasniper" },
                            { nom: "Pistolet Bolter Lourd" },
                            { nom: "Module Céramite Légère" },
                            { nom: "Module Scanner Tactique" },
                            { nom: "Module de Vision Nocturne" }
                        ]
                    },
                    {
                        type: "veteran",
                        items: [
                            { nom: "Hache Énergétique", aut: "sergent" },
                            { nom: "Épée Énergétique", aut: "sergent" },
                            { nom: "Thunder Hammer", aut: "capitaine" },
                            { nom: "Pistolet Plasma Mk2", aut: "lieutenant" },
                            { nom: "Pistolet Neo-Volkite", aut: "lieutenant" },
                            { nom: "Pistolet Inferno", aut: "lieutenant" },
                            { nom: "Module Céramite Renforcée", aut: "sergent" },
                            { nom: "Épée Tronçonneuse Bouclier", aut: "sergent" },
                            { nom: "Hache Tronçonneuse Bouclier", aut: "sergent" },
                            { nom: "Épée Énergétique Bouclier", aut: "lieutenant" },
                            { nom: "Hache Énergétique Bouclier", aut: "lieutenant" }
                        ]
                    }
                ]
            },
            {
                nom: "INCURSOR (AVANT-GARDE)",
                sections: [
                    {
                        type: "initial",
                        items: [
                            { nom: "Épée tronçonneuse" },
                            { nom: "Fusil Bolter" },
                            { nom: "Pistolet Bolter Mk2" },
                            { nom: "Module de Camouflage" },
                            { nom: "Grappin Astartes" }
                        ]
                    },
                    {
                        type: "optionnel",
                        items: [
                            { nom: "Couteau Astartes" },
                            { nom: "Hache Tronçonneuse" },
                            { nom: "Fusil Bolter Lourd" },
                            { nom: "Carabine Bolter" },
                            { nom: "Carabine Bolter Occulus" },
                            { nom: "Carabine Bolter Infiltrator" },
                            { nom: "Carabine Bolter Marksman" },
                            { nom: "Pistolet Bolter Lourd" },
                            { nom: "Module Céramite Lourde", aut: "sergent" },
                            { nom: "Module Céramite Légère" },
                            { nom: "Module Scanner Tactique" },
                            { nom: "Module de Vision Nocturne" }
                        ]
                    },
                    {
                        type: "veteran",
                        items: [
                            { nom: "Hache Énergétique", aut: "sergent" },
                            { nom: "Épée Énergétique", aut: "sergent" },
                            { nom: "Thunder Hammer", aut: "capitaine" },
                            { nom: "Storm Bolter", aut: "lieutenant" },
                            { nom: "Pistolet Plasma Mk2", aut: "lieutenant" },
                            { nom: "Pistolet Neo-Volkite", aut: "lieutenant" },
                            { nom: "Pistolet Inferno", aut: "lieutenant" },
                            { nom: "Épée Énergétique Bouclier", aut: "lieutenant" },
                            { nom: "Hache Énergétique Bouclier", aut: "lieutenant" },
                            { nom: "Épée Tronçonneuse Bouclier", aut: "sergent" },
                            { nom: "Hache Tronçonneuse Bouclier", aut: "sergent" }
                        ]
                    },
                    {
                        type: "pret",
                        items: [
                            { nom: "Fusil Melta Mk2" }
                        ]
                    }
                ]
            }
        ]
    },

    // -------------------------------------------------------- Apothicaires
    {
        id: "apothicaires",
        nav: "Apothicaires",
        titre: "DOTATIONS - APOTHICARION",
        intro: "Apothicaires des différentes Compagnies.",
        note: "Note des Forges : tout équipement non présent ou non conforme à cette liste dans l'inventaire d'un Frère Apothicaire lui sera confisqué. L'équipement honorifique est décerné par le Maître Apothicaire.",
        roles: [
            {
                nom: "APOTHICAIRE NOVICE",
                sections: [
                    {
                        type: "initial",
                        items: [
                            { nom: "Fusil Bolter Mk2" },
                            { nom: "Pistolet Bolter Mk2" },
                            { nom: "Épée Tronçonneuse Mk1" },
                            { nom: "Module de Céramite Légère" }
                        ]
                    },
                    {
                        type: "optionnel",
                        items: [
                            { nom: "Bolter Modèle Godwin" },
                            { nom: "Fusil Bolter Mk2" },
                            { nom: "Fusil Bolter Lourd Mk2" },
                            { nom: "Carabine Bolter (et variantes)" },
                            { nom: "Hache Tronçonneuse Mk1" }
                        ]
                    },
                    {
                        type: "pret",
                        items: [
                            { nom: "Matériel de spécialité", note: "Selon la mission et le commandant de mission (jump-pack, grappin, etc.). Armes de spécialité exclues." }
                        ]
                    }
                ]
            },
            {
                nom: "APOTHICAIRE CONFIRMÉ",
                sections: [
                    {
                        type: "initial",
                        items: [
                            { nom: "Fusil Bolter Mk2" },
                            { nom: "Pistolet Bolter Lourd Mk2" },
                            { nom: "Épée Énergétique Mk1" },
                            { nom: "Module de Céramite Légère" }
                        ]
                    },
                    {
                        type: "optionnel",
                        items: [
                            { nom: "Bolter Modèle Godwin" },
                            { nom: "Fusil Bolter Mk2" },
                            { nom: "Fusil Bolter Lourd Mk2" },
                            { nom: "Carabine Bolter (et variantes)" },
                            { nom: "Pistolet Bolter Mk2" }
                        ]
                    },
                    {
                        type: "honorifique",
                        items: [
                            { nom: "Pistolet Plasma Mk2" },
                            { nom: "Pistolet Inferno Mk2" },
                            { nom: "Pistolet Lance-Flamme Mk1" },
                            { nom: "Pistolet Neo-Volkite" }
                        ]
                    },
                    {
                        type: "pret",
                        items: [
                            { nom: "Matériel de spécialité", note: "Selon la mission et le commandant de mission (jump-pack, grappin, etc.). Armes de spécialité exclues." }
                        ]
                    }
                ]
            },
            {
                nom: "APOTHICAIRE VÉTÉRAN",
                limite: "Effectif maximal : 2",
                sections: [
                    {
                        type: "initial",
                        items: [
                            { nom: "Fusil Bolter Mk2" },
                            { nom: "Pistolet Plasma Mk2" },
                            { nom: "Épée Énergétique Mk1 avec Bouclier Relique" },
                            { nom: "Module de Céramite Légère" }
                        ]
                    },
                    {
                        type: "optionnel",
                        items: [
                            { nom: "Bolter Modèle Godwin" },
                            { nom: "Fusil Bolter Mk2" },
                            { nom: "Fusil Bolter Lourd Mk2" },
                            { nom: "Carabine Bolter (et variantes)" },
                            { nom: "Pistolet Bolter Mk2" },
                            { nom: "Pistolet Bolter Lourd Mk2" },
                            { nom: "Pistolet Inferno Mk2" }
                        ]
                    },
                    {
                        type: "honorifique",
                        items: [
                            { nom: "Pistolet Lance-Flamme Mk1" },
                            { nom: "Pistolet Neo-Volkite" }
                        ]
                    },
                    {
                        type: "pret",
                        items: [
                            { nom: "Matériel de spécialité", note: "Selon la mission et le commandant de mission (jump-pack, grappin, etc.). Armes de spécialité exclues." }
                        ]
                    }
                ]
            }
        ]
    },

    // --------------------------------------------------------- Chapelains
    {
        id: "chapelains",
        nav: "Chapelains",
        titre: "DOTATIONS - RECLUSIAM",
        intro: "Judicars et Chapelains des différentes Compagnies.",
        note: "Note des Forges : tout équipement non présent ou non conforme à cette liste dans l'inventaire d'un Frère Chapelain lui sera confisqué. L'équipement honorifique est décerné par le Réclusiarque.",
        roles: [
            {
                nom: "JUDICAR",
                sections: [
                    {
                        type: "initial",
                        items: [
                            { nom: "Lance-Flamme Mk1" },
                            { nom: "Pistolet Bolter Mk2" },
                            { nom: "Épée Énergétique Mk1" }
                        ]
                    },
                    {
                        type: "optionnel",
                        items: [
                            { nom: "Bolter Modèle Godwin" },
                            { nom: "Fusil Bolter Mk2" },
                            { nom: "Fusil Bolter Lourd Mk2" },
                            { nom: "Carabine Bolter (et variantes)" },
                            { nom: "Pistolet Bolter Lourd Mk2" }
                        ]
                    }
                ]
            },
            {
                nom: "CHAPELAIN",
                sections: [
                    {
                        type: "initial",
                        items: [
                            { nom: "Lance-Flamme Mk1" },
                            { nom: "Pistolet Bolter Mk2" },
                            { nom: "Crozius" }
                        ]
                    },
                    {
                        type: "optionnel",
                        items: [
                            { nom: "Bolter Modèle Godwin" },
                            { nom: "Fusil Bolter Mk2" },
                            { nom: "Fusil Bolter Lourd Mk2" },
                            { nom: "Carabine Bolter (et variantes)" },
                            { nom: "Pistolet Bolter Lourd Mk2" },
                            { nom: "Pistolet Plasma Mk2" },
                            { nom: "Pistolet Inferno Mk2" },
                            { nom: "Pistolet Lance-Flamme Mk1" }
                        ]
                    },
                    {
                        type: "honorifique",
                        items: [
                            { nom: "Pistolet Neo-Volkite" }
                        ]
                    },
                    {
                        type: "pret",
                        items: [
                            { nom: "Matériel de spécialité", note: "Selon la mission et le commandant de mission (jump-pack, grappin, etc.). Armes de spécialité exclues." }
                        ]
                    }
                ]
            }
        ]
    },

    // -------------------------------------------------------- Archivistes
    {
        id: "archivistes",
        nav: "Archivistes",
        titre: "DOTATIONS - LIBRARIUS",
        intro: "Archivistes des différentes Compagnies.",
        note: "Note des Forges : tout équipement non présent ou non conforme à cette liste dans l'inventaire d'un Frère Archiviste lui sera confisqué. L'équipement honorifique est décerné par le Maître Archiviste.",
        roles: [
            {
                nom: "INITIÉ",
                sections: [
                    {
                        type: "initial",
                        items: [
                            { nom: "Pistolet Bolter Mk2" },
                            { nom: "Épée Tronçonneuse Mk1" }
                        ]
                    },
                    {
                        type: "optionnel",
                        items: [
                            { nom: "Hache Tronçonneuse Mk1" },
                            { nom: "Fusil Bolter Mk2" }
                        ]
                    }
                ]
            },
            {
                nom: "ARCHIVISTE CONFIRMÉ",
                sections: [
                    {
                        type: "initial",
                        items: [
                            { nom: "Pistolet Bolter Lourd Mk2" },
                            { nom: "Épée Énergétique Mk1" },
                            { nom: "Module de Céramite Légère" }
                        ]
                    },
                    {
                        type: "optionnel",
                        items: [
                            { nom: "Hache Énergétique Mk1" },
                            { nom: "Fusil Bolter Mk2" }
                        ]
                    },
                    {
                        type: "honorifique",
                        items: [
                            { nom: "Pistolet Lance-Flamme Mk1" },
                            { nom: "Pistolet Plasma Mk2" },
                            { nom: "Pistolet Inferno Mk2" }
                        ]
                    }
                ]
            }
        ]
    }
];

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
            autorite: "capitaine",      // autorite maximale dont dispose le Frere
            masquerVerrouille: false,   // masquer plutot que griser les entrees hors portee
            recherche: ""
        };

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
                    if (q !== "" && !roleCorrespond && !norm(item.nom).includes(q)) return;

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

    // Index global : un objet par occurrence d'equipement dans le referentiel
    indexGlobal() {
        const lignes = [];
        this.categories.forEach(cat => {
            cat.roles.forEach(role => {
                role.sections.forEach(section => {
                    section.items.forEach(item => {
                        lignes.push({
                            nom: item.nom,
                            categorie: cat.nav,
                            role: role.nom,
                            type: section.type,
                            aut: item.aut || null
                        });
                    });
                });
            });
        });
        return lignes.sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
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
            <p>&gt; [DERNIÈRE COLLATION] : CYCLE STANDARD EN COURS.</p>
            <p>&gt; [AUTORITÉ DE RÉDACTION] : FORGES DES RETRIBUTORS.</p>
            <br>

            <h3>&gt; UTILISATION DU TERMINAL</h3>
            <p>Choisis une Compagnie ou un corps de spécialistes dans le menu. Chaque page liste les rôles de la formation et leur dotation réglementaire.</p>
            <ul class="liste-simple">
                <li>Les cases de la colonne de gauche filtrent l'affichage par type de dotation et par rôle.</li>
                <li>Le sélecteur d'autorité grise les entrées qui dépassent l'autorisation dont tu disposes.</li>
                <li>Coche une entrée dans la liste pour la verser à la fiche de dotation, copiable en un clic.</li>
                <li>L'index général permet de rechercher un équipement et de voir qui a le droit de le porter.</li>
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

    htmlFiltres(model, cat) {
        const cases = ORDRE_TYPES.map(t => `
            <label class="chk">
                <input type="checkbox" data-filtre-type="${t}" ${model.filtres.types[t] ? "checked" : ""}>
                <span class="box"></span>
                <span class="tag tag--${t}">${TYPES[t].court}</span> ${TYPES[t].label}
            </label>
        `).join("");

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
                       placeholder="Nom d'équipement ou de rôle" value="${esc(model.filtres.recherche)}">
            </div>

            <div class="filtre-groupe">
                <h3>&gt; TYPE DE DOTATION</h3>
                ${cases}
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
                        ? `<span class="auth${entree.verrouille ? " auth--verrou" : ""}">AUT. ${AUTORITES_LABEL[item.aut].toUpperCase()}</span>`
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
        this.appRoot.innerHTML = `
            <h2>&gt; INDEX GÉNÉRAL DE L'ARMURERIE</h2>
            <p class="dot-intro">Recherche un équipement pour savoir quelle formation peut le percevoir, à quel titre et sous quelle autorisation.</p>
            <div class="index-barre">
                <input type="text" id="index-recherche" class="champ" autocomplete="off"
                       placeholder="Ex : melta, bouclier, céramite" value="${esc(model.filtres.recherche)}">
            </div>
            <div id="index-resultats">${this.htmlIndex(model)}</div>
        `;
    }

    htmlIndex(model) {
        const q = norm(model.filtres.recherche.trim());
        let lignes = model.indexGlobal();

        if (q !== "") {
            lignes = lignes.filter(l => norm(l.nom).includes(q) || norm(l.role).includes(q) || norm(l.categorie).includes(q));
        }

        if (lignes.length === 0) {
            return `<p class="vide">&gt; AUCUNE OCCURRENCE DANS LE REGISTRE.</p>`;
        }

        const corps = lignes.map(l => `
            <tr>
                <td>${esc(l.nom)}</td>
                <td>${esc(l.categorie)}</td>
                <td>${esc(l.role)}</td>
                <td><span class="tag tag--${l.type}">${TYPES[l.type].court}</span></td>
                <td>${l.aut ? esc(AUTORITES_LABEL[l.aut]) : "-"}</td>
            </tr>
        `).join("");

        return `
            <p class="compteur-global">&gt; ${lignes.length} occurrences répertoriées.</p>
            <table class="index-table">
                <thead>
                    <tr>
                        <th>Équipement</th>
                        <th>Formation</th>
                        <th>Rôle</th>
                        <th>Type</th>
                        <th>Autorisation</th>
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

    // Ne redessine que la zone de resultats (le focus du champ de recherche est conserve)
    rafraichirResultats() {
        const cat = this.catCourante();
        const zone = document.getElementById("dot-results");
        if (cat && zone) zone.innerHTML = this.view.htmlResultats(this.model, cat);
    }

    rafraichirIndex() {
        const zone = document.getElementById("index-resultats");
        if (zone) zone.innerHTML = this.view.htmlIndex(this.model);
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
            this.rafraichirResultats();
            return;
        }

        // Filtres par role
        if (el.dataset.filtreRole) {
            const cat = this.catCourante();
            if (cat) this.model.basculerRole(cat.id, el.dataset.filtreRole, el.checked);
            this.rafraichirResultats();
            return;
        }

        // Autorite disponible
        if (el.id === "filtre-autorite") {
            this.model.filtres.autorite = el.value;
            this.rafraichirResultats();
            return;
        }

        // Masquage des entrees hors portee
        if (el.id === "filtre-verrouille") {
            this.model.filtres.masquerVerrouille = el.checked;
            this.rafraichirResultats();
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
        if (e.target.id === "filtre-recherche") {
            this.model.filtres.recherche = e.target.value;
            this.rafraichirResultats();
        }
        if (e.target.id === "index-recherche") {
            this.model.filtres.recherche = e.target.value;
            this.rafraichirIndex();
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
            this.rafraichirResultats();
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
