/* ============================================================================
   LABS PBQ — mises en situation type « performance-based question »
   Chaque lab enchaîne plusieurs étapes de décision, avec un contexte réaliste.
   steps[] : { prompt, options[], correct (index), why }
   ========================================================================== */
(function (App) {
  'use strict';

  App.LABS = [
    {
      id: 'lab-ir-ransomware', title: "Réponse à incident : ransomware en cours", icon: '🧯',
      section: 24, domain: '4.0', difficulty: 'Intermédiaire',
      brief: "Vendredi 17 h 40. Le helpdesk reçoit trois appels : des utilisateurs du service comptabilité ne peuvent plus ouvrir leurs fichiers, dont les noms se terminent désormais par « .lokd ». Une note texte réclame un paiement en cryptomonnaie. Vous êtes l'analyste d'astreinte.",
      steps: [
        { prompt: "Quelle est votre PREMIÈRE action ?", options: ["Lancer une analyse antivirus complète sur tous les postes", "Isoler du réseau les postes affectés", "Restaurer immédiatement les sauvegardes", "Rédiger le rapport d'incident"], correct: 1,
          why: "La question demande la **PREMIÈRE** action : c'est le **containment**. Un ransomware en cours de propagation doit être stoppé avant tout, sinon chaque minute écoulée ajoute des postes chiffrés. L'analyse et la restauration viennent après." },
        { prompt: "Les postes sont isolés. Vous devez déterminer l'ampleur réelle de la compromission. Quelle phase engagez-vous et avec quelle source prioritaire ?", options: ["Eradication, avec les sauvegardes", "Analysis, avec les logs du SIEM et les endpoint logs", "Recovery, avec les images système", "Lessons learned, avec le rapport final"], correct: 1,
          why: "Après le containment vient l'**Analysis** : confirmer la portée, identifier le patient zéro et les systèmes touchés. Le **SIEM** et les **endpoint logs** permettent de corréler l'activité et de reconstituer la chronologie." },
        { prompt: "L'analyse révèle que l'infection provient d'une pièce jointe ouverte par un comptable, et qu'un compte de service a été utilisé pour se propager. Quelle action relève de l'ÉRADICATION ?", options: ["Rebrancher les postes sur le réseau", "Supprimer le malware et désactiver le compte de service compromis", "Communiquer auprès des clients", "Payer la rançon pour gagner du temps"], correct: 1,
          why: "L'**eradication** supprime la **cause** : retirer le malware et **neutraliser le compte de service compromis** qui a servi au déplacement latéral. Rebrancher relève du recovery, et payer ne garantit rien." },
        { prompt: "La direction demande s'il faut payer la rançon. Quelle recommandation donnez-vous ?", options: ["Payer, c'est la solution la plus rapide", "Ne pas payer : restaurer depuis les sauvegardes hors ligne testées", "Payer la moitié pour négocier", "Payer si le montant est inférieur à l'ALE"], correct: 1,
          why: "Payer **ne garantit ni la clé de déchiffrement, ni la non-publication** des données, finance l'écosystème criminel et désigne l'organisation comme une cible qui paie. La restauration depuis des **sauvegardes hors ligne testées** est la réponse attendue par CompTIA." },
        { prompt: "Les systèmes sont restaurés et fonctionnels. Quelle est la dernière phase, souvent négligée mais systématiquement attendue à l'examen ?", options: ["Archiver le ticket et clore l'incident", "Lessons learned : analyse post-incident et mise à jour du plan", "Relancer un scan de vulnérabilités", "Informer les autorités uniquement"], correct: 1,
          why: "Les **lessons learned** closent le cycle : analyser ce qui a fonctionné ou non, puis **mettre à jour le plan, les contrôles et la formation**. Sans cette phase, l'organisation reste exposée au même scénario." }
      ]
    },
    {
      id: 'lab-controls', title: "Classer des contrôles de sécurité", icon: '🛡️',
      section: 2, domain: '1.0', difficulty: 'Fondamental',
      brief: "Un auditeur vous demande de qualifier plusieurs contrôles déployés dans l'entreprise, en précisant à chaque fois la CATÉGORIE (qui met en œuvre) et le TYPE (quel effet recherché). C'est l'exercice le plus rentable de tout l'examen.",
      steps: [
        { prompt: "Une caméra de vidéosurveillance enregistrant l'entrée du bâtiment : catégorie et type ?", options: ["Technical / Preventive", "Physical / Detective", "Managerial / Corrective", "Operational / Deterrent"], correct: 1,
          why: "La caméra est un dispositif **physique** qui **constate** les événements : **Physical / Detective**. Sa présence visible produit aussi un effet deterrent, mais sa fonction première reste la détection." },
        { prompt: "Une politique écrite imposant le changement de mot de passe tous les 90 jours : catégorie et type ?", options: ["Managerial / Directive", "Technical / Preventive", "Physical / Deterrent", "Operational / Detective"], correct: 0,
          why: "Une **politique écrite** est un instrument de gestion : catégorie **Managerial**. Elle **oriente le comportement** vers la conformité : type **Directive**. Si le système imposait techniquement la rotation, ce serait Technical / Preventive." },
        { prompt: "Un système ICS ne peut pas être patché. L'équipe le place derrière un pare-feu dédié et le segmente : quel type de contrôle ?", options: ["Preventive", "Compensating", "Detective", "Deterrent"], correct: 1,
          why: "Quand le contrôle prévu (le correctif) est **impossible à appliquer**, la mesure alternative atteignant un objectif comparable est un contrôle **compensating**. C'est le scénario ICS/SCADA classique." },
        { prompt: "Un plan de reprise d'activité exécuté après un sinistre : catégorie et type ?", options: ["Technical / Preventive", "Managerial / Corrective", "Physical / Detective", "Operational / Deterrent"], correct: 1,
          why: "Le DRP est un **document de gestion** (Managerial) qui **rétablit la situation après l'incident** (Corrective). Attention à ne pas le confondre avec les moyens techniques qu'il mobilise." },
        { prompt: "Un éclairage puissant installé sur le parking la nuit : quel type de contrôle ?", options: ["Preventive", "Deterrent", "Corrective", "Compensating"], correct: 1,
          why: "L'éclairage **décourage** l'intrusion sans l'empêcher physiquement : c'est un contrôle **deterrent**. Il améliore par ailleurs l'efficacité des contrôles détectifs comme les caméras." }
      ]
    },
    {
      id: 'lab-firewall', title: "Configurer un jeu de règles de pare-feu", icon: '🧱',
      section: 16, domain: '3.0', difficulty: 'Intermédiaire',
      brief: "Vous configurez le pare-feu d'un réseau comportant une DMZ (serveur web public) et un réseau interne (postes et serveur de fichiers). Objectif : appliquer le moindre privilège tout en assurant le service.",
      steps: [
        { prompt: "Quelle règle placer en DERNIÈRE position dans le jeu de règles ?", options: ["Autoriser tout le trafic sortant", "Deny any any (refus implicite explicite)", "Autoriser HTTPS entrant", "Autoriser ICMP"], correct: 1,
          why: "La règle finale doit être un **deny any any**. Ce refus par défaut garantit que **tout ce qui n'a pas été explicitement autorisé est bloqué** : c'est le principe même du moindre privilège appliqué au filtrage." },
        { prompt: "Le serveur web de la DMZ doit être accessible depuis Internet. Quelle règle est la plus sûre ?", options: ["Autoriser tout le trafic depuis Internet vers la DMZ", "Autoriser TCP/443 depuis Internet vers l'IP du serveur web uniquement", "Autoriser TCP/80 et 443 vers tout le réseau interne", "Autoriser TCP/3389 depuis Internet vers la DMZ"], correct: 1,
          why: "On autorise **uniquement le port nécessaire (443) vers l'hôte concerné**. Ouvrir vers tout le réseau ou exposer le RDP (3389) depuis Internet serait une faute grave : le RDP est une cible massive de brute force." },
        { prompt: "Le serveur web doit interroger une base de données située sur le réseau interne. Quelle approche appliquer ?", options: ["Placer la base en DMZ à côté du serveur web", "Autoriser uniquement le serveur web vers l'IP et le port de la base", "Autoriser toute la DMZ vers tout le réseau interne", "Désactiver le pare-feu entre DMZ et interne"], correct: 1,
          why: "La DMZ étant la zone la plus exposée, le flux vers l'interne doit être **strictement limité à l'hôte source, l'hôte destination et le port nécessaires**. Déplacer la base en DMZ l'exposerait inutilement." },
        { prompt: "Le pare-feu tombe en panne. Vous devez privilégier la sécurité aux dépens de la disponibilité. Quel comportement configurer ?", options: ["Fail-open", "Fail-closed", "Bypass automatique", "Mode transparent"], correct: 1,
          why: "En **fail-closed**, la panne **bloque tout le trafic** : la sécurité prime. Le **fail-open** laisserait passer le trafic sans filtrage, ce qui privilégie la disponibilité — un choix acceptable seulement si le service est critique et le risque assumé." },
        { prompt: "Vous souhaitez identifier les applications utilisées quel que soit le port employé. Quel équipement déployer ?", options: ["Un pare-feu de couche 4 (stateful)", "Un NGFW / pare-feu de couche 7", "Un simple routeur avec ACL", "Un serveur RADIUS"], correct: 1,
          why: "Seul un **NGFW / pare-feu de couche 7** **inspecte le contenu applicatif** et reconnaît une application même si elle utilise un port non standard. Un pare-feu de couche 4 ne voit que les IP, ports et états de connexion." }
      ]
    },
    {
      id: 'lab-iam', title: "Concevoir une politique d'accès",
      icon: '🪪', section: 17, domain: '4.0', difficulty: 'Intermédiaire',
      brief: "Une entreprise de 400 salariés vous confie la refonte de sa gestion des identités. Les droits ont été attribués au fil de l'eau depuis dix ans et personne ne sait plus qui accède à quoi.",
      steps: [
        { prompt: "Quel modèle de contrôle d'accès recommandez-vous pour simplifier durablement la gestion ?", options: ["DAC : chaque propriétaire gère ses fichiers", "RBAC : droits attribués via des rôles métier", "MAC : labels de classification imposés", "Aucun modèle, gestion au cas par cas"], correct: 1,
          why: "Le **RBAC** attribue les droits via des **rôles métier**, ce qui simplifie massivement les arrivées, mutations et départs. Le **MAC** serait excessivement rigide pour une entreprise classique, le **DAC** reproduirait le désordre actuel." },
        { prompt: "L'audit révèle que des salariés ayant changé de service cumulent les droits de leurs anciens postes. Quel phénomène et quelle correction ?", options: ["Privilege escalation ; renforcer les mots de passe", "Privilege creep ; instaurer des revues d'accès périodiques", "Federation ; déployer le SSO", "Identity proofing ; ajouter la biométrie"], correct: 1,
          why: "Le **privilege creep** est l'accumulation de droits faute de retrait lors des mutations. La correction est la **revue d'accès périodique (attestation)** couplée à un de-provisioning rigoureux." },
        { prompt: "Vous déployez le MFA. Laquelle de ces combinaisons constitue un VRAI multifacteur ?", options: ["Mot de passe + question secrète", "Mot de passe + code TOTP sur smartphone", "Code PIN + mot de passe", "Deux mots de passe différents"], correct: 1,
          why: "Le MFA exige des facteurs de **catégories différentes**. Mot de passe (**know**) + code TOTP sur smartphone (**have**) constitue un vrai MFA. Mot de passe et question secrète relèvent tous deux du « know »." },
        { prompt: "Les administrateurs disposent de droits élevés en permanence. Quelle pratique PAM réduit ce risque ?", options: ["Allonger la durée des mots de passe", "Just-in-time permissions : droits accordés temporairement à la demande", "Partager un compte administrateur unique", "Désactiver la journalisation des actions admin"], correct: 1,
          why: "Les **just-in-time permissions** accordent les privilèges **temporairement et à la demande**, réduisant drastiquement la fenêtre d'exploitation d'un compte compromis. Le partage de compte est au contraire une très mauvaise pratique." },
        { prompt: "Un salarié quitte l'entreprise. Quelle action est la plus critique le jour même ?", options: ["Archiver ses emails", "Révoquer immédiatement tous ses accès (de-provisioning)", "Effacer son poste de travail", "Modifier l'organigramme"], correct: 1,
          why: "Le **de-provisioning immédiat** est prioritaire : un compte laissé actif devient un **compte orphelin** non surveillé, porte d'entrée idéale, notamment pour un ancien salarié mécontent." }
      ]
    },
    {
      id: 'lab-crypto', title: "Choisir la bonne solution cryptographique", icon: '🔐',
      section: 8, domain: '1.0', difficulty: 'Avancé',
      brief: "Pour plusieurs besoins métier distincts, vous devez sélectionner la solution cryptographique appropriée. Attention aux confusions classiques entre confidentialité, intégrité et non-répudiation.",
      steps: [
        { prompt: "Alice veut envoyer un fichier que seul Bob pourra lire. Avec quelle clé chiffre-t-elle ?", options: ["Sa propre clé privée", "La clé publique de Bob", "Sa propre clé publique", "Une clé de session en clair"], correct: 1,
          why: "Pour la **confidentialité**, on chiffre avec la **clé publique du destinataire** : seul Bob, détenteur de la clé privée correspondante, pourra déchiffrer. Chiffrer avec sa propre clé privée reviendrait à signer." },
        { prompt: "L'entreprise doit prouver qu'un contrat émane bien de son directeur et qu'il n'a pas été modifié. Quelle solution ?", options: ["Chiffrement symétrique AES-256", "Signature numérique avec la clé privée du directeur", "Hachage MD5 du document", "Tokenisation du contrat"], correct: 1,
          why: "La **signature numérique** avec la **clé privée du signataire** apporte simultanément **authenticité, intégrité et non-répudiation**. Un simple hachage prouverait l'intégrité mais pas l'origine." },
        { prompt: "Il faut chiffrer 500 Go de sauvegardes chaque nuit, le plus rapidement possible. Quel choix ?", options: ["RSA 4096", "AES-256 (symétrique)", "ECC avec courbe P-521", "Diffie-Hellman seul"], correct: 1,
          why: "Le chiffrement **symétrique AES-256** est **bien plus rapide** et adapté aux gros volumes. L'asymétrique (RSA, ECC) est trop coûteux en calcul : on l'utilise pour l'échange de la clé symétrique, pas pour les données massives." },
        { prompt: "Vous stockez les mots de passe des utilisateurs. Quelle approche est correcte ?", options: ["Chiffrement AES réversible", "Hachage avec sel et key stretching (bcrypt/PBKDF2)", "Encodage Base64", "Stockage en clair avec accès restreint"], correct: 1,
          why: "Les mots de passe se **hachent** (jamais ne se chiffrent de façon réversible), avec un **sel unique** contre les rainbow tables et du **key stretching** (bcrypt, PBKDF2, Argon2) pour ralentir le cassage par force brute." },
        { prompt: "Une flotte d'objets IoT à faible puissance doit établir des communications chiffrées. Quel algorithme asymétrique privilégier ?", options: ["RSA 4096", "ECC", "3DES", "MD5"], correct: 1,
          why: "L'**ECC** offre une sécurité équivalente à RSA avec des **clés bien plus courtes**, donc moins de calcul, de mémoire et d'énergie : c'est le choix de référence pour l'**IoT et le mobile**." },
        { prompt: "Vous devez gérer et protéger les clés cryptographiques de toute l'entreprise à grande échelle. Quel équipement ?", options: ["Un TPM sur chaque poste", "Un HSM", "Un secure enclave", "Un gestionnaire de mots de passe"], correct: 1,
          why: "Le **HSM (Hardware Security Module)** est un **appareil dédié** conçu pour générer, stocker et utiliser les clés **à l'échelle de l'entreprise**. Le TPM est lié à une **machine unique** et ne répond pas à ce besoin." }
      ]
    },
    {
      id: 'lab-logs', title: "Choisir la bonne source de logs", icon: '🕵️',
      section: 25, domain: '4.0', difficulty: 'Intermédiaire',
      brief: "Une investigation est en cours après la découverte d'une exfiltration de données. Pour chaque question posée par la direction, vous devez identifier la source de données la plus pertinente.",
      steps: [
        { prompt: "« Prouvez qu'une connexion a bien eu lieu depuis un poste interne vers cette adresse IP externe. » Quelle source ?", options: ["Les application logs", "Les firewall logs", "Le risk register", "Les logs DHCP"], correct: 1,
          why: "Les **firewall logs** enregistrent le trafic autorisé et bloqué avec **IP source et destination, ports et horodatage** : c'est la source de référence pour établir l'existence d'une connexion sortante." },
        { prompt: "« Quel compte s'est connecté au serveur de fichiers à 2 h du matin ? » Quelle source ?", options: ["Les OS-specific security logs", "Les NetFlow records", "Les vulnerability scans", "Les métadonnées des documents"], correct: 0,
          why: "Les **OS security logs** (Windows Event Log Security, ou auth.log sous Linux) enregistrent les **connexions réussies et échouées** avec l'identifiant du compte concerné." },
        { prompt: "« Prouvez le CONTENU exact de ce qui a été exfiltré. » Quelle source est indispensable ?", options: ["NetFlow", "Une capture de paquets (PCAP)", "Les firewall logs", "Le dashboard du SIEM"], correct: 1,
          why: "Seule la **capture de paquets** contient le **contenu réel** des échanges. NetFlow prouverait qu'un transfert volumineux a eu lieu (métadonnées), mais **pas ce qui a été transféré**." },
        { prompt: "« Cet email est chiffré, mais nous devons savoir qui l'a envoyé, quand et depuis quel appareil. » Quelle source ?", options: ["Le contenu déchiffré du message", "Les métadonnées", "Le certificat racine", "Les logs de l'antivirus"], correct: 1,
          why: "Les **métadonnées** (expéditeur, horodatage, en-têtes de routage, appareil, géolocalisation) restent **exploitables même quand le contenu est chiffré** et suffisent souvent à établir le scénario." },
        { prompt: "Aucune source unique ne permet de conclure. Quelle démarche adopter ?", options: ["Clore l'investigation faute de preuves", "Corréler plusieurs sources via le SIEM", "Redémarrer les serveurs concernés", "Se fier au témoignage des utilisateurs"], correct: 1,
          why: "C'est le **recoupement de sources multiples** (pare-feu + endpoint + authentification + application) qui reconstitue le scénario complet. C'est précisément la valeur ajoutée de la **corrélation par un SIEM**." }
      ]
    },
    {
      id: 'lab-bcdr', title: "Dimensionner un plan de continuité", icon: '♻️',
      section: 14, domain: '3.0', difficulty: 'Intermédiaire',
      brief: "Une PME de e-commerce réalise 80 % de son chiffre d'affaires en ligne. La direction souhaite un plan de continuité proportionné à ses moyens. Vous devez arbitrer entre coût et niveau de service.",
      steps: [
        { prompt: "La direction exige une reprise en moins de 2 heures. Quel type de site de secours est nécessaire ?", options: ["Cold site", "Warm site", "Hot site", "Aucun site, les sauvegardes suffisent"], correct: 2,
          why: "Seul un **hot site** permet une bascule en **minutes à quelques heures** : c'est une réplique opérationnelle avec des données à jour. Un warm site exigerait des heures à des jours, incompatible avec l'objectif." },
        { prompt: "L'entreprise accepte de perdre au maximum 15 minutes de commandes. Quelle métrique fixe-t-on et quelle conséquence ?", options: ["Le RTO ; restaurer en 15 minutes", "Le RPO ; sauvegarder ou répliquer au moins toutes les 15 minutes", "Le MTTR ; réparer en 15 minutes", "Le MTBF ; une panne toutes les 15 minutes"], correct: 1,
          why: "Le **RPO** définit la **quantité maximale de données que l'on accepte de perdre**. Un RPO de 15 minutes impose une **réplication ou une sauvegarde au moins toutes les 15 minutes**." },
        { prompt: "Le responsable informatique affirme que le RAID 5 du serveur suffit comme sauvegarde. Que répondez-vous ?", options: ["Il a raison, le RAID 5 tolère une panne de disque", "Le RAID n'est pas une sauvegarde : il réplique aussi les suppressions et le chiffrement par ransomware", "Il faut passer en RAID 0 pour plus de sécurité", "Le RAID remplace le site de secours"], correct: 1,
          why: "Le RAID protège de la **panne matérielle d'un disque**, mais **réplique instantanément toute opération logique**. Une suppression accidentelle ou un ransomware est propagé sur tous les disques : ce n'est pas une sauvegarde." },
        { prompt: "Quelle stratégie de sauvegarde applique correctement la règle 3-2-1 ?", options: ["3 sauvegardes quotidiennes sur le même serveur", "3 copies, sur 2 types de supports, dont 1 hors site", "3 disques en RAID 5 dans la même baie", "3 administrateurs responsables des sauvegardes"], correct: 1,
          why: "La règle **3-2-1** impose **3 copies**, sur **2 types de supports différents**, dont **1 conservée hors site**. Elle couvre simultanément la panne matérielle, l'erreur humaine et le sinistre local." },
        { prompt: "Vous voulez tester le plan sans aucun risque pour la production. Quel exercice choisir ?", options: ["Un failover réel en pleine journée", "Un tabletop exercise", "Un parallel processing sur l'infrastructure de production", "Aucun test n'est nécessaire"], correct: 1,
          why: "Le **tabletop exercise** est une **discussion sur scénario** qui ne touche à aucun système : risque nul et coût minimal. C'est le point de départ logique avant d'envisager une simulation puis un failover réel." }
      ]
    },
    {
      id: 'lab-vuln', title: "Prioriser des vulnérabilités", icon: '🩹',
      section: 22, domain: '4.0', difficulty: 'Avancé',
      brief: "Un scan hebdomadaire remonte 340 vulnérabilités. Vous disposez d'une équipe de deux personnes et d'une semaine avant le prochain comité de sécurité. Il faut arbitrer intelligemment.",
      steps: [
        { prompt: "Sur quelle base prioriser en premier lieu ?", options: ["Uniquement le score CVSS, du plus élevé au plus faible", "Le CVSS combiné à l'exposition réelle et à l'impact métier", "L'ordre alphabétique des systèmes", "Les vulnérabilités les plus faciles à corriger"], correct: 1,
          why: "Le CVSS donne une **gravité théorique**. La priorisation réelle intègre l'**exposure factor**, les **environmental variables** et l'**impact métier**. Un CVSS 9 sur un système isolé est moins urgent qu'un CVSS 6 sur un serveur exposé à Internet." },
        { prompt: "Une vulnérabilité critique est signalée sur un serveur, mais après vérification elle n'existe pas. Comment la qualifier ?", options: ["Un faux négatif", "Un faux positif", "Un zero-day", "Un vrai positif"], correct: 1,
          why: "Un **faux positif** signale une vulnérabilité **inexistante**. Il fait perdre du temps sans danger direct. Le **faux négatif** — rater une vraie vulnérabilité — est bien plus grave car il crée un faux sentiment de sécurité." },
        { prompt: "Pour réduire les faux positifs sur les prochains scans, que recommandez-vous ?", options: ["Réduire la fréquence des scans", "Passer à des scans authentifiés (credentialed)", "Scanner uniquement depuis Internet", "Désactiver les plugins du scanner"], correct: 1,
          why: "Le scan **credentialed** se connecte au système et **vérifie réellement** les versions et configurations installées : la précision augmente fortement et les faux positifs diminuent nettement." },
        { prompt: "Un automate industriel présente une vulnérabilité critique mais ne peut pas être patché sans arrêter la production. Quelle réponse ?", options: ["Ignorer la vulnérabilité", "Appliquer des compensating controls et documenter une exception validée", "Patcher immédiatement en production", "Déconnecter définitivement l'automate"], correct: 1,
          why: "Quand le correctif est impossible, on déploie des **compensating controls** (segmentation stricte, filtrage, surveillance renforcée) et l'on documente une **exception formellement validée** par un responsable." },
        { prompt: "Les correctifs prioritaires ont été appliqués. Quelle étape ne doit surtout pas être omise ?", options: ["Archiver les tickets", "Effectuer un rescan pour valider la remédiation", "Communiquer auprès des clients", "Augmenter le budget sécurité"], correct: 1,
          why: "Sans **rescan de validation**, la correction n'est **pas prouvée** : elle est seulement supposée. La validation (rescanning, audit, verification) est une étape obligatoire du cycle de gestion des vulnérabilités." }
      ]
    },
    {
      id: 'lab-wifi', title: "Sécuriser un réseau Wi-Fi d'entreprise", icon: '📶',
      section: 21, domain: '4.0', difficulty: 'Intermédiaire',
      brief: "Vous déployez le Wi-Fi d'un nouveau siège de 200 personnes, réparti sur trois étages, avec un réseau invité distinct. La direction veut le meilleur niveau de sécurité réalisable.",
      steps: [
        { prompt: "Quel protocole de sécurité sans fil retenir ?", options: ["WEP avec une clé de 128 bits", "WPA avec TKIP", "WPA2-Personal avec une clé longue", "WPA3-Enterprise"], correct: 3,
          why: "**WPA3-Enterprise** combine le **SAE** (protection contre les attaques par dictionnaire hors ligne, forward secrecy) et l'authentification **802.1X par compte individuel**. WEP est cassé et WPA/TKIP obsolète." },
        { prompt: "Quel composant est indispensable pour l'authentification par compte individuel ?", options: ["Un serveur DHCP", "Un serveur RADIUS", "Un serveur DNS", "Un proxy web"], correct: 1,
          why: "Le mode Enterprise repose sur le **802.1X**, dont l'**authentication server** est typiquement un **serveur RADIUS**. Il permet la révocation ciblée d'un accès et une traçabilité par utilisateur." },
        { prompt: "Avant d'installer les bornes, quelle démarche réaliser et pourquoi ?", options: ["Un scan de vulnérabilités", "Un site survey avec heat map", "Un test d'intrusion", "Un audit de conformité"], correct: 1,
          why: "Le **site survey** mesure la couverture réelle et produit une **heat map**. Il élimine les zones mortes, limite les interférences et surtout **évite que le signal ne déborde hors du bâtiment**, où il serait captable." },
        { prompt: "Un employé signale un réseau portant le même SSID que celui de l'entreprise, mais sans mot de passe. Quelle attaque suspectez-vous ?", options: ["Un rogue AP branché sur le réseau", "Un evil twin", "Une attaque de deauthentication", "Du bluesnarfing"], correct: 1,
          why: "Un point d'accès **imitant le SSID légitime** pour capter les connexions est un **evil twin**. Le **rogue AP** désigne plutôt un point d'accès non autorisé **physiquement branché** sur le réseau de l'entreprise." },
        { prompt: "Comment isoler correctement le réseau invité du réseau d'entreprise ?", options: ["Utiliser le même VLAN avec un mot de passe différent", "Placer les invités sur un VLAN séparé, sans route vers le réseau interne", "Limiter simplement la bande passante des invités", "Désactiver le chiffrement sur le réseau invité"], correct: 1,
          why: "L'isolation exige une **segmentation réelle** : un **VLAN dédié sans aucune route vers le réseau interne**. Un mot de passe différent sur le même VLAN ne procure **aucune isolation** au niveau réseau." }
      ]
    },
    {
      id: 'lab-risk', title: "Calculer et arbitrer un risque", icon: '⚖️',
      section: 9, domain: '5.0', difficulty: 'Avancé',
      brief: "Le comité de direction vous demande de justifier économiquement un investissement de sécurité. Un serveur de production vaut 300 000 €. Une panne électrique majeure détruirait 40 % de sa valeur et survient statistiquement tous les 8 ans.",
      steps: [
        { prompt: "Quel est le SLE (Single Loss Expectancy) ?", options: ["300 000 €", "120 000 €", "15 000 €", "40 000 €"], correct: 1,
          why: "**SLE = AV × EF** = 300 000 × 0,40 = **120 000 €**. C'est la perte attendue pour **un seul incident**, avant toute prise en compte de la fréquence." },
        { prompt: "Quel est l'ARO (Annualized Rate of Occurrence) ?", options: ["8", "0,125", "1,25", "0,8"], correct: 1,
          why: "**ARO = 1 / nombre d'années** = 1/8 = **0,125**. L'événement survient en moyenne 0,125 fois par an, soit une fois tous les huit ans." },
        { prompt: "Quel est l'ALE (Annualized Loss Expectancy) ?", options: ["120 000 €", "15 000 €", "960 000 €", "37 500 €"], correct: 1,
          why: "**ALE = SLE × ARO** = 120 000 × 0,125 = **15 000 € par an**. C'est le montant que l'organisation doit statistiquement provisionner chaque année pour ce risque." },
        { prompt: "Un onduleur couplé à un générateur coûte 9 000 € par an et éliminerait ce risque. Que recommandez-vous ?", options: ["Refuser : 9 000 € est un montant trop élevé", "Accepter : le coût annuel (9 000 €) est inférieur à l'ALE (15 000 €)", "Refuser : il vaut mieux souscrire une assurance", "Accepter uniquement si le coût descend sous 1 000 €"], correct: 1,
          why: "Un contrôle est **rentable si son coût annuel est inférieur à la réduction d'ALE** obtenue. Ici 9 000 € < 15 000 € : l'investissement est **économiquement justifié**, avec un gain net de 6 000 € par an." },
        { prompt: "La direction préfère souscrire une assurance couvrant les pertes. Quelle stratégie de risque applique-t-elle et quelle limite signalez-vous ?", options: ["Mitigate ; aucune limite", "Transfer ; le risque opérationnel et réputationnel demeure", "Avoid ; l'activité est supprimée", "Accept ; aucun coût"], correct: 1,
          why: "L'assurance est un **transfert** : elle déplace l'**impact financier** vers un tiers. Mais elle ne restaure ni les systèmes, ni le service, ni la confiance des clients : le **risque opérationnel et réputationnel demeure entier**." }
      ]
    },
    {
      id: 'lab-phish', title: "Analyser un email suspect", icon: '🎣',
      section: 5, domain: '2.0', difficulty: 'Fondamental',
      brief: "Un utilisateur transmet au SOC un email qu'il juge douteux : expéditeur « support@micosoft-secure.com », objet « Action requise sous 2 heures : votre compte sera suspendu », avec un lien et une pièce jointe .zip.",
      steps: [
        { prompt: "Le domaine « micosoft-secure.com » imite un domaine légitime avec une faute. Quelle technique est-ce ?", options: ["Pharming", "Typosquatting", "DNS poisoning", "Domain hijacking"], correct: 1,
          why: "Enregistrer un domaine ressemblant au domaine légitime avec une **faute de frappe ou une variation** est du **typosquatting**. Le domain hijacking consisterait à voler le vrai domaine chez le registrar." },
        { prompt: "Quel levier psychologique la formule « sous 2 heures » exploite-t-elle ?", options: ["Authority", "Urgency", "Social proof", "Scarcity"], correct: 1,
          why: "L'**urgence** est le levier le plus employé : elle **empêche la victime de prendre le temps de vérifier**. Sous pression temporelle, le raisonnement critique cède à la réaction immédiate." },
        { prompt: "Quelle action l'utilisateur aurait-il dû effectuer en recevant ce message ?", options: ["Le transférer à ses collègues pour les avertir", "Le signaler via le bouton dédié sans cliquer ni transférer", "Répondre pour vérifier l'identité de l'expéditeur", "Ouvrir la pièce jointe dans un navigateur"], correct: 1,
          why: "Il faut **signaler** via le canal dédié, **sans cliquer, sans répondre et sans transférer**. Le transfert propage la menace et la réponse confirme à l'attaquant que l'adresse est active." },
        { prompt: "L'analyse révèle que 34 employés ont cliqué. Quelle mesure technique déployer en priorité ?", options: ["Réinstaller tous les postes", "Bloquer le domaine malveillant sur le DNS filtering et le web filter", "Désactiver la messagerie de l'entreprise", "Changer tous les mots de passe de l'annuaire"], correct: 1,
          why: "Le **DNS filtering** et le **web filter** bloquent immédiatement l'accès au domaine pour **tout le réseau à la fois** : c'est la mesure la plus rapide et la plus large. La réinitialisation des mots de passe des comptes réellement compromis vient ensuite." },
        { prompt: "Quel mécanisme de messagerie aurait pu bloquer ce message en amont, en vérifiant que l'expéditeur est autorisé pour son domaine ?", options: ["SPF, DKIM et DMARC", "TLS 1.3", "IPSec", "RADIUS"], correct: 0,
          why: "**SPF** déclare les serveurs autorisés, **DKIM** signe le message et **DMARC** définit la politique à appliquer en cas d'échec (quarantine ou reject). Ensemble, ils bloquent l'usurpation de domaine." }
      ]
    },
    {
      id: 'lab-cloud', title: "Répartir les responsabilités dans le cloud", icon: '☁️',
      section: 15, domain: '3.0', difficulty: 'Intermédiaire',
      brief: "Votre entreprise migre plusieurs applications vers le cloud selon des modèles différents. L'auditeur veut savoir précisément qui est responsable de quoi, et où se situent les risques.",
      steps: [
        { prompt: "En IaaS, de quoi le CLIENT est-il responsable ?", options: ["Uniquement de ses données", "Du système d'exploitation, des applications et des données", "De l'infrastructure physique", "De rien, le fournisseur gère tout"], correct: 1,
          why: "En **IaaS**, le fournisseur fournit l'infrastructure (matériel, virtualisation, réseau) ; le **client gère l'OS, les applications et les données**, y compris les correctifs du système d'exploitation." },
        { prompt: "En SaaS, quelle responsabilité reste au client ?", options: ["Le correctif du système d'exploitation", "Ses données et la gestion des identités et des accès", "La sécurité physique du data center", "La maintenance des serveurs applicatifs"], correct: 1,
          why: "En **SaaS**, le client ne gère plus que ses **données** et ses **identités et accès**. C'est une règle universelle : **dans TOUS les modèles cloud, données et IAM restent au client**." },
        { prompt: "Un bucket de stockage cloud a été rendu public par erreur, exposant des données clients. Qui est responsable ?", options: ["Le fournisseur cloud, c'est son infrastructure", "Le client : la configuration des accès lui incombe", "Personne, c'est un risque accepté", "L'auditeur externe"], correct: 1,
          why: "La **misconfiguration relève du client** dans tous les modèles. C'est la **cause la plus fréquente de compromission cloud** : buckets publics, permissions IAM trop larges, services d'administration exposés." },
        { prompt: "Une application est déployée en conteneurs. Quel risque spécifique par rapport à des machines virtuelles ?", options: ["Les conteneurs consomment plus de ressources", "L'isolation est plus faible car le noyau de l'hôte est partagé", "Les conteneurs ne peuvent pas être supervisés", "Les conteneurs ne supportent pas le chiffrement"], correct: 1,
          why: "Un conteneur **partage le noyau de l'hôte** : il est plus léger qu'une VM, mais l'**isolation est plus faible**. Une vulnérabilité noyau peut affecter **tous les conteneurs** de l'hôte simultanément." },
        { prompt: "L'équipe veut garantir des déploiements reproductibles et supprimer la dérive de configuration. Quelle approche ?", options: ["Documenter les configurations dans un fichier partagé", "Adopter l'Infrastructure as Code (IaC)", "Créer des captures d'écran des consoles", "Augmenter la fréquence des audits manuels"], correct: 1,
          why: "L'**Infrastructure as Code** décrit l'infrastructure dans du **code versionné** : les déploiements deviennent **reproductibles et auditables**, et la **dérive de configuration** disparaît puisque le code fait référence." }
      ]
    }
  ];

  App.LAB_BY_ID = {};
  App.LABS.forEach(function (l) { App.LAB_BY_ID[l.id] = l; });

})(window.App = window.App || {});
