/* 408-IDSAFE-1.0 public identity registry.
   Public facts are centralized here. No unverified organization license number is inferred. */
(function(root){
  'use strict';
  root.IDSAFE_IDENTITY=Object.freeze({
    build:'408-BRAND-CONVERGENCE-1.1',
    person:Object.freeze({
      name:'Dylan Haysbert',
      title:'Insurance Producer',
      individualLicense:'4528400'
    }),
    operator:Object.freeze({
      legalName:'Virginia Tam Insurance Agency, Inc.',
      address:'833 Corporate Way, Fremont, CA 94539',
      organizationLicense:'0D79616',
      organizationLicenseStatus:'USER_CONFIRMED'
    }),
    contact:Object.freeze({
      displayPhone:'(408) 327-6377',
      e164:'+14083276377',
      mnemonic:'408-FARMERS',
      email:'dylan.vtam@farmersagency.com'
    }),
    carrierCredential:Object.freeze({
      relationship:'Farmers Insurance Producer',
      asset:'/shared/assets/farmers-authorized-agency.png',
      enabled:true,
      status:'USER_SUPPLIED_AUTHORIZED_AGENCY_ASSET'
    }),
    coverageFit:Object.freeze({
      publicName:'CoverageFit',
      experienceName:'CoverageFit Snapshot'
    }),
    local:Object.freeze({
      publicName:'408 Local',
      tagline:'Supporting the businesses that make the South Bay feel like home.',
      mission:'Let’s build a stronger South Bay together.'
    })
  });
})(window);
