// Decorate only the canonical buyer HTML; never replace the intake contract.
export function buyerPresentation(html){
 if(!html.includes('id="entry-data"')||!html.includes('id="entry-review"'))return html;
 return html.replace(/<title>[^<]*<\/title>/,'<title>Buying a home? Review insurance with Dylan — 408FARMERS</title>')
 .replace('</head>','<link rel="stylesheet" href="/shared/professional-entry.css?v=1"><link rel="stylesheet" href="/shared/buyer-entry.css?v=1"></head>')
 .replace('<body>','<body class="professional-entry buyer-entry">')
 .replace('<a href="/">408FARMERS</a>','<header class="professional-brand"><a href="/" aria-label="408FARMERS home">408<span>FARMERS</span></a><img src="/shared/assets/farmers-insurance-official.svg" alt="Farmers Insurance" width="100" height="54"></header>')
 .replace(/<h1>[^<]*<\/h1><p>[^<]*<\/p>/,'<div class="professional-intro"><p class="professional-audience">Buying a home in California?</p><h1>Let’s get the insurance side ready for closing.</h1><p class="professional-summary">Tell me where you are in the buying process. I’ll personally help you review your insurance options and next steps.</p></div>')
 .replace(/<p class="identity">[\s\S]*?<\/p>/,'<div class="professional-advisor"><img src="/shared/images/dylan-headshot-160.webp" alt="Dylan Haysbert" width="48" height="48"><p><strong>Dylan Haysbert</strong><br>Your local Farmers Insurance Advisor</p></div>')
 .replace('About 1–2 minutes. No obligation. No quote or policy change happens automatically.','No obligation. Coverage and availability are subject to underwriting. A review does not bind coverage or guarantee coverage before closing.')
 .replace('<p id="entry-status"','<p id="entry-status"')
 .replace('href="/buyer/legacy.html">Existing review or appointment','href="/contact/">Help with an existing review or appointment')
 .replace('</main>','<aside class="professional-trust"><h2>A personal next step</h2><p>I’ll review what you share and follow up using your chosen contact method. No appointment is required.</p><p>Already started here? Your saved review can resume in this browser for up to seven days. For an existing appointment, use your original confirmation link or contact me.</p><a href="tel:+14083276377">Call 408-FARMERS · (408) 327-6377</a></aside><footer class="professional-footer">Dylan Haysbert · Insurance Advisor<br>Virginia Tam Insurance Agency, Inc.<br>CA Insurance License #4528400 · Serving California</footer></main>');
}
