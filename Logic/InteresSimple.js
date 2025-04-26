import { convertirTiempo } from "./Utils.js";

export const interesSimple = async (C = null, i = null, t = null, I = null, unidadTiempo) => {
    const valores = [C, i, t, I];
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

    let resultado;
    if (C === null) resultado = I / (i * t);
    else if (i === null) resultado = I / (C * t);
    else if (t === null) resultado = I / (C * i);
    else if (I === null) resultado = C * i * t;

    // Si estamos calculando el interés, devolver también el monto total
    if (I === null) {
        return {
            interes: resultado,
            montoTotal: C + resultado
        };
    }

    return resultado;
};