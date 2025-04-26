import { convertirTiempoAnualidad, calcularTiempo, redondear } from "./Utils.js";

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
    const valores = [A, j, t, p, VF, VA];
    const valoresNulos = valores.filter(v => v === null).length;

    if (valoresNulos !== 2) {
        return "Debe faltar exactamente un valor para calcular.";
    }

    let m = p !== null ? convertirTiempoAnualidad(p, unidadTiempoPerido) : null;
    let n = t !== null ? t * m : null;
    let i = j !== null ? (j / 100) / m : null;

    if (t === null && A !== null && VF !== null && i !== null) {
        t = calcularTiempo(A, VF, i) / m;
        return redondear(t, 6);
    } else if (t === null && A !== null && VA !== null && i !== null) {
        t = (Math.log(1 - (VA * i) / A)) / (-m * Math.log(1 + i));
        return redondear(t, 6);
    }

    let resultado = null;
    if (tipo === "VF" && VF === null && A !== null && i !== null) {
        resultado = A * ((Math.pow(1 + i, n) - 1) / i);
    } else if (tipo === "VA" && VA === null && A !== null && i !== null) {
        resultado = A * ((1 - Math.pow(1 + i, -n)) / i);
    } else if (A === null && VF !== null && i !== null) {
        resultado = VF * (i / (Math.pow(1 + i, n) - 1));
    } else if (A === null && VA !== null && i !== null) {
        resultado = (VA * i) / (1 - Math.pow(1 + i, -n));
    }

    return redondear(resultado, 2);
};