/* ============================================================================
   PORTS & PROTOCOLES — à mémoriser pour SY0-701
   secure: true = version chiffrée à privilégier / false = à éviter en clair
   ========================================================================== */
(function (App) {
  'use strict';

  App.PORTS = [
    { port: '20/21', proto: 'TCP', name: 'FTP', desc: 'Transfert de fichiers en clair (20 = données, 21 = commandes)', secure: false, alt: 'FTPS (989/990) ou SFTP (22)' },
    { port: '22', proto: 'TCP', name: 'SSH / SCP / SFTP', desc: 'Administration distante et transfert de fichiers chiffrés', secure: true },
    { port: '23', proto: 'TCP', name: 'Telnet', desc: 'Administration distante EN CLAIR, y compris le mot de passe', secure: false, alt: 'SSH (22)' },
    { port: '25', proto: 'TCP', name: 'SMTP', desc: 'Envoi de courrier électronique', secure: false, alt: 'SMTPS (465) ou STARTTLS (587)' },
    { port: '49', proto: 'TCP', name: 'TACACS+', desc: 'AAA Cisco : chiffre tout le paquet et sépare authentification, autorisation et traçabilité', secure: true },
    { port: '53', proto: 'TCP/UDP', name: 'DNS', desc: 'Résolution de noms ; UDP pour les requêtes, TCP pour les transferts de zone', secure: false, alt: 'DNSSEC, DoH, DoT (853)' },
    { port: '67/68', proto: 'UDP', name: 'DHCP', desc: 'Attribution automatique des adresses IP (67 serveur, 68 client)', secure: false },
    { port: '69', proto: 'UDP', name: 'TFTP', desc: 'Transfert simplifié SANS authentification', secure: false },
    { port: '80', proto: 'TCP', name: 'HTTP', desc: 'Web en clair', secure: false, alt: 'HTTPS (443)' },
    { port: '88', proto: 'TCP/UDP', name: 'Kerberos', desc: 'Authentification par tickets, sensible à la désynchronisation horaire', secure: true },
    { port: '110', proto: 'TCP', name: 'POP3', desc: 'Relève de courrier avec téléchargement', secure: false, alt: 'POP3S (995)' },
    { port: '119', proto: 'TCP', name: 'NNTP', desc: 'Protocole de forums Usenet', secure: false },
    { port: '123', proto: 'UDP', name: 'NTP', desc: 'Synchronisation horaire, indispensable à la corrélation des logs', secure: false },
    { port: '135', proto: 'TCP', name: 'RPC / DCOM', desc: 'Appel de procédure distante Microsoft', secure: false },
    { port: '137-139', proto: 'TCP/UDP', name: 'NetBIOS', desc: 'Service de noms et de sessions Windows historique', secure: false },
    { port: '143', proto: 'TCP', name: 'IMAP', desc: 'Consultation de courrier avec synchronisation serveur', secure: false, alt: 'IMAPS (993)' },
    { port: '161', proto: 'UDP', name: 'SNMP', desc: 'Interrogation des équipements par le manager', secure: false, alt: 'SNMPv3 (chiffré et authentifié)' },
    { port: '162', proto: 'UDP', name: 'SNMP Trap', desc: 'Alerte envoyée spontanément par l\'agent vers le manager', secure: false },
    { port: '389', proto: 'TCP/UDP', name: 'LDAP', desc: 'Accès annuaire en clair', secure: false, alt: 'LDAPS (636)' },
    { port: '443', proto: 'TCP', name: 'HTTPS', desc: 'Web chiffré par TLS', secure: true },
    { port: '445', proto: 'TCP', name: 'SMB / CIFS', desc: 'Partage de fichiers Windows ; cible de nombreux vers (WannaCry)', secure: false },
    { port: '465', proto: 'TCP', name: 'SMTPS', desc: 'Envoi de courrier chiffré (TLS implicite)', secure: true },
    { port: '500', proto: 'UDP', name: 'ISAKMP / IKE', desc: 'Négociation des associations de sécurité IPSec', secure: true },
    { port: '514', proto: 'UDP', name: 'Syslog', desc: 'Centralisation des journaux', secure: false },
    { port: '587', proto: 'TCP', name: 'SMTP (submission)', desc: 'Soumission de courrier avec STARTTLS', secure: true },
    { port: '636', proto: 'TCP', name: 'LDAPS', desc: 'Annuaire chiffré par TLS', secure: true },
    { port: '691', proto: 'TCP', name: 'MS Exchange', desc: 'Routage Microsoft Exchange', secure: false },
    { port: '860', proto: 'TCP', name: 'iSCSI', desc: 'Stockage en réseau sur IP', secure: false },
    { port: '989/990', proto: 'TCP', name: 'FTPS', desc: 'FTP sécurisé par TLS', secure: true },
    { port: '993', proto: 'TCP', name: 'IMAPS', desc: 'IMAP chiffré par TLS', secure: true },
    { port: '995', proto: 'TCP', name: 'POP3S', desc: 'POP3 chiffré par TLS', secure: true },
    { port: '1433', proto: 'TCP', name: 'Microsoft SQL Server', desc: 'Base de données SQL Server', secure: false },
    { port: '1521', proto: 'TCP', name: 'Oracle', desc: 'Base de données Oracle', secure: false },
    { port: '1645/1646', proto: 'UDP', name: 'RADIUS (ancien)', desc: 'Ports historiques RADIUS', secure: false },
    { port: '1812/1813', proto: 'UDP', name: 'RADIUS', desc: 'AAA centralisé : 1812 authentification, 1813 accounting. Ne chiffre que le mot de passe', secure: false },
    { port: '3306', proto: 'TCP', name: 'MySQL', desc: 'Base de données MySQL / MariaDB', secure: false },
    { port: '3389', proto: 'TCP', name: 'RDP', desc: 'Bureau à distance Microsoft, cible fréquente de brute force', secure: false },
    { port: '5060/5061', proto: 'TCP/UDP', name: 'SIP', desc: 'Signalisation VoIP (5061 = TLS)', secure: false },
    { port: '5432', proto: 'TCP', name: 'PostgreSQL', desc: 'Base de données PostgreSQL', secure: false },
    { port: '6514', proto: 'TCP', name: 'Syslog over TLS', desc: 'Journalisation centralisée chiffrée', secure: true }
  ];

  /* --------- Repères de mémorisation utiles au moment du brain dump --------- */
  App.PORT_TIPS = [
    'La version SÉCURISÉE d\'un protocole mail se situe dans les 900 : POP3S 995, IMAPS 993, FTPS 989/990.',
    'LDAP 389 → LDAPS 636. HTTP 80 → HTTPS 443. Le port sécurisé est toujours différent, jamais le même.',
    'SSH (22) porte trois usages : administration distante, SCP et SFTP. Un seul port pour les trois.',
    'RADIUS ne chiffre QUE le mot de passe ; TACACS+ chiffre tout le paquet et sépare les trois fonctions AAA.',
    'DNS utilise UDP/53 pour les requêtes courantes et TCP/53 pour les transferts de zone et les grosses réponses.',
    'SNMP : 161 = le manager interroge l\'agent, 162 = l\'agent alerte spontanément le manager (trap).',
    'Telnet (23) et FTP (21) transmettent les identifiants en clair : à remplacer systématiquement par SSH et SFTP.'
  ];

})(window.App = window.App || {});
