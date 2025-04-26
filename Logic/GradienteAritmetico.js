export const calcularGradienteAritmetico = (A, i, n, G) => {
  const factor1 = (1 - Math.pow(1 + i, -n)) / i;
  const factor2 = (1 - Math.pow(1 + i, -n)) / i - n / Math.pow(1 + i, n);
  return A * factor1 + (G / i) * factor2;
};