export const copyToClipboard = async (text) => {
  // Intentar usar la API moderna del portapapeles
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (err) {
      console.warn("Clipboard API falló, intentando fallback...", err);
    }
  }

  // Fallback para contextos donde navigator.clipboard falla
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Asegurar que el elemento sea parte del DOM pero no visible
    textArea.style.position = "fixed";
    textArea.style.left = "0";
    textArea.style.top = "0";
    textArea.style.opacity = "0";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);

    if (!successful) {
      throw new Error("Fallback copy failed.");
    }
  } catch (err) {
    console.error("Error al copiar al portapapeles: ", err);
    throw new Error("Error al copiar al portapapeles.");
  }
};
