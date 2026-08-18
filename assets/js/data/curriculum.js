/* ============================================================================
   CURRICULUM — CompTIA Security+ SY0-701
   Ordre strictement identique au cours Udemy de Jason Dion (28 sections).
   Chaque section est mappée aux objectifs officiels CompTIA SY0-701 v5.0.
   ========================================================================== */
(function (App) {
  'use strict';

  // --- Domaines officiels et pondération à l'examen -------------------------
  App.DOMAINS = [
    { id: '1.0', name: 'General Security Concepts', fr: 'Concepts généraux de sécurité', weight: 12, color: '#38bdf8' },
    { id: '2.0', name: 'Threats, Vulnerabilities & Mitigations', fr: 'Menaces, vulnérabilités et mitigations', weight: 22, color: '#f472b6' },
    { id: '3.0', name: 'Security Architecture', fr: 'Architecture de sécurité', weight: 18, color: '#a78bfa' },
    { id: '4.0', name: 'Security Operations', fr: 'Opérations de sécurité', weight: 28, color: '#34d399' },
    { id: '5.0', name: 'Security Program Management & Oversight', fr: 'Gestion et pilotage du programme de sécurité', weight: 20, color: '#fbbf24' }
  ];

  // --- Objectifs officiels --------------------------------------------------
  App.OBJECTIVES = {
    '1.1': 'Compare and contrast various types of security controls.',
    '1.2': 'Summarize fundamental security concepts.',
    '1.3': 'Explain the importance of change management processes and the impact to security.',
    '1.4': 'Explain the importance of using appropriate cryptographic solutions.',
    '2.1': 'Compare and contrast common threat actors and motivations.',
    '2.2': 'Explain common threat vectors and attack surfaces.',
    '2.3': 'Explain various types of vulnerabilities.',
    '2.4': 'Given a scenario, analyze indicators of malicious activity.',
    '2.5': 'Explain the purpose of mitigation techniques used to secure the enterprise.',
    '3.1': 'Compare and contrast security implications of different architecture models.',
    '3.2': 'Given a scenario, apply security principles to secure enterprise infrastructure.',
    '3.3': 'Compare and contrast concepts and strategies to protect data.',
    '3.4': 'Explain the importance of resilience and recovery in security architecture.',
    '4.1': 'Given a scenario, apply common security techniques to computing resources.',
    '4.2': 'Explain the security implications of proper hardware, software, and data asset management.',
    '4.3': 'Explain various activities associated with vulnerability management.',
    '4.4': 'Explain security alerting and monitoring concepts and tools.',
    '4.5': 'Given a scenario, modify enterprise capabilities to enhance security.',
    '4.6': 'Given a scenario, implement and maintain identity and access management.',
    '4.7': 'Explain the importance of automation and orchestration related to secure operations.',
    '4.8': 'Explain appropriate incident response activities.',
    '4.9': 'Given a scenario, use data sources to support an investigation.',
    '5.1': 'Summarize elements of effective security governance.',
    '5.2': 'Explain elements of the risk management process.',
    '5.3': 'Explain the processes associated with third-party risk assessment and management.',
    '5.4': 'Summarize elements of effective security compliance.',
    '5.5': 'Explain types and purposes of audits and assessments.',
    '5.6': 'Given a scenario, implement security awareness practices.'
  };

  /* Chaque section :
     id       : numéro de section du cours Dion
     title    : titre de la section (anglais, comme dans le cours)
     fr       : traduction / intitulé français
     domain   : domaine principal
     objs     : objectifs CompTIA couverts
     icon     : emoji d'identification visuelle
     summary  : ce que la section apporte
     lessons  : liste des leçons du cours
     keypoints: notions à mémoriser absolument (piège d'examen inclus)
  */
  App.SECTIONS = [
    {
      id: 1, title: 'Introduction', fr: 'Introduction', domain: '1.0', objs: [], icon: '🚀',
      summary: "Prise en main du cours, format de l'examen SY0-701 et méthode de travail. Le socle stratégique avant d'attaquer la technique.",
      lessons: ['Bienvenue dans le cours', "Télécharger les PDF (study guide, objectifs, plan d'étude)", "Format et déroulé de l'examen", 'Comment réussir du premier coup'],
      keypoints: [
        "L'examen SY0-701 dure 90 minutes avec un maximum de 90 questions.",
        "Le score de passage est de 750 sur une échelle de 100 à 900.",
        "Deux formats de questions : QCM (multiple-choice) et PBQ (performance-based questions).",
        "Les PBQ apparaissent en début d'examen : on peut les marquer et y revenir à la fin.",
        "Les 5 domaines pèsent : 1.0=12%, 2.0=22%, 3.0=18%, 4.0=28%, 5.0=20%.",
        "Expérience recommandée : 2 ans en administration IT orientée sécurité."
      ]
    },
    {
      id: 2, title: 'Fundamentals of Security', fr: 'Fondamentaux de la sécurité', domain: '1.0', objs: ['1.1', '1.2'], icon: '🛡️',
      summary: "La triade CIA, la non-répudiation, l'AAA, le Zero Trust et surtout les catégories et types de contrôles de sécurité — la matière la plus rentable de tout l'examen.",
      lessons: ['Fondamentaux de la sécurité', 'Triade CIA (Confidentiality, Integrity, Availability)', 'Non-répudiation', 'Authentication, Authorization, Accounting (AAA)', 'Security Control Categories', 'Security Control Types', 'Zero Trust', 'Menaces et vulnérabilités', 'Confidentialité, intégrité, disponibilité en pratique', 'Gap Analysis'],
      keypoints: [
        "CIA = Confidentiality (chiffrement), Integrity (hachage), Availability (redondance).",
        "Non-repudiation = impossibilité de nier une action : garantie par la signature numérique.",
        "AAA : Authentication (qui es-tu ?), Authorization (que peux-tu faire ?), Accounting (qu'as-tu fait ?).",
        "4 CATÉGORIES de contrôles : Technical, Managerial, Operational, Physical.",
        "6 TYPES de contrôles : Preventive, Deterrent, Detective, Corrective, Compensating, Directive.",
        "Ne jamais confondre catégorie (qui/quoi met en œuvre) et type (quel effet recherché).",
        "Zero Trust : « never trust, always verify ». Control Plane (Policy Engine, Policy Administrator, Adaptive Identity, Threat Scope Reduction, Policy-Driven Access Control) + Data Plane (Subject/System, Policy Enforcement Point, Implicit Trust Zones).",
        "Le Policy Engine DÉCIDE, le Policy Administrator COMMUNIQUE la décision, le Policy Enforcement Point APPLIQUE.",
        "Gap analysis = écart entre la posture actuelle et la posture cible.",
        "Risque = Menace × Vulnérabilité. Sans vulnérabilité, une menace ne produit aucun risque."
      ]
    },
    {
      id: 3, title: 'Threat Actors', fr: 'Acteurs de menace', domain: '2.0', objs: ['2.1', '2.2'], icon: '🎭',
      summary: "Qui attaque, pourquoi, avec quels moyens, et par quels vecteurs. L'examen teste surtout votre capacité à identifier l'acteur à partir de son profil de motivation et de ressources.",
      lessons: ['Threat Actors', 'Motivations des acteurs', 'Attributs des acteurs', 'Unskilled Attackers', 'Hacktivists', 'Organized Crime', 'Nation-state Actors', 'Insider Threats', 'Shadow IT', 'Threat Vectors and Attack Surfaces', 'Outsmarting Threat Actors'],
      keypoints: [
        "Nation-state = ressources quasi illimitées, très sophistiqué, motivé par espionnage et guerre. Associé aux APT (Advanced Persistent Threat).",
        "Unskilled attacker (script kiddie) = peu de ressources, peu de compétences, utilise des outils tout faits, motivé par le chaos.",
        "Hacktivist = motivé par des convictions philosophiques ou politiques ; ressources limitées mais capacité moyenne.",
        "Insider threat = menace interne, ressources moyennes, dangereuse car elle possède DÉJÀ un accès légitime.",
        "Organized crime = très bien financé, sophistiqué, motivé par le gain financier (ransomware).",
        "Shadow IT = matériel/logiciel/service utilisé sans l'accord de la DSI. Pas malveillant par nature, mais crée des vulnérabilités invisibles.",
        "3 attributs à comparer : interne/externe, ressources/financement, niveau de sophistication.",
        "Vecteurs : message (email, SMS, IM), image, fichier, appel vocal, support amovible, logiciel vulnérable, systèmes non supportés, réseaux non sécurisés, ports ouverts, identifiants par défaut, supply chain.",
        "Attack surface = ensemble des points d'entrée possibles. On la réduit ; le vecteur est le chemin emprunté."
      ]
    },
    {
      id: 4, title: 'Physical Security', fr: 'Sécurité physique', domain: '1.0', objs: ['1.2'], icon: '🚧',
      summary: "Barrières, contrôle d'accès physique, surveillance, capteurs et technologies de tromperie (honeypots). Facile à marquer si on connaît le vocabulaire exact.",
      lessons: ['Physical Security', 'Fencing and Bollards', 'Attacking with Brute Force', 'Surveillance Systems', 'Bypassing Surveillance Systems', 'Access Control Vestibules', 'Door Locks', 'Access Badge Cloning'],
      keypoints: [
        "Bollard = borne anti-bélier : arrête les véhicules mais laisse passer les piétons.",
        "Access control vestibule (mantrap) = double porte à interverrouillage : empêche le tailgating et le piggybacking.",
        "Tailgating = suivre quelqu'un À SON INSU. Piggybacking = entrer AVEC son consentement.",
        "Fencing : la hauteur et le barbelé déterminent le niveau de dissuasion.",
        "Video surveillance/CCTV = contrôle DÉTECTIF (il constate après coup), pas préventif.",
        "Le garde de sécurité est le seul contrôle capable de faire du jugement discrétionnaire.",
        "Capteurs : Infrared (chaleur), Pressure (poids), Microwave (mouvement par ondes), Ultrasonic (mouvement par son).",
        "Lighting = contrôle dissuasif (deterrent).",
        "Honeypot = un système leurre. Honeynet = un réseau entier de leurres. Honeyfile = un fichier appât. Honeytoken = une donnée traçable factice.",
        "Les technologies de tromperie servent à détecter et à étudier l'attaquant, pas à le bloquer."
      ]
    },
    {
      id: 5, title: 'Social Engineering', fr: 'Ingénierie sociale', domain: '2.0', objs: ['2.2', '5.6'], icon: '🎣',
      summary: "L'humain comme vecteur d'attaque. Distinguer précisément phishing / vishing / smishing / pretexting / BEC est un grand classique de l'examen.",
      lessons: ['Social Engineering', 'Motivational Triggers', 'Impersonation', 'Pretexting', 'Phishing Attacks', 'Preventing Phishing Attacks', 'Frauds and Scams', 'Influence Campaigns', 'Other Social Engineering Attacks'],
      keypoints: [
        "Phishing = email. Vishing = voix/téléphone. Smishing = SMS. Retenir par le support utilisé.",
        "Spear phishing = ciblé sur un groupe précis. Whaling = ciblé sur un dirigeant (C-level).",
        "Pretexting = inventer un scénario crédible pour justifier la demande.",
        "Impersonation = se faire passer pour quelqu'un d'autre. Brand impersonation = usurper une marque.",
        "BEC (Business Email Compromise) = compromission d'une boîte mail interne légitime pour émettre des ordres frauduleux. Très coûteux.",
        "Watering hole = compromettre un site tiers que la cible visite habituellement.",
        "Typosquatting = enregistrer un domaine avec une faute de frappe proche du domaine légitime.",
        "Misinformation = fausse information diffusée sans intention de nuire. Disinformation = fausse information diffusée DÉLIBÉRÉMENT.",
        "Leviers psychologiques : Authority, Urgency, Social proof, Scarcity, Likability, Fear.",
        "La meilleure contre-mesure globale reste la formation et la sensibilisation des utilisateurs."
      ]
    },
    {
      id: 6, title: 'Malware', fr: 'Logiciels malveillants', domain: '2.0', objs: ['2.4'], icon: '🦠',
      summary: "Toute la taxonomie des malwares et surtout leurs indicateurs de compromission. L'examen décrit un symptôme et demande le type de malware.",
      lessons: ['Malware', 'Viruses', 'Worms', 'Trojans', 'Ransomware', 'Zombies and Botnets', 'Rootkits', 'Backdoors and Logic Bombs', 'Keylogger', 'Spyware and Bloatware', 'Malware Attack Techniques', 'Indications of Malware Attacks'],
      keypoints: [
        "Virus = nécessite une action de l'utilisateur et un fichier hôte pour se propager.",
        "Worm (ver) = se propage SEUL sur le réseau, sans interaction ni hôte. Signature : saturation du réseau.",
        "Trojan = se fait passer pour un logiciel légitime. RAT = Remote Access Trojan (accès distant persistant).",
        "Ransomware = chiffre les données et exige une rançon. Défense n°1 : des sauvegardes hors ligne testées.",
        "Rootkit = obtient un accès privilégié et se dissimule ; opère souvent en mode noyau (kernel mode). Le détecter demande souvent un boot externe.",
        "Logic bomb = code malveillant déclenché par une condition (date, événement).",
        "Keylogger = enregistre les frappes clavier.",
        "Spyware = espionne l'activité. Bloatware = logiciel préinstallé inutile, pas malveillant mais augmente la surface d'attaque.",
        "Botnet = réseau de machines zombies pilotées par un C2 (command and control).",
        "Indicateurs : lenteur anormale, pop-ups, trafic sortant inexpliqué, comptes créés, services désactivés, fichiers renommés/chiffrés."
      ]
    },
    {
      id: 7, title: 'Data Protection', fr: 'Protection des données', domain: '3.0', objs: ['3.3'], icon: '🔒',
      summary: "Classifier, localiser et protéger la donnée selon son état. Attention aux nuances entre chiffrement, masquage, tokenisation et obfuscation.",
      lessons: ['Data Protection', 'Data Classifications', 'Data Ownership', 'Data States', 'Data Types', 'Data Sovereignty', 'Securing Data', 'Data Loss Prevention (DLP)', 'Configuring a DLP'],
      keypoints: [
        "3 états de la donnée : at rest (stockée), in transit/motion (en circulation), in use (en mémoire, en traitement).",
        "Data at rest → chiffrement de disque/fichier. Data in transit → TLS/IPSec. Data in use → chiffrement en mémoire, secure enclave.",
        "Classifications : Public, Private, Sensitive, Confidential, Critical, Restricted.",
        "Data sovereignty = les données sont soumises aux lois du pays où elles sont physiquement stockées.",
        "Data owner = responsable métier de la donnée. Data controller = décide des finalités. Data processor = traite pour le compte du controller. Data custodian/steward = gère techniquement au quotidien.",
        "Tokenization = remplace la donnée par un jeton sans valeur, la vraie donnée est dans un coffre séparé. Réversible via le coffre.",
        "Masking = remplace partiellement (ex. ****-****-****-1234). Généralement irréversible.",
        "Hashing = irréversible, sert à l'intégrité, pas à la confidentialité.",
        "DLP = détecte et bloque l'exfiltration. Se décline en endpoint DLP, network DLP, storage DLP et cloud DLP.",
        "Geographic restriction / geofencing = restreindre l'accès selon la localisation."
      ]
    },
    {
      id: 8, title: 'Cryptographic Solutions', fr: 'Solutions cryptographiques', domain: '1.0', objs: ['1.4'], icon: '🔐',
      summary: "La section la plus dense du cours. Symétrique vs asymétrique, PKI, certificats, hachage, signatures, TPM/HSM. Il faut connaître les tailles de clés et les usages.",
      lessons: ['Cryptographic Solutions', 'Symmetric vs Asymmetric', 'Symmetric Algorithms', 'Asymmetric Algorithms', 'Hashing', 'Increasing Hash Security', 'Public Key Infrastructure (PKI)', 'Digital Certificates', 'Blockchain', 'Encryption Tools', 'Obfuscation', 'Cryptographic Attacks'],
      keypoints: [
        "Symétrique = UNE seule clé partagée, rapide, idéal pour de gros volumes. AES (128/192/256), 3DES, Blowfish, Twofish, RC4 (obsolète).",
        "Asymétrique = paire clé publique/clé privée, lent, sert à l'échange de clés et à la signature. RSA, ECC, Diffie-Hellman, ElGamal.",
        "CONFIDENTIALITÉ : on chiffre avec la clé PUBLIQUE du destinataire, il déchiffre avec sa clé PRIVÉE.",
        "SIGNATURE : on signe avec sa PROPRE clé PRIVÉE, tout le monde vérifie avec la clé PUBLIQUE. Cela donne authenticité + intégrité + non-répudiation.",
        "ECC offre une sécurité équivalente à RSA avec des clés bien plus courtes → idéal pour mobile et IoT.",
        "Hachage : MD5 (128 bits, cassé), SHA-1 (160 bits, obsolète), SHA-256/SHA-512, HMAC (hachage + clé secrète).",
        "Salting = ajouter une valeur aléatoire avant hachage → contre les rainbow tables. Key stretching (PBKDF2, bcrypt, scrypt) = rendre le calcul volontairement lent.",
        "PKI : CA (émet), RA (vérifie l'identité), CRL (liste de révocation, consultation par téléchargement), OCSP (vérification en temps réel), OCSP stapling (le serveur fournit la preuve).",
        "CSR = Certificate Signing Request : contient la clé publique et les infos d'identité, JAMAIS la clé privée.",
        "Wildcard certificate = *.domaine.com, couvre tous les sous-domaines d'un même niveau. SAN = plusieurs domaines différents.",
        "TPM = puce soudée à la carte mère d'UNE machine. HSM = appareil dédié, souvent amovible, gère les clés à grande échelle. KMS = gestion centralisée des clés (souvent cloud). Secure enclave = zone protégée du processeur.",
        "Perfect Forward Secrecy (PFS) = une clé de session compromise ne compromet pas les sessions passées (DHE, ECDHE).",
        "Attaques crypto : downgrade (forcer un protocole plus faible), collision (deux entrées, même hash), birthday attack (exploite le paradoxe des anniversaires)."
      ]
    },
    {
      id: 9, title: 'Risk Management', fr: 'Gestion du risque', domain: '5.0', objs: ['5.2'], icon: '⚖️',
      summary: "Identification, analyse qualitative et quantitative, registre des risques, stratégies de traitement et BIA. Les formules SLE/ARO/ALE tombent presque toujours.",
      lessons: ['Risk Management', 'Risk Assessment Frequency', 'Risk Identification', 'Risk Register', 'Qualitative Risk Analysis', 'Quantitative Risk Analysis', 'Risk Management Strategies', 'Risk Monitoring and Reporting', 'Business Impact Analysis'],
      keypoints: [
        "SLE = AV × EF (Single Loss Expectancy = valeur de l'actif × facteur d'exposition).",
        "ALE = SLE × ARO (Annualized Loss Expectancy = perte par incident × fréquence annuelle).",
        "Une contre-mesure est rentable si son coût annuel est INFÉRIEUR à la réduction d'ALE qu'elle procure.",
        "Analyse qualitative = échelles subjectives (faible/moyen/élevé), matrice probabilité × impact. Rapide et peu coûteuse.",
        "Analyse quantitative = valeurs monétaires chiffrées. Objective mais longue et coûteuse.",
        "4 stratégies : Mitigate (réduire), Transfer (assurer/sous-traiter), Avoid (supprimer l'activité), Accept (assumer, avec exemption ou exception).",
        "Risk appetite = appétit global (expansionary, conservative, neutral). Risk tolerance = variation acceptable autour du seuil.",
        "Risk register : contient les risques identifiés, les KRI (key risk indicators), les risk owners et le risk threshold.",
        "RTO = temps maximal acceptable pour REMETTRE EN SERVICE. RPO = quantité maximale de données que l'on accepte de PERDRE (fenêtre de sauvegarde).",
        "MTTR = temps moyen de réparation. MTBF = temps moyen entre deux pannes (fiabilité).",
        "BIA = identifie les fonctions critiques et détermine RTO/RPO. Elle précède le plan de continuité."
      ]
    },
    {
      id: 10, title: 'Third-party Vendor Risks', fr: 'Risques liés aux tiers', domain: '5.0', objs: ['5.3'], icon: '🤝',
      summary: "Évaluation des fournisseurs, supply chain et surtout les types d'accords contractuels — un pur exercice de mémorisation d'acronymes.",
      lessons: ['Third-party Vendor Risks', 'Supply Chain Risks', 'Supply Chain Attacks', 'Vendor Assessment', 'Vendor Selection and Monitoring', 'Contracts and Agreements'],
      keypoints: [
        "SLA (Service-Level Agreement) = engagement mesurable sur le niveau de service (disponibilité, délai). Contient des pénalités.",
        "MOU (Memorandum of Understanding) = déclaration d'intention, généralement NON contraignante juridiquement.",
        "MOA (Memorandum of Agreement) = plus formel que le MOU, décrit les rôles et responsabilités, peut être contraignant.",
        "MSA (Master Service Agreement) = contrat-cadre qui fixe les conditions générales pour tous les travaux à venir.",
        "SOW / WO (Statement of Work / Work Order) = détaille les livrables, le calendrier et le périmètre d'une mission précise, sous l'égide du MSA.",
        "NDA (Non-Disclosure Agreement) = accord de confidentialité.",
        "BPA (Business Partners Agreement) = définit la relation entre partenaires : parts, responsabilités, répartition des profits.",
        "Right-to-audit clause = clause contractuelle autorisant à auditer le fournisseur. À négocier AVANT la signature.",
        "Due diligence = vérification approfondie avant sélection. Conflict of interest = à identifier lors de la sélection.",
        "Supply chain attack = compromettre un fournisseur pour atteindre ses clients (cas SolarWinds).",
        "Le monitoring du fournisseur est continu, pas ponctuel : questionnaires, revues de performance, rules of engagement."
      ]
    },
    {
      id: 11, title: 'Governance and Compliance', fr: 'Gouvernance et conformité', domain: '5.0', objs: ['5.1', '5.4'], icon: '🏛️',
      summary: "Politiques, standards, procédures, structures de gouvernance, conformité réglementaire et vie privée. Hiérarchie documentaire à connaître par cœur.",
      lessons: ['Governance and Compliance', 'Governance', 'Governance Structures', 'Policies', 'Standards', 'Procedures', 'Governance Considerations', 'Compliance', 'Non-compliance Consequences', 'Privacy'],
      keypoints: [
        "Hiérarchie : Policies (le QUOI et le POURQUOI, obligatoire) → Standards (le niveau exigé, obligatoire) → Procedures (le COMMENT, étape par étape) → Guidelines (recommandations, facultatives).",
        "AUP (Acceptable Use Policy) = ce que l'utilisateur a le droit de faire avec les ressources de l'entreprise.",
        "Politiques attendues : information security, business continuity, disaster recovery, incident response, SDLC, change management.",
        "Structures de gouvernance : boards (conseils), committees (comités), government entities, centralisé vs décentralisé.",
        "Centralisé = cohérence et contrôle fort, mais lenteur. Décentralisé = agilité et réactivité, mais incohérences.",
        "Rôles données : Owner (responsable, classifie), Controller (décide des finalités), Processor (exécute pour le controller), Custodian/Steward (met en œuvre techniquement).",
        "Conséquences de la non-conformité : amendes (fines), sanctions, atteinte à la réputation, perte de licence, impacts contractuels.",
        "Due diligence = enquêter avant d'agir. Due care = agir raisonnablement et de façon continue ensuite.",
        "Attestation and acknowledgement = signature formelle confirmant la prise de connaissance et le respect des règles.",
        "RGPD : data subject (la personne), right to be forgotten (droit à l'effacement), controller vs processor, inventaire et rétention des données.",
        "Considérations externes : regulatory, legal, industry, local/regional, national, global."
      ]
    },
    {
      id: 12, title: 'Asset and Change Management', fr: 'Gestion des actifs et des changements', domain: '1.0', objs: ['1.3', '4.2'], icon: '📦',
      summary: "Le cycle de vie de l'actif du achat à la destruction, et le processus formel de change management avec ses implications techniques.",
      lessons: ['Asset and Change Management', 'Acquisition and Procurement', 'Mobile Asset Deployments', 'Asset Management', 'Asset Disposal and Decommissioning', 'Change Management', 'Business Processes', 'Technical Implications', 'Documenting Changes', 'Change Management Version Control'],
      keypoints: [
        "Processus de change management : demande → analyse d'impact → approbation (CAB) → test → planification de la fenêtre → mise en œuvre → documentation.",
        "Backout plan (plan de retour arrière) = obligatoire AVANT tout changement : comment revenir à l'état antérieur si ça échoue.",
        "Maintenance window = créneau planifié où l'interruption est acceptée.",
        "SOP (Standard Operating Procedure) = mode opératoire normalisé.",
        "Implications techniques : allow lists/deny lists, restricted activities, downtime, service restart, application restart, legacy applications, dependencies.",
        "Une allow list est plus sûre (tout est interdit sauf ce qui est listé) qu'une deny list (tout est permis sauf ce qui est listé).",
        "Après un changement : mettre à jour les diagrammes ET les politiques/procédures. La documentation périmée est une vulnérabilité.",
        "Version control = traçabilité des versions, permet de revenir en arrière.",
        "Cycle de vie de l'actif : acquisition → assignation (owner, classification) → suivi d'inventaire → mise hors service → destruction.",
        "Sanitization = effacer les données de façon irrécupérable (wiping, degaussing, cryptographic erase). Destruction = détruire physiquement (broyage, incinération, pulvérisation).",
        "Certificate of destruction = preuve documentaire que le média a bien été détruit.",
        "Degaussing ne fonctionne PAS sur les SSD (pas de magnétisme) : utiliser un cryptographic erase ou une destruction physique."
      ]
    },
    {
      id: 13, title: 'Audits and Assessments', fr: 'Audits et évaluations', domain: '5.0', objs: ['5.5'], icon: '🔍',
      summary: "Audits internes/externes, attestation et tests d'intrusion. Bien distinguer les niveaux de connaissance de l'environnement et les types de reconnaissance.",
      lessons: ['Audits and Assessments', 'Internal Audits', 'External Audits', 'Penetration Testing', 'Attestation of Findings'],
      keypoints: [
        "Audit interne : réalisé par l'organisation (compliance team, audit committee, self-assessments). Objectif : préparation et amélioration continue.",
        "Audit externe : réalisé par un tiers indépendant (regulatory, examinations, assessment, independent third-party audit). Objectif : crédibilité et conformité.",
        "Attestation = déclaration formelle et signée qu'une conclusion d'audit est exacte. Engage la responsabilité du signataire.",
        "Known environment (white box) = le testeur a toutes les informations. Rapide et exhaustif.",
        "Unknown environment (black box) = aucune information. Simule un attaquant externe réaliste.",
        "Partially known environment (gray box) = informations partielles. Bon compromis.",
        "Reconnaissance passive = collecte SANS interagir avec la cible (OSINT, WHOIS, réseaux sociaux, moteurs de recherche). Indétectable.",
        "Reconnaissance active = interaction directe (scan de ports, énumération, ping). Détectable par la cible.",
        "Types de pentest : physical, offensive (red team), defensive (blue team), integrated (purple team).",
        "Rules of engagement = document définissant le périmètre, les horaires, les méthodes autorisées et les contacts. À signer AVANT de commencer."
      ]
    },
    {
      id: 14, title: 'Cyber Resilience and Redundancy', fr: 'Résilience et redondance', domain: '3.0', objs: ['3.4'], icon: '♻️',
      summary: "Haute disponibilité, sites de secours, sauvegardes, alimentation et tests de continuité. Les délais de bascule des sites hot/warm/cold sont une question récurrente.",
      lessons: ['Cyber Resilience and Redundancy', 'High Availability', 'Data Redundancy', 'Capacity Planning', 'Powering Data Centers', 'Data Backups', 'Continuity of Operations Plan', 'Redundant Site Considerations', 'Resilience and Recovery Testing'],
      keypoints: [
        "Hot site = réplique opérationnelle, données à jour, bascule en minutes/heures. Le plus cher.",
        "Warm site = matériel et connexions en place, données à restaurer, bascule en heures/jours. Compromis.",
        "Cold site = local vide avec électricité et réseau, bascule en jours/semaines. Le moins cher.",
        "Load balancing = répartir la charge sur plusieurs serveurs actifs. Clustering = plusieurs serveurs vus comme un seul système, avec bascule automatique.",
        "RAID 0 = striping, performance, AUCUNE tolérance de panne. RAID 1 = miroir. RAID 5 = striping + parité distribuée (tolère 1 disque). RAID 6 = double parité (tolère 2 disques). RAID 10 = miroir + striping.",
        "RAID n'est PAS une sauvegarde : il ne protège ni de la suppression, ni du ransomware.",
        "Règle 3-2-1 : 3 copies, sur 2 supports différents, dont 1 hors site.",
        "Full backup = tout, long, restauration rapide (1 jeu). Incremental = ce qui a changé depuis la DERNIÈRE sauvegarde quelconque, rapide à sauvegarder, restauration lente (full + tous les incréments). Differential = ce qui a changé depuis le dernier FULL, restauration en 2 jeux.",
        "Journaling = enregistrement des transactions permettant de rejouer/annuler. Replication = copie en continu. Snapshot = image à un instant T.",
        "UPS = alimentation immédiate mais de courte durée (batteries). Generator = alimentation longue durée mais avec un délai de démarrage. Les deux sont complémentaires.",
        "Tests : tabletop exercise (sur papier, discussion), simulation (mise en situation), failover (bascule réelle), parallel processing (le site de secours tourne en parallèle sans couper la production).",
        "Geographic dispersion = éloigner les sites pour qu'un même sinistre ne les touche pas simultanément."
      ]
    },
    {
      id: 15, title: 'Security Architecture', fr: 'Architecture de sécurité', domain: '3.0', objs: ['3.1'], icon: '🏗️',
      summary: "Cloud, virtualisation, conteneurs, serverless, microservices, IoT et ICS/SCADA. Le modèle de responsabilité partagée est incontournable.",
      lessons: ['Security Architecture', 'On-premise versus the Cloud', 'Cloud Security', 'Virtualization and Containerization', 'Serverless', 'Microservices', 'Network Infrastructure', 'Software-Defined Network (SDN)', 'Infrastructure as Code (IaC)', 'Centralized vs Decentralized Architectures', 'Internet of Things (IoT)', 'ICS and SCADA', 'Embedded Systems'],
      keypoints: [
        "Responsibility matrix : IaaS = le client gère l'OS, les applis et les données. PaaS = le client gère les applis et les données. SaaS = le client ne gère QUE ses données et ses accès.",
        "Dans TOUS les modèles cloud, la donnée et la gestion des identités restent la responsabilité du client.",
        "Virtualisation = plusieurs OS complets sur un hyperviseur. Type 1 = bare metal (performant, sécurisé). Type 2 = hébergé sur un OS existant.",
        "Conteneurisation = partage le noyau de l'OS hôte. Plus léger et plus rapide qu'une VM, mais isolation plus faible.",
        "VM escape = s'échapper d'une VM pour atteindre l'hyperviseur ou les autres VM. Resource reuse = récupérer des données résiduelles dans de la mémoire ou du stockage réattribué.",
        "Serverless (FaaS) = le fournisseur gère toute l'infrastructure ; réduit la surface d'attaque côté client mais crée une dépendance forte au fournisseur.",
        "Microservices = services indépendants et faiblement couplés ; résilients et évolutifs, mais multiplient les interfaces à sécuriser.",
        "IaC (Infrastructure as Code) = infrastructure décrite dans du code versionné → configurations reproductibles, dérive de configuration éliminée.",
        "SDN sépare le control plane (décision) du data plane (transfert), pilotage centralisé et programmable.",
        "Air-gapped = isolation physique totale, aucune connexion réseau. La protection la plus forte, contournable par supports amovibles.",
        "ICS/SCADA = pilotage industriel ; priorité à la DISPONIBILITÉ et à la sûreté, souvent impossible à patcher → segmentation et compensating controls.",
        "RTOS = système temps réel à contraintes déterministes ; ressources limitées, patching difficile.",
        "Considérations à comparer : availability, resilience, cost, responsiveness, scalability, ease of deployment, risk transference, ease of recovery, patch availability, inability to patch, power, compute."
      ]
    },
    {
      id: 16, title: 'Security Infrastructure', fr: 'Infrastructure de sécurité', domain: '3.0', objs: ['3.2'], icon: '🌐',
      summary: "Ports et protocoles, pare-feux, IDS/IPS, équilibrage, proxies, VPN et SASE. Les ports et les types de pare-feux sont massivement testés.",
      lessons: ['Security Infrastructure', 'Ports and Protocols', 'Firewalls', 'Configuring Firewalls', 'IDS and IPS', 'Network Appliances', 'Port Security', 'Securing Network Communications', 'SD-WAN and SASE', 'Infrastructure Considerations', 'Selecting Infrastructure Controls'],
      keypoints: [
        "Ports critiques : 20/21 FTP, 22 SSH/SCP/SFTP, 23 Telnet, 25 SMTP, 53 DNS, 67/68 DHCP, 69 TFTP, 80 HTTP, 110 POP3, 143 IMAP, 161/162 SNMP, 389 LDAP, 443 HTTPS, 445 SMB, 636 LDAPS, 3389 RDP.",
        "Layer 4 firewall = filtre sur IP/port (stateless ou stateful). Layer 7 / NGFW = inspecte le contenu applicatif, identifie l'application quel que soit le port.",
        "WAF = protège spécifiquement les applications web (SQLi, XSS). UTM = boîtier tout-en-un (pare-feu + antivirus + IDS + filtrage).",
        "IDS = DÉTECTE et alerte (passif, hors chemin / tap). IPS = détecte et BLOQUE (actif, en ligne / inline).",
        "Détection par signature = efficace sur le connu, aveugle au zero-day. Détection par anomalie/comportement = détecte l'inconnu mais génère des faux positifs.",
        "Faux positif = alerte sur du trafic légitime. Faux négatif = attaque réelle non détectée (le plus dangereux).",
        "Jump server = point de rebond durci et surveillé pour accéder à une zone sensible.",
        "Proxy forward = protège les clients sortants. Reverse proxy = protège les serveurs entrants.",
        "802.1X = contrôle d'accès au port basé sur l'identité. Acteurs : supplicant (le client), authenticator (le switch/AP), authentication server (RADIUS). EAP est le cadre d'échange.",
        "Fail-open = en cas de panne, le trafic passe (priorité à la disponibilité). Fail-closed = le trafic est bloqué (priorité à la sécurité).",
        "Active vs passive : un équipement actif agit sur le trafic, un passif se contente d'observer. Inline vs tap/monitor : sur le chemin ou en dérivation.",
        "VPN : site-to-site (relie deux sites) ou remote access (relie un utilisateur). Full tunnel = tout passe par le VPN (sûr). Split tunnel = seul le trafic d'entreprise passe (performant, moins sûr).",
        "IPSec : AH assure l'intégrité et l'authentification SANS chiffrement ; ESP assure le chiffrement. Tunnel mode chiffre tout le paquet, transport mode seulement la charge utile.",
        "SD-WAN = optimise le WAN entre sites. SASE = SD-WAN + services de sécurité cloud (SWG, CASB, ZTNA, FWaaS) délivrés en périphérie."
      ]
    },
    {
      id: 17, title: 'Identity and Access Management (IAM)', fr: 'Gestion des identités et des accès', domain: '4.0', objs: ['4.6'], icon: '🪪',
      summary: "Provisioning, SSO, fédération, MFA, modèles de contrôle d'accès et PAM. Les modèles MAC/DAC/RBAC/ABAC sont un incontournable de l'examen.",
      lessons: ['Identity and Access Management (IAM) Solutions', 'Multifactor Authentication', 'Password Security', 'Password Attacks', 'Single Sign-On (SSO)', 'Federation', 'Privileged Access Management (PAM)', 'Access Control Models', 'Assigning Permissions'],
      keypoints: [
        "4 facteurs d'authentification : something you KNOW (mot de passe), you HAVE (token, carte), you ARE (biométrie), somewhere you ARE (géolocalisation).",
        "MFA = au moins DEUX facteurs de CATÉGORIES DIFFÉRENTES. Mot de passe + question secrète = deux fois « know » → ce n'est PAS du MFA.",
        "MAC (Mandatory) = le SYSTÈME impose selon des labels de classification. Le plus strict, usage militaire.",
        "DAC (Discretionary) = le PROPRIÉTAIRE du fichier décide qui y accède. Le plus souple, le moins sûr.",
        "RBAC (Role-Based) = droits attribués via des rôles/groupes métier. Le plus courant en entreprise.",
        "Rule-Based = règles conditionnelles appliquées par le système (ex. ACL, horaire).",
        "ABAC (Attribute-Based) = décision selon des attributs combinés (utilisateur, ressource, environnement). Le plus granulaire et dynamique.",
        "SSO = une authentification unique pour plusieurs services. LDAP (annuaire, port 389 / LDAPS 636), SAML (fédération web par assertions XML), OAuth (AUTORISATION, délégation d'accès), OpenID Connect (AUTHENTIFICATION, couche au-dessus d'OAuth 2.0).",
        "Piège classique : OAuth = autorisation, SAML et OIDC = authentification.",
        "Federation = faire confiance aux identités d'un autre domaine via un IdP (Identity Provider). Le SP (Service Provider) consomme l'assertion.",
        "Kerberos = authentification par tickets avec KDC et TGT, utilise le port 88, sensible à la désynchronisation d'horloge.",
        "PAM : just-in-time permissions (droits accordés temporairement à la demande), password vaulting (coffre-fort), ephemeral credentials (identifiants à durée de vie très courte).",
        "Least privilege = strictement les droits nécessaires. Separation of duties = découper une tâche sensible entre plusieurs personnes.",
        "Privilege creep = accumulation de droits au fil des mutations. Contre-mesure : revues d'accès régulières et de-provisioning rigoureux.",
        "Identity proofing = vérifier que la personne est bien celle qu'elle prétend être avant de créer le compte.",
        "Biométrie : FAR (accepte un imposteur, risque sécurité), FRR (rejette un légitime, risque ergonomie), CER/EER (point d'équilibre, sert à comparer les systèmes)."
      ]
    },
    {
      id: 18, title: 'Vulnerabilities and Attacks', fr: 'Vulnérabilités et attaques', domain: '2.0', objs: ['2.3', '2.4'], icon: '💥',
      summary: "Vulnérabilités applicatives, web, matérielles, de virtualisation et cloud, avec les attaques qui les exploitent. Buffer overflow, race conditions, SQLi et XSS sont systématiquement testés.",
      lessons: ['Vulnerabilities and Attacks', 'Hardware Vulnerabilities', 'Bluetooth Vulnerabilities and Attacks', 'Mobile Vulnerabilities and Attacks', 'Zero-day Vulnerabilities', 'Operating System Vulnerabilities', 'SQL and XML Injections', 'XSS and XSRF', 'Buffer Overflow', 'Race Conditions'],
      keypoints: [
        "Buffer overflow = écrire au-delà de la mémoire allouée pour écraser des données adjacentes et détourner l'exécution. Contre-mesures : validation des entrées, ASLR, DEP.",
        "Race condition = le résultat dépend de l'ordre d'exécution. TOC/TOU (Time-of-Check to Time-of-Use) = l'état change entre la vérification et l'utilisation.",
        "Memory injection = injecter du code dans l'espace mémoire d'un processus en cours.",
        "SQLi = injecter du SQL via une entrée non filtrée. Contre-mesures : requêtes paramétrées (prepared statements), validation d'entrée, moindre privilège sur le compte SQL.",
        "XSS = injecter du script exécuté par le NAVIGATEUR d'une autre victime. Stored (persistant en base), Reflected (renvoyé dans la réponse), DOM-based (côté client uniquement).",
        "XSRF/CSRF = forcer le navigateur d'un utilisateur AUTHENTIFIÉ à exécuter une action à son insu. Contre-mesure : jetons anti-CSRF et SameSite cookies.",
        "Différence clé : XSS exploite la confiance de l'utilisateur envers le site ; CSRF exploite la confiance du site envers l'utilisateur.",
        "Zero-day = vulnérabilité inconnue de l'éditeur, aucun correctif disponible. Une détection par signature ne la voit pas.",
        "Jailbreaking (iOS) / rooting (Android) = retirer les restrictions du fabricant. Side loading = installer une application hors du magasin officiel.",
        "Bluetooth : bluejacking (envoi de messages non sollicités), bluesnarfing (VOL de données), bluebugging (prise de contrôle).",
        "Firmware / end-of-life / legacy = matériel qui ne reçoit plus de correctifs → risque permanent, à compenser par segmentation.",
        "Malicious update = mise à jour piégée. Contre-mesure : signature de code et vérification d'intégrité.",
        "Misconfiguration reste l'une des causes de compromission les plus fréquentes (identifiants par défaut, permissions trop larges, buckets cloud publics)."
      ]
    },
    {
      id: 19, title: 'Malicious Activity', fr: 'Activité malveillante', domain: '2.0', objs: ['2.4'], icon: '🚨',
      summary: "Attaques réseau, applicatives, cryptographiques et sur mots de passe, avec leurs indicateurs. La section « scénario » par excellence : un symptôme, une attaque.",
      lessons: ['Malicious Activity', 'Distributed Denial of Service (DDoS)', 'Domain Name System (DNS) Attacks', 'Directory Traversal Attack', 'Execution and Escalation Attacks', 'Password Attacks', 'Wireless Attacks', 'On-path Attacks', 'Injection Attacks', 'Indicators of Compromise (IoC)'],
      keypoints: [
        "DDoS amplifié = petite requête, énorme réponse (DNS, NTP, memcached). DDoS réfléchi = usurper l'IP de la victime pour que les réponses lui soient renvoyées.",
        "DNS poisoning / cache poisoning = corrompre le cache résolveur pour rediriger les victimes. Contre-mesure : DNSSEC.",
        "Domain hijacking = prendre le contrôle de l'enregistrement du domaine chez le registrar.",
        "DNS tunneling = exfiltrer des données dissimulées dans des requêtes DNS.",
        "Directory traversal = ../../ pour sortir du répertoire web et lire des fichiers système.",
        "Privilege escalation verticale = obtenir plus de droits (utilisateur → admin). Horizontale = accéder aux données d'un autre utilisateur de même niveau.",
        "Password spraying = UN mot de passe courant essayé sur BEAUCOUP de comptes → évite le verrouillage de compte.",
        "Brute force = beaucoup de mots de passe sur UN compte. Dictionary attack = liste de mots probables. Rainbow table = tables de hachages précalculés (contrée par le salting).",
        "Credential replay / replay attack = rejouer des identifiants ou une session capturés. Contre-mesure : nonces, timestamps, chiffrement de session.",
        "On-path (anciennement man-in-the-middle) = s'interposer dans la communication. Variantes : ARP poisoning, rogue AP, SSL stripping.",
        "Evil twin = faux point d'accès imitant le SSID légitime. Rogue AP = point d'accès non autorisé branché sur le réseau.",
        "Deauthentication attack = forcer la déconnexion des clients Wi-Fi pour capturer la reconnexion (handshake).",
        "Forgery = falsifier une requête ou un jeton pour qu'il paraisse légitime.",
        "Indicateurs à reconnaître : account lockout, concurrent session usage, blocked content, IMPOSSIBLE TRAVEL (connexions géographiquement incompatibles), resource consumption, resource inaccessibility, out-of-cycle logging, published/documented, MISSING LOGS (signe d'effacement de traces)."
      ]
    },
    {
      id: 20, title: 'Hardening', fr: 'Durcissement', domain: '2.0', objs: ['2.5', '4.1'], icon: '🧱',
      summary: "Réduire la surface d'attaque des systèmes, des réseaux et des équipements. Les techniques de hardening reviennent dans les PBQ.",
      lessons: ['Hardening', 'Changing Default Configurations', 'Restricting Applications', 'Unnecessary Services', 'Trusted Operating Systems', 'Updates and Patches', 'Patch Management', 'Group Policies', 'SELinux', 'Data Encryption Levels', 'Secure Baselines'],
      keypoints: [
        "Durcissement = réduire la surface d'attaque : désinstaller les logiciels inutiles, désactiver les services et ports non nécessaires, changer les identifiants par défaut.",
        "Secure baseline : ÉTABLIR (définir la configuration de référence) → DÉPLOYER (l'appliquer au parc) → MAINTENIR (surveiller la dérive et l'actualiser).",
        "Application allow list = seuls les exécutables listés peuvent s'exécuter. Beaucoup plus sûr qu'une deny list.",
        "Patch management : identifier → tester en préproduction → déployer → vérifier. Ne jamais patcher directement en production sans test.",
        "Group Policy (GPO) = application centralisée de configurations dans un domaine Windows.",
        "SELinux = MAC sous Linux, applique des contextes de sécurité obligatoires. Modes : enforcing, permissive, disabled.",
        "Niveaux de chiffrement : full-disk, partition, volume, file, database, record. Plus le niveau est fin, plus le contrôle est granulaire.",
        "FDE protège une machine ÉTEINTE (vol de portable) ; il ne protège pas une machine allumée et déverrouillée.",
        "Cibles de durcissement : mobile devices, workstations, switches, routers, cloud infrastructure, servers, ICS/SCADA, embedded systems, RTOS, IoT.",
        "Techniques : chiffrement, endpoint protection, host-based firewall, HIPS, désactivation des ports/protocoles, changement des mots de passe par défaut, suppression des logiciels inutiles.",
        "Autres mitigations d'entreprise : segmentation, access control (ACL, permissions), isolation, patching, monitoring, least privilege, configuration enforcement, decommissioning."
      ]
    },
    {
      id: 21, title: 'Security Techniques', fr: 'Techniques de sécurité', domain: '4.0', objs: ['4.1', '4.5'], icon: '⚙️',
      summary: "Sécurisation du sans-fil, des mobiles, des applications et du cloud. WPA3, MDM et les modèles de déploiement mobiles sont très rentables.",
      lessons: ['Security Techniques', 'Wireless Infrastructure Security', 'Wireless Security Settings', 'Application Security', 'Network Access Control (NAC)', 'Web and DNS Filtering', 'Email Security', 'Endpoint Detection and Response (EDR)', 'User Behavior Analytics'],
      keypoints: [
        "WPA3 apporte SAE (Simultaneous Authentication of Equals) qui remplace le PSK : protège contre les attaques par dictionnaire hors ligne et fournit la forward secrecy.",
        "WEP est cassé, WPA (TKIP/RC4) est obsolète, WPA2 utilise CCMP/AES, WPA3 utilise SAE + GCMP.",
        "WPA2-Enterprise / WPA3-Enterprise = authentification 802.1X par RADIUS avec un compte individuel, bien supérieur à une clé partagée.",
        "Site survey = mesurer la couverture radio réelle. Heat map = représentation visuelle de la puissance du signal. Les deux évitent les zones mortes et les débordements hors du bâtiment.",
        "MDM = gestion centralisée des mobiles : politiques, chiffrement, conteneurisation, effacement à distance (remote wipe).",
        "BYOD = appareil personnel, coût faible, contrôle faible, vie privée sensible. COPE = appareil d'entreprise à usage personnel autorisé, contrôle fort. CYOD = choix dans une liste d'appareils fournis par l'entreprise.",
        "Sécurité applicative : input validation (la contre-mesure n°1 des injections), secure cookies (flags Secure/HttpOnly), static code analysis (SAST, sans exécuter), code signing (authenticité et intégrité).",
        "Sandboxing = exécuter du code inconnu dans un environnement isolé pour l'observer sans risque.",
        "NAC = vérifie la conformité d'un poste (antivirus à jour, correctifs) AVANT de l'autoriser sur le réseau ; sinon quarantaine ou remédiation.",
        "Email : SPF déclare les serveurs autorisés à envoyer (enregistrement DNS TXT), DKIM signe cryptographiquement le message, DMARC définit la politique à appliquer en cas d'échec (none, quarantine, reject) et le reporting.",
        "Web filter : agent-based (sur le poste, suit l'utilisateur partout) ou centralized proxy (au niveau réseau). Filtrage par URL, catégorie, réputation et règles de blocage.",
        "DNS filtering = bloquer la résolution des domaines malveillants : simple, efficace et très large.",
        "EDR = détection et réponse sur l'endpoint. XDR = corrèle endpoint + réseau + cloud + messagerie.",
        "UBA / UEBA = établit une base comportementale et alerte sur les écarts (utile contre les menaces internes et les comptes compromis).",
        "FIM (File Integrity Monitoring) = alerte lorsqu'un fichier critique est modifié."
      ]
    },
    {
      id: 22, title: 'Vulnerability Management', fr: 'Gestion des vulnérabilités', domain: '4.0', objs: ['4.3'], icon: '🩹',
      summary: "Identifier, analyser, prioriser, corriger et valider. Le CVSS, les faux positifs et la validation de la remédiation sont les points chauds.",
      lessons: ['Vulnerability Management', 'Identifying Vulnerabilities', 'Threat Intelligence Feeds', 'Responsible Disclosure Programs', 'Analyzing Vulnerabilities', 'Conducting Vulnerability Scans', 'Assessing Vulnerability Scan Results', 'Vulnerability Response and Remediation', 'Validating Vulnerability Remediation', 'Vulnerability Reporting'],
      keypoints: [
        "Cycle : identification → analyse → priorisation → réponse/remédiation → validation → reporting.",
        "Scan non authentifié (non-credentialed) = vue de l'attaquant externe, moins précis. Scan authentifié (credentialed) = vue interne complète, beaucoup plus précis, moins de faux positifs.",
        "Scan actif = envoie des paquets à la cible, précis mais détectable et potentiellement perturbant. Scan passif = observe le trafic, sans impact mais moins complet.",
        "SAST (static) = analyse le code source SANS l'exécuter. DAST (dynamic) = teste l'application EN COURS D'EXÉCUTION.",
        "Package monitoring = surveiller les dépendances et bibliothèques tierces utilisées par l'application.",
        "CVE = identifiant unique d'une vulnérabilité connue. CVSS = score de gravité de 0 à 10 (0 None, 0.1-3.9 Low, 4.0-6.9 Medium, 7.0-8.9 High, 9.0-10.0 Critical).",
        "Faux positif = le scanner signale une vulnérabilité inexistante (perte de temps). Faux négatif = le scanner rate une vulnérabilité réelle (danger réel).",
        "La priorisation ne dépend PAS que du CVSS : il faut aussi l'exposure factor, les environmental variables, l'impact métier/sectoriel et la risk tolerance.",
        "Réponses possibles : patching, insurance, segmentation, compensating controls, exceptions and exemptions.",
        "Un compensating control s'utilise quand on ne PEUT pas corriger (système legacy, ICS non patchable).",
        "Validation obligatoire après correction : rescanning, audit, verification. Sans re-scan, la remédiation n'est pas prouvée.",
        "Threat feeds : OSINT (ouvert), proprietary/third-party (payant), information-sharing organizations (ISAC), dark web.",
        "Responsible disclosure program / bug bounty = canal officiel pour que des chercheurs signalent des failles, avec récompense pour le bug bounty."
      ]
    },
    {
      id: 23, title: 'Alerting and Monitoring', fr: 'Alerte et supervision', domain: '4.0', objs: ['4.4'], icon: '📡',
      summary: "SIEM, agrégation de logs, SNMP, NetFlow, SCAP et réglage des alertes. Le rôle exact du SIEM et l'alert tuning sont très demandés.",
      lessons: ['Alerting and Monitoring', 'Monitoring Resources', 'Alerting and Monitoring Activities', 'Simple Network Management Protocol (SNMP)', 'Security Content Automation and Protocol (SCAP)', 'Network Monitoring', 'Log Aggregation', 'Security Information and Event Management (SIEM)', 'Data from Security Tools', 'Security Content Automation'],
      keypoints: [
        "SIEM = collecte, agrège, normalise et CORRÈLE les logs de sources multiples pour produire des alertes exploitables.",
        "Log aggregation = centraliser les journaux. La corrélation, elle, met en relation des événements de sources différentes pour révéler un scénario d'attaque.",
        "Activités de supervision : log aggregation, alerting, scanning, reporting, archiving, alert response and remediation/validation.",
        "Alert tuning = ajuster les règles pour réduire le bruit et les faux positifs. Indispensable pour éviter la fatigue d'alerte (alert fatigue).",
        "Quarantine = isoler automatiquement un élément suspect en attendant analyse.",
        "SNMP : agents sur les équipements, manager central. Un SNMP trap est une alerte envoyée SPONTANÉMENT par l'agent (contrairement au polling où le manager interroge). SNMPv3 apporte le chiffrement et l'authentification.",
        "NetFlow = métadonnées sur les FLUX réseau (qui parle à qui, quand, combien), pas le contenu des paquets.",
        "Packet capture (PCAP) = capture le contenu complet des paquets, volumineux mais détaillé.",
        "SCAP = protocole standardisé pour automatiser la vérification de conformité et de vulnérabilités. Composants : CVE, CVSS, CPE, OVAL, XCCDF.",
        "Benchmarks (CIS, DISA STIG) = configurations de référence durcies et mesurables.",
        "Agent-based = installé sur l'hôte, riche en données mais lourd à déployer. Agentless = pas d'installation, plus simple mais moins profond.",
        "Archiving = conserver les journaux pour les exigences légales et les investigations ultérieures.",
        "Trois cibles à superviser : systems, applications, infrastructure."
      ]
    },
    {
      id: 24, title: 'Incident Response', fr: 'Réponse à incident', domain: '4.0', objs: ['4.8'], icon: '🧯',
      summary: "Les 7 phases de la réponse à incident, dans l'ordre. C'est LA séquence à savoir réciter sans hésiter.",
      lessons: ['Incident Response', 'Incident Response Process', 'Threat Hunting', 'Root Cause Analysis', 'Incident Response Training and Testing', 'Digital Forensic Procedures'],
      keypoints: [
        "Les 7 phases dans l'ordre : Preparation → Detection → Analysis → Containment → Eradication → Recovery → Lessons Learned.",
        "Preparation = créer le plan, l'équipe (CIRT/CERT), les outils et les playbooks AVANT l'incident. C'est la phase la plus déterminante.",
        "Detection = repérer l'événement. Analysis = confirmer qu'il s'agit d'un incident, en évaluer la portée et la gravité.",
        "Containment = STOPPER la propagation (isoler le poste, couper le segment). Objectif : limiter les dégâts immédiatement.",
        "Eradication = supprimer la cause (malware, compte compromis, faille exploitée).",
        "Recovery = restaurer les systèmes en production et vérifier leur bon fonctionnement.",
        "Lessons learned = analyse post-incident, mise à jour du plan et des contrôles. Souvent négligée en pratique, systématiquement testée à l'examen.",
        "Threat hunting = recherche PROACTIVE d'une compromission non détectée, fondée sur des hypothèses. Ce n'est pas une réaction à une alerte.",
        "Root cause analysis = identifier la cause PROFONDE, pas le symptôme, pour empêcher la récidive.",
        "Tabletop exercise = discussion sur scénario, sans impact sur la production, peu coûteux. Simulation = mise en situation réaliste (ex. campagne de phishing simulée).",
        "Forensique : legal hold (obligation de conserver les preuves), chain of custody (traçabilité continue de la preuve), acquisition (collecte), preservation (préservation de l'intégrité), reporting, e-discovery.",
        "Ordre de volatilité pour la collecte : registres/cache → mémoire vive (RAM) → état réseau → processus → disque → journaux distants → archives. On collecte du plus volatil au moins volatil.",
        "Une copie forensique se fait bit à bit avec un bloqueur d'écriture et se vérifie par empreinte de hachage."
      ]
    },
    {
      id: 25, title: 'Investigating an Incident', fr: 'Investigation d\'un incident', domain: '4.0', objs: ['4.9'], icon: '🕵️',
      summary: "Quelles sources de données consulter et ce que chacune apporte. L'examen demande souvent « quel log consulter pour prouver X ? ».",
      lessons: ['Investigating an Incident', 'Investigating with Data', 'Dashboards', 'Automated Reports', 'Vulnerability Scans', 'Packet Captures', 'Firewall Logs', 'Application Logs', 'Endpoint Logs', 'OS-specific Security Logs', 'IPS/IDS Logs', 'Network Logs', 'Metadata'],
      keypoints: [
        "Firewall logs = trafic autorisé et bloqué, adresses IP source/destination, ports. Pour prouver une connexion ou une tentative d'accès.",
        "Application logs = événements propres au logiciel : erreurs, transactions, authentifications applicatives.",
        "Endpoint logs = activité sur le poste : processus lancés, fichiers créés, connexions locales.",
        "OS-specific security logs = Windows Event Log (Security), auth.log / secure sous Linux. Pour prouver une connexion réussie ou échouée d'un compte.",
        "IDS/IPS logs = alertes de détection avec la signature déclenchée.",
        "Network logs = équipements réseau, changements de configuration, état des interfaces.",
        "Metadata = données SUR la donnée (expéditeur, horodatage, appareil, géolocalisation). Souvent décisives dans une enquête, y compris quand le contenu est chiffré.",
        "Packet capture = le contenu réel des échanges ; indispensable pour prouver une exfiltration.",
        "Vulnerability scans = montrent quelle faiblesse a pu être exploitée.",
        "Dashboards = vue consolidée et temps réel pour les analystes. Automated reports = synthèses périodiques pour le pilotage et la conformité.",
        "La synchronisation des horloges (NTP) est indispensable : sans horodatage cohérent, la corrélation entre sources est impossible."
      ]
    },
    {
      id: 26, title: 'Automation and Orchestration', fr: 'Automatisation et orchestration', domain: '4.0', objs: ['4.7'], icon: '🤖',
      summary: "SOAR, cas d'usage, bénéfices et limites. Attention : l'examen insiste autant sur les inconvénients que sur les avantages.",
      lessons: ['Automation and Orchestration', 'When to Automate and Orchestrate', 'Benefits of Automation and Orchestration', 'Automating Support Tickets', 'Automating Onboarding', 'Automating Security', 'Automating Application Development', 'Integrations and APIs'],
      keypoints: [
        "Automation = automatiser UNE tâche. Orchestration = coordonner plusieurs tâches et outils en un flux complet.",
        "SOAR = Security Orchestration, Automation and Response : exécute des playbooks de réponse automatisés.",
        "Cas d'usage : user provisioning, resource provisioning, guard rails, security groups, ticket creation, escalation, activation/désactivation de services et d'accès, intégration continue et tests, intégrations et API.",
        "Guard rails = garde-fous automatiques qui empêchent une configuration non conforme d'être déployée.",
        "Bénéfices : efficacité et gain de temps, application des baselines, configurations d'infrastructure standardisées, mise à l'échelle sécurisée, fidélisation des employés (moins de tâches ingrates), temps de réaction, effet multiplicateur sur les effectifs (workforce multiplier).",
        "Inconvénients à connaître : complexité, coût initial, POINT UNIQUE DE DÉFAILLANCE (single point of failure), dette technique, maintien en condition opérationnelle (ongoing supportability).",
        "Une automatisation mal conçue propage une erreur à grande échelle et instantanément.",
        "API = interface permettant à deux systèmes de communiquer ; à sécuriser par authentification, limitation de débit (rate limiting) et validation des entrées.",
        "L'automatisation de l'onboarding/offboarding réduit les erreurs humaines et les comptes orphelins."
      ]
    },
    {
      id: 27, title: 'Security Awareness', fr: 'Sensibilisation à la sécurité', domain: '5.0', objs: ['5.6'], icon: '🎓',
      summary: "Programmes de sensibilisation, campagnes de phishing simulé et reconnaissance des comportements anormaux. Le facteur humain comme dernière ligne de défense.",
      lessons: ['Security Awareness', 'Recognizing Insider Threats', 'Password Management', 'Avoiding Social Engineering', 'Policy and Handbooks', 'Removable Media and Cables', 'Additional Awareness Topics', 'User Guidance and Training', 'Reporting and Monitoring', 'Development and Execution'],
      keypoints: [
        "Cycle d'un programme de sensibilisation : development (conception) → execution (déploiement) → reporting and monitoring → révision continue.",
        "Reporting initial = première mesure de référence. Reporting recurring = suivi de l'évolution dans le temps.",
        "Campagne de phishing simulé = mesurer le taux de clic et de signalement, puis former ciblé. L'objectif est pédagogique, pas punitif.",
        "Il faut apprendre aux utilisateurs à RECONNAÎTRE un phishing ET à savoir quoi en faire (signaler via le bouton dédié, ne pas transférer).",
        "Comportements anormaux à reconnaître : risky (risqué en connaissance de cause), unexpected (inattendu), unintentional (involontaire).",
        "Thèmes de formation attendus : policy/handbooks, situational awareness, insider threat, password management, removable media and cables, social engineering, operational security, hybrid/remote work.",
        "Les supports amovibles et les câbles piégés (USB drop attack, câbles USB malveillants) sont un vecteur classique : politique d'interdiction et blocage des ports USB.",
        "OPSEC (operational security) = ne pas divulguer d'informations exploitables (réseaux sociaux, badges visibles, conversations en public).",
        "Le télétravail élargit la surface d'attaque : réseau domestique non maîtrisé, shoulder surfing en espace public, VPN obligatoire.",
        "La formation doit être RÉCURRENTE : une session annuelle unique est insuffisante."
      ]
    },
    {
      id: 28, title: 'Conclusion', fr: 'Conclusion et stratégie d\'examen', domain: '1.0', objs: [], icon: '🏁',
      summary: "Stratégie du jour J : gestion du temps, technique du brain dump, traitement des PBQ et méthode d'élimination.",
      lessons: ['Conclusion', "Ce qu'il faut faire le jour de l'examen", 'Technique du brain dump', 'Gestion du temps et des PBQ', 'Comment passer et réussir'],
      keypoints: [
        "Brain dump : dès le début de l'examen, écrire de mémoire les formules (SLE/ALE/ARO), les ports, les 7 phases de l'IR et les modèles de contrôle d'accès.",
        "Traiter les PBQ en dernier : les marquer (flag) et y revenir après avoir sécurisé tous les QCM.",
        "90 questions en 90 minutes = environ 1 minute par question. Ne jamais bloquer plus de 2 minutes sur une question.",
        "Méthode d'élimination : écarter d'abord les 2 réponses manifestement fausses, puis départager les 2 restantes.",
        "Chercher les mots-clés déclencheurs : MOST likely, BEST, FIRST, MOST cost-effective. Ils changent complètement la bonne réponse.",
        "« FIRST » demande la première ACTION à mener, souvent le containment en réponse à incident.",
        "Répondre à TOUTES les questions : il n'y a pas de point négatif.",
        "Toujours répondre du point de vue de CompTIA (les bonnes pratiques du manuel), pas de votre expérience terrain personnelle.",
        "Score de passage : 750 sur 900. Toutes les questions ne pèsent pas le même poids.",
        "Le jour J : arriver en avance, pièce d'identité valide, être reposé."
      ]
    }
  ];

  // Index rapide par id
  App.SECTION_BY_ID = {};
  App.SECTIONS.forEach(function (s) { App.SECTION_BY_ID[s.id] = s; });

  App.getDomain = function (id) {
    for (var i = 0; i < App.DOMAINS.length; i++) if (App.DOMAINS[i].id === id) return App.DOMAINS[i];
    return App.DOMAINS[0];
  };

})(window.App = window.App || {});
