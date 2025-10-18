const incomeInput = document.getElementById("incomeInput");
const incomeRange = document.getElementById("income");
const incomeValue = document.getElementById("incomeValue");

const taxInput = document.getElementById("taxInput");
const taxRange = document.getElementById("taxdeducted");
const taxValue = document.getElementById("taxValue");

const rrspInput = document.getElementById("rrspInput");
const rrspRange = document.getElementById("rrspRange");
const rrspValue = document.getElementById("rrspValue");

function updateIncome(value){
  incomeInput.value = value;
  incomeValue.textContent = Number(value).toLocaleString();
}
function updateIncomeFromBox(value){
  incomeRange.value = value;
  incomeValue.textContent = Number(value).toLocaleString();
}
function updateTax(value){
  taxInput.value = value;
  taxValue.textContent = Number(value).toLocaleString();
}
function updateTaxFromBox(value){
  taxRange.value = value;
  taxValue.textContent = Number(value).toLocaleString();
}
function updateRRSP(value){
  rrspInput.value = value;
  rrspRange.value = value;
  rrspValue.textContent = Number(value).toLocaleString();
}

const federalBrackets = [
  { limit: 57375, rate: 0.145 },
  { limit: 114750, rate: 0.205 },
  { limit: 177882, rate: 0.26 },
  { limit: 253414, rate: 0.29 },
  { limit: Infinity, rate: 0.33 }
];

const provinces = {
  Ontario: [
    { limit: 52886, rate: 0.0505 },
    { limit: 105775, rate: 0.0915 },
    { limit: 150000, rate: 0.1116 },
    { limit: 220000, rate: 0.1216 },
    { limit: Infinity, rate: 0.1316 }
  ],
  "British Columbia": [
    { limit: 49279, rate: 0.0506 },
    { limit: 98560, rate: 0.077 },
    { limit: 113158, rate: 0.105 },
    { limit: 137407, rate: 0.1229 },
    { limit: 186306, rate: 0.147 },
    { limit: 259829, rate: 0.168 },
    { limit: Infinity, rate: 0.205 }
  ],
  Alberta: [
    { limit: 60000, rate: 0.08 },
    { limit: 151234, rate: 0.10 },
    { limit: 181481, rate: 0.12 },
    { limit: 241974, rate: 0.13 },
    { limit: 362961, rate: 0.14 },
    { limit: Infinity, rate: 0.15 }
  ]
};

function calculateTax(){
  let income = Number(incomeInput.value);
  let taxDeducted = Number(taxInput.value);
  let rrsp = Number(rrspInput.value);
  let province = document.getElementById("provinceSelect").value;

  let taxableIncome = income - rrsp;

  // Federal Tax
  let federalTax = 0;
  let prevLimit = 0;
  for(let bracket of federalBrackets){
    let amount = Math.min(taxableIncome, bracket.limit) - prevLimit;
    if(amount > 0) federalTax += amount * bracket.rate;
    prevLimit = bracket.limit;
    if(taxableIncome <= bracket.limit) break;
  }

  // Provincial Tax
  let provTax = 0;
  prevLimit = 0;
  let provBrackets = provinces[province] || provinces["Ontario"];
  for(let bracket of provBrackets){
    let amount = Math.min(taxableIncome, bracket.limit) - prevLimit;
    if(amount > 0) provTax += amount * bracket.rate;
    prevLimit = bracket.limit;
    if(taxableIncome <= bracket.limit) break;
  }

  let totalTax = federalTax + provTax;
  let refund = taxDeducted - totalTax;

  let messageEl = document.getElementById("resultMessage");
  if(refund > 0){
    messageEl.innerHTML = `You will get a refund of <span style="color:green; font-weight:600;">$${refund.toLocaleString()}</span> this year. This is an estimate and actual refund may vary based on deductions and credits.`;
  } else {
    messageEl.innerHTML = `You owe <span style="color:red; font-weight:600;">$${Math.abs(refund).toLocaleString()}</span> in taxes this year. This is an estimate and actual tax may vary based on deductions and credits.`;
  }
}

