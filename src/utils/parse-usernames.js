

export function parseUsernames(str) {
  // Если строка уже в формате массива
  if (str.startsWith('[') && str.endsWith(']')) {
    try {
      return JSON.parse(str.replace(/'/g, '"'));
    } catch (e) {
      // Если JSON.parse не сработал, используем альтернативный метод
      return str.slice(1, -1).split(',')
        .map(item => item.trim().replace(/'/g, ''));
    }
  }

  // Если строка через запятую
  return str.split(',')
    .map(item => item.trim().replace(/'/g, ''));
}
