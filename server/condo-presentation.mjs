import {buyerPresentation} from './buyer-presentation.mjs';
// Reuse the accepted acquisition shell; the canonical questionnaire is untouched.
export function condoPresentation(html){
 if(!html.includes('id="entry-data"')||!html.includes('id="entry-review"'))return html;
 return buyerPresentation(html)
 .replace('Buying a home? Review insurance with Dylan — 408FARMERS','Condo insurance review with Dylan — Farmers Insurance')
 .replace('professional-entry buyer-entry','professional-entry buyer-entry condo-entry')
 .replace('</head>','<link rel="stylesheet" href="/shared/condo-entry.css?v=CONDO-1.0"></head>')
 .replace(/<header class="professional-brand">[\s\S]*?<\/header>/,'<header class="professional-brand"><img src="/shared/assets/farmers-insurance-official.svg" alt="Farmers Insurance" width="100" height="54"><a href="/" aria-label="Virginia Tam Insurance Agency home">Virginia Tam<br>Insurance Agency, Inc.</a></header>')
 .replace('Buying a home in California?','Condo insurance in California')
 .replace('Let’s get the insurance side ready for closing.','Let’s review the coverage your condo may need.')
 .replace('Tell me where you are in the buying process. I’ll personally help you review your insurance options and next steps.','Whether you’re buying a condo or reviewing your current policy, I’ll personally help you explore your insurance options.')
 .replace('A review does not bind coverage or guarantee coverage before closing.','A review does not bind coverage. HOA responsibilities and available coverage vary.')
 .replace('href="/condo/legacy.html">Existing review or appointment','href="/contact/">Help with an existing review or appointment')
 .replace('Call 408-FARMERS · (408) 327-6377','Call (408) 327-6377 · 408-FARMERS');
}
