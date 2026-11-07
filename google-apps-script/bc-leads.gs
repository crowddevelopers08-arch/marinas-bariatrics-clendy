// Google Apps Script - ONE webhook for BOTH forms. Nothing of the original flow is removed.
//   - "herinas leads"   form  -> "HC-leads" sheet  (original flow, unchanged, default)
//   - "Bariatric leads" form  -> "BC-leads" sheet  (new)
// Every lead is ALSO written to the original "Submissions" sheet, exactly as before.
// Deploy as Web app (Execute as: Me, Who has access: Anyone) and put the /exec URL in
// GOOGLE_APPS_SCRIPT_URL in .env.

const SUBMISSIONS_SHEET = "Submissions";
const HC_SHEET = "HC-leads";
const BC_SHEET = "BC-leads";

const SUBMISSIONS_HEADERS = [
  "Timestamp",
  "Source",
  "Name",
  "Phone",
  "Email",
  "Condition",
  "Preferred Time",
  "Note",
  "URL",
  "TeleCRM",
];

const HC_HEADERS = [
  "Timestamp",
  "Form Name",
  "Source",
  "First Name",
  "Last Name",
  "Email",
  "Phone",
  "Location",
  "Appointment Date",
  "Appointment Time",
  "Symptom Type",
  "Surgery Advised",
  "Previous Consult",
  "Page URL",
  "TeleCRM",
];

// BC-leads uses the same columns as HC-leads
const BC_HEADERS = HC_HEADERS;

function getSheet(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);

  if (!sheet) {
    sheet = ss.insertSheet(name);
  }

  const firstRow = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  if (!firstRow.some(String)) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  return sheet;
}

function doPost(e) {
  try {
    const body = e && e.postData && e.postData.contents
      ? JSON.parse(e.postData.contents)
      : {};

    // Bariatric form -> BC-leads. Anything else -> HC-leads (original behaviour).
    const isBariatric = String(body.formName || "").toLowerCase() === "bariatric leads";

    const timestamp = body.timestamp || new Date();
    const source = body.source || (isBariatric ? "Bariatric-BC" : "Herinas-HC");
    const fullName = [body.firstName, body.lastName].filter(Boolean).join(" ") || body.name || "";
    const preferredTime = [body.appointmentDate, body.appointmentTime].filter(Boolean).join(" ");
    const note = [
      body.location ? "Location: " + body.location : "",
      body.hadSurgery ? "Surgery advised: " + body.hadSurgery : "",
      body.prevConsult ? "Prev consult: " + body.prevConsult : "",
    ].filter(Boolean).join(" | ") || body.note || "";

    // Original "Submissions" sheet (same columns as before)
    const submissionsRow = [
      timestamp,
      source,
      fullName,
      body.phone ? String(body.phone) : "",
      body.email || "",
      body.symptomType || body.condition || body.concern || "",
      preferredTime,
      note,
      body.pageUrl || body.url || "",
      body.telecrm || "",
    ];

    // Form-specific sheet row (HC-leads or BC-leads)
    const leadRow = [
      timestamp,
      body.formName || (isBariatric ? "Bariatric leads" : "herinas leads"),
      source,
      body.firstName || "",
      body.lastName || "",
      body.email || "",
      body.phone ? String(body.phone) : "",
      body.location || "",
      body.appointmentDate || "",
      body.appointmentTime || "",
      body.symptomType || "",
      body.hadSurgery || "",
      body.prevConsult || "",
      body.pageUrl || body.url || "",
      body.telecrm || "",
    ];

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      getSheet(SUBMISSIONS_SHEET, SUBMISSIONS_HEADERS).appendRow(submissionsRow);
      if (isBariatric) {
        getSheet(BC_SHEET, BC_HEADERS).appendRow(leadRow);
      } else {
        getSheet(HC_SHEET, HC_HEADERS).appendRow(leadRow);
      }
    } finally {
      lock.releaseLock();
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, message: "Submissions + HC-leads + BC-leads webhook is live" }))
    .setMimeType(ContentService.MimeType.JSON);
}
