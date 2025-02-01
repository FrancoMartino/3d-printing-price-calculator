const translations = {
  en: {
    printSpecifications: "Print Specifications",
    material: "Material",
    materialCostKg: "Material Cost (kg)",
    volumeCm3: "Volume (cm³)",
    printTimeHours: "Print Time (hours)",
    markup: "Markup (%)",
    additionalCosts: "Additional Costs",
    electricityCostKWh: "Electricity Cost (kWh)",
    machinePowerW: "Machine Power (W)",
    postProcessingTimeHours: "Post-processing Time (hours)",
    laborCostHour: "Labor Cost (hour)",
    overheadCostHour: "Overhead Cost (hour)",
    costBreakdown: "Cost Breakdown",
    materialCost: "Material Cost:",
    electricityCost: "Electricity Cost:",
    laborCost: "Labor Cost:",
    overheadCost: "Overhead Cost:",
    subtotalWithoutMarkup: "Subtotal (without markup):",
    finalPrice: "Final Price:",
    howToUse: "How to Use",
    howToUseText:
      "To calculate the cost of your 3D print, fill in the fields in the 'Print Specifications' and 'Additional Costs' sections. The calculator will automatically update the cost breakdown and final price. You can adjust the markup percentage to see how it affects the final price. Use the currency selector to view the results in your preferred currency.",
    currency: "Currency",
    changeLanguage: "Change Language",
  },
  es: {
    printSpecifications: "Especificaciones de Impresión",
    material: "Material",
    materialCostKg: "Costo del Material (kg)",
    volumeCm3: "Volumen (cm³)",
    printTimeHours: "Tiempo de Impresión (horas)",
    markup: "Margen (%)",
    additionalCosts: "Costos Adicionales",
    electricityCostKWh: "Costo de Electricidad (kWh)",
    machinePowerW: "Potencia de la Máquina (W)",
    postProcessingTimeHours: "Tiempo de Post-procesamiento (horas)",
    laborCostHour: "Costo de Mano de Obra (hora)",
    overheadCostHour: "Costos Generales (hora)",
    costBreakdown: "Desglose de Costos",
    materialCost: "Costo del Material:",
    electricityCost: "Costo de Electricidad:",
    laborCost: "Costo de Mano de Obra:",
    overheadCost: "Costos Generales:",
    subtotalWithoutMarkup: "Subtotal (sin margen):",
    finalPrice: "Precio Final:",
    howToUse: "Cómo Usar",
    howToUseText:
      "Para calcular el costo de tu impresión 3D, completa los campos en las secciones 'Especificaciones de Impresión' y 'Costos Adicionales'. La calculadora actualizará automáticamente el desglose de costos y el precio final. Puedes ajustar el porcentaje de margen para ver cómo afecta el precio final. Usa el selector de moneda para ver los resultados en tu moneda preferida.",
    currency: "Moneda",
    changeLanguage: "Cambiar Idioma",
  },
};

let currentLanguage = "en";

function changeLanguage(lang) {
  currentLanguage = lang;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    element.textContent = translations[lang][key];
  });
}

document.getElementById("changeLanguage").addEventListener("click", () => {
  currentLanguage = currentLanguage === "en" ? "es" : "en";
  changeLanguage(currentLanguage);
});

const currencySymbols = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CAD: "CA$",
  AUD: "A$",
  CHF: "Fr",
  CNY: "¥",
};

function calculateCosts() {
  const materialCostPerKg = parseFloat($("#materialCostPerKg").val()) || 0;
  const volume = parseFloat($("#volume").val()) || 0;
  const printTime = parseFloat($("#printTime").val()) || 0;
  const electricityRate = parseFloat($("#electricityRate").val()) || 0;
  const machinePower = parseFloat($("#machinePower").val()) || 0;
  const postProcessingTime = parseFloat($("#postProcessingTime").val()) || 0;
  const laborRate = parseFloat($("#laborRate").val()) || 0;
  const overheadRate = parseFloat($("#overheadRate").val()) || 0;
  const markup = parseFloat($("#markup").val()) || 0;
  const currency = $("#currency").val();

  // Calcula el costo del material
  const materialCost = ((materialCostPerKg * volume) / 1000).toFixed(2);

  // Calcula el costo de electricidad
  const electricityCost = (
    ((printTime * machinePower) / 1000) *
    electricityRate
  ).toFixed(2);

  // Calcula el costo de mano de obra
  const laborCost = (postProcessingTime * laborRate).toFixed(2);

  // Calcula el costo de los costos generales
  const overheadCost = (postProcessingTime * overheadRate).toFixed(2);

  // Calcula el subtotal
  const subtotal = (
    parseFloat(materialCost) +
    parseFloat(electricityCost) +
    parseFloat(laborCost) +
    parseFloat(overheadCost)
  ).toFixed(2);

  // Aplica el markup al subtotal para obtener el precio final
  const finalPrice = (parseFloat(subtotal) * (1 + markup / 100)).toFixed(2);

  // Obtiene el símbolo de la moneda
  const currencySymbol = currencySymbols[currency];

  // Actualiza los elementos del DOM con los valores calculados
  $("#materialCost").text(`${currencySymbol}${materialCost}`);
  $("#electricityCost").text(`${currencySymbol}${electricityCost}`);
  $("#laborCost").text(`${currencySymbol}${laborCost}`);
  $("#overheadCost").text(`${currencySymbol}${overheadCost}`);
  $("#subtotal").text(`${currencySymbol}${subtotal}`);
  $("#finalPrice").text(`${currencySymbol}${finalPrice}`);
}

