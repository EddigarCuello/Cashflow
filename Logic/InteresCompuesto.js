import { convertirTiempo } from "./Utils.js";

export const interesCompuesto = async (C = null, i = null, t = null, M = null, unidadTiempo, frecuenciaCapitalizacion = 12) => {
    const valores = [C, i, t, M];
    const valoresNulos = valores.filter(v => v === null).length;

    if (valoresNulos !== 1) {
        return "No puede haber varios campos vacíos.";
    }

    if (t !== null) {
        t = convertirTiempo(t, unidadTiempo);
    }

    // Convertir tasa de interés a decimal si no es null
    if (i !== null) {
        i = i / 100;
    }

    // Ajustar la tasa y el tiempo según la frecuencia de capitalización
    const tasaPeriodica = i / frecuenciaCapitalizacion;
    const periodos = frecuenciaCapitalizacion * t;

    if (C === null) return M / Math.pow(1 + tasaPeriodica, periodos);
    if (i === null) return (Math.pow(M / C, 1 / periodos) - 1) * frecuenciaCapitalizacion;
    if (t === null) return Math.log(M / C) / (frecuenciaCapitalizacion * Math.log(1 + tasaPeriodica));
    if (M === null) return C * Math.pow(1 + tasaPeriodica, periodos);
};