/**
 * Formater les objets 'timestamp' de Firestore pour obtenir une date formatée.
 * @param {Object} d Objet 'timestamp' retourné par Firestore
 * @returns {string} date formatée en français
 */
 export default function formaterDateEtHeure(d) {
  const dateJs = d ? new Date(d.seconds*1000) : new Date();
  const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 
                        'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const ajouteZero = nombre => ((nombre<10) ? '0' : '') + nombre;
  return `${dateJs.getDate()} ${mois[dateJs.getMonth()]} ${dateJs.getFullYear()}
            à ${ajouteZero(dateJs.getHours())}:${ajouteZero(dateJs.getMinutes())}:${ajouteZero(dateJs.getSeconds())}`;
}