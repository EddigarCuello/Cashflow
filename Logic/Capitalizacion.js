// Sistemas de Capitalización
export const calcularCapitalizacion = (tipo, C, i, t, M = null, n = null, t0 = null) => {
    // Validar que solo falte un valor entre C, i, t, M
    const valores = [C, i, t, M];
    const valoresNulos = valores.filter(v => v === null).length;

    if (valoresNulos !== 1) {
        return "Debe faltar exactamente un valor para calcular.";
    }

    // Validar que los valores no nulos sean números válidos
    const valoresNoNulos = valores.filter(v => v !== null);
    if (valoresNoNulos.some(v => isNaN(v))) {
        return "Todos los valores deben ser números válidos.";
    }

    // Validar que se proporcione n solo para los tipos que lo requieren
    const tiposConFrecuencia = ["compuesta", "periodica", "anticipada", "diferida"];
    if (tiposConFrecuencia.includes(tipo) && !n) {
        return "Debe especificar el número de capitalizaciones por año (n)";
    }

    switch (tipo) {
        case "simple":
            return calcularCapitalizacionSimple(C, i, t, M);
        case "compuesta":
            return calcularCapitalizacionCompuesta(C, i, t, M, n);
        case "continua":
            return calcularCapitalizacionContinua(C, i, t, M);
        case "periodica":
            return calcularCapitalizacionPeriodica(C, i, t, M, n);
        case "anticipada":
            return calcularCapitalizacionAnticipada(C, i, t, M, n);
        case "diferida":
            if (t0 === null) return "Para capitalización diferida se requiere el tiempo de diferimiento (t0)";
            return calcularCapitalizacionDiferida(C, i, t, M, n, t0);
        default:
            return "Tipo de capitalización no válido";
    }
};

// Capitalización Simple - No usa n porque la tasa es anual
const calcularCapitalizacionSimple = (C, i, t, M) => {
    if (C === null) return M / (1 + i * t);
    if (i === null) return (M / C - 1) / t;
    if (t === null) return (M / C - 1) / i;
    if (M === null) return C * (1 + i * t);
};

// Capitalización Compuesta - Usa n para ajustar la tasa y el tiempo
const calcularCapitalizacionCompuesta = (C, i, t, M, n) => {
    const tasaPeriodica = i / n;
    const periodos = n * t;
    
    if (C === null) return M / Math.pow(1 + tasaPeriodica, periodos);
    if (i === null) return (Math.pow(M / C, 1 / periodos) - 1) * n;
    if (t === null) return Math.log(M / C) / (n * Math.log(1 + tasaPeriodica));
    if (M === null) return C * Math.pow(1 + tasaPeriodica, periodos);
};

// Capitalización Continua - No usa n porque es infinito
const calcularCapitalizacionContinua = (C, i, t, M) => {
    const e = Math.E;
    if (C === null) return M / Math.pow(e, i * t);
    if (i === null) return Math.log(M / C) / (t * Math.log(e));
    if (t === null) return Math.log(M / C) / (i * Math.log(e));
    if (M === null) return C * Math.pow(e, i * t);
};

// Capitalización Periódica - Similar a compuesta pero con énfasis en los períodos
const calcularCapitalizacionPeriodica = (C, i, t, M, n) => {
    const tasaPeriodica = i / n;
    const periodos = n * t;
    
    if (C === null) return M / Math.pow(1 + tasaPeriodica, periodos);
    if (i === null) return (Math.pow(M / C, 1 / periodos) - 1) * n;
    if (t === null) return Math.log(M / C) / (n * Math.log(1 + tasaPeriodica));
    if (M === null) return C * Math.pow(1 + tasaPeriodica, periodos);
};

// Capitalización Anticipada - Agrega un período adicional al exponente
const calcularCapitalizacionAnticipada = (C, i, t, M, n) => {
    const tasaPeriodica = i / n;
    const periodos = n * t + 1; // Se suma 1 porque es anticipada
    
    if (C === null) return M / Math.pow(1 + tasaPeriodica, periodos);
    if (i === null) return (Math.pow(M / C, 1 / periodos) - 1) * n;
    if (t === null) return (Math.log(M / C) / Math.log(1 + tasaPeriodica) - 1) / n;
    if (M === null) return C * Math.pow(1 + tasaPeriodica, periodos);
};

// Capitalización Diferida - Ajusta el tiempo según el período de diferimiento
const calcularCapitalizacionDiferida = (C, i, t, M, n, t0) => {
    const tasaPeriodica = i / n;
    const periodos = n * (t - t0); // Solo se capitaliza después del diferimiento
    
    if (C === null) return M / Math.pow(1 + tasaPeriodica, periodos);
    if (i === null) return (Math.pow(M / C, 1 / periodos) - 1) * n;
    if (t === null) return (Math.log(M / C) / Math.log(1 + tasaPeriodica)) / n + t0;
    if (M === null) return C * Math.pow(1 + tasaPeriodica, periodos);
}; 