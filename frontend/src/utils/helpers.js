export const copyToClipboard = async (text) => {
  if (!navigator.clipboard) {
    console.error("La API del portapapeles no es compatible con este navegador.");
    throw new Error("La API del portapapeles no es compatible con este navegador.");
  }
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('Error al copiar al portapapeles: ', err);
    throw new Error("Error al copiar al portapapeles.");
  }
};