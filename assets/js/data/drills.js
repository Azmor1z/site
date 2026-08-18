/* ============================================================================
   EXERCICES INTERACTIFS — 4 formats par section
   type 'match' : associer deux colonnes           { pairs: [[gauche, droite], ...] }
   type 'sort'  : trier des étiquettes en bacs     { bins: { "Nom du bac": [items] } }
   type 'order' : remettre dans le bon ordre       { steps: [étape1, étape2, ...] }
   type 'fill'  : texte à trous                    { text: "... {{réponse}} ...", pool: [leurres] }
   ========================================================================== */
(function (App) {
  'use strict';

  App.DRILLS = {

  1: [
    { id: 'd1a', type: 'match', title: "Format de l'examen SY0-701", desc: "Associez chaque paramètre à sa valeur exacte.",
      pairs: [["Durée de l'examen", "90 minutes"], ["Nombre maximal de questions", "90 questions"], ["Score de passage", "750 sur 900"], ["Domaine le plus lourd", "4.0 Security Operations (28 %)"], ["Domaine le plus léger", "1.0 General Security Concepts (12 %)"], ["Expérience recommandée", "2 ans en administration IT sécurité"]] },
    { id: 'd1b', type: 'sort', title: "Pondération des domaines", desc: "Classez chaque domaine selon son poids à l'examen.",
      bins: { "Plus de 20 %": ["4.0 Security Operations (28 %)", "2.0 Threats & Vulnerabilities (22 %)"], "Entre 15 et 20 %": ["5.0 Program Management (20 %)", "3.0 Security Architecture (18 %)"], "Moins de 15 %": ["1.0 General Security Concepts (12 %)"] } },
    { id: 'd1c', type: 'order', title: "Stratégie optimale le jour J", desc: "Remettez la stratégie d'examen dans l'ordre chronologique.",
      steps: ["Réaliser le brain dump sur le brouillon", "Marquer les PBQ du début et les passer", "Traiter tous les QCM à environ 1 minute chacun", "Revenir sur les PBQ marquées", "Relire les questions marquées comme incertaines", "Vérifier qu'aucune question n'est laissée vide"] }
  ],

  2: [
    { id: 'd2a', type: 'sort', title: "Catégories de contrôles de sécurité", desc: "Classez chaque contrôle dans sa CATÉGORIE (qui met en œuvre ?).",
      bins: { "Technical": ["Pare-feu", "Chiffrement", "Antivirus", "Liste de contrôle d'accès"], "Managerial": ["Politique de sécurité", "Analyse de risque", "Plan de reprise d'activité"], "Operational": ["Formation des utilisateurs", "Garde de sécurité", "Gestion des changements"], "Physical": ["Clôture", "Serrure de porte", "Caméra de surveillance", "Bollard"] } },
    { id: 'd2b', type: 'sort', title: "Types de contrôles de sécurité", desc: "Classez chaque contrôle selon son TYPE (quel effet recherché ?).",
      bins: { "Preventive": ["Serrure", "Chiffrement", "Pare-feu"], "Deterrent": ["Panneau d'avertissement", "Éclairage", "Chien de garde"], "Detective": ["Caméra de surveillance", "IDS", "Analyse des journaux"], "Corrective": ["Sauvegarde et restauration", "Plan de reprise", "Correctif de sécurité"] } },
    { id: 'd2c', type: 'match', title: "Zero Trust : rôle de chaque composant", desc: "Associez chaque composant du Zero Trust à sa fonction exacte.",
      pairs: [["Policy Engine", "DÉCIDE d'accorder ou de refuser l'accès"], ["Policy Administrator", "COMMUNIQUE la décision prise"], ["Policy Enforcement Point", "APPLIQUE concrètement la décision"], ["Adaptive Identity", "Ajuste la confiance selon le contexte"], ["Threat Scope Reduction", "Limite le périmètre exposé"], ["Implicit Trust Zone", "Zone du Data Plane après validation"]] },
    { id: 'd2d', type: 'fill', title: "Triade CIA et principes fondamentaux", desc: "Complétez avec le terme technique exact.",
      text: "La {{confidentialité}} s'obtient par le chiffrement, l'{{intégrité}} par le hachage, et la {{disponibilité}} par la redondance. La {{non-répudiation}} empêche un acteur de nier une action et repose sur la signature numérique. Dans l'AAA, l'{{accounting}} correspond à la journalisation des actions réalisées.",
      pool: ["tokenisation", "obfuscation", "authorization", "attestation"] }
  ],

  3: [
    { id: 'd3a', type: 'match', title: "Acteurs de menace et profils", desc: "Associez chaque acteur à sa caractéristique déterminante.",
      pairs: [["Nation-state", "Ressources quasi illimitées, espionnage et guerre"], ["Unskilled attacker", "Outils tout faits, motivation chaos"], ["Hacktivist", "Convictions philosophiques ou politiques"], ["Insider threat", "Dispose déjà d'un accès légitime"], ["Organized crime", "Très bien financé, motivé par le gain financier"], ["Shadow IT", "Usage non approuvé par la DSI, sans malveillance"]] },
    { id: 'd3b', type: 'sort', title: "Niveau de ressources des acteurs", desc: "Classez les acteurs selon leurs moyens et leur sophistication.",
      bins: { "Ressources très élevées": ["Nation-state actor", "Organized crime"], "Ressources moyennes": ["Insider threat", "Hacktivist"], "Ressources faibles": ["Unskilled attacker / script kiddie"] } },
    { id: 'd3c', type: 'sort', title: "Vecteurs de menace par famille", desc: "Rangez chaque vecteur dans la bonne famille.",
      bins: { "Message-based": ["Email", "SMS", "Messagerie instantanée"], "Réseau et exposition": ["Ports ouverts", "Réseaux non sécurisés", "Bluetooth"], "Logiciel et système": ["Logiciel vulnérable", "Système non supporté", "Identifiants par défaut"], "Tiers": ["MSP compromis", "Fournisseur", "Supply chain"] } },
    { id: 'd3d', type: 'fill', title: "Surface d'attaque et vecteurs", desc: "Complétez le raisonnement.",
      text: "L'{{attack surface}} désigne l'ensemble des points d'entrée possibles, tandis que le {{threat vector}} est le chemin réellement emprunté par l'attaquant. Un acteur de type {{nation-state}} est associé aux campagnes {{APT}}, caractérisées par un accès maintenu longtemps sans détection. Le {{shadow IT}} n'est pas malveillant mais crée des vulnérabilités invisibles.",
      pool: ["honeypot", "botnet", "hacktivist", "insider threat"] }
  ],

  4: [
    { id: 'd4a', type: 'match', title: "Capteurs et sécurité physique", desc: "Associez chaque dispositif à son principe de fonctionnement.",
      pairs: [["Capteur infrarouge", "Détecte la chaleur corporelle"], ["Capteur de pression", "Détecte le poids"], ["Capteur micro-ondes", "Détecte le mouvement par ondes radio"], ["Capteur ultrasonique", "Détecte le mouvement par ondes sonores"], ["Bollard", "Arrête les véhicules, laisse passer les piétons"], ["Access control vestibule", "Sas empêchant le tailgating"]] },
    { id: 'd4b', type: 'match', title: "Technologies de tromperie", desc: "Associez chaque leurre à sa définition précise.",
      pairs: [["Honeypot", "Un système leurre isolé"], ["Honeynet", "Un réseau entier de systèmes leurres"], ["Honeyfile", "Un fichier appât déclenchant une alerte"], ["Honeytoken", "Une donnée factice traçable"]] },
    { id: 'd4c', type: 'sort', title: "Type de contrôle en sécurité physique", desc: "Classez chaque dispositif selon son type de contrôle dominant.",
      bins: { "Preventive": ["Serrure de porte", "Access control vestibule", "Bollard"], "Deterrent": ["Éclairage extérieur", "Panneau d'avertissement", "Clôture visible"], "Detective": ["Caméra CCTV", "Capteur de mouvement", "Journal d'accès badge"] } },
    { id: 'd4d', type: 'fill', title: "Vocabulaire de l'accès physique", desc: "Complétez avec le terme exact attendu à l'examen.",
      text: "Suivre quelqu'un dans un bâtiment à son insu s'appelle le {{tailgating}}, alors qu'entrer avec son consentement est du {{piggybacking}}. La contre-mesure de référence est l'{{access control vestibule}}. Copier un badge sans contact à distance se nomme le {{RFID cloning}}. Le seul contrôle capable d'exercer un jugement discrétionnaire est le {{garde de sécurité}}.",
      pool: ["shoulder surfing", "dumpster diving", "honeypot", "bollard"] }
  ],

  5: [
    { id: 'd5a', type: 'match', title: "Ingénierie sociale : support d'attaque", desc: "Associez chaque attaque au support qu'elle utilise.",
      pairs: [["Phishing", "Email"], ["Vishing", "Appel vocal"], ["Smishing", "SMS"], ["Whaling", "Email ciblant un dirigeant"], ["Watering hole", "Site tiers légitime compromis"], ["Typosquatting", "Domaine avec faute de frappe"]] },
    { id: 'd5b', type: 'match', title: "Leviers psychologiques", desc: "Associez chaque message au levier exploité.",
      pairs: [["« Votre compte sera fermé dans 2 heures »", "Urgency"], ["« Je suis le directeur informatique »", "Authority"], ["« Tous vos collègues l'ont déjà fait »", "Social proof"], ["« Offre limitée aux 10 premiers »", "Scarcity"], ["« Vous risquez une amende »", "Fear"]] },
    { id: 'd5c', type: 'sort', title: "Intention derrière l'information trompeuse", desc: "Classez selon l'intention de nuire.",
      bins: { "Sans intention de nuire": ["Misinformation", "Partage de bonne foi d'une rumeur"], "Avec intention délibérée": ["Disinformation", "Influence campaign", "Brand impersonation"] } },
    { id: 'd5d', type: 'fill', title: "Attaques par messagerie", desc: "Complétez avec le terme exact.",
      text: "La compromission d'une boîte mail interne légitime pour émettre des ordres frauduleux se nomme {{BEC}}. Inventer un scénario crédible pour justifier une demande est du {{pretexting}}. Compromettre un site tiers que la cible visite habituellement est une attaque de type {{watering hole}}. La meilleure contre-mesure globale reste la {{formation}} des utilisateurs.",
      pool: ["phishing", "smishing", "tailgating", "chiffrement"] }
  ],

  6: [
    { id: 'd6a', type: 'match', title: "Malwares et signatures", desc: "Associez chaque malware à son comportement caractéristique.",
      pairs: [["Ver (worm)", "Se propage seul sur le réseau, sature la bande passante"], ["Virus", "Nécessite un fichier hôte et une action utilisateur"], ["Cheval de Troie", "Se fait passer pour un logiciel légitime"], ["Ransomware", "Chiffre les données et exige une rançon"], ["Rootkit", "Accès privilégié et dissimulation en mode noyau"], ["Bombe logique", "Se déclenche sur une condition précise"], ["Keylogger", "Enregistre les frappes clavier"], ["Bloatware", "Préinstallé et inutile, non malveillant"]] },
    { id: 'd6b', type: 'sort', title: "Malware : propagation autonome ou non ?", desc: "Classez selon le mode de propagation.",
      bins: { "Se propage seul": ["Ver (worm)", "Botnet auto-propagé"], "Nécessite une action utilisateur": ["Virus", "Cheval de Troie", "Ransomware par pièce jointe"], "Ne se propage pas": ["Bombe logique", "Keylogger matériel", "Bloatware"] } },
    { id: 'd6c', type: 'match', title: "Symptôme observé et malware suspecté", desc: "Associez chaque symptôme au malware le plus probable.",
      pairs: [["CPU à 100 % sans activité utilisateur", "Cryptojacking"], ["Fichiers renommés avec extension inconnue", "Ransomware"], ["Saturation réseau entre machines internes", "Ver (worm)"], ["Aucune trace visible malgré une compromission avérée", "Rootkit"], ["Connexions régulières vers une IP externe inconnue", "Botnet et serveur C2"]] },
    { id: 'd6d', type: 'fill', title: "Défenses contre les malwares", desc: "Complétez avec la contre-mesure attendue.",
      text: "La meilleure défense contre un ransomware repose sur des {{sauvegardes}} hors ligne et testées. Un malware {{polymorphe}} modifie son code pour échapper à la détection par signature. Un malware {{fileless}} s'exécute uniquement en mémoire en détournant PowerShell. Le réseau de machines zombies piloté par un serveur de commande se nomme un {{botnet}}.",
      pool: ["pare-feu", "rootkit", "chiffrement", "honeypot"] }
  ],

  7: [
    { id: 'd7a', type: 'match', title: "États de la donnée et protection", desc: "Associez chaque état à sa protection adaptée.",
      pairs: [["Data at rest", "Chiffrement de disque ou de fichier"], ["Data in transit", "TLS, IPSec, VPN"], ["Data in use", "Chiffrement mémoire et secure enclave"]] },
    { id: 'd7b', type: 'match', title: "Rôles autour de la donnée", desc: "Associez chaque rôle à sa responsabilité.",
      pairs: [["Data owner", "Responsable métier, décide de la classification"], ["Data controller", "Décide des finalités du traitement"], ["Data processor", "Traite pour le compte du controller"], ["Data custodian / steward", "Met en œuvre techniquement au quotidien"], ["Data subject", "Personne concernée par les données"]] },
    { id: 'd7c', type: 'sort', title: "Techniques de protection : réversibles ou non ?", desc: "Classez selon la possibilité de retrouver la donnée d'origine.",
      bins: { "Réversible": ["Chiffrement (avec la clé)", "Tokenisation (via le coffre)"], "Irréversible": ["Hachage", "Data masking", "Destruction physique"] } },
    { id: 'd7d', type: 'fill', title: "Protection et souveraineté des données", desc: "Complétez avec le terme exact.",
      text: "Le principe de {{data sovereignty}} veut que les données soient soumises aux lois du pays où elles sont physiquement stockées. Remplacer une donnée par un jeton dont la vraie valeur est dans un coffre séparé est de la {{tokenisation}}. Dissimuler l'existence même d'un message dans une image relève de la {{stéganographie}}. La solution qui détecte et bloque l'exfiltration se nomme {{DLP}}.",
      pool: ["hachage", "salting", "SIEM", "geofencing"] }
  ],

  8: [
    { id: 'd8a', type: 'sort', title: "Algorithmes symétriques et asymétriques", desc: "Classez chaque algorithme dans la bonne famille.",
      bins: { "Symétrique": ["AES", "3DES", "Blowfish", "Twofish", "RC4"], "Asymétrique": ["RSA", "ECC", "Diffie-Hellman", "ElGamal", "DSA"], "Hachage": ["MD5", "SHA-256", "SHA-512", "HMAC"] } },
    { id: 'd8b', type: 'match', title: "Quelle clé pour quel usage ?", desc: "Identifiez la clé utilisée ET à qui elle appartient. C'est cette précision qui départage les réponses à l'examen.",
      pairs: [["Chiffrer un message pour le rendre confidentiel", "Clé PUBLIQUE du destinataire"], ["Déchiffrer le message que l'on reçoit", "Clé PRIVÉE du destinataire"], ["Apposer une signature numérique", "Clé PRIVÉE de l'émetteur"], ["Vérifier une signature reçue", "Clé PUBLIQUE de l'émetteur"]] },
    { id: 'd8c', type: 'match', title: "Outils et composants cryptographiques", desc: "Associez chaque élément à sa définition.",
      pairs: [["TPM", "Puce soudée à la carte mère d'une machine"], ["HSM", "Appareil dédié gérant les clés à grande échelle"], ["CSR", "Demande de certificat contenant la clé publique"], ["CRL", "Liste de révocation téléchargée périodiquement"], ["OCSP", "Vérification de révocation en temps réel"], ["Secure enclave", "Zone protégée du processeur"], ["Key escrow", "Dépôt d'une copie des clés chez un tiers"]] },
    { id: 'd8d', type: 'fill', title: "Renforcement du hachage et PKI", desc: "Complétez avec le terme exact.",
      text: "Ajouter une valeur aléatoire avant de hacher un mot de passe s'appelle le {{salting}} et neutralise les rainbow tables. Rendre le calcul volontairement lent se nomme le {{key stretching}}, mis en œuvre par PBKDF2 ou bcrypt. Deux entrées produisant la même empreinte constituent une {{collision}}. La garantie qu'une clé de session compromise ne révèle pas les sessions passées s'appelle la {{perfect forward secrecy}}.",
      pool: ["tokenisation", "obfuscation", "downgrade", "attestation"] }
  ],

  9: [
    { id: 'd9a', type: 'match', title: "Formules et métriques du risque", desc: "Associez chaque métrique à sa définition ou formule.",
      pairs: [["SLE", "AV × EF, perte pour un seul incident"], ["ALE", "SLE × ARO, perte annuelle attendue"], ["ARO", "Fréquence annuelle d'occurrence"], ["RTO", "Délai maximal de remise en service"], ["RPO", "Volume maximal de données perdues acceptable"], ["MTTR", "Temps moyen de réparation"], ["MTBF", "Temps moyen entre deux pannes"]] },
    { id: 'd9b', type: 'match', title: "Stratégies de traitement du risque", desc: "Associez chaque décision à sa stratégie.",
      pairs: [["Souscrire une cyber-assurance", "Transfer"], ["Déployer un pare-feu et former les équipes", "Mitigate"], ["Abandonner le projet jugé trop risqué", "Avoid"], ["Assumer le risque avec une exception documentée", "Accept"]] },
    { id: 'd9c', type: 'order', title: "Processus de gestion du risque", desc: "Remettez les étapes dans l'ordre logique.",
      steps: ["Identification du risque", "Évaluation et analyse du risque", "Inscription au risk register", "Choix de la stratégie de traitement", "Mise en œuvre des contrôles", "Suivi et reporting continu"] },
    { id: 'd9d', type: 'fill', title: "Vocabulaire du risque", desc: "Complétez avec le terme exact.",
      text: "L'analyse {{qualitative}} utilise des échelles subjectives et une matrice probabilité × impact, tandis que l'analyse {{quantitative}} produit des valeurs monétaires. L'appétit au risque d'une organisation prudente est dit {{conservative}}. L'analyse qui identifie les fonctions critiques et fixe les RTO et RPO est la {{BIA}}. Le risque subsistant après application des contrôles est le risque {{résiduel}}.",
      pool: ["inhérent", "expansionary", "gap analysis", "actuarielle"] }
  ],

  10: [
    { id: 'd10a', type: 'match', title: "Types d'accords contractuels", desc: "Associez chaque acronyme à sa définition exacte.",
      pairs: [["SLA", "Engagement mesurable de niveau de service avec pénalités"], ["MOU", "Déclaration d'intention non contraignante"], ["MOA", "Accord formel détaillant rôles et responsabilités"], ["MSA", "Contrat-cadre pour tous les travaux futurs"], ["SOW", "Livrables, calendrier et périmètre d'une mission"], ["NDA", "Accord de confidentialité"], ["BPA", "Relation entre partenaires et partage des profits"]] },
    { id: 'd10b', type: 'sort', title: "Juridiquement contraignant ou non ?", desc: "Classez les accords selon leur force juridique.",
      bins: { "Contraignant": ["SLA", "MSA", "NDA", "BPA", "SOW"], "Généralement non contraignant": ["MOU"] } },
    { id: 'd10c', type: 'order', title: "Cycle de gestion d'un fournisseur", desc: "Remettez les étapes dans l'ordre chronologique.",
      steps: ["Due diligence et évaluation initiale", "Négociation du contrat et de la clause d'audit", "Signature de l'accord et du NDA", "Intégration et ouverture des accès", "Monitoring continu et questionnaires réguliers", "Fin de contrat et révocation des accès"] },
    { id: 'd10d', type: 'fill', title: "Gestion des risques tiers", desc: "Complétez avec le terme exact.",
      text: "La clause permettant d'auditer un fournisseur se nomme {{right-to-audit}} et doit être négociée avant la signature. L'enquête approfondie menée avant de contractualiser est la {{due diligence}}. Compromettre un fournisseur pour atteindre ses clients est une attaque de la {{supply chain}}. Le document définissant périmètre et méthodes autorisées lors d'une intervention se nomme {{rules of engagement}}.",
      pool: ["due care", "attestation", "playbook", "gap analysis"] }
  ],

  11: [
    { id: 'd11a', type: 'order', title: "Hiérarchie documentaire de gouvernance", desc: "Classez du plus général au plus opérationnel.",
      steps: ["Policy — le quoi et le pourquoi", "Standard — le niveau exigé", "Procedure — le comment, étape par étape", "Guideline — recommandation facultative"] },
    { id: 'd11b', type: 'sort', title: "Obligatoire ou facultatif ?", desc: "Classez les documents de gouvernance selon leur caractère contraignant.",
      bins: { "Obligatoire": ["Policy", "Standard", "Procedure"], "Facultatif": ["Guideline"] } },
    { id: 'd11c', type: 'match', title: "Gouvernance et conformité", desc: "Associez chaque notion à sa définition.",
      pairs: [["AUP", "Charte d'usage acceptable des ressources"], ["Due diligence", "Enquêter et vérifier avant d'agir"], ["Due care", "Agir raisonnablement et de façon continue"], ["Attestation", "Confirmation formelle et signée"], ["Right to be forgotten", "Droit à l'effacement des données personnelles"], ["Data subject", "Personne concernée par les données"]] },
    { id: 'd11d', type: 'sort', title: "Gouvernance centralisée ou décentralisée", desc: "Classez chaque caractéristique.",
      bins: { "Centralisée": ["Cohérence des standards", "Contrôle fort", "Décisions plus lentes"], "Décentralisée": ["Agilité et réactivité", "Proximité du terrain", "Risque d'incohérences"] } }
  ],

  12: [
    { id: 'd12a', type: 'order', title: "Processus de gestion des changements", desc: "Remettez les étapes dans le bon ordre.",
      steps: ["Soumission de la demande de changement", "Analyse d'impact et des dépendances", "Approbation par le CAB", "Test en préproduction", "Planification de la fenêtre de maintenance", "Mise en œuvre du changement", "Mise à jour de la documentation et des diagrammes"] },
    { id: 'd12b', type: 'match', title: "Effacement et destruction des supports", desc: "Associez chaque méthode à son usage correct.",
      pairs: [["Degaussing", "Efficace sur disque magnétique, inutile sur SSD"], ["Cryptographic erase", "Destruction de la clé, idéal pour SSD chiffré"], ["Destruction physique", "Broyage ou incinération du support"], ["Certificate of destruction", "Preuve documentaire de la destruction"], ["Sanitization", "Efface les données en conservant le média"]] },
    { id: 'd12c', type: 'order', title: "Cycle de vie d'un actif", desc: "Remettez les phases dans l'ordre.",
      steps: ["Acquisition et achat", "Assignation d'un propriétaire et classification", "Suivi d'inventaire et enumeration", "Mise hors service (decommissioning)", "Sanitization ou destruction certifiée"] },
    { id: 'd12d', type: 'fill', title: "Gestion des changements", desc: "Complétez avec le terme exact.",
      text: "Le plan permettant de revenir à l'état antérieur si un changement échoue se nomme {{backout plan}}. Le créneau planifié durant lequel l'interruption est acceptée est la {{maintenance window}}. Le comité qui évalue et approuve les changements est le {{CAB}}. Une liste qui interdit tout sauf ce qui est explicitement autorisé est une {{allow list}}.",
      pool: ["deny list", "SOP", "playbook", "risk register"] }
  ],

  13: [
    { id: 'd13a', type: 'match', title: "Types de tests d'intrusion", desc: "Associez chaque approche à son niveau d'information.",
      pairs: [["Known environment", "Le testeur a toutes les informations"], ["Partially known environment", "Informations partielles, bon compromis"], ["Unknown environment", "Aucune information, attaquant externe réaliste"], ["Reconnaissance passive", "Collecte sans interaction, indétectable"], ["Reconnaissance active", "Interaction directe, détectable"]] },
    { id: 'd13b', type: 'sort', title: "Audit interne ou externe ?", desc: "Classez chaque élément selon le type d'audit.",
      bins: { "Audit interne": ["Compliance team", "Audit committee", "Self-assessments"], "Audit externe": ["Regulatory", "Examinations", "Independent third-party audit"] } },
    { id: 'd13c', type: 'match', title: "Équipes de test de sécurité", desc: "Associez chaque équipe à sa mission.",
      pairs: [["Red team", "Attaque et simule l'adversaire"], ["Blue team", "Défend, détecte et répond"], ["Purple team", "Fait collaborer attaque et défense"], ["White team", "Arbitre et supervise l'exercice"]] },
    { id: 'd13d', type: 'fill', title: "Audits et attestation", desc: "Complétez avec le terme exact.",
      text: "La déclaration formelle et signée affirmant l'exactitude des conclusions d'un audit est une {{attestation}}. Le document définissant périmètre, horaires et méthodes autorisées avant un pentest se nomme {{rules of engagement}}. Collecter des informations via WHOIS et les réseaux sociaux relève de la reconnaissance {{passive}}. Un audit vérifie la {{conformité}} alors qu'un pentest exploite réellement les failles.",
      pool: ["active", "due care", "gap analysis", "disponibilité"] }
  ],

  14: [
    { id: 'd14a', type: 'match', title: "Sites de secours et délais de bascule", desc: "Associez chaque type de site à son délai et son coût.",
      pairs: [["Hot site", "Bascule en minutes ou heures, le plus cher"], ["Warm site", "Bascule en heures ou jours, compromis"], ["Cold site", "Bascule en jours ou semaines, le moins cher"]] },
    { id: 'd14b', type: 'match', title: "Niveaux de RAID", desc: "Associez chaque niveau à sa caractéristique.",
      pairs: [["RAID 0", "Striping, aucune tolérance de panne"], ["RAID 1", "Miroir de deux disques"], ["RAID 5", "Striping avec parité, tolère 1 disque"], ["RAID 6", "Double parité, tolère 2 disques"], ["RAID 10", "Miroir et striping combinés"]] },
    { id: 'd14c', type: 'sort', title: "Types de sauvegarde et restauration", desc: "Classez selon le nombre de jeux nécessaires à la restauration.",
      bins: { "1 seul jeu": ["Full backup"], "2 jeux (full + dernier)": ["Differential backup"], "Full + tous les jeux": ["Incremental backup"] } },
    { id: 'd14d', type: 'order', title: "Tests de continuité du moins au plus intrusif", desc: "Classez du test le moins risqué au plus risqué pour la production.",
      steps: ["Tabletop exercise (discussion sur scénario)", "Simulation (mise en situation)", "Parallel processing (site de secours en parallèle)", "Failover (bascule réelle de la production)"] }
  ],

  15: [
    { id: 'd15a', type: 'sort', title: "Responsabilité partagée dans le cloud", desc: "Classez chaque responsabilité selon qui l'assume et dans quel modèle.",
      bins: { "Toujours au CLIENT, quel que soit le modèle": ["Ses données", "La gestion des identités et des accès", "La classification de ses informations"], "Au client en IaaS, au fournisseur en PaaS": ["Les correctifs du système d'exploitation", "La configuration du runtime applicatif"], "Toujours au FOURNISSEUR": ["La sécurité physique du data center", "La maintenance du matériel serveur", "L'hyperviseur de virtualisation"] } },
    { id: 'd15b', type: 'match', title: "Modèles d'architecture", desc: "Associez chaque concept à sa définition.",
      pairs: [["Virtualisation", "Plusieurs OS complets sur un hyperviseur"], ["Conteneurisation", "Partage du noyau de l'hôte, plus léger"], ["Serverless", "Le fournisseur gère toute l'infrastructure"], ["Microservices", "Services indépendants et faiblement couplés"], ["IaC", "Infrastructure décrite dans du code versionné"], ["SDN", "Sépare le control plane du data plane"], ["Air gap", "Isolation physique totale du réseau"]] },
    { id: 'd15c', type: 'sort', title: "Environnements industriels et embarqués", desc: "Classez chaque affirmation.",
      bins: { "Vrai pour ICS/SCADA": ["Priorité à la disponibilité et à la sûreté", "Souvent impossible à patcher", "Nécessite segmentation et compensating controls"], "Vrai pour RTOS": ["Contraintes temps réel déterministes", "Ressources très limitées"], "Vrai pour IoT": ["Identifiants par défaut fréquents", "Cible privilégiée des botnets"] } },
    { id: 'd15d', type: 'fill', title: "Virtualisation et cloud", desc: "Complétez avec le terme exact.",
      text: "S'échapper d'une machine virtuelle pour atteindre l'hyperviseur se nomme {{VM escape}}. Récupérer des données résiduelles dans de la mémoire réattribuée est du {{resource reuse}}. Un hyperviseur de type {{1}} s'exécute directement sur le matériel. Dans tous les modèles cloud, le client reste toujours responsable de ses {{données}} et de la gestion des identités.",
      pool: ["2", "conteneur", "serverless", "correctifs"] }
  ],

  16: [
    { id: 'd16a', type: 'match', title: "Ports et protocoles essentiels", desc: "Associez chaque protocole à son port.",
      pairs: [["SSH / SCP / SFTP", "22"], ["HTTPS", "443"], ["LDAP", "389"], ["LDAPS", "636"], ["RDP", "3389"], ["SMB", "445"], ["DNS", "53"], ["Kerberos", "88"]] },
    { id: 'd16b', type: 'sort', title: "Protocoles chiffrés ou en clair", desc: "Classez chaque protocole selon qu'il chiffre ou non.",
      bins: { "Chiffré (à privilégier)": ["SSH (22)", "HTTPS (443)", "LDAPS (636)", "IMAPS (993)", "SFTP (22)"], "En clair (à éviter)": ["Telnet (23)", "FTP (21)", "HTTP (80)", "LDAP (389)", "POP3 (110)"] } },
    { id: 'd16c', type: 'match', title: "Équipements de sécurité réseau", desc: "Associez chaque équipement à sa fonction.",
      pairs: [["IDS", "Détecte et alerte, passif en dérivation"], ["IPS", "Détecte et bloque, actif en ligne"], ["WAF", "Protège les applications web (SQLi, XSS)"], ["UTM", "Boîtier de sécurité tout-en-un"], ["Jump server", "Point de rebond durci pour l'administration"], ["Reverse proxy", "Protège les serveurs entrants"], ["Forward proxy", "Filtre les clients sortants"]] },
    { id: 'd16d', type: 'fill', title: "VPN, IPSec et contrôle d'accès réseau", desc: "Complétez avec le terme exact.",
      text: "Dans IPSec, le composant assurant le chiffrement est {{ESP}}, tandis que {{AH}} n'assure qu'intégrité et authentification. Un VPN en mode {{full tunnel}} fait passer tout le trafic par l'entreprise. Les trois acteurs du 802.1X sont le supplicant, l'{{authenticator}} et le serveur d'authentification. En cas de panne, un équipement configuré en {{fail-closed}} bloque tout le trafic.",
      pool: ["IKE", "split tunnel", "fail-open", "policy engine"] }
  ],

  17: [
    { id: 'd17a', type: 'match', title: "Modèles de contrôle d'accès", desc: "Associez chaque modèle à son principe.",
      pairs: [["MAC", "Le système impose selon des labels de classification"], ["DAC", "Le propriétaire du fichier décide des accès"], ["RBAC", "Droits attribués via des rôles métier"], ["Rule-based", "Règles conditionnelles appliquées par le système"], ["ABAC", "Décision selon des attributs combinés"]] },
    { id: 'd17b', type: 'sort', title: "Facteurs d'authentification", desc: "Classez chaque élément dans son facteur.",
      bins: { "Something you know": ["Mot de passe", "Code PIN", "Question secrète"], "Something you have": ["Carte à puce", "Token matériel", "Téléphone avec application TOTP"], "Something you are": ["Empreinte digitale", "Reconnaissance faciale", "Scan de l'iris"], "Somewhere you are": ["Géolocalisation GPS", "Adresse IP de l'entreprise"] } },
    { id: 'd17c', type: 'match', title: "Protocoles d'identité fédérée", desc: "Associez chaque protocole à son rôle exact.",
      pairs: [["OAuth", "AUTORISATION : déléguer un accès"], ["SAML", "AUTHENTIFICATION fédérée par assertions XML"], ["OpenID Connect", "Couche d'authentification au-dessus d'OAuth 2.0"], ["LDAP", "Accès à un annuaire d'identités"], ["Kerberos", "Authentification par tickets avec un KDC"], ["RADIUS", "Serveur AAA centralisé"]] },
    { id: 'd17d', type: 'fill', title: "IAM, PAM et biométrie", desc: "Complétez avec le terme exact.",
      text: "Accorder des privilèges temporairement et à la demande se nomme {{just-in-time}} permissions. L'accumulation de droits au fil des mutations est le {{privilege creep}}. En biométrie, le taux qui laisse entrer un imposteur est le {{FAR}}, plus grave pour la sécurité que le FRR. Découper une tâche sensible entre plusieurs personnes relève de la {{separation of duties}}.",
      pool: ["FRR", "least privilege", "password vaulting", "identity proofing"] }
  ],

  18: [
    { id: 'd18a', type: 'match', title: "Vulnérabilités applicatives", desc: "Associez chaque vulnérabilité à sa description.",
      pairs: [["Buffer overflow", "Écriture au-delà de la mémoire allouée"], ["Race condition TOC/TOU", "L'état change entre vérification et utilisation"], ["SQL injection", "Injection de SQL via une entrée non filtrée"], ["XSS", "Script exécuté par le navigateur de la victime"], ["CSRF", "Action forcée à l'insu d'un utilisateur authentifié"], ["Directory traversal", "Séquences ../ pour sortir du répertoire web"], ["Memory injection", "Code injecté dans un processus en cours"]] },
    { id: 'd18b', type: 'match', title: "Vulnérabilités et contre-mesures", desc: "Associez chaque faille à sa parade principale.",
      pairs: [["SQL injection", "Requêtes paramétrées (prepared statements)"], ["Buffer overflow", "Validation des entrées, ASLR et DEP"], ["XSS", "Encodage des sorties et cookies HttpOnly"], ["CSRF", "Jetons anti-CSRF et cookies SameSite"], ["Malicious update", "Signature de code et vérification d'intégrité"]] },
    { id: 'd18c', type: 'sort', title: "Attaques Bluetooth et mobiles", desc: "Classez chaque terme selon son impact.",
      bins: { "Nuisance sans vol": ["Bluejacking"], "Vol de données": ["Bluesnarfing"], "Prise de contrôle": ["Bluebugging"], "Contournement des restrictions": ["Jailbreaking", "Rooting", "Side loading"] } },
    { id: 'd18d', type: 'fill', title: "Types de XSS et vulnérabilités", desc: "Complétez avec le terme exact.",
      text: "Un XSS {{stored}} est enregistré en base et servi à tous les visiteurs, alors qu'un XSS {{reflected}} est renvoyé immédiatement via un lien piégé. Une vulnérabilité inconnue de l'éditeur et sans correctif est un {{zero-day}}. Installer une application hors du magasin officiel est du {{side loading}}. La cause la plus fréquente de compromission cloud est la {{misconfiguration}}.",
      pool: ["DOM-based", "buffer overflow", "jailbreaking", "collision"] }
  ],

  19: [
    { id: 'd19a', type: 'match', title: "Indicateurs de compromission", desc: "Associez chaque indicateur à sa signification.",
      pairs: [["Impossible travel", "Connexions depuis des lieux géographiquement incompatibles"], ["Missing logs", "Effacement probable de traces par un attaquant"], ["Out-of-cycle logging", "Activité en dehors des plages horaires normales"], ["Concurrent session usage", "Même compte utilisé simultanément ailleurs"], ["Resource consumption", "Cryptominage, exfiltration ou déni de service"], ["Resource inaccessibility", "Ransomware ou déni de service"]] },
    { id: 'd19b', type: 'match', title: "Attaques sur mots de passe", desc: "Associez chaque attaque à sa méthode.",
      pairs: [["Password spraying", "Un mot de passe courant sur beaucoup de comptes"], ["Brute force", "Toutes les combinaisons sur un seul compte"], ["Dictionary attack", "Liste de mots probables"], ["Rainbow table", "Hachages précalculés, contrés par le salting"], ["Credential replay", "Rejeu d'identifiants capturés"]] },
    { id: 'd19c', type: 'sort', title: "Familles d'attaques", desc: "Classez chaque attaque dans sa famille.",
      bins: { "Attaques réseau": ["DDoS amplifié", "DNS poisoning", "On-path", "Deauthentication"], "Attaques applicatives": ["Injection", "Directory traversal", "Privilege escalation", "Forgery"], "Attaques cryptographiques": ["Downgrade", "Collision", "Birthday attack"] } },
    { id: 'd19d', type: 'fill', title: "Attaques réseau et sans fil", desc: "Complétez avec le terme exact.",
      text: "Un faux point d'accès imitant le SSID légitime est un {{evil twin}}, à distinguer du {{rogue AP}} branché sans autorisation sur le réseau. Exfiltrer des données dissimulées dans des requêtes DNS est du {{DNS tunneling}}. Obtenir des droits administrateur depuis un compte utilisateur est une escalade {{verticale}}. Corrompre le cache d'un résolveur DNS se nomme le {{DNS poisoning}}.",
      pool: ["horizontale", "on-path", "replay", "spraying"] }
  ],

  20: [
    { id: 'd20a', type: 'order', title: "Cycle de vie d'une secure baseline", desc: "Remettez les étapes dans le bon ordre.",
      steps: ["Establish — définir la configuration de référence", "Deploy — appliquer la baseline au parc", "Maintain — surveiller la dérive et actualiser"] },
    { id: 'd20b', type: 'order', title: "Processus de patch management", desc: "Remettez les étapes dans l'ordre correct.",
      steps: ["Identifier les correctifs disponibles", "Évaluer la criticité et la priorité", "Tester en environnement de préproduction", "Déployer progressivement en production", "Vérifier l'application effective du correctif"] },
    { id: 'd20c', type: 'sort', title: "Techniques et cibles de durcissement", desc: "Classez chaque élément.",
      bins: { "Technique de durcissement": ["Désactiver les services inutiles", "Changer les mots de passe par défaut", "Installer un HIPS", "Chiffrement du disque"], "Cible de durcissement": ["Workstations", "Switches et routers", "Serveurs", "IoT devices", "ICS/SCADA"] } },
    { id: 'd20d', type: 'fill', title: "Durcissement et mitigation", desc: "Complétez avec le terme exact.",
      text: "Une {{allow list}} n'autorise que les exécutables explicitement listés et bloque donc même les zero-days. Sous Linux, le contrôle d'accès obligatoire est mis en œuvre par {{SELinux}}, dont le mode {{permissive}} journalise sans bloquer. Le chiffrement intégral de disque protège une machine {{éteinte}} mais pas une session déverrouillée. Vérifier en continu la conformité et corriger les dérives se nomme le {{configuration enforcement}}.",
      pool: ["deny list", "GPO", "enforcing", "allumée"] }
  ],

  21: [
    { id: 'd21a', type: 'order', title: "Évolution de la sécurité Wi-Fi", desc: "Classez du moins sûr au plus sûr.",
      steps: ["WEP — cassé, à bannir", "WPA — TKIP/RC4, obsolète", "WPA2 — CCMP/AES", "WPA3 — SAE/GCMP"] },
    { id: 'd21b', type: 'match', title: "Sécurité de la messagerie", desc: "Associez chaque mécanisme à son rôle.",
      pairs: [["SPF", "Déclare les serveurs autorisés à envoyer"], ["DKIM", "Signe cryptographiquement le message"], ["DMARC", "Définit la politique en cas d'échec et le reporting"], ["Gateway", "Filtre les messages entrants et sortants"]] },
    { id: 'd21c', type: 'sort', title: "Modèles de déploiement mobile", desc: "Classez chaque caractéristique selon le modèle.",
      bins: { "BYOD": ["Appareil personnel du salarié", "Coût faible pour l'entreprise", "Contrôle limité et vie privée sensible"], "COPE": ["Appareil propriété de l'entreprise", "Usage personnel autorisé", "Contrôle fort de l'entreprise"], "CYOD": ["Choix dans une liste imposée", "Compromis contrôle et satisfaction"] } },
    { id: 'd21d', type: 'fill', title: "Sécurité applicative et endpoint", desc: "Complétez avec le terme exact.",
      text: "La contre-mesure numéro un contre toutes les injections est l'{{input validation}}. L'attribut de cookie qui empêche l'accès par JavaScript est {{HttpOnly}}. Exécuter du code inconnu dans un environnement isolé pour l'observer se nomme le {{sandboxing}}. La solution qui corrèle endpoint, réseau, cloud et messagerie est l'{{XDR}}.",
      pool: ["Secure", "EDR", "hachage", "NAC"] }
  ],

  22: [
    { id: 'd22a', type: 'order', title: "Cycle de gestion des vulnérabilités", desc: "Remettez les étapes dans l'ordre.",
      steps: ["Identification par scan ou threat feed", "Analyse et confirmation (faux positif ?)", "Priorisation selon CVSS et contexte métier", "Réponse et remédiation", "Validation par rescanning", "Reporting"] },
    { id: 'd22b', type: 'match', title: "Sévérité CVSS", desc: "Associez chaque plage de score à sa catégorie.",
      pairs: [["0.1 à 3.9", "Low"], ["4.0 à 6.9", "Medium"], ["7.0 à 8.9", "High"], ["9.0 à 10.0", "Critical"]] },
    { id: 'd22c', type: 'sort', title: "Méthodes d'identification des vulnérabilités", desc: "Classez chaque méthode.",
      bins: { "Analyse du code": ["SAST (analyse statique)", "DAST (analyse dynamique)", "Package monitoring"], "Renseignement externe": ["OSINT", "Flux propriétaires", "Dark web", "ISAC"], "Test actif": ["Penetration testing", "Vulnerability scan", "Bug bounty"] } },
    { id: 'd22d', type: 'fill', title: "Analyse et remédiation", desc: "Complétez avec le terme exact.",
      text: "Un scan qui signale une vulnérabilité inexistante produit un {{faux positif}}, alors qu'un scan qui rate une vraie faille produit un {{faux négatif}}, bien plus dangereux. Un scan {{authentifié}} donne une vue interne bien plus précise. Quand un correctif est impossible, on met en place des {{compensating controls}}. La remédiation n'est prouvée qu'après un {{rescan}}.",
      pool: ["vrai positif", "passif", "guard rails", "audit externe"] }
  ],

  23: [
    { id: 'd23a', type: 'match', title: "Outils de supervision", desc: "Associez chaque outil à sa fonction.",
      pairs: [["SIEM", "Agrège et corrèle les logs de sources multiples"], ["NetFlow", "Métadonnées des flux réseau, sans le contenu"], ["Packet capture", "Contenu complet des paquets"], ["SNMP trap", "Alerte envoyée spontanément par l'agent"], ["SCAP", "Automatise la vérification de conformité"], ["FIM", "Alerte à la modification d'un fichier critique"]] },
    { id: 'd23b', type: 'sort', title: "Activités de supervision", desc: "Classez chaque activité.",
      bins: { "Collecte": ["Log aggregation", "Scanning", "Archiving"], "Réaction": ["Alerting", "Quarantine", "Alert tuning", "Remediation et validation"] } },
    { id: 'd23c', type: 'match', title: "SNMP et supervision réseau", desc: "Associez chaque élément à sa caractéristique.",
      pairs: [["SNMP port 161", "Le manager interroge l'agent (polling)"], ["SNMP port 162", "L'agent envoie une alerte (trap)"], ["SNMPv3", "Apporte chiffrement et authentification"], ["Agent-based", "Données riches mais déploiement lourd"], ["Agentless", "Simple à déployer, moins de profondeur"]] },
    { id: 'd23d', type: 'fill', title: "SIEM et corrélation", desc: "Complétez avec le terme exact.",
      text: "La fonction qui distingue un SIEM d'un simple serveur de logs est la {{corrélation}}. Ajuster les règles pour réduire les faux positifs se nomme l'{{alert tuning}}, indispensable pour éviter l'{{alert fatigue}}. Sans synchronisation {{NTP}}, la corrélation chronologique entre sources devient impossible. Les configurations de référence durcies et mesurables se nomment des {{benchmarks}}.",
      pool: ["agrégation", "quarantine", "SCAP", "archiving"] }
  ],

  24: [
    { id: 'd24a', type: 'order', title: "Les 7 phases de la réponse à incident", desc: "L'ordre exact attendu à l'examen.",
      steps: ["Preparation", "Detection", "Analysis", "Containment", "Eradication", "Recovery", "Lessons Learned"] },
    { id: 'd24b', type: 'order', title: "Ordre de volatilité pour la collecte de preuves", desc: "Du plus volatil au moins volatil.",
      steps: ["Registres et cache du processeur", "Mémoire vive (RAM)", "État du réseau et connexions actives", "Processus en cours d'exécution", "Disque dur", "Journaux distants", "Archives et sauvegardes"] },
    { id: 'd24c', type: 'match', title: "Phases de la réponse à incident", desc: "Associez chaque phase à son action clé.",
      pairs: [["Preparation", "Créer le plan, l'équipe et les playbooks"], ["Detection", "Repérer l'événement suspect"], ["Analysis", "Confirmer l'incident et évaluer sa portée"], ["Containment", "Stopper la propagation immédiatement"], ["Eradication", "Supprimer la cause racine"], ["Recovery", "Restaurer les systèmes en production"], ["Lessons Learned", "Analyser et améliorer le dispositif"]] },
    { id: 'd24d', type: 'fill', title: "Investigation numérique", desc: "Complétez avec le terme exact.",
      text: "La traçabilité continue de la preuve se nomme {{chain of custody}} et toute rupture la rend irrecevable. L'obligation juridique de conserver les preuves est le {{legal hold}}. Une copie forensique se réalise {{bit à bit}} avec un bloqueur d'écriture et se vérifie par hachage. La recherche proactive d'une compromission non détectée est le {{threat hunting}}.",
      pool: ["e-discovery", "attestation", "fichier par fichier", "root cause analysis"] }
  ],

  25: [
    { id: 'd25a', type: 'match', title: "Quelle source de logs pour quelle preuve ?", desc: "Associez chaque besoin à la source appropriée.",
      pairs: [["Prouver une connexion vers une IP externe", "Firewall logs"], ["Vérifier une connexion réussie ou échouée", "OS security logs"], ["Identifier les processus lancés sur un poste", "Endpoint logs"], ["Prouver le contenu exfiltré", "Packet capture (PCAP)"], ["Voir la signature d'attaque déclenchée", "IDS/IPS logs"], ["Retrouver l'expéditeur d'un mail chiffré", "Métadonnées"]] },
    { id: 'd25b', type: 'sort', title: "Contenu ou métadonnées ?", desc: "Classez chaque source selon ce qu'elle fournit.",
      bins: { "Fournit le contenu": ["Packet capture (PCAP)", "Application logs détaillés"], "Fournit des métadonnées": ["NetFlow", "En-têtes d'email", "Firewall logs"] } },
    { id: 'd25c', type: 'fill', title: "Sources de données d'investigation", desc: "Complétez avec le terme exact.",
      text: "Les données SUR la donnée, exploitables même si le contenu est chiffré, sont les {{métadonnées}}. La vue consolidée et temps réel destinée aux analystes est un {{dashboard}}. Pour prouver le contenu exact d'une exfiltration, seule une {{capture de paquets}} suffit. Quand une seule source ne permet pas de conclure, il faut {{corréler}} plusieurs sources via le SIEM.",
      pool: ["NetFlow", "automated report", "archiver", "supprimer"] }
  ],

  26: [
    { id: 'd26a', type: 'sort', title: "Bénéfices et inconvénients de l'automatisation", desc: "Classez chaque élément.",
      bins: { "Bénéfice": ["Gain de temps et efficacité", "Application des baselines", "Mise à l'échelle sécurisée", "Workforce multiplier", "Temps de réaction réduit"], "Inconvénient": ["Complexité", "Coût initial", "Point unique de défaillance", "Dette technique", "Maintien en condition opérationnelle"] } },
    { id: 'd26b', type: 'match', title: "Automatisation et orchestration", desc: "Associez chaque terme à sa définition.",
      pairs: [["Automation", "Automatiser une seule tâche"], ["Orchestration", "Coordonner plusieurs tâches et outils"], ["SOAR", "Playbooks de réponse automatisés"], ["Guard rails", "Empêchent une configuration non conforme"], ["API", "Interface de communication entre systèmes"]] },
    { id: 'd26c', type: 'fill', title: "Cas d'usage et risques", desc: "Complétez avec le terme exact.",
      text: "Les garde-fous automatiques empêchant le déploiement d'une configuration non conforme sont des {{guard rails}}. L'effet permettant à une équipe constante de traiter bien plus de travail est le {{workforce multiplier}}. Le risque majeur de l'automatisation selon CompTIA est le {{single point of failure}}. L'accumulation de scripts non documentés et non maintenus constitue la {{dette technique}}.",
      pool: ["playbook", "orchestration", "alert fatigue", "privilege creep"] }
  ],

  27: [
    { id: 'd27a', type: 'order', title: "Cycle d'un programme de sensibilisation", desc: "Remettez les phases dans l'ordre.",
      steps: ["Development — conception du programme", "Execution — déploiement auprès des utilisateurs", "Reporting and monitoring — mesure des résultats", "Révision et amélioration continue"] },
    { id: 'd27b', type: 'sort', title: "Comportements anormaux", desc: "Classez chaque situation selon le type de comportement.",
      bins: { "Risky (risqué en connaissance de cause)": ["Contourner le VPN pour aller plus vite", "Utiliser un service cloud non approuvé"], "Unexpected (inattendu)": ["Accès à des données hors de son périmètre", "Connexion à 3 h du matin"], "Unintentional (involontaire)": ["Cliquer sur un lien de phishing par méconnaissance", "Envoyer un fichier au mauvais destinataire"] } },
    { id: 'd27c', type: 'match', title: "Thèmes de sensibilisation", desc: "Associez chaque thème à son contenu.",
      pairs: [["OPSEC", "Ne pas divulguer d'informations exploitables"], ["Situational awareness", "Repérer ce qui est anormal autour de soi"], ["Insider threat", "Reconnaître les signaux d'une menace interne"], ["Removable media", "Risques des clés USB et câbles piégés"], ["Hybrid/remote work", "Réseau domestique et espaces publics"]] },
    { id: 'd27d', type: 'fill', title: "Sensibilisation et signalement", desc: "Complétez avec le terme exact.",
      text: "L'objectif d'une campagne de phishing simulé est {{pédagogique}} et non punitif. Le reporting {{initial}} établit la mesure de référence, tandis que le recurring suit l'évolution. Abandonner des clés USB piégées sur un parking est une {{USB drop attack}}. Face à un message suspect, l'utilisateur doit le {{signaler}} sans cliquer ni le transférer.",
      pool: ["punitif", "recurring", "watering hole", "supprimer"] }
  ],

  28: [
    { id: 'd28a', type: 'match', title: "Mots-clés discriminants de l'examen", desc: "Associez chaque mot-clé à ce qu'il demande réellement.",
      pairs: [["FIRST", "La première action chronologique à mener"], ["BEST", "La solution optimale parmi plusieurs correctes"], ["MOST likely", "L'hypothèse la plus probable"], ["MOST cost-effective", "L'objectif atteint au moindre coût"], ["LEAST", "L'option la moins adaptée ou la moins impactante"]] },
    { id: 'd28b', type: 'order', title: "Déroulé optimal de l'examen", desc: "Remettez la stratégie dans l'ordre.",
      steps: ["Brain dump des formules, ports et processus", "Marquer les PBQ et les reporter à la fin", "Traiter les QCM à environ 1 minute chacun", "Revenir sur les PBQ marquées", "Relire les questions incertaines", "Vérifier qu'aucune réponse n'est vide"] },
    { id: 'd28c', type: 'fill', title: "Stratégie du jour J", desc: "Complétez avec le terme exact.",
      text: "Écrire de mémoire les formules et processus en début d'examen se nomme le {{brain dump}}. Le score de passage est de {{750}} sur 900. Il n'existe {{aucun}} point négatif, il faut donc répondre à toutes les questions. Face à une contradiction entre votre expérience et le manuel, répondez selon les bonnes pratiques {{CompTIA}}.",
      pool: ["700", "un seul", "terrain", "flag"] }
  ]

  };

  /* ------------------------------------------------------------------------
     Générateur d'exercices de calcul de risque (valeurs aléatoires à chaque
     tirage, pour un entraînement illimité sur SLE / ARO / ALE).
     ---------------------------------------------------------------------- */
  App.riskProblem = function () {
    var assets = [
      { n: 'un serveur de base de données', v: [40000, 250000] },
      { n: 'une flotte de portables', v: [30000, 180000] },
      { n: 'un automate industriel', v: [60000, 400000] },
      { n: 'une baie de stockage', v: [80000, 500000] },
      { n: "un système de caisse d'un magasin", v: [20000, 120000] }
    ];
    var events = [
      { n: 'un incendie', ef: [0.3, 0.9], years: [8, 25] },
      { n: 'un dégât des eaux', ef: [0.2, 0.6], years: [5, 20] },
      { n: 'un vol de matériel', ef: [0.1, 0.4], years: [2, 10] },
      { n: 'une panne électrique majeure', ef: [0.15, 0.5], years: [3, 12] },
      { n: 'une attaque par ransomware', ef: [0.25, 0.8], years: [1, 6] }
    ];
    function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
    function rnd(min, max, step) { step = step || 1; return Math.round((min + Math.random() * (max - min)) / step) * step; }

    var a = pick(assets), e = pick(events);
    var av = rnd(a.v[0], a.v[1], 5000);
    var ef = rnd(e.ef[0] * 100, e.ef[1] * 100, 5) / 100;
    var years = rnd(e.years[0], e.years[1], 1);
    var aro = 1 / years;
    var sle = av * ef;
    var ale = sle * aro;

    return {
      text: "La valeur de " + a.n + " est estimée à **" + av.toLocaleString('fr-FR') + " €**. " +
            "En cas " + (e.n.indexOf('une') === 0 ? "d'" + e.n.slice(4) : "de " + e.n.slice(3)) +
            ", on estime que **" + Math.round(ef * 100) + " %** de sa valeur serait perdue. " +
            "Ce type d'événement survient statistiquement **une fois tous les " + years + " ans**.",
      av: av, ef: ef, years: years, aro: aro, sle: sle, ale: ale,
      questions: [
        { label: 'SLE (Single Loss Expectancy) en €', answer: sle, hint: 'SLE = AV × EF' },
        { label: 'ARO (Annualized Rate of Occurrence)', answer: aro, hint: 'ARO = 1 / nombre d\'années', decimals: 4 },
        { label: 'ALE (Annualized Loss Expectancy) en €', answer: ale, hint: 'ALE = SLE × ARO' }
      ]
    };
  };

})(window.App = window.App || {});
