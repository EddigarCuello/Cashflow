export const calcularTasaInteres = (A, VF, VA, n, tipo) => {
    let i = 0.05; // Suposición inicial (5%)
    const tolerancia = 1e-8; // Precisión deseada
    const maxIteraciones = 1000; // Número máximo de iteraciones

    for (let iter = 0; iter < maxIteraciones; iter++) {
        let f, df;

        if (tipo === "VF") {
            // Fórmula para VF
            f = A * ((Math.pow(1 + i, n) - 1) / i) - VF;
            df = (A * n * Math.pow(1 + i, n - 1)) / i - (A * (Math.pow(1 + i, n) - 1)) / (i * i);
        } else if (tipo === "VA") {
            // Fórmula para VA
            f = A * ((1 - Math.pow(1 + i, -n)) / i) - VA;
            df = (A * n * Math.pow(1 + i, -n - 1)) / i - (A * (1 - Math.pow(1 + i, -n))) / (i * i);
        } else {
            return null; // Tipo inválido
        }

        // Evitar divisiones por cero
        if (Math.abs(df) < tolerancia) {
            return null;
        }

        const iNuevo = i - f / df;

        // Verificar convergencia
        if (Math.abs(iNuevo - i) < tolerancia) {
            return iNuevo;
        }

        i = iNuevo;
    }

    return null; // No converge después de maxIteraciones
};

// Método para calcular el tiempo (t) cuando la tasa de interés (i) es conocida
export const calcularTiempo = (A, VF, i) => {
    return Math.log((VF * i / A) + 1) / Math.log(1 + i);
};