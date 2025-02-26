// utils.js

/**
 * Échappe les caractères spéciaux d'une chaîne pour une utilisation sécurisée dans une RegExp.
 * @param {string} str - La chaîne à échapper.
 * @returns {string} - La chaîne échappée.
 */
export function escapeRegExp(str) {
  return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}
