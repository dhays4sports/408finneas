// Presentation only: preserve CoverageFit's canonical state, options and client.
export const PROFESSIONS = Object.freeze({tech:'technology',healthcare:'healthcare',engineers:'engineering',teachers:'education'});
export function professionalPresentation(html, entry) {
  const profession=PROFESSIONS[entry];
  if(!profession)return html;
  // Fail safely if the upstream contract changes; never replace an unknown form.
  if(!html.includes('id="entry-data"') || !html.includes('id="entry-review"'))return html;
  const headline='Your career may come with an insurance perk.';
  return html.replace(/<title>[^<]*<\/title>/,`<title>${profession[0].toUpperCase()+profession.slice(1)} professionals — 408FARMERS</title>`)
    .replace('</head>','<link rel="stylesheet" href="/shared/professional-entry.css?v=1"></head>')
    .replace('<body>','<body class="professional-entry">')
    .replace('<a href="/">408FARMERS</a>', '<header class="professional-brand"><a href="/" aria-label="408FARMERS home">408<span>FARMERS</span></a><img src="/shared/assets/farmers-insurance-official.svg" alt="Farmers Insurance" width="100" height="54"></header>')
    .replace(/<h1>[^<]*<\/h1><p>[^<]*<\/p>/,`<div class="professional-intro"><p class="professional-audience">For ${profession} professionals</p><h1>${headline}</h1><p class="professional-summary">Some ${profession} professionals may qualify for additional insurance discounts. I’ll personally review what may apply to your coverage.</p><p class="professional-reassurance">Personalized review <span>·</span> No obligation <span>·</span> Quick review</p></div>`)
    .replace(/<p class="identity">[\s\S]*?<\/p>/,'<div class="professional-advisor"><img src="/shared/images/dylan-headshot-160.webp" alt="Dylan Haysbert" width="48" height="48"><p><strong>Dylan Haysbert</strong><br>Insurance Advisor · California</p></div>')
    .replace('What are you looking for help with?','What would you like me to review?')
    .replace('About 1–2 minutes. No obligation. No quote or policy change happens automatically.','Discounts subject to eligibility, underwriting, and policy terms. A review does not bind coverage. No quote or policy change happens automatically.')
    .replace('<p id="entry-status"', '<aside class="professional-trust"><h2>Personally reviewed by Dylan Haysbert</h2><p>“If you’re already in a good spot, I’ll tell you. If there’s something worth improving, I’ll show you your options.”</p><p class="professional-next">After you send your request, I’ll review your answers and follow up using your chosen contact method.</p></aside><p id="entry-status"')
    .replace('</main>','<footer class="professional-footer">Dylan Haysbert · Insurance Advisor<br>Virginia Tam Insurance Agency, Inc.<br>CA Insurance License #4528400 · Serving California</footer></main>')
    .replace(`href="/${entry}/">Existing review or appointment`,`href="/${entry}/legacy.html">Existing review or appointment`);
}
