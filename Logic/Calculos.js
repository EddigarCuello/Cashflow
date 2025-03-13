/*
C -> Capital también puede ser Valor Presente (VP)
i -> Tasa de interés
t -> Tiempo
I -> Interés simple
*/

const convertirTiempo = (t, unidad) => {
    if (unidad === "y") return t; // Ya está en años
    if (unidad === "m") return t / 12; // Convertir meses a años
    if (unidad === "d") return t / 365; // Convertir días a años
    if (unidad === "ym") return (t.y || 0) + (t.m || 0) / 12; // Años + meses
    if (unidad === "yd") return (t.y || 0) + (t.d || 0) / 365; // Años + días
    if (unidad === "md") return (t.m || 0) / 12 + (t.d || 0) / 365; // Meses + días
    if (unidad === "ymd") return (t.y || 0) + (t.m || 0) / 12 + (t.d || 0) / 365; // Años + meses + días
    return "Unidad de tiempo inválida"; // Si la unidad no es válida
};

export const interesSimple = async (C = null, i = null, t = null, I = null, unidadTiempo) => {
    // Validar que solo falte un valor
    const valores = [C, i, t, I];
    const valoresNulos = valores.filter(v => v === null).length;

    if (valoresNulos !== 1) {
        return "No puede haber varios campos vacíos.";
    }

    // Convertir el tiempo antes de los cálculos
    if (t !== null) {
        t = convertirTiempo(t, unidadTiempo);
    }

    if (C === null) return I / (i * t);
    if (i === null) return I / (C * t);
    if (t === null) return I / (C * i);
    if (I === null) return C * i * t;
};

/*
C -> Capital inicial o Valor Presente (VP)
i -> Tasa de interés por período
t -> Número de períodos
M -> Monto final o Valor Futuro (VF)
*/

export const interesCompuesto = async (C = null, i = null, t = null, M = null, unidadTiempo) => {
    // Validar que solo falte un valor
    const valores = [C, i, t, M];
    const valoresNulos = valores.filter(v => v === null).length;

    if (valoresNulos !== 1) {
        return "No puede haber varios campos vacíos.";
    }

    // Convertir el tiempo antes de los cálculos
    if (t !== null) {
        t = convertirTiempo(t, unidadTiempo);
    }

    if (C === null) return M / Math.pow(1 + i, t);
    if (i === null) return Math.pow(M / C, 1 / t) - 1;
    if (t === null) return Math.log(M / C) / Math.log(1 + i);
    if (M === null) return C * Math.pow(1 + i, t);
};

/*
A  -> Renta o pago periódico
i  -> Tasa de interés por período
n  -> Número de períodos
VF -> Valor futuro de la anualidad
VA -> Valor actual o presente de la anualidad
*/

export const AnualidadesSimples = async (A = null, i = null, n = null, VF = null, VA = null, unidadTiempo) => {
    // Validar que solo falte un valor
    const valores = [A, i, n, VF, VA];
    const valoresNulos = valores.filter(v => v === null).length;

    if (valoresNulos !== 1) {
        return "No puede haber varios campos vacíos.";
    }

    // Convertir el tiempo antes de los cálculos
    if (n !== null) {
        n = convertirTiempo(n, unidadTiempo);
    }

    if (VF === null) {
        return A * ((Math.pow(1 + i, n) - 1) / i);
    }
    if (VA === null) {
        return A * ((1 - Math.pow(1 + i, -n)) / i);
    }
    if (A === null) {
        return VF !== null
            ? VF * (i / (Math.pow(1 + i, n) - 1))
            : VA * (i / (1 - Math.pow(1 + i, -n)));
    }
    if (i === null) {
        return "El cálculo de la tasa i requiere un método iterativo.";
    }
    if (n === null) {
        return VF !== null
            ? Math.log(1 + ((VF * i) / A)) / Math.log(1 + i)
            : Math.log(1 - (VA * i) / A) / Math.log(1 + i) * -1;
    }
};
