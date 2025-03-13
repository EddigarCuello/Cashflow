
/*
C -> Capital también puede ser Valor Presente (VP)
i -> Tasa de interés
t -> Tiempo
I -> Interés simple
*/

export const interesSimple = async (C = null, i = null, t = null, I = null) => {
    // Validar que solo falte un valor
    const valores = [C, i, t, I];
    const valoresNulos = valores.filter(v => v === null).length;

    if (valoresNulos !== 1) {
        return "No puede haber varios campos vacios.";
    }

    // Calcular el valor faltante y devolverlo directamente
    if (C === null) return I / (i * t); // Capital Inicial
    if (i === null) return I / (C * t); // Tasa de Interés
    if (t === null) return I / (C * i); // Tiempo
    if (I === null) return C * i * t; // Interés generado
};




/*
C -> Capital inicial o Valor Presente (VP)
i -> Tasa de interés por período
t -> Número de períodos
M -> Monto final o Valor Futuro (VF)
*/

export const interesCompuesto = async (C = null, i = null, t = null, M = null) => {
    // Validar que solo falte un valor
    const valores = [C, i, t, M];
    const valoresNulos = valores.filter(v => v === null).length;

    if (valoresNulos !== 1) {
        return "No puede haber varios campos vacios.";
    }

    // Fórmula del interés compuesto: M = C * (1 + i)^t
    if (C === null) return M / Math.pow(1 + i, t); // Capital Inicial (VP)
    if (i === null) return Math.pow(M / C, 1 / t) - 1; // Tasa de Interés
    if (t === null) return Math.log(M / C) / Math.log(1 + i); // Tiempo (Número de períodos)
    if (M === null) return C * Math.pow(1 + i, t); // Monto Final (VF)
};



/*
A  -> Renta o pago periódico
i  -> Tasa de interés por período
n  -> Número de períodos
VF -> Valor futuro de la anualidad
VA -> Valor actual o presente de la anualidad
*/

export const AnualidadesSimples = async (A = null, i = null, n = null, VF = null, VA = null) => {
    // Validar que solo falte un valor
    const valores = [A, i, n, VF, VA];
    const valoresNulos = valores.filter(v => v === null).length;

    if (valoresNulos !== 1) {
        return "No puede haber varios campos vacios.";
    }

    // Calcular el valor faltante según la fórmula de la imagen
    if (VF === null) {
        return A * ((Math.pow(1 + i, n) - 1) / i); // Monto final de la anualidad
    }
    if (VA === null) {
        return A * ((1 - Math.pow(1 + i, -n)) / i); // Valor actual de la anualidad
    }
    if (A === null) {
        return VF !== null
            ? VF * (i / (Math.pow(1 + i, n) - 1)) // Cálculo desde VF
            : VA * (i / (1 - Math.pow(1 + i, -n))); // Cálculo desde VA
    }
    if (i === null) {
        return "El cálculo de la tasa i requiere un método iterativo.";
    }
    if (n === null) {
        return VF !== null
            ? Math.log(1 + ((VF * i) / A)) / Math.log(1 + i) // Cálculo desde VF
            : Math.log(1 - (VA * i) / A) / Math.log(1 + i) * -1; // Cálculo desde VA
    }
};


