const ajustarPlazo = (r, n, plazoMaximo, frecuenciaPago) => {
  let factorPlazo, factorFrecuencia;

  // Determinar el factor del plazo máximo
  switch (plazoMaximo) {
    case "anual":
      factorPlazo = 1;
      break;
    case "mensual":
      factorPlazo = 12;
      break;
    case "semanal":
      factorPlazo = 52;
      break;
    case "diario":
      factorPlazo = 365;
      break;
    default:
      throw new Error("Plazo máximo no válido");
  }

  // Determinar el factor de la frecuencia de pago
  switch (frecuenciaPago) {
    case "anual":
      factorFrecuencia = 1;
      break;
    case "mensual":
      factorFrecuencia = 12;
      break;
    case "semanal":
      factorFrecuencia = 52;
      break;
    case "diario":
      factorFrecuencia = 365;
      break;
    default:
      throw new Error("Frecuencia de pago no válida");
  }

  // Calcular los períodos y la tasa ajustada
  const periodos = n * factorPlazo * (factorFrecuencia / factorPlazo);
  const tasa = (r / 100) / factorFrecuencia;

  return { tasa, periodos };
};

// Amortización Francesa
export const calcularAmortizacion = (P, r, n, plazoMaximo, frecuenciaPago) => {
  const { tasa, periodos } = ajustarPlazo(r, n, plazoMaximo, frecuenciaPago);
  const tabla = [];
  const cuotaBruta = (P * tasa) / (1 - Math.pow(1 + tasa, -periodos));
  const cuota = parseFloat(cuotaBruta.toFixed(2));

  let saldo = P;

  for (let periodo = 1; periodo <= periodos; periodo++) {
    const interes = parseFloat((saldo * tasa).toFixed(2));
    const abonoCapital = parseFloat((cuota - interes).toFixed(2));
    saldo = parseFloat((saldo - abonoCapital).toFixed(2));

    if (periodo === periodos) saldo = 0;

    tabla.push({
      periodo,
      cuota,
      interes,
      abonoCapital,
      saldo,
    });
  }

  return tabla;
};

// Amortización Americana
export const calcularAmortizacionAmericana = (P, r, n, plazoMaximo, frecuenciaPago) => {
  const { tasa, periodos } = ajustarPlazo(r, n, plazoMaximo, frecuenciaPago);
  const tabla = [];
  const interes = parseFloat((P * tasa).toFixed(2));

  for (let periodo = 1; periodo <= periodos; periodo++) {
    const saldo = periodo === periodos ? 0 : P;
    const abonoCapital = periodo === periodos ? P : 0;

    tabla.push({
      periodo,
      cuota: parseFloat((periodo === periodos ? interes + P : interes).toFixed(2)),
      interes,
      abonoCapital,
      saldo,
    });
  }

  return tabla;
};

// Amortización Alemana (CORREGIDA)
export const calcularAmortizacionAleman = (P, r, n, plazoMaximo, frecuenciaPago) => {
  const { tasa, periodos } = ajustarPlazo(r, n, plazoMaximo, frecuenciaPago);
  const tabla = [];
  const abonoCapitalSinRedondeo = P / periodos;

  let saldo = P;

  for (let periodo = 1; periodo <= periodos; periodo++) {
    const interes = saldo * tasa;
    const cuota = abonoCapitalSinRedondeo + interes;

    tabla.push({
      periodo,
      cuota: parseFloat(cuota.toFixed(2)),
      interes: parseFloat(interes.toFixed(2)),
      abonoCapital: parseFloat(abonoCapitalSinRedondeo.toFixed(2)),
      saldo: parseFloat((saldo - abonoCapitalSinRedondeo).toFixed(2)),
    });

    saldo -= abonoCapitalSinRedondeo;
  }

  return tabla;
};

// Selección de tipo de amortización
export const seleccionarTipoAmortizacion = (tipoAmortizacion, capital, interes, periodos, plazoMaximo, plazo) => {
  let resultados;

  switch (tipoAmortizacion) {
    case "francesa":
      resultados = calcularAmortizacion(capital, interes, periodos, plazoMaximo, plazo);
      break;
    case "americana":
      resultados = calcularAmortizacionAmericana(capital, interes, periodos, plazoMaximo, plazo);
      break;
    case "alemana":
      resultados = calcularAmortizacionAleman(capital, interes, periodos, plazoMaximo, plazo);
      break;
    default:
      throw new Error("Tipo de amortización no válido.");
  }

  return resultados;
};
