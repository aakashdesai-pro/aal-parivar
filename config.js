/**
 * Temple / Madh Static Configuration
 * This file is loaded directly by index.html so it works seamlessly
 * even when opening index.html directly via file:/// in your browser.
 */
const TEMPLE_CONFIG = {
  "deityNames": [
    "જય લીંબોજ માં",
    "જય મોમાઈ માં",
    "જય મેલડી માં",
    "જય ગોગા મહારાજ"
  ],
  "tagline": "“શ્રદ્ધા, સેવા અને સંગઠન”",
  "purposeLine": "",
  "villageLine": "ગામ : ભેચડા",
  "footerLine1": "આલ પરિવાર મઢ - ભેચડા",
  "footerLine2": "મઢના વિકાસ અર્થે આપનું મૂલ્ય યોગદાન આપવા બદલ",
  "footerLine3": "ખુબ ખુબ આભાર...."
};

if (typeof window !== 'undefined') {
  window.TEMPLE_CONFIG = TEMPLE_CONFIG;
}
