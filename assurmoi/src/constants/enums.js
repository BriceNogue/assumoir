const Roles = ['ADMIN', 'GESTIONNAIRE', 'CHARGE_SUIVI', 'CHARGE_CLIENTELE', 'ASSURE'];
const DocTypes = ['CNI', 'CARTE_GRISE', 'ATTESTATION', 'FACTURE', 'RIB', 'RAPPORT_EXPERT'];
const RequestStatus = ['INITIALIZED', 'EXPERTISE_PENDING', 'REPAIR_IN_PROGRESS', 'COMPENSATION_PENDING', 'CLOSED'];
const Diagnostic = ['REPAIRABLE', 'NOT_REPAIRABLE', 'PENDING'];

module.exports = { Roles, DocTypes, RequestStatus, Diagnostic };