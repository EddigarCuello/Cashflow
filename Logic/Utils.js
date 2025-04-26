export const convertirTiempo = (t, unidad) => {
    if (unidad === "y") return t;
    if (unidad === "m") return t / 12;
    if (unidad === "d") return t / 365;
    if (unidad === "ym") return (t.y || 0) + (t.m || 0) / 12;
    if (unidad === "yd") return (t.y || 0) + (t.d || 0) / 365;
    if (unidad === "md") return (t.m || 0) / 12 + (t.d || 0) / 365;
    if (unidad === "ymd") return (t.y || 0) + (t.m || 0) / 12 + (t.d || 0) / 365;
    return "Unidad de tiempo inválida";
};

export const convertirTiempoAnualidad = (p, unidad) => {
    if (unidad === "y") return p;
    if (unidad === "m") return 12 / p;
    if (unidad === "d") return 365 / p;
    return "Unidad de tiempo inválida";
};

export const calcularTiempo = (A, VF, i) => {
    return Math.log((VF * i / A) + 1) / Math.log(1 + i);
};

export const redondear = (valor, cifras = 8) => Math.round(valor * 10 ** cifras) / 10 ** cifras;