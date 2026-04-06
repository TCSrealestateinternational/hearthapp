import type { User, Transaction, ChecklistItem, Property, EmotionalLog } from "@/types";

interface ExportData {
  user: User;
  transactions: Transaction[];
  checklistItems?: ChecklistItem[];
  properties?: Property[];
  emotionalLogs?: EmotionalLog[];
}

export function exportClientPDF(data: ExportData) {
  const { user, transactions, checklistItems, properties, emotionalLogs } = data;

  const row = (label: string, value: string | null | undefined) =>
    value ? `<tr><td style="padding:6px 10px;color:#6b7280;width:40%">${label}</td><td style="padding:6px 10px;font-weight:500">${value}</td></tr>` : "";

  const section = (title: string, content: string) =>
    content.trim() ? `<h2 style="color:#0c414e;font-size:15px;margin-top:24px">${title}</h2>${content}` : "";

  const table = (rows: string) =>
    rows.trim() ? `<table style="width:100%;border-collapse:collapse;font-size:13px;border:1px solid #e5e7eb"><tbody>${rows}</tbody></table>` : "";

  // Profile
  const profileRows = [
    row("Name", user.displayName),
    row("Email", user.email),
    row("Phone", user.phone || null),
    row("Roles", user.roles.join(", ")),
    row("Status", user.status),
  ].join("");

  // Transactions
  const txHtml = transactions.length > 0
    ? `<table style="width:100%;border-collapse:collapse;font-size:13px;border:1px solid #e5e7eb">
       <thead><tr style="background:#0c414e;color:white"><th style="padding:6px 10px;text-align:left">Label</th><th style="padding:6px 10px;text-align:left">Type</th><th style="padding:6px 10px;text-align:left">Status</th></tr></thead>
       <tbody>${transactions.map((tx) => `<tr><td style="padding:6px 10px">${tx.label}</td><td style="padding:6px 10px;text-transform:capitalize">${tx.type}</td><td style="padding:6px 10px;text-transform:capitalize">${tx.status}</td></tr>`).join("")}</tbody></table>`
    : "";

  // Checklist
  const checklistHtml = checklistItems && checklistItems.length > 0
    ? `<div style="font-size:13px">${checklistItems.map((item) =>
        `<div style="padding:4px 0;display:flex;gap:8px;align-items:center">
           <span style="color:${item.completed ? "#0c414e" : "#d1d5db"};font-size:16px">${item.completed ? "&#9745;" : "&#9744;"}</span>
           <span style="${item.completed ? "text-decoration:line-through;color:#9ca3af" : ""}">${item.label}</span>
         </div>`
      ).join("")}</div>`
    : "";

  // Properties
  const propsHtml = properties && properties.length > 0
    ? `<table style="width:100%;border-collapse:collapse;font-size:13px;border:1px solid #e5e7eb">
       <thead><tr style="background:#0c414e;color:white"><th style="padding:6px 10px;text-align:left">Address</th><th style="padding:6px 10px;text-align:left">Price</th><th style="padding:6px 10px;text-align:left">Status</th><th style="padding:6px 10px;text-align:left">Rating</th></tr></thead>
       <tbody>${properties.map((p) =>
         `<tr><td style="padding:6px 10px">${p.address}, ${p.city}</td><td style="padding:6px 10px">$${p.price.toLocaleString()}</td><td style="padding:6px 10px;text-transform:capitalize">${p.status}</td><td style="padding:6px 10px">${"★".repeat(p.rating)}${"☆".repeat(5 - p.rating)}</td></tr>`
       ).join("")}</tbody></table>`
    : "";

  // Emotional logs
  const emotionalHtml = emotionalLogs && emotionalLogs.length > 0
    ? `<table style="width:100%;border-collapse:collapse;font-size:13px;border:1px solid #e5e7eb">
       <thead><tr style="background:#0c414e;color:white"><th style="padding:6px 10px;text-align:left">Date</th><th style="padding:6px 10px;text-align:left">Mood</th><th style="padding:6px 10px;text-align:left">Notes</th></tr></thead>
       <tbody>${emotionalLogs.map((log) =>
         `<tr><td style="padding:6px 10px">${log.createdAt instanceof Date ? log.createdAt.toLocaleDateString() : ""}</td><td style="padding:6px 10px;text-transform:capitalize">${log.mood}</td><td style="padding:6px 10px">${log.notes || "—"}</td></tr>`
       ).join("")}</tbody></table>`
    : "";

  const html = `<html><head><title>${user.displayName} — Hearth</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; padding: 28px; color: #1f2937; max-width: 700px; margin: 0 auto; }
    h1 { color: #0c414e; font-size: 20px; margin-bottom: 2px; }
    h2 { margin-bottom: 8px; }
    table { border-radius: 6px; overflow: hidden; }
    tr:nth-child(even) { background: #f9fafb; }
    td, th { border-bottom: 1px solid #f3f4f6; }
    .badge { display: inline-block; padding: 2px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; background: rgba(12,65,78,0.1); color: #0c414e; }
    @media print { body { padding: 0; } }
  </style></head><body>
  <h1>${user.displayName}</h1>
  <span class="badge">${user.roles.join(" / ")}</span>
  <span style="font-size:12px;color:#9ca3af;margin-left:8px">Exported ${new Date().toLocaleDateString()}</span>
  ${section("Profile", table(profileRows))}
  ${section("Transactions", txHtml)}
  ${section("Checklist", checklistHtml)}
  ${section("Properties", propsHtml)}
  ${section("Emotional Check-ins", emotionalHtml)}
  </body></html>`;

  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.onload = () => { win.print(); };
}
