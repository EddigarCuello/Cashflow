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
        console.log(t)
    }

    if (C === null) return M / Math.pow(1 + i, t);
    if (i === null) return Math.pow(M / C, 1 / t) - 1;
    if (t === null) return Math.log(M / C) / Math.log(1 + i);
    if (M === null) return C * Math.pow(1 + i, t);
};
/*
A  -> Renta o pago periódico
i  -> Tasa de interés por período
n  -> numero de capitalizacion
m  -> frecuencia de capitalizacion
VF -> Valor futuro de la anualidad
VA -> Valor actual o presente de la anualidad
t-> tiempo de capitalizacion en años
tipo -> "VF" para valor futuro, "VA" para valor actual
t-> variable que contiene losd atos sobre la capitalizacion
*/
const convertirTiempoAnualidad = (p, unidad) => {
    if (unidad === "y") return p;
    if (unidad === "m") return 12 / p;
    if (unidad === "d") return 365 / p;
    return "Unidad de tiempo inválida";
};

// Método de Newton-Raphson para hallar i
const calcularTasaInteres = (A, VF, n) => {
    let i = 0.05; // Suposición inicial (5%)
    let tolerancia = 1e-8; // Mayor precisión
    let maxIteraciones = 100;

    for (let iter = 0; iter < maxIteraciones; iter++) {
        let f = A * ((Math.pow(1 + i, n) - 1) / i) - VF;
        let df = A * ((n * Math.pow(1 + i, n - 1) * i - (Math.pow(1 + i, n) - 1)) / (i * i));

        let iNuevo = i - f / df;
        if (Math.abs(iNuevo - i) < tolerancia) {
            return iNuevo;
        }
        i = iNuevo;
    }
    return null; // No converge
};

// Método para calcular t cuando i es conocido
const calcularTiempo = (A, VF, i) => {
    return Math.log((VF * i / A) + 1) / Math.log(1 + i);
};

// Redondeo con 8 decimales para evitar truncar valores pequeños
const redondear = (valor, cifras = 8) => Math.round(valor * 10 ** cifras) / 10 ** cifras;

export const AnualidadesSimples = async (
    A = null,
    j = null,
    t = null,
    p = null,
    VF = null,
    VA = null,
    tipo = "VF",
    unidadTiempoPerido = "y"
) => {
    // Validar que solo falte un valor
    const valores = [A, j, t, p, VF, VA];
    const valoresNulos = valores.filter(v => v === null).length;

    if (valoresNulos !== 2) {
        return "Debe faltar exactamente un valor para calcular.";
    }

    // Calcular número de pagos por año (m)
    let m = p !== null ? convertirTiempoAnualidad(p, unidadTiempoPerido) : null;

    // Calcular número total de períodos (n)
    let n = t !== null ? t * m : null;

    // Calcular i si j es nulo
    let i = j !== null ? j / m : null;
    if (i === null && A !== null && VF !== null && n !== null) {
        i = calcularTasaInteres(A, VF, n);
        if (i !== null) return redondear(i, 8);
        return "No se pudo calcular la tasa de interés.";
    }

    // Calcular t si es nulo
    if (t === null && A !== null && VF !== null && i !== null) {
        t = calcularTiempo(A, VF, i) / m;
        return redondear(t, 6);
    }

    let resultado = null;
    if (tipo === "VF" && VF === null && A !== null && i !== null) {
        resultado = A * ((Math.pow(1 + i, n) - 1) / i);
    } else if (tipo === "VA" && VA === null && A !== null && i !== null) {
        resultado = A * ((1 - Math.pow(1 + i, -n)) / i);
    } else if (A === null && VF !== null && i !== null) {
        resultado = VF * (i / (Math.pow(1 + i, n) - 1));
    }

    return redondear(resultado, 6);
};

// 🔹 **Ejemplo de uso sin j**
(async () => {
    const resultadoA = await AnualidadesSimples(
        250,   // A (pago periódico)
        0.08,   // j (tasa nominal, a calcular)
        null,     // t (años)
        7,      // p (mensual)
        1629940.25595,  // VF (valor futuro)
        null,   // VA
        "VF",   // Tipo de cálculo
        "d"     // unidadTiempo
    );
    console.log("Ejercicio 4 - Resultado:", resultadoA);
})();
