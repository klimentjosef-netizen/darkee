// Odesílání e-mailů přes Resend. Bez klíče RESEND_API_KEY je odesílání vypnuté
// a připomínky se na webu vůbec nenabízejí.

const FROM = process.env.MAIL_FROM || 'Dárkee <pripominky@darkee.cz>'

export function mailEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY)
}

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL || 'https://www.darkee.cz').replace(/\/$/, '')
}

export async function sendMail(to: string, subject: string, html: string): Promise<boolean> {
  if (!mailEnabled()) return false
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    })
    if (!res.ok) console.error('Mail failed:', res.status, (await res.text()).slice(0, 300))
    return res.ok
  } catch (error) {
    console.error('Mail failed:', error instanceof Error ? error.message : error)
    return false
  }
}

// Jednoduchá šablona: text, jedno tlačítko a patička s odhlášením
export function mailLayout(opts: { heading: string; body: string; button?: { label: string; url: string }; footer?: string }): string {
  const button = opts.button
    ? `<p style="margin:28px 0"><a href="${opts.button.url}" style="background:#C9A84C;color:#080806;text-decoration:none;font-weight:600;padding:14px 28px;border-radius:999px;display:inline-block">${opts.button.label}</a></p>`
    : ''
  return `<!doctype html><html lang="cs"><body style="margin:0;background:#F3F1EC;font-family:Arial,Helvetica,sans-serif;color:#1A1814">
<div style="max-width:520px;margin:0 auto;padding:32px 24px">
<p style="font-size:20px;color:#8A6B2A;margin:0 0 24px">Dárkee</p>
<h1 style="font-size:24px;line-height:1.25;margin:0 0 16px">${opts.heading}</h1>
<p style="font-size:16px;line-height:1.6;margin:0">${opts.body}</p>
${button}
<p style="font-size:13px;line-height:1.6;color:#6B6358;margin:32px 0 0">${opts.footer || ''}</p>
</div></body></html>`
}