function handleInput() {
  if ($(this).attr("id") === "markup") {
    $("#markupValue").text(`${$(this).val()}%`);
  }
  calculateCosts();
  saveToLocalStorage();
}

function saveToLocalStorage() {
  const data = {};
  $("input, select").each(function () {
    data[this.id] = $(this).val();
  });
  localStorage.setItem("calculatorData", JSON.stringify(data));
}

function loadFromLocalStorage() {
  const data = JSON.parse(localStorage.getItem("calculatorData"));
  if (data) {
    $.each(data, function (key, value) {
      const $input = $("#" + key);
      if ($input.length) {
        $input.val(value);
        if (key === "markup") {
          $("#markupValue").text(`${value}%`);
        }
      }
    });
    calculateCosts();
  }
}

function downloadImage() {
  html2canvas($("#costBreakdown")[0]).then(function (canvas) {
    var link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "Cost_Calculation.png";
    link.click();
  });
}

function downloadExcel() {
  const wb = XLSX.utils.book_new();

  // Tabla de entrada del usuario
  const userInputs = [
    ["Field", "Value"],
    ["Material", $("#material").val()],
    ["Material Cost (kg)", $("#materialCostPerKg").val()],
    ["Volume (cm³)", $("#volume").val()],
    ["Print Time (hours)", $("#printTime").val()],
    ["Markup (%)", $("#markup").val()],
    ["Electricity Cost (kWh)", $("#electricityRate").val()],
    ["Machine Power (W)", $("#machinePower").val()],
    ["Post-processing Time (hours)", $("#postProcessingTime").val()],
    ["Labor Cost (hour)", $("#laborRate").val()],
    ["Overhead Cost (hour)", $("#overheadRate").val()],
    ["Currency", $("#currency").val()],
  ];

  // Tabla de resultados
  const resultData = [
    ["Description", "Amount"],
    ["Material Cost", $("#materialCost").text()],
    ["Electricity Cost", $("#electricityCost").text()],
    ["Machine Cost", $("#machineCost").text()],
    ["Labor Cost", $("#laborCost").text()],
    ["Overhead Cost", $("#overheadCost").text()],
    ["Subtotal (without markup)", $("#subtotal").text()],
    ["Final Price", $("#finalPrice").text()],
  ];

  // Crear hojas de cálculo con formato
  const ws1 = XLSX.utils.aoa_to_sheet(userInputs);
  const ws2 = XLSX.utils.aoa_to_sheet(resultData);

  // Estilizar las hojas
  ws1["!cols"] = [{ wpx: 200 }, { wpx: 150 }];
  ws2["!cols"] = [{ wpx: 200 }, { wpx: 100 }];

  const headerStyle = {
    font: { bold: true },
    fill: { fgColor: { rgb: "FFFF00" } },
  };
  const amountStyle = { numFmt: "$#,##0.00" };

  // Aplicar estilo a la fila de encabezado en ambas hojas
  for (let col = 0; col < 2; col++) {
    const headerCell1 = XLSX.utils.encode_cell({ r: 0, c: col });
    ws1[headerCell1].s = headerStyle;
    const headerCell2 = XLSX.utils.encode_cell({ r: 0, c: col });
    ws2[headerCell2].s = headerStyle;
  }

  // Aplicar formato de moneda a las celdas de la columna B en la tabla de resultados
  for (let row = 1; row < resultData.length; row++) {
    const amountCell = XLSX.utils.encode_cell({ r: row, c: 1 });
    ws2[amountCell].s = amountStyle;
  }

  // Agregar las hojas al libro
  XLSX.utils.book_append_sheet(wb, ws1, "User Inputs");
  XLSX.utils.book_append_sheet(wb, ws2, "Cost Breakdown");

  // Guardar el archivo
  XLSX.writeFile(wb, "Cost_Calculation.xlsx");
}

function setDefaultValue() {
  $(this).each(function () {
    if ($(this).val().trim() === "") {
      $(this).val("0");
    }
  });
}

$(document).ready(function () {
  $("#downloadExcel").on("click", downloadExcel);
  $("#downloadImage").on("click", downloadImage);
  $('input[type="number"]').on("blur", setDefaultValue);
  $("input, select").on("blur", handleInput);
  $("input, select").on("input", handleInput);

  // Cargar datos desde localStorage al cargar la página
  loadFromLocalStorage();
});
