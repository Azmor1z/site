/* ============================================================================
   FLASHCARDS — une banque par section du cours Dion
   q = recto (question / terme), a = verso (réponse). **gras** mis en valeur.
   ========================================================================== */
(function (App) {
  'use strict';

  App.FLASHCARDS = {

  /* ---------------------------- 1. Introduction ---------------------------- */
  1: [
    { q: "Combien de temps dure l'examen SY0-701 et combien de questions comporte-t-il ?", a: "**90 minutes** pour un maximum de **90 questions**." },
    { q: "Quel est le score de passage de l'examen Security+ ?", a: "**750** sur une échelle allant de **100 à 900**." },
    { q: "Quels sont les deux formats de questions à l'examen ?", a: "Les **QCM** (multiple-choice) et les **PBQ** (performance-based questions, questions de mise en situation)." },
    { q: "Où se situent les PBQ dans l'examen et comment les traiter ?", a: "Elles apparaissent **au début**. Stratégie : les **marquer (flag)** et y revenir **à la fin**, après avoir sécurisé tous les QCM." },
    { q: "Quelle est la pondération des 5 domaines à l'examen ?", a: "1.0 = **12 %**, 2.0 = **22 %**, 3.0 = **18 %**, 4.0 = **28 %**, 5.0 = **20 %**." },
    { q: "Quel domaine pèse le plus lourd à l'examen ?", a: "Le domaine **4.0 Security Operations** avec **28 %** des questions." },
    { q: "Quelle expérience professionnelle CompTIA recommande-t-elle avant de passer le Security+ ?", a: "Au minimum **2 ans en administration IT** avec une orientation sécurité." },
    { q: "Que certifie le Security+ selon CompTIA ?", a: "Évaluer la **posture de sécurité** d'une entreprise, sécuriser les environnements **hybrides (cloud, mobile, IoT)**, opérer selon la **gouvernance, le risque et la conformité**, et **répondre aux incidents**." },
    { q: "Y a-t-il des points négatifs à l'examen ?", a: "**Non.** Il faut donc répondre à **toutes** les questions, même en devinant." },
    { q: "Depuis quel point de vue faut-il répondre aux questions de l'examen ?", a: "Celui de **CompTIA et des bonnes pratiques du manuel**, jamais celui de votre expérience terrain personnelle." }
  ],

  /* ----------------------- 2. Fundamentals of Security ---------------------- */
  2: [
    { q: "Que signifie la triade CIA et à quoi sert chaque composante ?", a: "**Confidentiality** (seuls les autorisés accèdent — chiffrement), **Integrity** (la donnée n'est pas altérée — hachage), **Availability** (la donnée est accessible quand nécessaire — redondance)." },
    { q: "Qu'est-ce que la non-répudiation et comment l'obtient-on ?", a: "L'impossibilité pour un acteur de **nier une action** qu'il a réalisée. Elle est garantie par la **signature numérique**." },
    { q: "Que recouvrent les trois A de l'AAA ?", a: "**Authentication** (qui êtes-vous ?), **Authorization** (qu'avez-vous le droit de faire ?), **Accounting** (qu'avez-vous fait ? — journalisation)." },
    { q: "Quelles sont les 4 CATÉGORIES de contrôles de sécurité ?", a: "**Technical** (mis en œuvre par la technologie), **Managerial** (politiques et procédures de gestion), **Operational** (exécutés par des personnes au quotidien), **Physical** (barrières tangibles)." },
    { q: "Quels sont les 6 TYPES de contrôles de sécurité ?", a: "**Preventive**, **Deterrent**, **Detective**, **Corrective**, **Compensating**, **Directive**." },
    { q: "Quelle différence entre un contrôle preventive et un contrôle deterrent ?", a: "Le **preventive** empêche physiquement ou techniquement l'action (une serrure). Le **deterrent** décourage sans empêcher (un panneau d'avertissement, un éclairage)." },
    { q: "Qu'est-ce qu'un contrôle compensating ?", a: "Un contrôle **alternatif** mis en place quand le contrôle prévu est **impossible à appliquer** (ex. segmenter un système ICS non patchable)." },
    { q: "Qu'est-ce qu'un contrôle directive ?", a: "Un contrôle qui **oriente le comportement** vers la conformité : une politique, une consigne, une charte d'usage." },
    { q: "Une caméra de vidéosurveillance appartient à quelle catégorie et quel type ?", a: "Catégorie **Physical**, type **Detective** (elle constate a posteriori). Sa présence visible joue aussi un rôle **deterrent**." },
    { q: "Quel est le principe fondateur du Zero Trust ?", a: "**« Never trust, always verify »** : aucune confiance implicite, même à l'intérieur du périmètre. Chaque accès est vérifié." },
    { q: "Quels composants forment le Control Plane du Zero Trust ?", a: "**Adaptive identity**, **threat scope reduction**, **policy-driven access control**, **Policy Administrator** et **Policy Engine**." },
    { q: "Quels composants forment le Data Plane du Zero Trust ?", a: "**Implicit trust zones**, **Subject/System** et le **Policy Enforcement Point (PEP)**." },
    { q: "Dans le Zero Trust, qui décide, qui communique et qui applique ?", a: "Le **Policy Engine DÉCIDE**, le **Policy Administrator COMMUNIQUE** la décision, le **Policy Enforcement Point APPLIQUE**." },
    { q: "Qu'est-ce qu'une gap analysis ?", a: "L'analyse de l'**écart entre la posture de sécurité actuelle et la posture cible** souhaitée." },
    { q: "Quelle est la relation entre menace, vulnérabilité et risque ?", a: "**Risque = Menace × Vulnérabilité**. Sans vulnérabilité exploitable, une menace ne génère **aucun risque**." },
    { q: "Quelle différence entre authentifier une personne et authentifier un système ?", a: "Une **personne** s'authentifie par mot de passe, biométrie ou token. Un **système** s'authentifie par certificat, clé partagée ou identité machine." },
    { q: "Qu'est-ce qu'un modèle d'autorisation (authorization model) ?", a: "La règle qui détermine **quels droits sont accordés** une fois l'identité vérifiée : MAC, DAC, RBAC, Rule-based ou ABAC." },
    { q: "Un plan de reprise d'activité (DRP) est quel type de contrôle ?", a: "Un contrôle **Corrective** (il rétablit après incident) et de catégorie **Managerial** (c'est un document de gestion)." }
  ],

  /* ---------------------------- 3. Threat Actors --------------------------- */
  3: [
    { q: "Quels sont les 3 attributs servant à comparer les acteurs de menace ?", a: "**Interne/externe**, **ressources et financement**, **niveau de sophistication et de capacité**." },
    { q: "Caractérisez l'acteur nation-state.", a: "Ressources **quasi illimitées**, sophistication **très élevée**, externe. Motivations : **espionnage, guerre, perturbation**. Associé aux **APT**." },
    { q: "Qu'est-ce qu'une APT ?", a: "**Advanced Persistent Threat** : un attaquant qui obtient un accès et le **maintient longtemps sans être détecté**. Typiquement l'œuvre d'un acteur étatique." },
    { q: "Caractérisez l'unskilled attacker (script kiddie).", a: "**Peu de compétences et peu de ressources**, utilise des **outils tout faits** trouvés en ligne. Motivation : le **chaos** ou la reconnaissance." },
    { q: "Qu'est-ce qui motive un hacktivist ?", a: "Des **convictions philosophiques ou politiques**. Ressources limitées, capacités moyennes. Actions typiques : défacement, DDoS, fuite de documents." },
    { q: "Pourquoi l'insider threat est-il particulièrement dangereux ?", a: "Parce qu'il dispose **déjà d'un accès légitime** et connaît l'organisation : il contourne naturellement les défenses périmétriques." },
    { q: "Qu'est-ce que le Shadow IT ?", a: "Du matériel, un logiciel ou un service utilisé **sans l'accord de la DSI**. Pas malveillant par nature, mais crée des **vulnérabilités invisibles** et non gérées." },
    { q: "Qu'est-ce qui motive principalement le crime organisé ?", a: "Le **gain financier**. Très bien financé et sophistiqué, il est à l'origine de la majorité des **ransomwares**." },
    { q: "Citez les principales motivations d'un acteur de menace.", a: "**Data exfiltration**, **espionage**, **service disruption**, **blackmail**, **financial gain**, **philosophical/political beliefs**, **ethical**, **revenge**, **disruption/chaos**, **war**." },
    { q: "Qu'est-ce qu'un acteur « ethical » ?", a: "Un **hacker éthique** (white hat) qui teste la sécurité **avec autorisation** pour aider l'organisation à se protéger." },
    { q: "Quelle différence entre threat vector et attack surface ?", a: "L'**attack surface** est l'ensemble des points d'entrée possibles ; le **threat vector** est le **chemin précis** effectivement emprunté. On **réduit** la surface, on **bloque** le vecteur." },
    { q: "Citez les vecteurs de menace basés sur les messages.", a: "**Email**, **SMS** et **messagerie instantanée (IM)**. L'email reste le vecteur numéro un." },
    { q: "Pourquoi un système non supporté (unsupported system) est-il un vecteur de menace ?", a: "Parce qu'il ne reçoit **plus de correctifs de sécurité** : chaque nouvelle vulnérabilité découverte y reste **exploitable indéfiniment**." },
    { q: "Qu'est-ce qu'un vecteur d'attaque par supply chain ?", a: "Compromettre un **MSP, un fournisseur ou un prestataire** pour atteindre indirectement ses clients." },
    { q: "Quelle différence entre logiciel vulnérable client-based et agentless ?", a: "**Client-based** : un agent est installé sur le poste et doit être maintenu à jour. **Agentless** : aucune installation, mais la sécurité dépend entièrement du serveur." },
    { q: "Pourquoi les identifiants par défaut constituent-ils un vecteur majeur ?", a: "Parce qu'ils sont **publiquement documentés** dans les manuels constructeurs : un attaquant les teste en premier, sans aucun effort." },
    { q: "Qu'est-ce qu'un open service port en tant que vecteur ?", a: "Un **port ouvert et à l'écoute** qui expose un service au réseau. Chaque port inutile ouvert **élargit la surface d'attaque**." }
  ],

  /* --------------------------- 4. Physical Security ------------------------- */
  4: [
    { q: "À quoi sert un bollard ?", a: "C'est une **borne anti-bélier** : elle **arrête les véhicules** tout en laissant **passer les piétons**." },
    { q: "Qu'est-ce qu'un access control vestibule ?", a: "Un **sas à double porte interverrouillée** (mantrap) : une seule personne passe à la fois. Il empêche le **tailgating** et le **piggybacking**." },
    { q: "Quelle différence entre tailgating et piggybacking ?", a: "**Tailgating** : suivre quelqu'un **à son insu**. **Piggybacking** : entrer **avec son consentement** (on lui tient la porte)." },
    { q: "La vidéosurveillance est quel type de contrôle ?", a: "Un contrôle **detective** : elle **constate** l'événement, elle ne l'empêche pas. Sa présence visible ajoute un effet **deterrent**." },
    { q: "Quel est le seul contrôle physique capable de jugement discrétionnaire ?", a: "Le **garde de sécurité** : il peut analyser une situation imprévue et adapter sa réponse, ce qu'aucun dispositif automatique ne fait." },
    { q: "Citez les 4 types de capteurs à connaître et leur principe.", a: "**Infrared** (détecte la chaleur), **Pressure** (détecte le poids), **Microwave** (détecte le mouvement par ondes radio), **Ultrasonic** (détecte le mouvement par ondes sonores)." },
    { q: "L'éclairage (lighting) est quel type de contrôle ?", a: "Un contrôle **deterrent** : il décourage l'intrusion et améliore l'efficacité de la surveillance." },
    { q: "Qu'est-ce qu'un honeypot ?", a: "Un **système leurre** délibérément vulnérable, destiné à **attirer l'attaquant** pour le détecter et étudier ses méthodes." },
    { q: "Quelle différence entre honeypot, honeynet, honeyfile et honeytoken ?", a: "**Honeypot** = un système leurre. **Honeynet** = un **réseau entier** de leurres. **Honeyfile** = un **fichier appât**. **Honeytoken** = une **donnée factice traçable** qui déclenche une alerte si elle est utilisée." },
    { q: "Quel est l'objectif réel des technologies de tromperie (deception) ?", a: "**Détecter** l'intrusion et **étudier** le comportement de l'attaquant, pas le bloquer. Elles servent aussi à le **détourner** des vrais actifs." },
    { q: "Comment la hauteur d'une clôture influence-t-elle son rôle ?", a: "Environ 1 m **délimite** simplement, 2 m **dissuade** le passage occasionnel, plus de 2,4 m avec **barbelé** dissuade un intrus déterminé." },
    { q: "Qu'est-ce que le badge cloning et comment s'en protéger ?", a: "Copier un badge **RFID/NFC** à distance avec un lecteur. Protection : badges **chiffrés**, étuis blindés, et **MFA** ajoutant un code PIN ou la biométrie." },
    { q: "Qu'est-ce qu'une attaque physique par brute force ?", a: "Forcer **physiquement** une barrière : enfoncer une porte, couper un cadenas, briser une vitre." },
    { q: "Qu'est-ce qu'une attaque environnementale en sécurité physique ?", a: "S'attaquer aux **conditions d'environnement** plutôt qu'au système : couper la climatisation, l'électricité, ou provoquer une inondation." },
    { q: "Comment un attaquant contourne-t-il un système de vidéosurveillance ?", a: "En **obstruant** ou aveuglant l'objectif, en exploitant les **angles morts**, en coupant l'alimentation ou le réseau, ou en attaquant le **NVR** via ses identifiants par défaut." },
    { q: "Qu'est-ce qu'un access badge ?", a: "Un support d'identification (**RFID, NFC, magnétique ou à puce**) qui prouve l'identité et déclenche l'ouverture. C'est un facteur **« something you have »**." }
  ],

  /* -------------------------- 5. Social Engineering ------------------------- */
  5: [
    { q: "Comment distinguer phishing, vishing et smishing ?", a: "Par le **support utilisé** : **phishing** = email, **vishing** = appel vocal, **smishing** = SMS." },
    { q: "Quelle différence entre spear phishing et whaling ?", a: "Le **spear phishing** cible un **groupe ou une personne précise** ; le **whaling** cible spécifiquement un **dirigeant (C-level)**." },
    { q: "Qu'est-ce que le pretexting ?", a: "**Inventer un scénario crédible** pour justifier une demande d'information ou d'action (« je suis du support informatique, il y a un incident »)." },
    { q: "Qu'est-ce que le Business Email Compromise (BEC) ?", a: "La compromission d'une **boîte mail interne légitime** pour émettre des ordres frauduleux (virements). Très difficile à détecter car l'expéditeur est **authentique**." },
    { q: "Qu'est-ce qu'une attaque de type watering hole ?", a: "**Compromettre un site tiers légitime** que la cible visite habituellement, afin de l'infecter indirectement." },
    { q: "Qu'est-ce que le typosquatting ?", a: "Enregistrer un domaine avec une **faute de frappe proche** du domaine légitime (gogle.com) pour capturer les visiteurs distraits." },
    { q: "Quelle différence entre misinformation et disinformation ?", a: "La **misinformation** est fausse mais diffusée **sans intention de nuire** ; la **disinformation** est fausse et diffusée **délibérément** pour tromper." },
    { q: "Qu'est-ce que la brand impersonation ?", a: "**Usurper l'identité visuelle d'une marque** (logo, charte, ton) pour rendre une communication frauduleuse crédible." },
    { q: "Citez les principaux leviers psychologiques exploités en ingénierie sociale.", a: "**Authority**, **Urgency**, **Social proof**, **Scarcity**, **Likability**, **Fear**, **Familiarity**." },
    { q: "Pourquoi l'urgence est-elle le levier le plus employé ?", a: "Parce qu'elle **empêche la victime de réfléchir et de vérifier** : sous pression de temps, on court-circuite le raisonnement critique." },
    { q: "Quelle est la contre-mesure la plus efficace contre l'ingénierie sociale ?", a: "La **formation et la sensibilisation des utilisateurs**, renforcée par des **campagnes de phishing simulé** régulières." },
    { q: "Qu'est-ce que l'impersonation ?", a: "**Se faire passer pour quelqu'un d'autre** : un collègue, un prestataire, un responsable, pour obtenir un accès ou une information." },
    { q: "Qu'est-ce qu'une influence campaign ?", a: "Une opération coordonnée, souvent **étatique**, visant à **manipuler l'opinion publique** via les réseaux sociaux et les médias." },
    { q: "Quels signes doivent faire suspecter un email de phishing ?", a: "Adresse d'expéditeur **incohérente**, **urgence** artificielle, **fautes** de langue, lien dont l'URL réelle diffère du texte, **pièce jointe** inattendue, demande d'identifiants." },
    { q: "Qu'est-ce que le pharming ?", a: "Rediriger la victime vers un **faux site** en corrompant la **résolution DNS** ou le fichier hosts, sans qu'elle clique sur quoi que ce soit." },
    { q: "Que doit faire un utilisateur qui reçoit un message suspect ?", a: "Le **signaler** via le bouton dédié ou au SOC, **sans cliquer, sans répondre et sans le transférer** à des collègues." }
  ],

  /* -------------------------------- 6. Malware ------------------------------ */
  6: [
    { q: "Quelle différence fondamentale entre un virus et un ver (worm) ?", a: "Le **virus** a besoin d'un **fichier hôte** et d'une **action de l'utilisateur** ; le **ver se propage seul** sur le réseau, sans hôte ni interaction." },
    { q: "Quel indicateur réseau trahit typiquement un ver ?", a: "Une **saturation soudaine de la bande passante** et une multiplication des connexions entre machines internes." },
    { q: "Qu'est-ce qu'un cheval de Troie (trojan) ?", a: "Un programme qui **se fait passer pour un logiciel légitime** mais exécute une charge malveillante en arrière-plan." },
    { q: "Qu'est-ce qu'un RAT ?", a: "**Remote Access Trojan** : un cheval de Troie qui ouvre un **accès distant persistant** à l'attaquant, comme un outil d'administration clandestin." },
    { q: "Quelle est la meilleure défense contre un ransomware ?", a: "Des **sauvegardes hors ligne (offline / immuables), régulières et TESTÉES**. Payer la rançon ne garantit rien." },
    { q: "Qu'est-ce qu'un rootkit et pourquoi est-il si difficile à détecter ?", a: "Un malware qui obtient un **accès privilégié** et **se dissimule**, souvent en **mode noyau (kernel mode)** : il ment au système d'exploitation lui-même. Il faut souvent **démarrer sur un support externe** pour le détecter." },
    { q: "Qu'est-ce qu'une bombe logique (logic bomb) ?", a: "Du code malveillant dormant, **déclenché par une condition** : une date, un événement, ou la disparition d'un compte (typique d'un employé licencié)." },
    { q: "Qu'est-ce qu'un keylogger ?", a: "Un dispositif **logiciel ou matériel** qui **enregistre les frappes clavier** pour voler identifiants et données saisies." },
    { q: "Quelle différence entre spyware et bloatware ?", a: "Le **spyware espionne** l'activité à l'insu de l'utilisateur (malveillant). Le **bloatware** est un logiciel **préinstallé inutile** : pas malveillant, mais il **augmente la surface d'attaque**." },
    { q: "Qu'est-ce qu'un botnet et un zombie ?", a: "Un **zombie** est une machine compromise contrôlée à distance ; le **botnet** est le **réseau de zombies** piloté par un serveur **C2 (command and control)**." },
    { q: "À quoi sert un serveur C2 ?", a: "**Command and Control** : il **envoie les ordres** aux machines compromises et **reçoit les données exfiltrées**. Couper le C2 neutralise le botnet." },
    { q: "Qu'est-ce qu'une backdoor ?", a: "Un **accès dissimulé** contournant l'authentification normale, laissé par un attaquant ou par un développeur." },
    { q: "Citez les principaux indicateurs d'une infection par malware.", a: "**Lenteur anormale**, **pop-ups**, **trafic sortant inexpliqué**, **comptes créés**, **services de sécurité désactivés**, **fichiers chiffrés ou renommés**, **processus inconnus**." },
    { q: "Qu'est-ce qu'un malware polymorphe ?", a: "Un malware qui **modifie son propre code** à chaque infection pour **échapper à la détection par signature**." },
    { q: "Qu'est-ce qu'un fileless malware ?", a: "Un malware qui **s'exécute uniquement en mémoire**, sans écrire de fichier sur le disque, en détournant des outils légitimes comme **PowerShell** ou WMI." },
    { q: "Qu'est-ce que le crypto-malware ou cryptojacking ?", a: "Un malware qui utilise les **ressources de la machine pour miner de la cryptomonnaie**. Indicateur : **CPU/GPU à 100 %** sans raison." },
    { q: "Quelle est la différence entre ransomware et extorsion double ?", a: "Le **ransomware** chiffre les données. L'**extorsion double** ajoute l'**exfiltration** : l'attaquant menace aussi de **publier** les données volées." }
  ],

  /* ----------------------------- 7. Data Protection ------------------------- */
  7: [
    { q: "Quels sont les 3 états de la donnée ?", a: "**At rest** (stockée), **in transit / in motion** (en circulation), **in use** (en mémoire, en cours de traitement)." },
    { q: "Comment protège-t-on la donnée dans chacun de ses 3 états ?", a: "**At rest** : chiffrement de disque ou de fichier. **In transit** : TLS, IPSec, VPN. **In use** : chiffrement mémoire, **secure enclave**." },
    { q: "Citez les classifications de données du programme SY0-701.", a: "**Public**, **Private**, **Sensitive**, **Confidential**, **Critical**, **Restricted**." },
    { q: "Qu'est-ce que la data sovereignty ?", a: "Le principe selon lequel les données sont soumises aux **lois du pays où elles sont physiquement stockées**, quel que soit le siège de l'entreprise." },
    { q: "Quel est le rôle du data owner ?", a: "Le **responsable métier** de la donnée : il en assume la responsabilité finale et décide de sa **classification**." },
    { q: "Quelle différence entre data controller et data processor ?", a: "Le **controller décide des finalités** et des moyens du traitement ; le **processor traite pour le compte** du controller, sur instruction." },
    { q: "Que fait un data custodian ou steward ?", a: "Il **met en œuvre techniquement** la protection au quotidien : sauvegardes, droits d'accès, chiffrement. Il n'en est pas le propriétaire." },
    { q: "Qu'est-ce que la tokenisation ?", a: "Remplacer la donnée sensible par un **jeton sans valeur exploitable** ; la vraie donnée est conservée dans un **coffre séparé**. C'est **réversible** via ce coffre." },
    { q: "Quelle différence entre masking et tokenisation ?", a: "Le **masking** remplace **partiellement** la valeur (**\\*\\*\\*\\*-1234**) et est généralement **irréversible** ; la **tokenisation** substitue intégralement et reste **réversible** via le coffre." },
    { q: "Pourquoi le hachage ne protège-t-il pas la confidentialité ?", a: "Parce qu'il est **irréversible** : il sert à prouver l'**intégrité**, pas à restituer la donnée. On ne « déhache » pas." },
    { q: "Qu'est-ce que la stéganographie ?", a: "**Dissimuler** une information à l'intérieur d'un autre fichier (image, audio, vidéo) de sorte que son **existence même** reste invisible." },
    { q: "À quoi sert un système DLP ?", a: "**Data Loss Prevention** : détecter et **bloquer l'exfiltration** de données sensibles, qu'elle soit malveillante ou accidentelle." },
    { q: "Quelles sont les grandes familles de DLP ?", a: "**Endpoint DLP** (sur le poste), **Network DLP** (sur le trafic), **Storage DLP** (sur les serveurs de fichiers) et **Cloud DLP**." },
    { q: "Citez les types de données réglementées à connaître.", a: "**Regulated**, **trade secret**, **intellectual property**, **legal information**, **financial information**, ainsi que les données **human-readable** et **non-human-readable**." },
    { q: "Qu'est-ce qu'une restriction géographique (geofencing) ?", a: "Limiter l'accès aux données selon la **localisation géographique** de l'utilisateur ou de l'appareil." },
    { q: "Qu'est-ce que l'obfuscation ?", a: "Rendre une donnée **difficile à comprendre** sans la chiffrer réellement. Elle regroupe la **stéganographie**, la **tokenisation** et le **data masking**." },
    { q: "Quelle méthode de protection choisir pour permettre à des développeurs de tester sans exposer de vraies données clients ?", a: "Le **data masking** (ou la tokenisation) : le format reste réaliste et exploitable, mais la valeur réelle n'est jamais exposée." }
  ],

  /* ------------------------ 8. Cryptographic Solutions ---------------------- */
  8: [
    { q: "Quelle est la différence fondamentale entre chiffrement symétrique et asymétrique ?", a: "Le **symétrique** utilise **une seule clé partagée** (rapide, gros volumes) ; l'**asymétrique** utilise une **paire clé publique / clé privée** (lent, échange de clés et signature)." },
    { q: "Citez les principaux algorithmes symétriques.", a: "**AES** (128/192/256, la référence), **3DES**, **Blowfish**, **Twofish**, **RC4** (par flot, obsolète), **DES** (obsolète)." },
    { q: "Citez les principaux algorithmes asymétriques.", a: "**RSA**, **ECC** (courbes elliptiques), **Diffie-Hellman** (échange de clés), **ElGamal**, **DSA** (signature)." },
    { q: "Pour assurer la CONFIDENTIALITÉ, avec quelle clé chiffre-t-on ?", a: "Avec la **clé PUBLIQUE du destinataire**. Lui seul pourra déchiffrer avec sa **clé privée**." },
    { q: "Pour SIGNER un document, quelle clé utilise-t-on ?", a: "Sa **propre clé PRIVÉE**. N'importe qui vérifie ensuite avec la **clé publique** correspondante." },
    { q: "Que garantit une signature numérique ?", a: "L'**authenticité**, l'**intégrité** et la **non-répudiation**. Elle ne garantit **pas** la confidentialité." },
    { q: "Quel avantage décisif offre ECC par rapport à RSA ?", a: "Une **sécurité équivalente avec des clés bien plus courtes** : moins de calcul et d'énergie, idéal pour le **mobile et l'IoT**." },
    { q: "Citez les principales fonctions de hachage et leur taille d'empreinte.", a: "**MD5** = 128 bits (cassé), **SHA-1** = 160 bits (obsolète), **SHA-256** et **SHA-512**, **HMAC** (hachage combiné à une clé secrète)." },
    { q: "À quoi sert le salting et contre quelle attaque protège-t-il ?", a: "Ajouter une **valeur aléatoire unique** avant le hachage. Il rend inefficaces les **rainbow tables** et empêche deux mots de passe identiques de produire la même empreinte." },
    { q: "Qu'est-ce que le key stretching ?", a: "Rendre le calcul du hachage **volontairement lent et coûteux** pour freiner le cassage par force brute. Algorithmes : **PBKDF2**, **bcrypt**, **scrypt**, **Argon2**." },
    { q: "Quel est le rôle d'une CA dans une PKI ?", a: "L'**autorité de certification** **émet, signe et révoque** les certificats numériques. Elle est la **racine de confiance**." },
    { q: "Quelle différence entre CRL et OCSP ?", a: "La **CRL** est une **liste de révocation téléchargée périodiquement** (pouvant être périmée) ; l'**OCSP** interroge l'autorité **en temps réel** sur un certificat précis." },
    { q: "Qu'est-ce que l'OCSP stapling ?", a: "Le **serveur web fournit lui-même** la preuve OCSP de validité de son certificat, ce qui **évite au client de contacter la CA** : plus rapide et plus respectueux de la vie privée." },
    { q: "Que contient un CSR et que ne contient-il jamais ?", a: "Un **Certificate Signing Request** contient la **clé publique** et les informations d'identité. Il ne contient **JAMAIS la clé privée**." },
    { q: "Quelle différence entre un certificat wildcard et un certificat SAN ?", a: "Le **wildcard** (\\*.domaine.com) couvre tous les **sous-domaines d'un même niveau** ; le **SAN** couvre **plusieurs domaines différents** listés explicitement." },
    { q: "Quand un certificat auto-signé est-il acceptable ?", a: "Uniquement en **interne, test ou développement**. Sur Internet il déclenche une alerte car **aucune autorité de confiance ne le valide**." },
    { q: "Quelle différence entre TPM et HSM ?", a: "Le **TPM** est une **puce soudée à la carte mère d'UNE machine** (chiffrement de disque, boot mesuré). Le **HSM** est un **appareil dédié**, souvent amovible ou réseau, qui gère les clés **à grande échelle**." },
    { q: "Qu'est-ce qu'un secure enclave ?", a: "Une **zone isolée et protégée du processeur** qui traite les secrets (clés, biométrie) hors de portée du système d'exploitation." },
    { q: "Qu'est-ce que le key escrow ?", a: "Le **dépôt d'une copie des clés** auprès d'un tiers de confiance, permettant la **récupération** en cas de perte — au prix d'un risque si ce dépôt est compromis." },
    { q: "Qu'est-ce que la Perfect Forward Secrecy ?", a: "La garantie qu'une **clé de session compromise ne permet pas de déchiffrer les sessions passées**. Obtenue avec **DHE** et **ECDHE**." },
    { q: "Qu'est-ce qu'une attaque par downgrade ?", a: "Forcer les parties à négocier une **version de protocole ou un algorithme plus faible** afin de casser plus facilement le chiffrement." },
    { q: "Qu'est-ce qu'une collision et une birthday attack ?", a: "Une **collision** : **deux entrées différentes produisent la même empreinte**. La **birthday attack** exploite le **paradoxe des anniversaires** pour trouver une collision bien plus vite que prévu." },
    { q: "Qu'apporte la blockchain en matière de sécurité ?", a: "Un **registre distribué et immuable** : chaque bloc contient l'empreinte du précédent, ce qui rend toute modification **détectable**. C'est un **open public ledger**." },
    { q: "Quels sont les niveaux de chiffrement possibles ?", a: "**Full-disk**, **partition**, **volume**, **file**, **database** et **record**. Plus le niveau est fin, plus le contrôle est granulaire." }
  ],

  /* ----------------------------- 9. Risk Management ------------------------- */
  9: [
    { q: "Quelle est la formule du SLE ?", a: "**SLE = AV × EF** : la valeur de l'actif multipliée par le facteur d'exposition. C'est la perte pour **un seul incident**." },
    { q: "Quelle est la formule de l'ALE ?", a: "**ALE = SLE × ARO** : la perte par incident multipliée par la **fréquence annuelle d'occurrence**." },
    { q: "Un serveur vaut 50 000 €, un incendie en détruirait 40 %, et cela survient tous les 5 ans. Calculez SLE, ARO et ALE.", a: "**SLE** = 50 000 × 0,40 = **20 000 €**. **ARO** = 1/5 = **0,2**. **ALE** = 20 000 × 0,2 = **4 000 € par an**." },
    { q: "Comment juge-t-on qu'une contre-mesure est rentable ?", a: "Son **coût annuel doit être inférieur à la réduction d'ALE** qu'elle procure. Sinon on dépense plus que le risque ne coûte." },
    { q: "Quand privilégier une analyse qualitative ?", a: "Quand il faut aller **vite et à faible coût**, ou lorsque les données chiffrées manquent. Elle utilise des **échelles subjectives** et une matrice probabilité × impact." },
    { q: "Quels sont les avantages et limites de l'analyse quantitative ?", a: "Elle donne des **valeurs monétaires objectives** utiles à la décision budgétaire, mais elle est **longue, coûteuse** et dépend de la qualité des données." },
    { q: "Citez les 4 stratégies de traitement du risque.", a: "**Mitigate** (réduire), **Transfer** (assurer ou sous-traiter), **Avoid** (supprimer l'activité), **Accept** (assumer)." },
    { q: "Quelle stratégie de risque correspond à souscrire une cyber-assurance ?", a: "Le **transfert (transfer)** : on déplace l'impact financier vers un tiers. Attention, le risque **opérationnel demeure**." },
    { q: "Quelle différence entre risk appetite et risk tolerance ?", a: "Le **risk appetite** est le **niveau de risque global recherché** (expansionary, conservative, neutral) ; la **risk tolerance** est la **variation acceptable** autour de ce seuil." },
    { q: "Que contient un risk register ?", a: "Les **risques identifiés**, leur description, leur évaluation, les **KRI (key risk indicators)**, les **risk owners** et le **risk threshold**." },
    { q: "Qu'est-ce qu'un KRI ?", a: "Un **Key Risk Indicator** : une métrique **prédictive** qui signale qu'un risque augmente **avant** qu'il ne se matérialise." },
    { q: "Quelle différence entre RTO et RPO ?", a: "Le **RTO** est le **temps maximal acceptable pour remettre en service** ; le **RPO** est la **quantité maximale de données que l'on accepte de perdre** (il dicte la fréquence des sauvegardes)." },
    { q: "Quelle différence entre MTTR et MTBF ?", a: "Le **MTTR** est le **temps moyen de réparation** (rapidité de rétablissement) ; le **MTBF** est le **temps moyen entre deux pannes** (fiabilité de l'équipement)." },
    { q: "À quoi sert une BIA ?", a: "La **Business Impact Analysis** identifie les **fonctions critiques** de l'organisation et détermine les **RTO et RPO**. Elle **précède** le plan de continuité." },
    { q: "Quels sont les types de fréquence d'évaluation du risque ?", a: "**Ad hoc** (ponctuelle, suite à un événement), **recurring** (périodique), **one-time** (unique, pour un projet), **continuous** (permanente et automatisée)." },
    { q: "Quelle différence entre exemption et exception dans l'acceptation du risque ?", a: "L'**exception** est une **dérogation temporaire et justifiée** à une règle ; l'**exemption** est une **dispense formelle et durable** de s'y conformer." },
    { q: "Qu'est-ce que l'exposure factor (EF) ?", a: "Le **pourcentage de la valeur d'un actif perdu** lors d'un incident donné. Exprimé de 0 à 1 ou en pourcentage." },
    { q: "Quelle différence entre risque inhérent et risque résiduel ?", a: "Le **risque inhérent** est celui existant **avant tout contrôle** ; le **risque résiduel** est celui **qui subsiste après** application des contrôles." }
  ],

  /* ------------------------ 10. Third-party Vendor Risks -------------------- */
  10: [
    { q: "Qu'est-ce qu'un SLA et que contient-il ?", a: "**Service-Level Agreement** : un engagement **mesurable** sur le niveau de service (disponibilité, temps de réponse), assorti de **pénalités** en cas de manquement." },
    { q: "Qu'est-ce qu'un MOU et est-il contraignant ?", a: "**Memorandum of Understanding** : une **déclaration d'intention** décrivant un accord général. Il n'est **généralement pas juridiquement contraignant**." },
    { q: "Quelle différence entre MOU et MOA ?", a: "Le **MOA (Memorandum of Agreement)** est **plus formel** : il détaille les **rôles et responsabilités** de chaque partie et **peut être contraignant**." },
    { q: "À quoi sert un MSA ?", a: "Le **Master Service Agreement** est un **contrat-cadre** fixant les conditions générales applicables à **tous les travaux futurs**, ce qui évite de renégocier à chaque mission." },
    { q: "Quel est le lien entre MSA et SOW ?", a: "Le **MSA** fixe les **conditions générales** ; le **SOW (Statement of Work)** détaille, mission par mission, les **livrables, le calendrier et le périmètre**." },
    { q: "Qu'est-ce qu'un NDA ?", a: "**Non-Disclosure Agreement** : un accord de **confidentialité** interdisant la divulgation des informations échangées." },
    { q: "Qu'est-ce qu'un BPA ?", a: "**Business Partners Agreement** : il définit la relation entre partenaires — apports, **responsabilités**, **répartition des profits** et modalités de sortie." },
    { q: "Qu'est-ce qu'une right-to-audit clause et quand la négocier ?", a: "Une clause autorisant le client à **auditer le fournisseur**. Elle doit être négociée **AVANT la signature** : après, le fournisseur n'a plus aucune raison de l'accepter." },
    { q: "Qu'est-ce que la due diligence dans la sélection d'un fournisseur ?", a: "L'**enquête approfondie préalable** sur sa santé financière, sa réputation, sa conformité et sa posture de sécurité, **avant** de contractualiser." },
    { q: "Qu'est-ce qu'un conflict of interest chez un fournisseur ?", a: "Une situation où le fournisseur a un **intérêt personnel ou concurrent** susceptible de biaiser son objectivité (ex. auditer un système qu'il a lui-même vendu)." },
    { q: "Qu'est-ce qu'une attaque de la chaîne d'approvisionnement ?", a: "**Compromettre un fournisseur** (logiciel, matériel ou service) pour atteindre **tous ses clients** d'un coup. Cas emblématique : **SolarWinds**." },
    { q: "Quels éléments composent une vendor assessment ?", a: "**Penetration testing**, **right-to-audit clause**, **evidence of internal audits**, **independent assessments** et **supply chain analysis**." },
    { q: "Le vendor monitoring est-il ponctuel ou continu ?", a: "**Continu**. La conformité constatée à la signature ne garantit rien dans la durée : questionnaires réguliers, revues de performance et suivi des incidents." },
    { q: "À quoi servent les rules of engagement avec un prestataire ?", a: "Elles définissent le **périmètre autorisé, les horaires, les méthodes permises et les contacts** d'urgence. À signer **avant** toute intervention." },
    { q: "Quels sont les 3 grands types de fournisseurs à risque dans la supply chain ?", a: "Les **service providers** (MSP), les **hardware providers** et les **software providers**." },
    { q: "Pourquoi un MSP représente-t-il un risque particulier ?", a: "Parce qu'il détient des **accès privilégiés permanents** à vos systèmes : le compromettre revient à compromettre directement votre infrastructure." }
  ],

  /* ---------------------- 11. Governance and Compliance --------------------- */
  11: [
    { q: "Quelle est la hiérarchie documentaire en gouvernance ?", a: "**Policies** (le quoi et le pourquoi) → **Standards** (le niveau exigé) → **Procedures** (le comment, étape par étape) → **Guidelines** (recommandations)." },
    { q: "Quels documents de gouvernance sont obligatoires et lesquels sont facultatifs ?", a: "**Policies, standards et procedures sont obligatoires** ; les **guidelines sont des recommandations facultatives**." },
    { q: "Qu'est-ce qu'une AUP ?", a: "**Acceptable Use Policy** : la charte définissant ce que l'utilisateur a le **droit et l'interdiction de faire** avec les ressources de l'entreprise." },
    { q: "Citez les politiques de sécurité attendues dans une organisation.", a: "**Information security**, **business continuity**, **disaster recovery**, **incident response**, **SDLC** et **change management**." },
    { q: "Quels standards une organisation doit-elle formaliser ?", a: "Des standards de **password**, **access control**, **physical security** et **encryption**." },
    { q: "Qu'est-ce qu'un playbook ?", a: "Une **procédure détaillée et prête à l'emploi** décrivant les étapes à suivre pour un **type d'incident précis** (ex. playbook ransomware)." },
    { q: "Citez les types de structures de gouvernance.", a: "**Boards** (conseils d'administration), **committees** (comités), **government entities**, et les modèles **centralisé ou décentralisé**." },
    { q: "Quels sont les avantages et inconvénients d'une gouvernance centralisée ?", a: "**Avantages** : cohérence, contrôle fort, standards uniformes. **Inconvénients** : lenteur de décision, faible adaptation aux besoins locaux." },
    { q: "Quels sont les avantages et inconvénients d'une gouvernance décentralisée ?", a: "**Avantages** : agilité, réactivité, proximité du terrain. **Inconvénients** : incohérences, duplication et lacunes de contrôle." },
    { q: "Citez les conséquences possibles d'une non-conformité.", a: "**Fines** (amendes), **sanctions**, **reputational damage**, **loss of license** et **contractual impacts**." },
    { q: "Quelle différence entre due diligence et due care ?", a: "La **due diligence** consiste à **enquêter et vérifier AVANT d'agir** ; la **due care** consiste à **agir raisonnablement et de façon continue** ensuite." },
    { q: "Qu'est-ce que l'attestation and acknowledgement en conformité ?", a: "La **signature formelle** par laquelle une personne confirme avoir **pris connaissance** des règles et s'engage à les respecter. Elle crée une **responsabilité traçable**." },
    { q: "Qu'est-ce que le droit à l'effacement (right to be forgotten) ?", a: "Le droit, pour une personne, d'exiger la **suppression de ses données personnelles**. Pilier du **RGPD**." },
    { q: "Qui est le data subject au sens du RGPD ?", a: "La **personne physique** à laquelle se rapportent les données personnelles." },
    { q: "Citez les considérations externes qui s'imposent à la gouvernance.", a: "**Regulatory**, **legal**, **industry**, **local/regional**, **national** et **global**." },
    { q: "Pourquoi la gouvernance doit-elle inclure monitoring and revision ?", a: "Parce qu'une politique **non révisée devient obsolète** face aux évolutions techniques, réglementaires et organisationnelles : elle donne alors une **fausse impression de conformité**." },
    { q: "Quelle différence entre compliance reporting interne et externe ?", a: "Le **reporting interne** informe la **direction et les comités** pour piloter ; le **reporting externe** s'adresse aux **régulateurs, auditeurs et clients** et engage juridiquement." }
  ],

  /* ------------------- 12. Asset and Change Management --------------------- */
  12: [
    { q: "Quelles sont les grandes étapes du processus de change management ?", a: "**Demande** → **analyse d'impact** → **approbation (CAB)** → **test** → **planification de la fenêtre** → **mise en œuvre** → **documentation**." },
    { q: "Qu'est-ce qu'un backout plan et pourquoi est-il obligatoire ?", a: "Le **plan de retour arrière** décrivant comment **revenir à l'état antérieur** si le changement échoue. Sans lui, un échec devient une **panne prolongée**." },
    { q: "Qu'est-ce qu'une maintenance window ?", a: "Un **créneau planifié et communiqué** pendant lequel l'interruption de service est **acceptée**, généralement en dehors des heures de production." },
    { q: "Qu'est-ce qu'une SOP ?", a: "**Standard Operating Procedure** : un **mode opératoire normalisé** garantissant que la même tâche est exécutée de façon identique par tous." },
    { q: "Citez les implications techniques d'un changement.", a: "**Allow lists / deny lists**, **restricted activities**, **downtime**, **service restart**, **application restart**, **legacy applications** et **dependencies**." },
    { q: "Pourquoi une allow list est-elle plus sûre qu'une deny list ?", a: "L'**allow list interdit tout par défaut** et n'autorise que l'explicitement listé ; la **deny list autorise tout** sauf ce qui est listé, et laisse donc passer **tout ce qui est inconnu**." },
    { q: "Que faut-il impérativement mettre à jour après un changement ?", a: "Les **diagrammes** d'architecture **et** les **politiques et procédures**. Une documentation périmée est en soi une **vulnérabilité**." },
    { q: "Pourquoi les dépendances sont-elles critiques dans un changement ?", a: "Parce que modifier un composant peut **casser silencieusement** les systèmes qui en dépendent : l'analyse d'impact doit les cartographier au préalable." },
    { q: "À quoi sert le version control dans la gestion des changements ?", a: "À **tracer chaque version**, savoir **qui a modifié quoi et quand**, et pouvoir **revenir en arrière** rapidement." },
    { q: "Quelles sont les étapes du cycle de vie d'un actif ?", a: "**Acquisition/procurement** → **assignation** (owner, classification) → **suivi d'inventaire** → **mise hors service** → **destruction**." },
    { q: "Quelle différence entre sanitization et destruction ?", a: "La **sanitization efface les données** de façon irrécupérable en **conservant le média** (wiping, degaussing, cryptographic erase) ; la **destruction détruit physiquement** le média (broyage, incinération, pulvérisation)." },
    { q: "Pourquoi le degaussing ne fonctionne-t-il pas sur un SSD ?", a: "Parce qu'un SSD stocke en **mémoire flash, sans magnétisme**. Il faut un **cryptographic erase** ou une **destruction physique**." },
    { q: "Qu'est-ce qu'un certificate of destruction ?", a: "La **preuve documentaire** qu'un média a bien été détruit, mentionnant la méthode, la date et le responsable. Indispensable pour la **conformité**." },
    { q: "Qu'est-ce que le cryptographic erase ?", a: "**Détruire la clé de chiffrement** d'un support chiffré : les données subsistent physiquement mais deviennent **définitivement indéchiffrables**. Rapide et efficace sur SSD." },
    { q: "Que recouvre l'enumeration dans le suivi des actifs ?", a: "Le **recensement automatisé** de tous les composants présents : matériels, logiciels, versions et configurations." },
    { q: "Pourquoi la data retention est-elle un enjeu de sécurité ?", a: "Conserver **trop longtemps** augmente l'exposition en cas de fuite ; **pas assez longtemps** viole les obligations légales et prive d'éléments d'investigation." },
    { q: "Qu'est-ce qu'un CAB ?", a: "**Change Advisory Board** : le comité qui **évalue et approuve** les changements en pesant le bénéfice attendu contre le risque encouru." }
  ],

  /* ---------------------- 13. Audits and Assessments ----------------------- */
  13: [
    { q: "Quelle est la finalité d'un audit interne ?", a: "La **préparation et l'amélioration continue** : détecter les écarts avant qu'un auditeur externe ou un régulateur ne les découvre." },
    { q: "Quels sont les composants d'un audit interne ?", a: "L'équipe **compliance**, l'**audit committee** et les **self-assessments** réalisés par les équipes elles-mêmes." },
    { q: "Quelle est la finalité d'un audit externe ?", a: "Apporter une **crédibilité indépendante** et démontrer la **conformité** aux régulateurs, clients et partenaires." },
    { q: "Citez les formes d'audit externe.", a: "**Regulatory** (imposé par un régulateur), **examinations**, **assessment** et **independent third-party audit**." },
    { q: "Qu'est-ce que l'attestation of findings ?", a: "Une **déclaration formelle et signée** affirmant que les conclusions d'un audit sont exactes. Elle **engage la responsabilité** du signataire." },
    { q: "Qu'est-ce qu'un pentest en known environment ?", a: "Le testeur dispose de **toutes les informations** (architecture, code, identifiants). Approche **rapide et exhaustive**, dite white box." },
    { q: "Qu'est-ce qu'un pentest en unknown environment ?", a: "Le testeur ne dispose d'**aucune information** : il simule un **attaquant externe réaliste**. Approche black box, plus longue mais très représentative." },
    { q: "Qu'est-ce qu'un pentest en partially known environment ?", a: "Le testeur dispose d'**informations partielles**. C'est le **meilleur compromis** entre réalisme et efficacité, dit gray box." },
    { q: "Quelle différence entre reconnaissance passive et active ?", a: "La **passive** collecte **sans interagir** avec la cible (OSINT, WHOIS, réseaux sociaux) et reste **indétectable** ; l'**active** interagit directement (scan de ports, énumération) et est **détectable**." },
    { q: "Citez les types de tests d'intrusion selon la posture.", a: "**Physical**, **offensive** (red team), **defensive** (blue team) et **integrated** (purple team, les deux collaborent)." },
    { q: "Que fait une red team, une blue team et une purple team ?", a: "La **red team attaque**, la **blue team défend et détecte**, la **purple team fait collaborer les deux** pour améliorer la détection en continu." },
    { q: "Pourquoi les rules of engagement sont-elles indispensables avant un pentest ?", a: "Elles définissent le **périmètre, les horaires, les méthodes autorisées et les contacts d'urgence**. Sans elles, le test peut être **illégal** ou provoquer une panne non couverte." },
    { q: "Qu'est-ce qu'un system/process audit ?", a: "Un examen vérifiant qu'un système ou un processus **fonctionne comme prévu et respecte les politiques** définies." },
    { q: "Quelle différence entre un audit et un test d'intrusion ?", a: "L'**audit vérifie la conformité** à un référentiel (documentaire et déclaratif) ; le **pentest exploite réellement** les failles pour démontrer l'impact concret." }
  ],

  /* ------------------ 14. Cyber Resilience and Redundancy ------------------ */
  14: [
    { q: "Comparez hot site, warm site et cold site.", a: "**Hot** : réplique opérationnelle, données à jour, bascule en **minutes/heures**, le plus cher. **Warm** : matériel prêt, données à restaurer, bascule en **heures/jours**. **Cold** : local vide, bascule en **jours/semaines**, le moins cher." },
    { q: "Quelle différence entre load balancing et clustering ?", a: "Le **load balancing répartit la charge** entre plusieurs serveurs actifs ; le **clustering** fait apparaître plusieurs serveurs comme **un seul système** avec **bascule automatique** en cas de panne." },
    { q: "Que fait le RAID 0 et quelle est sa limite ?", a: "Du **striping** : il améliore les performances mais n'offre **AUCUNE tolérance de panne**. La perte d'un seul disque détruit tout le volume." },
    { q: "Comparez RAID 1, RAID 5, RAID 6 et RAID 10.", a: "**RAID 1** = miroir. **RAID 5** = striping + parité distribuée, tolère **1 disque**. **RAID 6** = double parité, tolère **2 disques**. **RAID 10** = miroir + striping, performance et tolérance." },
    { q: "Pourquoi le RAID n'est-il pas une sauvegarde ?", a: "Parce qu'il **réplique instantanément toute opération**, y compris une **suppression** ou un **chiffrement par ransomware**. Il protège de la panne matérielle, pas de l'erreur ni de l'attaque." },
    { q: "En quoi consiste la règle 3-2-1 des sauvegardes ?", a: "**3 copies** des données, sur **2 supports différents**, dont **1 hors site**." },
    { q: "Comparez sauvegarde full, incrémentale et différentielle.", a: "**Full** : tout, longue à faire, restauration en **1 jeu**. **Incremental** : depuis la **dernière sauvegarde quelconque**, rapide à faire, restauration **lente** (full + tous les incréments). **Differential** : depuis le dernier **full**, restauration en **2 jeux**." },
    { q: "Quel type de sauvegarde offre la restauration la plus rapide après un full ?", a: "La **différentielle** : il suffit du **dernier full + la dernière différentielle**, soit deux jeux seulement." },
    { q: "Quelle différence entre snapshot, replication et journaling ?", a: "**Snapshot** = image figée à un instant T. **Replication** = copie **continue** vers un autre site. **Journaling** = enregistrement des **transactions** permettant de rejouer ou d'annuler." },
    { q: "Quelle différence entre un UPS et un générateur ?", a: "L'**UPS fournit une alimentation immédiate mais courte** (batteries, quelques minutes) ; le **générateur fournit une alimentation longue durée** mais avec un **délai de démarrage**. Ils sont **complémentaires**." },
    { q: "Citez les 4 types de tests de continuité.", a: "**Tabletop exercise** (discussion sur scénario), **simulation** (mise en situation), **fail over** (bascule réelle), **parallel processing** (le site de secours tourne **en parallèle** sans couper la production)." },
    { q: "Quel test de continuité présente le moins de risque pour la production ?", a: "Le **tabletop exercise** : purement discursif, il ne touche à aucun système et coûte très peu." },
    { q: "Qu'est-ce que la geographic dispersion et pourquoi est-elle nécessaire ?", a: "**Éloigner géographiquement les sites** pour qu'un même sinistre (séisme, inondation, panne régionale) ne puisse pas les affecter **simultanément**." },
    { q: "Que recouvre le capacity planning ?", a: "Anticiper les besoins en **people** (effectifs et compétences), **technology** (matériel et licences) et **infrastructure** (énergie, espace, bande passante)." },
    { q: "Qu'est-ce que la platform diversity et quel bénéfice apporte-t-elle ?", a: "Utiliser des **technologies et fournisseurs variés** afin qu'une **vulnérabilité unique** ou la défaillance d'un fournisseur **n'affecte pas tout le parc**." },
    { q: "Pourquoi une architecture multi-cloud améliore-t-elle la résilience ?", a: "Elle **supprime la dépendance à un fournisseur unique** : la panne d'un cloud n'interrompt pas tout le service. En contrepartie elle augmente la **complexité**." },
    { q: "Qu'est-ce qu'un COOP ?", a: "**Continuity of Operations Plan** : le plan garantissant que les **fonctions essentielles** se poursuivent pendant une perturbation majeure." }
  ],

  /* ------------------------ 15. Security Architecture --------------------- */
  15: [
    { q: "Que gère le client dans chacun des modèles IaaS, PaaS et SaaS ?", a: "**IaaS** : l'OS, les applications et les données. **PaaS** : les applications et les données. **SaaS** : uniquement ses **données et ses accès**." },
    { q: "Quelle responsabilité reste TOUJOURS au client, quel que soit le modèle cloud ?", a: "Ses **données** et la **gestion des identités et des accès**. Le fournisseur ne les assume jamais à sa place." },
    { q: "Quelle différence entre hyperviseur de type 1 et de type 2 ?", a: "Le **type 1 (bare metal)** s'exécute **directement sur le matériel** : performant et plus sûr, usage serveur. Le **type 2 (hosted)** s'exécute **sur un OS existant** : pratique pour le poste de travail, surface d'attaque plus large." },
    { q: "Quelle différence entre virtualisation et conteneurisation ?", a: "Une **VM embarque un OS complet** sur un hyperviseur (isolation forte, lourd) ; un **conteneur partage le noyau de l'hôte** (léger et rapide, mais **isolation plus faible**)." },
    { q: "Qu'est-ce qu'une VM escape ?", a: "S'**échapper d'une machine virtuelle** pour atteindre l'**hyperviseur** ou les **autres VM** du même hôte. C'est la vulnérabilité la plus grave en virtualisation." },
    { q: "Qu'est-ce que le resource reuse dans un environnement virtualisé ?", a: "Récupérer des **données résiduelles** dans de la mémoire ou du stockage **réattribué** à un autre locataire sans avoir été correctement effacé." },
    { q: "Quels avantages et risques présente le serverless ?", a: "**Avantages** : plus d'infrastructure à gérer ni à patcher, surface d'attaque réduite, coût à l'usage. **Risques** : **dépendance forte au fournisseur** (vendor lock-in) et visibilité réduite." },
    { q: "Quel est l'intérêt sécurité des microservices ?", a: "Chaque service est **indépendant et isolé** : une compromission reste **circonscrite**. En contrepartie, ils **multiplient les interfaces** (API) à sécuriser." },
    { q: "Qu'est-ce que l'Infrastructure as Code ?", a: "Décrire l'infrastructure dans du **code versionné** : les déploiements deviennent **reproductibles, auditables** et la **dérive de configuration** disparaît." },
    { q: "Que sépare le SDN et quel bénéfice en tire-t-on ?", a: "Il sépare le **control plane** (la décision de routage) du **data plane** (le transfert effectif), permettant un **pilotage centralisé et programmable** du réseau." },
    { q: "Qu'est-ce qu'un système air-gapped ?", a: "Un système **physiquement isolé, sans aucune connexion réseau**. C'est la protection la plus forte, mais elle reste contournable par les **supports amovibles**." },
    { q: "Quelle différence entre isolation physique et segmentation logique ?", a: "L'**isolation physique** sépare par du **matériel distinct** (air gap) ; la **segmentation logique** sépare par configuration (**VLAN**, sous-réseaux) sur une infrastructure partagée." },
    { q: "Quelle est la priorité de sécurité dans un environnement ICS/SCADA ?", a: "La **disponibilité et la sûreté** avant la confidentialité : un arrêt de production peut être **dangereux** pour les personnes." },
    { q: "Pourquoi les systèmes ICS/SCADA sont-ils difficiles à sécuriser ?", a: "Ils sont **anciens**, tournent en **continu** (fenêtres de maintenance rares), et sont souvent **impossibles à patcher**. On compense par la **segmentation** et des **compensating controls**." },
    { q: "Qu'est-ce qu'un RTOS et quelle est sa contrainte principale ?", a: "**Real-Time Operating System** : il doit répondre dans un **délai déterministe garanti**. Ressources limitées et mises à jour délicates car toute latence est inacceptable." },
    { q: "Pourquoi les objets IoT sont-ils des cibles privilégiées ?", a: "**Identifiants par défaut**, **puissance de calcul limitée** empêchant un chiffrement fort, **absence de mises à jour** et déploiement massif : idéals pour constituer un **botnet**." },
    { q: "Citez les considérations à comparer entre modèles d'architecture.", a: "**Availability**, **resilience**, **cost**, **responsiveness**, **scalability**, **ease of deployment**, **risk transference**, **ease of recovery**, **patch availability**, **inability to patch**, **power** et **compute**." },
    { q: "Quels sont les avantages et inconvénients d'une architecture centralisée ?", a: "**Avantages** : contrôle, cohérence, supervision simplifiée. **Inconvénients** : **point unique de défaillance** et goulet d'étranglement." }
  ],

  /* ----------------------- 16. Security Infrastructure -------------------- */
  16: [
    { q: "Quelle différence entre un pare-feu de couche 4 et un NGFW ?", a: "Le **layer 4** filtre sur **IP et port** uniquement ; le **NGFW / layer 7** **inspecte le contenu applicatif** et identifie l'application **quel que soit le port** utilisé." },
    { q: "À quoi sert un WAF ?", a: "**Web Application Firewall** : protéger spécifiquement les **applications web** contre les attaques applicatives comme la **SQLi** et le **XSS**." },
    { q: "Qu'est-ce qu'un UTM ?", a: "**Unified Threat Management** : un boîtier **tout-en-un** (pare-feu, antivirus, IDS/IPS, filtrage web, VPN). Simple à gérer, mais **point unique de défaillance**." },
    { q: "Quelle différence fondamentale entre IDS et IPS ?", a: "L'**IDS détecte et alerte** (passif, en **dérivation / tap**) ; l'**IPS détecte et BLOQUE** (actif, **en ligne / inline** sur le trafic)." },
    { q: "Comparez détection par signature et détection par anomalie.", a: "La **signature** est fiable sur les menaces **connues** mais aveugle au **zero-day** ; l'**anomalie** détecte l'inconnu en s'écartant d'une base comportementale, mais génère plus de **faux positifs**." },
    { q: "Quelle différence entre faux positif et faux négatif, et lequel est le plus dangereux ?", a: "Le **faux positif** alerte sur du trafic légitime (perte de temps) ; le **faux négatif** **laisse passer une attaque réelle** — c'est **le plus dangereux**." },
    { q: "À quoi sert un jump server ?", a: "C'est un **point de rebond unique, durci et surveillé** par lequel transitent tous les accès administratifs vers une zone sensible. Il **concentre et journalise** les accès privilégiés." },
    { q: "Quelle différence entre forward proxy et reverse proxy ?", a: "Le **forward proxy protège les clients** qui sortent vers Internet (filtrage, anonymisation) ; le **reverse proxy protège les serveurs** en recevant les requêtes entrantes (répartition, terminaison TLS)." },
    { q: "Quels sont les 3 acteurs du 802.1X ?", a: "Le **supplicant** (le client qui demande l'accès), l'**authenticator** (le switch ou le point d'accès) et l'**authentication server** (généralement un serveur **RADIUS**)." },
    { q: "Quel est le rôle d'EAP dans le 802.1X ?", a: "**Extensible Authentication Protocol** est le **cadre d'échange** qui transporte les méthodes d'authentification (PEAP, EAP-TLS, EAP-TTLS)." },
    { q: "Quelle différence entre fail-open et fail-closed ?", a: "En **fail-open**, la panne laisse **passer le trafic** (priorité à la **disponibilité**) ; en **fail-closed**, la panne **bloque tout** (priorité à la **sécurité**)." },
    { q: "Quelle différence entre un équipement actif et passif, inline et tap ?", a: "**Actif** : il **agit** sur le trafic. **Passif** : il **observe** seulement. **Inline** : placé **sur le chemin** du trafic. **Tap/monitor** : en **dérivation**, il reçoit une copie." },
    { q: "Quelle différence entre VPN site-to-site et remote access ?", a: "Le **site-to-site relie deux réseaux** en permanence (deux agences) ; le **remote access relie un utilisateur nomade** au réseau de l'entreprise." },
    { q: "Comparez full tunnel et split tunnel.", a: "**Full tunnel** : **tout** le trafic passe par le VPN — plus sûr, mais consomme de la bande passante. **Split tunnel** : seul le trafic d'entreprise y passe — performant, mais le poste est **exposé directement** à Internet." },
    { q: "Quelle différence entre AH et ESP dans IPSec ?", a: "**AH** assure l'**intégrité et l'authentification SANS chiffrement** ; **ESP** assure le **chiffrement** (et peut aussi authentifier). Pour la confidentialité, il faut **ESP**." },
    { q: "Quelle différence entre le mode tunnel et le mode transport d'IPSec ?", a: "Le **mode tunnel chiffre le paquet IP entier** et en ajoute un nouveau (VPN site-à-site) ; le **mode transport ne chiffre que la charge utile** en conservant l'en-tête d'origine." },
    { q: "Qu'est-ce que le SASE et que combine-t-il ?", a: "**Secure Access Service Edge** : le **SD-WAN combiné à des services de sécurité cloud** (SWG, CASB, ZTNA, FWaaS) délivrés **en périphérie**, au plus près de l'utilisateur." },
    { q: "Quel est l'apport principal du SD-WAN ?", a: "**Optimiser et piloter par logiciel** les liaisons WAN entre sites, en choisissant dynamiquement le meilleur chemin et en réduisant la dépendance au MPLS." },
    { q: "Qu'est-ce qu'un screened subnet ?", a: "Anciennement appelé **DMZ** : une **zone tampon** entre Internet et le réseau interne, hébergeant les services publics (web, mail) et isolée par des pare-feux." },
    { q: "Pourquoi placer un IPS en amont ou en aval du pare-feu change-t-il son rôle ?", a: "**En amont**, il voit **tout le trafic** brut (beaucoup de bruit) ; **en aval**, il n'analyse que ce que le pare-feu a **déjà autorisé** — plus pertinent et moins bruyant." }
  ],

  /* --------------- 17. Identity and Access Management (IAM) --------------- */
  17: [
    { q: "Citez les 4 facteurs d'authentification.", a: "Something you **KNOW** (mot de passe), something you **HAVE** (token, carte), something you **ARE** (biométrie), somewhere you **ARE** (géolocalisation)." },
    { q: "Mot de passe + question secrète : est-ce du MFA ?", a: "**NON.** Les deux relèvent du facteur **« something you know »**. Le MFA exige des facteurs de **catégories différentes**." },
    { q: "Qu'est-ce que le modèle MAC et où l'utilise-t-on ?", a: "**Mandatory Access Control** : le **système impose** les accès selon des **labels de classification**. Le plus strict, utilisé dans les environnements **militaires et gouvernementaux**." },
    { q: "Qu'est-ce que le modèle DAC ?", a: "**Discretionary Access Control** : le **propriétaire du fichier décide** qui y accède. Le plus **souple** mais le **moins sûr** (risque d'erreur humaine)." },
    { q: "Qu'est-ce que le modèle RBAC et pourquoi domine-t-il en entreprise ?", a: "**Role-Based Access Control** : les droits sont attribués via des **rôles métier**, pas individuellement. Il **simplifie massivement** l'administration lors des arrivées et départs." },
    { q: "Qu'est-ce que le modèle ABAC ?", a: "**Attribute-Based Access Control** : la décision combine des **attributs** de l'utilisateur, de la ressource et de l'environnement (heure, lieu, appareil). Le plus **granulaire et dynamique**." },
    { q: "Qu'est-ce que le Rule-Based Access Control ?", a: "L'accès est déterminé par des **règles conditionnelles appliquées par le système**, identiques pour tous (ex. une ACL, une restriction horaire)." },
    { q: "Quelle différence essentielle entre OAuth et SAML ?", a: "**OAuth = AUTORISATION** (déléguer l'accès à une ressource sans partager son mot de passe) ; **SAML = AUTHENTIFICATION** fédérée par assertions **XML**." },
    { q: "Qu'est-ce qu'OpenID Connect ?", a: "Une **couche d'AUTHENTIFICATION construite au-dessus d'OAuth 2.0**. OAuth seul n'authentifie pas ; OIDC comble ce manque." },
    { q: "Qu'est-ce que la fédération d'identité ?", a: "**Faire confiance aux identités d'un autre domaine** via un **IdP (Identity Provider)**. Le **SP (Service Provider)** consomme l'assertion sans gérer lui-même les comptes." },
    { q: "Comment fonctionne Kerberos ?", a: "Authentification par **tickets** délivrés par un **KDC**. L'utilisateur obtient un **TGT** puis des tickets de service. Utilise le port **88** et exige des **horloges synchronisées**." },
    { q: "Qu'est-ce que le just-in-time permissions en PAM ?", a: "Accorder les droits privilégiés **temporairement, à la demande et pour une durée limitée**, au lieu de les laisser attribués en permanence." },
    { q: "Qu'est-ce que le password vaulting ?", a: "Stocker les identifiants privilégiés dans un **coffre-fort centralisé** : l'administrateur ne connaît jamais le mot de passe réel, qui est **injecté et changé automatiquement**." },
    { q: "Que sont des ephemeral credentials ?", a: "Des identifiants à **durée de vie très courte**, générés à la demande et **expirant automatiquement** : même volés, ils deviennent vite inutilisables." },
    { q: "Quelle différence entre least privilege et separation of duties ?", a: "Le **least privilege** limite chaque compte aux **droits strictement nécessaires** ; la **separation of duties** **découpe une tâche sensible entre plusieurs personnes** pour qu'aucune ne puisse agir seule." },
    { q: "Qu'est-ce que le privilege creep et comment le corriger ?", a: "L'**accumulation de droits** au fil des mutations, sans jamais retirer les anciens. Correction : **revues d'accès périodiques** et **de-provisioning rigoureux**." },
    { q: "Qu'est-ce que l'identity proofing ?", a: "**Vérifier que la personne est réellement celle qu'elle prétend être AVANT de créer son compte** (pièce d'identité, vérification en personne)." },
    { q: "Que signifient FAR, FRR et CER en biométrie ?", a: "**FAR** : taux d'acceptation d'un imposteur (**risque sécurité**). **FRR** : taux de rejet d'un légitime (**risque ergonomie**). **CER/EER** : point où FAR = FRR, sert à **comparer** les systèmes." },
    { q: "Entre un FAR élevé et un FRR élevé, lequel est le plus grave pour la sécurité ?", a: "Un **FAR élevé** : il laisse **entrer des imposteurs**. Un FRR élevé n'est qu'une gêne pour les utilisateurs légitimes." },
    { q: "Citez les bonnes pratiques de mot de passe selon CompTIA.", a: "**Length** (la longueur prime sur la complexité), **complexity**, interdiction du **reuse**, **expiration** raisonnée et **age** minimal. Complétées par les **password managers** et le **passwordless**." },
    { q: "Qu'est-ce que l'attestation en IAM ?", a: "La **revue et validation formelle et périodique** des droits d'accès par les responsables, qui confirment que chaque accès est toujours justifié." },
    { q: "Que recouvre le provisioning et le de-provisioning ?", a: "Le **provisioning crée et attribue** les comptes et droits à l'arrivée ; le **de-provisioning les révoque immédiatement** au départ. Un de-provisioning négligé laisse des **comptes orphelins** exploitables." }
  ],

  /* -------------------- 18. Vulnerabilities and Attacks ------------------- */
  18: [
    { q: "Qu'est-ce qu'un buffer overflow ?", a: "**Écrire au-delà de la mémoire allouée** à un tampon, écrasant les données adjacentes pour **détourner l'exécution** du programme." },
    { q: "Quelles sont les contre-mesures contre le buffer overflow ?", a: "La **validation des entrées** et le contrôle de longueur, plus les protections système **ASLR** (randomisation mémoire) et **DEP** (interdiction d'exécuter des données)." },
    { q: "Qu'est-ce qu'une race condition ?", a: "Une faille où le **résultat dépend de l'ordre d'exécution** de deux opérations concurrentes non synchronisées." },
    { q: "Qu'est-ce que le TOC/TOU ?", a: "**Time-of-Check to Time-of-Use** : l'**état change entre le moment de la vérification et celui de l'utilisation**, permettant à un attaquant de substituer la ressource entre les deux." },
    { q: "Qu'est-ce que la memory injection ?", a: "**Injecter du code dans l'espace mémoire d'un processus en cours d'exécution**, afin de profiter de ses privilèges légitimes." },
    { q: "Quelle est la contre-mesure principale contre l'injection SQL ?", a: "Les **requêtes paramétrées (prepared statements)**, complétées par la **validation des entrées** et le **moindre privilège** sur le compte de base de données." },
    { q: "Quels sont les 3 types de XSS ?", a: "**Stored** (persistant, stocké en base et servi à tous), **Reflected** (renvoyé immédiatement dans la réponse via un lien piégé) et **DOM-based** (exécuté côté client uniquement)." },
    { q: "Quelle différence entre XSS et CSRF ?", a: "Le **XSS exploite la confiance de l'UTILISATEUR envers le site** (on injecte du script chez la victime) ; le **CSRF exploite la confiance du SITE envers l'utilisateur** (on force une action authentifiée à son insu)." },
    { q: "Quelle est la contre-mesure contre le CSRF ?", a: "Les **jetons anti-CSRF** uniques par session et les cookies **SameSite**, complétés par une reconfirmation pour les actions sensibles." },
    { q: "Qu'est-ce qu'une vulnérabilité zero-day ?", a: "Une faille **inconnue de l'éditeur**, pour laquelle **aucun correctif n'existe**. Les détections **par signature sont inopérantes** : seule l'analyse comportementale peut la repérer." },
    { q: "Quelle différence entre jailbreaking, rooting et side loading ?", a: "**Jailbreaking (iOS)** et **rooting (Android)** retirent les **restrictions du fabricant** ; le **side loading** installe une application **hors du magasin officiel**." },
    { q: "Comparez bluejacking, bluesnarfing et bluebugging.", a: "**Bluejacking** : envoi de **messages non sollicités** (nuisance). **Bluesnarfing** : **VOL de données**. **Bluebugging** : **prise de contrôle** de l'appareil." },
    { q: "Pourquoi le matériel end-of-life ou legacy est-il un risque permanent ?", a: "Parce qu'il **ne reçoit plus de correctifs** : chaque nouvelle faille y demeure exploitable. On compense par la **segmentation** et une surveillance renforcée." },
    { q: "Qu'est-ce qu'une malicious update ?", a: "Une **mise à jour piégée** distribuée via un canal légitime compromis. Contre-mesure : **signature de code** et **vérification d'intégrité** avant installation." },
    { q: "Pourquoi la misconfiguration est-elle une cause majeure de compromission ?", a: "Parce qu'elle est **fréquente et facile à exploiter** : identifiants par défaut, permissions trop larges, buckets cloud publics, services inutiles laissés actifs." },
    { q: "Quelles sont les vulnérabilités spécifiques au cloud ?", a: "**Mauvaise configuration** des accès et du stockage, **API non sécurisées**, **gestion des identités** défaillante et confusion sur le **modèle de responsabilité partagée**." },
    { q: "Qu'est-ce qu'une injection XML / XXE ?", a: "L'injection d'**entités externes XML** permettant de **lire des fichiers du serveur**, de faire des requêtes internes (SSRF) ou de provoquer un déni de service." },
    { q: "Qu'est-ce qu'une vulnérabilité cryptographique ?", a: "L'usage d'**algorithmes obsolètes** (MD5, SHA-1, DES, RC4, WEP), de **clés trop courtes**, d'une **mauvaise gestion des clés** ou d'une **implémentation défaillante**." }
  ],

  /* ------------------------- 19. Malicious Activity ----------------------- */
  19: [
    { q: "Quelle différence entre un DDoS amplifié et un DDoS réfléchi ?", a: "L'**amplifié** exploite un service qui renvoie une **réponse bien plus grosse** que la requête (DNS, NTP, memcached) ; le **réfléchi** **usurpe l'IP de la victime** pour que des tiers lui renvoient les réponses. Les deux sont souvent combinés." },
    { q: "Qu'est-ce que le DNS poisoning ?", a: "**Corrompre le cache d'un résolveur DNS** pour associer un nom légitime à l'IP d'un serveur malveillant, redirigeant les victimes à leur insu. Contre-mesure : **DNSSEC**." },
    { q: "Qu'est-ce que le domain hijacking ?", a: "**Prendre le contrôle de l'enregistrement du domaine chez le registrar**, souvent via un compte administrateur compromis. L'attaquant maîtrise alors tout le trafic du domaine." },
    { q: "Qu'est-ce que le DNS tunneling ?", a: "**Exfiltrer des données dissimulées dans des requêtes DNS**. Efficace car le port 53 est presque toujours autorisé en sortie. Indicateur : requêtes DNS **anormalement nombreuses ou longues**." },
    { q: "Qu'est-ce qu'une attaque par directory traversal ?", a: "Utiliser des séquences **../** pour **sortir du répertoire web** et accéder à des fichiers système (ex. /etc/passwd)." },
    { q: "Quelle différence entre escalade de privilèges verticale et horizontale ?", a: "La **verticale** obtient **plus de droits** (utilisateur → administrateur) ; l'**horizontale** accède aux **données d'un autre utilisateur de même niveau**." },
    { q: "Qu'est-ce que le password spraying et pourquoi est-il redoutable ?", a: "Essayer **UN mot de passe courant sur BEAUCOUP de comptes**. Comme chaque compte ne subit qu'une tentative, il **évite le verrouillage** et passe sous les radars." },
    { q: "Quelle différence entre brute force, dictionary attack et rainbow table ?", a: "**Brute force** : toutes les combinaisons sur un compte. **Dictionary** : une liste de mots probables. **Rainbow table** : des **hachages précalculés** — neutralisée par le **salting**." },
    { q: "Qu'est-ce qu'une attaque par rejeu (replay) ?", a: "**Capturer puis réémettre** des identifiants ou une session valide pour se faire passer pour la victime. Contre-mesures : **nonces**, **horodatages** et chiffrement de session." },
    { q: "Qu'est-ce qu'une attaque on-path ?", a: "L'attaquant **s'interpose dans la communication** entre deux parties (anciennement man-in-the-middle). Variantes : **ARP poisoning**, **rogue AP**, **SSL stripping**." },
    { q: "Quelle différence entre evil twin et rogue AP ?", a: "L'**evil twin imite le SSID légitime** pour tromper les clients ; le **rogue AP** est un point d'accès **non autorisé branché sur le réseau** de l'entreprise." },
    { q: "À quoi sert une attaque de deauthentication ?", a: "**Forcer la déconnexion des clients Wi-Fi** pour capturer le **handshake** lors de leur reconnexion, ou pour les pousser vers un **evil twin**." },
    { q: "Qu'est-ce que l'impossible travel comme indicateur ?", a: "Deux connexions du **même compte depuis des lieux géographiquement incompatibles** dans un délai trop court : preuve quasi certaine d'un **compte compromis**." },
    { q: "Que révèle l'absence de logs (missing logs) ?", a: "Un signe fort d'**effacement de traces par un attaquant** cherchant à couvrir son intrusion — ou une défaillance de collecte, à vérifier immédiatement." },
    { q: "Que signifie l'indicateur out-of-cycle logging ?", a: "Des journaux générés **en dehors des plages d'activité normales** (ex. connexion administrateur à 3 h du matin), révélant une activité anormale." },
    { q: "Que révèlent les indicateurs resource consumption et resource inaccessibility ?", a: "Une **consommation anormale** (CPU, bande passante, stockage) suggère un **cryptominage, une exfiltration ou un DDoS** ; une **ressource devenue inaccessible** évoque un **ransomware** ou un déni de service." },
    { q: "Que signifie l'indicateur concurrent session usage ?", a: "Un **même compte utilisé simultanément depuis plusieurs sessions ou appareils**, signe classique d'identifiants partagés ou volés." },
    { q: "Qu'est-ce qu'une attaque de type forgery ?", a: "**Falsifier une requête, un jeton ou une signature** pour qu'elle paraisse légitime et soit acceptée par le système." },
    { q: "Qu'est-ce qu'une attaque par RFID cloning ?", a: "**Copier à distance** les données d'un badge RFID avec un lecteur, puis créer un duplicata permettant l'accès physique." }
  ],

  /* ------------------------------ 20. Hardening --------------------------- */
  20: [
    { q: "Quel est l'objectif du durcissement (hardening) ?", a: "**Réduire la surface d'attaque** : désinstaller les logiciels inutiles, désactiver les services et ports non nécessaires, changer les identifiants par défaut." },
    { q: "Quelles sont les 3 étapes de la gestion d'une secure baseline ?", a: "**Establish** (définir la configuration de référence), **Deploy** (l'appliquer au parc), **Maintain** (surveiller la dérive et l'actualiser)." },
    { q: "Pourquoi une application allow list est-elle plus sûre qu'une deny list ?", a: "Parce que **seuls les exécutables explicitement autorisés** peuvent tourner : tout malware inconnu est **bloqué par défaut**, y compris un zero-day." },
    { q: "Quelles sont les étapes d'un patch management rigoureux ?", a: "**Identifier** les correctifs → **tester en préproduction** → **déployer** progressivement → **vérifier** l'application effective. Jamais de patch direct en production sans test." },
    { q: "Pourquoi ne faut-il pas déployer un correctif directement en production ?", a: "Parce qu'un correctif peut **casser une application** ou provoquer une **régression**. Le test préalable évite de transformer une correction en panne majeure." },
    { q: "À quoi sert une GPO ?", a: "**Group Policy Object** : appliquer de façon **centralisée et automatique** des configurations de sécurité à tous les postes et utilisateurs d'un domaine Windows." },
    { q: "Qu'est-ce que SELinux et quels sont ses modes ?", a: "L'implémentation du **MAC sous Linux**, appliquant des contextes de sécurité obligatoires. Modes : **enforcing** (applique et bloque), **permissive** (journalise sans bloquer), **disabled**." },
    { q: "Contre quoi le chiffrement intégral de disque (FDE) protège-t-il réellement ?", a: "Contre l'accès aux données d'une machine **ÉTEINTE** (vol de portable). Il **ne protège pas** une machine **allumée et déverrouillée**." },
    { q: "Citez les cibles de durcissement à connaître.", a: "**Mobile devices**, **workstations**, **switches**, **routers**, **cloud infrastructure**, **servers**, **ICS/SCADA**, **embedded systems**, **RTOS** et **IoT devices**." },
    { q: "Citez les principales techniques de durcissement.", a: "**Chiffrement**, **endpoint protection**, **host-based firewall**, **HIPS**, **désactivation des ports/protocoles**, **changement des mots de passe par défaut** et **suppression des logiciels inutiles**." },
    { q: "Citez les mitigations d'entreprise du programme SY0-701.", a: "**Segmentation**, **access control** (ACL et permissions), **application allow list**, **isolation**, **patching**, **encryption**, **monitoring**, **least privilege**, **configuration enforcement**, **decommissioning** et **hardening techniques**." },
    { q: "Qu'est-ce que le configuration enforcement ?", a: "Vérifier **en continu** que les systèmes respectent la configuration de référence et **corriger automatiquement** toute dérive constatée." },
    { q: "Qu'est-ce qu'un trusted operating system ?", a: "Un OS conçu pour appliquer une **politique de sécurité obligatoire** (MAC) et **évalué formellement** selon des critères reconnus." },
    { q: "Pourquoi désactiver les services inutiles est-il si efficace ?", a: "Parce que **chaque service actif est une porte potentielle** : ce qui n'est pas installé ou activé ne peut être ni vulnérable ni exploité." },
    { q: "Que signifie la decommissioning comme mesure de sécurité ?", a: "**Retirer proprement du service** un système obsolète : révoquer ses accès, effacer ses données et le sortir de l'inventaire, pour qu'il ne devienne pas un actif oublié et vulnérable." },
    { q: "Pourquoi l'isolation est-elle une mitigation efficace ?", a: "Parce qu'elle **empêche la propagation latérale** : un système compromis mais isolé ne peut pas contaminer le reste du réseau." }
  ],

  /* -------------------------- 21. Security Techniques --------------------- */
  21: [
    { q: "Qu'apporte WPA3 par rapport à WPA2 ?", a: "Le **SAE (Simultaneous Authentication of Equals)** remplace le PSK : il protège contre les **attaques par dictionnaire hors ligne** et fournit la **forward secrecy**. Il utilise aussi **GCMP**." },
    { q: "Classez WEP, WPA, WPA2 et WPA3 par sécurité croissante.", a: "**WEP** (cassé, à bannir) → **WPA** (TKIP/RC4, obsolète) → **WPA2** (CCMP/AES) → **WPA3** (SAE/GCMP, actuel)." },
    { q: "Quelle différence entre WPA-Personal et WPA-Enterprise ?", a: "**Personal** utilise une **clé partagée unique** par tous ; **Enterprise** utilise le **802.1X avec RADIUS** et un **compte individuel** par utilisateur — bien plus sûr et traçable." },
    { q: "Quelle différence entre un site survey et une heat map ?", a: "Le **site survey** est la **mesure sur le terrain** de la couverture radio ; la **heat map** en est la **représentation visuelle colorée**." },
    { q: "Pourquoi réaliser un site survey avant un déploiement Wi-Fi ?", a: "Pour éliminer les **zones mortes**, limiter les **interférences**, et surtout **éviter que le signal ne déborde hors du bâtiment** où un attaquant pourrait le capter." },
    { q: "Que permet un MDM ?", a: "**Mobile Device Management** : appliquer des **politiques centralisées** sur les mobiles — chiffrement obligatoire, code d'accès, **conteneurisation** des données pro, et **effacement à distance (remote wipe)**." },
    { q: "Comparez BYOD, COPE et CYOD.", a: "**BYOD** : appareil **personnel**, coût faible mais **contrôle faible** et vie privée sensible. **COPE** : appareil **d'entreprise** avec usage personnel autorisé, **contrôle fort**. **CYOD** : choix dans une **liste fournie** par l'entreprise, bon compromis." },
    { q: "Quel modèle de déploiement mobile offre le meilleur contrôle à l'entreprise ?", a: "Le **COPE** : l'entreprise **possède l'appareil**, elle peut donc imposer toutes ses politiques sans conflit avec la vie privée du salarié." },
    { q: "Quelle est la contre-mesure numéro un contre toutes les attaques par injection ?", a: "L'**input validation** (validation des entrées), idéalement par **allow list** définissant ce qui est acceptable plutôt que ce qui est interdit." },
    { q: "Que sont des secure cookies ?", a: "Des cookies protégés par les attributs **Secure** (transmis uniquement en HTTPS), **HttpOnly** (inaccessibles au JavaScript, ce qui limite le vol par XSS) et **SameSite** (contre le CSRF)." },
    { q: "Quelle différence entre static et dynamic code analysis ?", a: "La **static (SAST)** analyse le **code source sans l'exécuter** — tôt dans le développement ; la **dynamic (DAST)** teste l'application **en cours d'exécution** — elle trouve les failles réelles d'environnement." },
    { q: "À quoi sert le code signing ?", a: "**Signer numériquement** un logiciel pour prouver son **auteur (authenticité)** et garantir qu'il n'a **pas été modifié (intégrité)** depuis sa publication." },
    { q: "Qu'est-ce que le sandboxing ?", a: "Exécuter du code inconnu ou suspect dans un **environnement isolé** afin d'**observer son comportement sans risque** pour le système réel." },
    { q: "Que vérifie un NAC avant d'autoriser un poste sur le réseau ?", a: "Sa **conformité** : antivirus présent et à jour, correctifs appliqués, chiffrement actif. Un poste non conforme est mis en **quarantaine** ou en **remédiation**." },
    { q: "Quel est le rôle respectif de SPF, DKIM et DMARC ?", a: "**SPF** déclare (via DNS) **quels serveurs sont autorisés à envoyer** pour le domaine ; **DKIM signe cryptographiquement** le message ; **DMARC** définit la **politique à appliquer en cas d'échec** (none, quarantine, reject) et le **reporting**." },
    { q: "Quelles sont les 3 politiques possibles de DMARC ?", a: "**none** (observer seulement), **quarantine** (placer en indésirable), **reject** (refuser le message)." },
    { q: "Quelle différence entre un web filter agent-based et un centralized proxy ?", a: "L'**agent-based** est installé **sur le poste** et le protège **partout, y compris hors du réseau** ; le **centralized proxy** filtre **au niveau réseau** et ne protège que les postes qui y transitent." },
    { q: "Pourquoi le DNS filtering est-il une mesure très rentable ?", a: "Parce qu'il **bloque la résolution des domaines malveillants** pour **tout le réseau à la fois**, avec une mise en œuvre simple et un impact large (phishing, C2, malware)." },
    { q: "Quelle différence entre EDR et XDR ?", a: "L'**EDR** surveille et répond **sur les endpoints** ; l'**XDR** **corrèle en plus** le réseau, le cloud et la messagerie pour une visibilité globale." },
    { q: "Que détecte l'analyse comportementale UBA/UEBA ?", a: "Les **écarts par rapport à une base comportementale** établie : horaires inhabituels, volumes anormaux, accès à des ressources jamais consultées. Efficace contre les **menaces internes** et les **comptes compromis**." },
    { q: "À quoi sert le FIM ?", a: "**File Integrity Monitoring** : alerter dès qu'un **fichier critique** (système, configuration) est **modifié**, ce qui trahit une intrusion ou un changement non autorisé." },
    { q: "Que recouvre la notion de protocol selection dans les protocoles sécurisés ?", a: "Choisir systématiquement la **version chiffrée** d'un protocole : **SSH au lieu de Telnet**, **HTTPS au lieu de HTTP**, **SFTP au lieu de FTP**, **LDAPS au lieu de LDAP**." }
  ],

  /* ----------------------- 22. Vulnerability Management ------------------- */
  22: [
    { q: "Quelles sont les étapes du cycle de gestion des vulnérabilités ?", a: "**Identification** → **analyse** → **priorisation** → **réponse et remédiation** → **validation** → **reporting**." },
    { q: "Quelle différence entre un scan authentifié et non authentifié ?", a: "Le **non-credentialed** donne la **vue d'un attaquant externe** (moins précis, plus de faux positifs) ; le **credentialed** se connecte au système et donne une **vue interne complète et bien plus fiable**." },
    { q: "Quelle différence entre scan actif et scan passif ?", a: "L'**actif envoie des paquets** à la cible : précis mais **détectable** et potentiellement perturbant. Le **passif observe le trafic** : aucun impact, mais couverture partielle." },
    { q: "Quelle différence entre SAST et DAST ?", a: "**SAST** analyse le **code source sans exécution** (tôt, exhaustif sur le code) ; **DAST** teste l'**application en fonctionnement** (trouve les failles réelles mais plus tard)." },
    { q: "Qu'est-ce que le package monitoring ?", a: "**Surveiller les bibliothèques et dépendances tierces** utilisées par une application, afin de détecter celles qui deviennent vulnérables ou compromises." },
    { q: "Quelle différence entre un CVE et le CVSS ?", a: "Le **CVE est l'identifiant unique** d'une vulnérabilité connue ; le **CVSS est le score de gravité** de 0 à 10 qui lui est attribué." },
    { q: "Quelles sont les tranches de sévérité du CVSS ?", a: "**0** = None, **0,1-3,9** = Low, **4,0-6,9** = Medium, **7,0-8,9** = High, **9,0-10,0** = Critical." },
    { q: "Quelle différence entre faux positif et faux négatif en scan de vulnérabilités ?", a: "Le **faux positif** signale une vulnérabilité **inexistante** (perte de temps) ; le **faux négatif rate une vulnérabilité réelle** — bien plus dangereux car il crée un **faux sentiment de sécurité**." },
    { q: "La priorisation dépend-elle uniquement du score CVSS ?", a: "**Non.** Il faut aussi considérer l'**exposure factor**, les **environmental variables**, l'**impact métier et sectoriel** et la **risk tolerance** de l'organisation." },
    { q: "Citez les réponses possibles face à une vulnérabilité.", a: "**Patching**, **insurance**, **segmentation**, **compensating controls**, et **exceptions/exemptions** formellement documentées." },
    { q: "Quand recourir à un compensating control plutôt qu'à un correctif ?", a: "Quand le correctif est **impossible à appliquer** : système **legacy**, équipement **ICS non patchable**, ou application critique incompatible. On segmente et on surveille à la place." },
    { q: "Comment valide-t-on une remédiation ?", a: "Par **rescanning**, **audit** et **verification**. Sans nouveau scan, la correction **n'est pas prouvée** — elle est seulement supposée." },
    { q: "Citez les types de threat feeds.", a: "**OSINT** (sources ouvertes), **proprietary / third-party** (payantes), **information-sharing organizations** (ISAC sectoriels) et le **dark web**." },
    { q: "Quelle différence entre responsible disclosure et bug bounty ?", a: "La **responsible disclosure** est un **canal officiel** pour signaler une faille de façon coordonnée ; le **bug bounty** y ajoute une **récompense financière** proportionnelle à la gravité." },
    { q: "Qu'est-ce que l'exposure factor dans l'analyse d'une vulnérabilité ?", a: "La **proportion de l'actif réellement affectée** si la vulnérabilité est exploitée — elle module fortement la priorité de traitement." },
    { q: "Pourquoi un scan de vulnérabilités ne remplace-t-il pas un pentest ?", a: "Le **scan identifie des faiblesses potentielles** de façon automatisée ; le **pentest les exploite réellement** et démontre l'**impact concret** ainsi que les chaînes d'attaque." }
  ],

  /* ------------------------ 23. Alerting and Monitoring ------------------- */
  23: [
    { q: "Quelle est la fonction essentielle d'un SIEM ?", a: "**Collecter, agréger, normaliser et CORRÉLER** les journaux de sources multiples pour produire des **alertes exploitables**." },
    { q: "Quelle différence entre agrégation et corrélation de logs ?", a: "L'**agrégation centralise** les journaux au même endroit ; la **corrélation met en relation des événements de sources différentes** pour révéler un scénario d'attaque invisible isolément." },
    { q: "Citez les activités de supervision attendues à l'examen.", a: "**Log aggregation**, **alerting**, **scanning**, **reporting**, **archiving**, et **alert response and remediation/validation** (avec quarantine et alert tuning)." },
    { q: "Qu'est-ce que l'alert tuning et pourquoi est-il vital ?", a: "**Ajuster les règles de détection** pour réduire le bruit et les faux positifs. Sans lui, l'**alert fatigue** s'installe et les analystes finissent par **ignorer de vraies alertes**." },
    { q: "Qu'est-ce que la quarantine comme réponse à une alerte ?", a: "**Isoler automatiquement** un fichier, un poste ou un compte suspect en attendant l'analyse humaine, afin d'**empêcher la propagation**." },
    { q: "Quelle différence entre le polling SNMP et un SNMP trap ?", a: "En **polling**, le **manager interroge** périodiquement l'agent (port 161) ; le **trap est envoyé SPONTANÉMENT par l'agent** vers le manager dès qu'un événement survient (port 162)." },
    { q: "Qu'apporte SNMPv3 par rapport aux versions précédentes ?", a: "Le **chiffrement et l'authentification**. Les versions 1 et 2c transmettent les community strings **en clair**." },
    { q: "Quelle différence entre NetFlow et une capture de paquets ?", a: "**NetFlow** enregistre les **métadonnées des flux** (qui parle à qui, quand, combien) — léger et idéal pour les tendances ; le **PCAP capture le contenu complet** — volumineux mais indispensable pour prouver le détail." },
    { q: "Qu'est-ce que SCAP et à quoi sert-il ?", a: "**Security Content Automation Protocol** : un ensemble de standards permettant d'**automatiser la vérification de conformité et de vulnérabilités**. Composants : **CVE, CVSS, CPE, OVAL, XCCDF**." },
    { q: "Que sont les benchmarks en supervision de sécurité ?", a: "Des **configurations de référence durcies et mesurables** publiées par des organismes reconnus : **CIS Benchmarks**, **DISA STIG**." },
    { q: "Quelle différence entre supervision agent-based et agentless ?", a: "**Agent-based** : logiciel installé sur l'hôte, données **riches et en continu**, mais déploiement et maintenance lourds. **Agentless** : **aucune installation**, plus simple à déployer, mais visibilité **moins profonde**." },
    { q: "Pourquoi l'archiving des journaux est-il nécessaire ?", a: "Pour satisfaire aux **exigences légales et réglementaires de rétention** et permettre des **investigations rétrospectives**, une intrusion étant souvent découverte des mois après les faits." },
    { q: "Quelles sont les 3 catégories de ressources à superviser ?", a: "Les **systems** (serveurs, postes), les **applications** et l'**infrastructure** (réseau, stockage, cloud)." },
    { q: "Pourquoi le NTP est-il critique pour un SIEM ?", a: "Sans **horloges synchronisées**, les événements de sources différentes ne peuvent pas être **corrélés chronologiquement** : la reconstitution de l'attaque devient impossible." },
    { q: "Qu'est-ce qu'un SOC ?", a: "**Security Operations Center** : l'équipe et l'infrastructure assurant la **surveillance, la détection et la réponse** aux incidents, souvent en continu (24/7)." }
  ],

  /* --------------------------- 24. Incident Response ---------------------- */
  24: [
    { q: "Citez dans l'ordre les 7 phases de la réponse à incident.", a: "**Preparation** → **Detection** → **Analysis** → **Containment** → **Eradication** → **Recovery** → **Lessons Learned**." },
    { q: "Que comprend la phase Preparation et pourquoi est-elle décisive ?", a: "Créer le **plan**, constituer l'**équipe (CIRT/CERT)**, préparer les **outils et playbooks**, et former — le tout **AVANT** l'incident. C'est la phase qui **conditionne l'efficacité de toutes les suivantes**." },
    { q: "Quelle différence entre Detection et Analysis ?", a: "La **Detection repère l'événement** ; l'**Analysis confirme qu'il s'agit bien d'un incident**, en évalue la **portée, la gravité et l'impact**." },
    { q: "Quel est l'objectif de la phase Containment ?", a: "**Stopper immédiatement la propagation** (isoler le poste, couper un segment) pour **limiter les dégâts**, avant même de chercher à éliminer la cause." },
    { q: "Que fait-on pendant la phase Eradication ?", a: "**Supprimer la cause** : retirer le malware, désactiver les comptes compromis, corriger la vulnérabilité exploitée." },
    { q: "Que comprend la phase Recovery ?", a: "**Restaurer les systèmes en production**, vérifier leur bon fonctionnement et **surveiller étroitement** un éventuel retour de l'attaquant." },
    { q: "Pourquoi la phase Lessons Learned est-elle essentielle ?", a: "Elle **analyse l'incident a posteriori** pour **mettre à jour le plan et les contrôles**. Souvent négligée en pratique, elle est **systématiquement testée à l'examen**." },
    { q: "Si une question demande la PREMIÈRE action face à une machine infectée, que répondre ?", a: "**Contenir** : isoler la machine du réseau. On limite d'abord la propagation, on analyse ensuite." },
    { q: "Qu'est-ce que le threat hunting et en quoi diffère-t-il de la détection ?", a: "C'est la recherche **PROACTIVE** d'une compromission **non détectée**, fondée sur des **hypothèses**. Contrairement à la détection, elle **ne part d'aucune alerte**." },
    { q: "Qu'est-ce que la root cause analysis ?", a: "Identifier la **cause profonde** d'un incident, et non son symptôme, afin d'**empêcher qu'il ne se reproduise**." },
    { q: "Quelle différence entre tabletop exercise et simulation ?", a: "Le **tabletop** est une **discussion sur scénario**, sans impact sur les systèmes et peu coûteuse ; la **simulation** est une **mise en situation réaliste** (ex. campagne de phishing simulé)." },
    { q: "Qu'est-ce qu'un legal hold ?", a: "L'**obligation juridique de conserver** toutes les données pouvant servir de preuve dans un litige, **suspendant les politiques normales de suppression**." },
    { q: "Qu'est-ce que la chain of custody et pourquoi est-elle critique ?", a: "La **traçabilité continue de la preuve** : qui l'a collectée, quand, où elle a été conservée, qui y a eu accès. **Toute rupture rend la preuve irrecevable** en justice." },
    { q: "Citez l'ordre de volatilité pour la collecte de preuves.", a: "**Registres et cache** → **RAM** → **état réseau** → **processus en cours** → **disque** → **journaux distants** → **archives**. On collecte **du plus volatil au moins volatil**." },
    { q: "Comment réalise-t-on une copie forensique valide ?", a: "Une copie **bit à bit** avec un **bloqueur d'écriture (write blocker)**, dont l'intégrité est prouvée par une **empreinte de hachage** avant et après. On travaille toujours **sur la copie**, jamais sur l'original." },
    { q: "Qu'est-ce que l'e-discovery ?", a: "Le processus d'**identification, collecte et production de preuves électroniques** dans un cadre judiciaire." },
    { q: "Que recouvre la preservation en forensique ?", a: "**Protéger l'intégrité de la preuve** contre toute modification ou destruction, dès sa collecte et pendant toute la durée de la procédure." }
  ],

  /* ----------------------- 25. Investigating an Incident ------------------ */
  25: [
    { q: "Quel journal consulter pour prouver qu'une connexion réseau a eu lieu vers une IP externe ?", a: "Les **firewall logs** : ils enregistrent le trafic **autorisé et bloqué**, avec IP source et destination, ports et horodatage." },
    { q: "Quel journal consulter pour vérifier une connexion réussie ou échouée sur un compte ?", a: "Les **OS-specific security logs** : le **Windows Event Log (Security)** ou **auth.log / secure** sous Linux." },
    { q: "Qu'apportent les endpoint logs dans une investigation ?", a: "L'activité **sur le poste lui-même** : processus lancés, fichiers créés ou modifiés, connexions locales, exécutions suspectes." },
    { q: "Qu'apportent les application logs ?", a: "Les **événements propres au logiciel** : erreurs, transactions métier, authentifications applicatives — utiles quand l'attaque cible directement l'application." },
    { q: "Qu'apportent les IDS/IPS logs ?", a: "Les **alertes de détection avec la signature déclenchée**, ce qui permet d'identifier la **technique d'attaque** employée." },
    { q: "Qu'apportent les network logs ?", a: "L'activité des **équipements réseau** : changements de configuration, état des interfaces, tables de routage, événements de commutation." },
    { q: "Pourquoi les métadonnées sont-elles souvent décisives ?", a: "Parce qu'elles renseignent **expéditeur, horodatage, appareil, géolocalisation** — et restent **exploitables même quand le contenu est chiffré**." },
    { q: "Quand une capture de paquets est-elle indispensable ?", a: "Pour **prouver le contenu réel** d'un échange, notamment une **exfiltration de données** : c'est la seule source montrant ce qui a effectivement transité." },
    { q: "À quoi servent les vulnerability scans dans une investigation ?", a: "À identifier **quelle faiblesse a pu être exploitée** pour entrer, en recoupant la date du scan avec celle de l'intrusion." },
    { q: "Quelle différence entre un dashboard et un automated report ?", a: "Le **dashboard** offre une vue **consolidée et temps réel** pour les analystes ; l'**automated report** est une **synthèse périodique** destinée au pilotage et à la conformité." },
    { q: "Pourquoi la synchronisation horaire est-elle indispensable à une investigation ?", a: "Sans horodatage cohérent entre les sources, il devient **impossible de reconstituer la chronologie** de l'attaque et de corréler les événements." },
    { q: "Quelle source consulter pour identifier quel utilisateur a supprimé un fichier partagé ?", a: "Les **OS security logs** du serveur de fichiers, avec l'**audit d'accès aux objets** activé — complétés par les journaux du **FIM** s'il est en place." },
    { q: "Comment procéder quand une seule source de logs ne suffit pas à conclure ?", a: "**Corréler plusieurs sources** (pare-feu + endpoint + authentification) via le SIEM : c'est le **recoupement** qui établit le scénario complet." }
  ],

  /* --------------------- 26. Automation and Orchestration ----------------- */
  26: [
    { q: "Quelle différence entre automation et orchestration ?", a: "L'**automation automatise UNE tâche** ; l'**orchestration coordonne plusieurs tâches et plusieurs outils** en un flux complet de bout en bout." },
    { q: "Qu'est-ce qu'un SOAR ?", a: "**Security Orchestration, Automation and Response** : une plateforme exécutant des **playbooks de réponse automatisés** en pilotant les différents outils de sécurité." },
    { q: "Citez les cas d'usage de l'automatisation en sécurité.", a: "**User provisioning**, **resource provisioning**, **guard rails**, **security groups**, **ticket creation**, **escalation**, **activation/désactivation de services et d'accès**, **intégration continue et tests**, **intégrations et API**." },
    { q: "Que sont des guard rails ?", a: "Des **garde-fous automatiques** empêchant le déploiement d'une configuration **non conforme** aux politiques de sécurité (ex. bloquer la création d'un bucket public)." },
    { q: "Citez les bénéfices de l'automatisation et de l'orchestration.", a: "**Efficacité et gain de temps**, **application des baselines**, **configurations standardisées**, **mise à l'échelle sécurisée**, **fidélisation des employés**, **temps de réaction** et **effet multiplicateur sur les effectifs (workforce multiplier)**." },
    { q: "Citez les inconvénients de l'automatisation à connaître pour l'examen.", a: "**Complexité**, **coût** initial, **point unique de défaillance**, **dette technique** et **maintien en condition opérationnelle (ongoing supportability)**." },
    { q: "Pourquoi une automatisation mal conçue est-elle dangereuse ?", a: "Parce qu'elle **propage une erreur à grande échelle et instantanément** : ce qui aurait été une erreur isolée devient un incident généralisé." },
    { q: "Pourquoi l'automatisation constitue-t-elle un single point of failure ?", a: "Parce que si la **plateforme d'automatisation tombe ou est compromise**, **tous les processus qui en dépendent s'arrêtent** — ou pire, exécutent des actions malveillantes avec des droits élevés." },
    { q: "Comment sécurise-t-on une API ?", a: "Par l'**authentification** forte, l'**autorisation** granulaire, la **limitation de débit (rate limiting)**, la **validation des entrées** et le **chiffrement TLS**." },
    { q: "Quel bénéfice sécurité apporte l'automatisation de l'onboarding et de l'offboarding ?", a: "Elle **supprime les erreurs humaines** et garantit la **révocation immédiate** des accès au départ, éliminant les **comptes orphelins**." },
    { q: "Qu'est-ce que la dette technique appliquée à l'automatisation ?", a: "L'accumulation de **scripts et intégrations non documentés et non maintenus**, qui deviennent progressivement **impossibles à faire évoluer** et fragilisent tout l'édifice." },
    { q: "Que sont des security groups automatisés ?", a: "Des **regroupements de règles d'accès** appliqués et mis à jour automatiquement, garantissant que chaque ressource déployée reçoit **immédiatement la bonne posture** de sécurité." }
  ],

  /* --------------------------- 27. Security Awareness --------------------- */
  27: [
    { q: "Quel est le cycle d'un programme de sensibilisation ?", a: "**Development** (conception) → **Execution** (déploiement) → **Reporting and monitoring** → **révision continue**." },
    { q: "Quelle différence entre reporting initial et recurring ?", a: "L'**initial** établit la **mesure de référence** (le point de départ) ; le **recurring** suit l'**évolution dans le temps** et démontre l'efficacité du programme." },
    { q: "Quel est le véritable objectif d'une campagne de phishing simulé ?", a: "**Pédagogique** : mesurer les taux de clic et de signalement pour **cibler la formation**. Ce n'est **pas un outil de sanction**, sous peine de décourager les signalements." },
    { q: "Que doit-on enseigner aux utilisateurs à propos du phishing ?", a: "À la fois **le reconnaître** (indices d'un message frauduleux) **et savoir quoi en faire** : le **signaler** via le canal dédié, sans cliquer, répondre ni le transférer." },
    { q: "Citez les 3 types de comportements anormaux à reconnaître.", a: "**Risky** (risqué en connaissance de cause), **unexpected** (inattendu au regard du rôle), **unintentional** (involontaire, par ignorance)." },
    { q: "Citez les thèmes de formation attendus par CompTIA.", a: "**Policy/handbooks**, **situational awareness**, **insider threat**, **password management**, **removable media and cables**, **social engineering**, **operational security**, **hybrid/remote work environments**." },
    { q: "Qu'est-ce qu'une USB drop attack ?", a: "**Abandonner volontairement des clés USB piégées** sur un parking ou dans un hall : la curiosité pousse un employé à la brancher, ce qui exécute la charge malveillante." },
    { q: "Pourquoi les câbles constituent-ils un risque ?", a: "Certains **câbles USB piégés** contiennent une électronique cachée qui **injecte des frappes clavier** ou ouvre un accès distant, tout en paraissant parfaitement ordinaires." },
    { q: "Qu'est-ce que l'OPSEC ?", a: "**Operational Security** : ne pas divulguer d'informations exploitables par un attaquant — publications sur les réseaux sociaux, badges visibles en public, conversations professionnelles dans les transports." },
    { q: "Pourquoi le télétravail élargit-il la surface d'attaque ?", a: "**Réseau domestique non maîtrisé**, équipements personnels partagés, **shoulder surfing** en espace public, Wi-Fi ouverts. D'où l'exigence de **VPN** et de postes gérés." },
    { q: "Pourquoi une formation annuelle unique est-elle insuffisante ?", a: "Parce que les **menaces évoluent en permanence** et que la **vigilance décroît avec le temps**. La sensibilisation doit être **récurrente et variée**." },
    { q: "Qu'est-ce que la situational awareness ?", a: "La capacité à **percevoir son environnement et à repérer ce qui est anormal** : un inconnu sans badge, une demande inhabituelle, un comportement suspect." },
    { q: "Comment reconnaître un insider threat potentiel ?", a: "**Accès à des données sans lien avec ses fonctions**, connexions à des heures inhabituelles, **volumes de téléchargement anormaux**, contournement des contrôles, mécontentement marqué avant un départ." },
    { q: "Que doit contenir un handbook de sécurité pour les employés ?", a: "Les **règles d'usage acceptable**, les **procédures de signalement**, les **bonnes pratiques** (mots de passe, mobilité, données) et les **conséquences** en cas de non-respect." }
  ],

  /* ------------------------------ 28. Conclusion -------------------------- */
  28: [
    { q: "Qu'est-ce que la technique du brain dump et quand l'appliquer ?", a: "**Dès le début de l'examen**, écrire de mémoire sur le brouillon les **formules (SLE/ALE/ARO)**, les **ports**, les **7 phases de l'IR** et les **modèles de contrôle d'accès**, avant que le stress ne les efface." },
    { q: "Quelle stratégie adopter face aux PBQ ?", a: "Les **marquer (flag) et les laisser de côté** pour traiter d'abord tous les QCM, puis y revenir avec le temps restant. Une PBQ peut consommer 10 minutes à elle seule." },
    { q: "Combien de temps consacrer en moyenne à chaque question ?", a: "Environ **1 minute** (90 questions en 90 minutes). Ne **jamais bloquer plus de 2 minutes** sur une même question : marquez-la et avancez." },
    { q: "En quoi consiste la méthode d'élimination ?", a: "Écarter d'abord les **deux réponses manifestement fausses**, puis départager les deux restantes en cherchant le **mot-clé discriminant** de l'énoncé." },
    { q: "Quels mots-clés changent radicalement la bonne réponse ?", a: "**MOST likely**, **BEST**, **FIRST**, **MOST cost-effective**, **LEAST**. Plusieurs réponses peuvent être correctes : ces mots désignent **laquelle est attendue**." },
    { q: "Que demande une question commençant par « What should you do FIRST » ?", a: "La **première action chronologique** à mener. En réponse à incident, c'est très souvent le **containment** (isoler) avant toute analyse." },
    { q: "Faut-il répondre à toutes les questions même sans certitude ?", a: "**Oui, absolument.** Il n'y a **aucun point négatif** : une réponse au hasard vaut toujours mieux qu'une absence de réponse." },
    { q: "Depuis quelle perspective faut-il répondre aux questions ?", a: "Celle des **bonnes pratiques CompTIA « par le manuel »**, jamais celle des raccourcis pratiqués sur le terrain dans votre entreprise." },
    { q: "Quel est le score de passage et l'échelle de notation ?", a: "**750 sur 900** (échelle de 100 à 900). Les questions n'ont **pas toutes le même poids**." },
    { q: "Comment aborder une PBQ complexe qui vous bloque ?", a: "Répondre **partiellement** : les PBQ accordent souvent des **points partiels**. Faire ce qu'on sait, puis passer plutôt que de tout perdre en temps." },
    { q: "Que faire dans les derniers instants de l'examen ?", a: "**Revoir les questions marquées**, vérifier qu'**aucune n'est laissée vide**, et ne changer une réponse que si l'on identifie une **raison objective** de le faire." }
  ]

  };
})(window.App = window.App || {});
