import React from 'react';

// Official National Emblem of Bangladesh (গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের প্রতীক - ফুল কালার সিল)
export const BangladeshEmblem: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/bd-govt-seal.svg"
      alt="গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের প্রতীক"
      className={`${className} object-contain shrink-0`}
      crossOrigin="anonymous"
    />
  );
};

// Official Golden Security Watermark Emblem for Front Card Particulars Background (National_emblem_of_Bangladesh.svg)
export const GoldenWatermarkEmblem: React.FC<{
  className?: string;
  style?: React.CSSProperties;
}> = ({ className = 'w-28 h-28', style }) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/National_emblem_of_Bangladesh.svg"
      alt="বাংলাদেশের জাতীয় প্রতীক জলছাপ"
      className={`${className} object-contain select-none pointer-events-none`}
      style={style}
      crossOrigin="anonymous"
    />
  );
};

// Default Watermark alias
export const WatermarkEmblem = GoldenWatermarkEmblem;

// Authority Signature with Golden Official Stamp Behind Cursive Stroke
export const IssuingAuthoritySignature: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-8 flex items-center justify-center">
        {/* Faint Golden Round Stamp behind signature */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
          <svg viewBox="0 0 44 44" className="w-9 h-9" fill="none">
            <circle cx="22" cy="22" r="20" stroke="#D4AF37" strokeWidth="1.2" />
            <circle cx="22" cy="22" r="17.5" stroke="#D4AF37" strokeWidth="0.6" strokeDasharray="2 1.5" />
            <circle cx="22" cy="22" r="14" stroke="#D4AF37" strokeWidth="0.5" />
            {/* Center mini lily icon */}
            <path d="M22 17 C21 21, 21 24, 22 26 C23 24, 23 21, 22 17 Z" fill="#D4AF37" />
            <path d="M19 23 C17 25, 20 26, 22 27 C24 26, 27 25, 25 23" stroke="#D4AF37" strokeWidth="0.6" />
          </svg>
        </div>

        {/* Cursive Signature Stroke in Black */}
        <svg viewBox="0 0 84 28" className="w-16 h-7 text-black relative z-10" fill="none" stroke="currentColor">
          <path
            d="M8 22 C 14 7, 20 23, 27 8 C 31 16, 35 7, 40 19 C 45 10, 51 22, 58 11 C 64 18, 70 7, 76 15 C 79 11, 82 14, 84 12"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18 23 C 32 19, 52 20, 78 19"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <span className="text-[7.5px] text-black font-normal font-nikosh leading-tight mt-0.5">
        প্রদানকারী কর্তৃপক্ষের স্বাক্ষর
      </span>
    </div>
  );
};

// Bangladesh NID 2D PDF417 Barcode (Exact match with user's back side barcode)
export const Pdf417NidBarcode: React.FC<{ className?: string }> = ({ className = 'w-full h-8' }) => {
  return (
    <div className={`flex items-center justify-between bg-white overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 340 38"
        className="w-full h-full"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Start Pattern (Solid bar + narrow bars) */}
        <rect x="0" y="0" width="4" height="38" fill="black" />
        <rect x="6" y="0" width="1.5" height="38" fill="black" />
        <rect x="9.5" y="0" width="3" height="38" fill="black" />
        <rect x="14" y="0" width="1.5" height="38" fill="black" />

        {/* Dense PDF417 Matrix Pattern Rows */}
        {/* Row 1 */}
        <rect x="18" y="0" width="4" height="12" fill="black" />
        <rect x="24" y="0" width="2" height="12" fill="black" />
        <rect x="28" y="0" width="5" height="12" fill="black" />
        <rect x="35" y="0" width="2" height="12" fill="black" />
        <rect x="40" y="0" width="6" height="12" fill="black" />
        <rect x="48" y="0" width="2" height="12" fill="black" />
        <rect x="52" y="0" width="4" height="12" fill="black" />
        <rect x="58" y="0" width="3" height="12" fill="black" />
        <rect x="64" y="0" width="5" height="12" fill="black" />
        <rect x="71" y="0" width="2" height="12" fill="black" />
        <rect x="76" y="0" width="7" height="12" fill="black" />
        <rect x="85" y="0" width="2" height="12" fill="black" />
        <rect x="89" y="0" width="4" height="12" fill="black" />
        <rect x="95" y="0" width="3" height="12" fill="black" />
        <rect x="100" y="0" width="5" height="12" fill="black" />
        <rect x="108" y="0" width="2" height="12" fill="black" />
        <rect x="112" y="0" width="6" height="12" fill="black" />
        <rect x="120" y="0" width="3" height="12" fill="black" />
        <rect x="125" y="0" width="4" height="12" fill="black" />
        <rect x="131" y="0" width="2" height="12" fill="black" />
        <rect x="135" y="0" width="5" height="12" fill="black" />
        <rect x="142" y="0" width="3" height="12" fill="black" />
        <rect x="148" y="0" width="6" height="12" fill="black" />
        <rect x="156" y="0" width="2" height="12" fill="black" />
        <rect x="160" y="0" width="4" height="12" fill="black" />
        <rect x="166" y="0" width="3" height="12" fill="black" />
        <rect x="171" y="0" width="7" height="12" fill="black" />
        <rect x="180" y="0" width="2" height="12" fill="black" />
        <rect x="184" y="0" width="5" height="12" fill="black" />
        <rect x="191" y="0" width="3" height="12" fill="black" />
        <rect x="196" y="0" width="4" height="12" fill="black" />
        <rect x="202" y="0" width="2" height="12" fill="black" />
        <rect x="206" y="0" width="6" height="12" fill="black" />
        <rect x="214" y="0" width="3" height="12" fill="black" />
        <rect x="219" y="0" width="5" height="12" fill="black" />
        <rect x="226" y="0" width="2" height="12" fill="black" />
        <rect x="230" y="0" width="4" height="12" fill="black" />
        <rect x="236" y="0" width="3" height="12" fill="black" />
        <rect x="241" y="0" width="6" height="12" fill="black" />
        <rect x="249" y="0" width="2" height="12" fill="black" />
        <rect x="253" y="0" width="5" height="12" fill="black" />
        <rect x="260" y="0" width="3" height="12" fill="black" />
        <rect x="265" y="0" width="4" height="12" fill="black" />
        <rect x="271" y="0" width="2" height="12" fill="black" />
        <rect x="275" y="0" width="6" height="12" fill="black" />
        <rect x="283" y="0" width="3" height="12" fill="black" />
        <rect x="288" y="0" width="4" height="12" fill="black" />
        <rect x="294" y="0" width="2" height="12" fill="black" />
        <rect x="298" y="0" width="5" height="12" fill="black" />
        <rect x="305" y="0" width="3" height="12" fill="black" />
        <rect x="310" y="0" width="6" height="12" fill="black" />
        <rect x="318" y="0" width="2" height="12" fill="black" />
        <rect x="322" y="0" width="3" height="12" fill="black" />

        {/* Row 2 */}
        <rect x="18" y="13" width="2" height="12" fill="black" />
        <rect x="22" y="13" width="5" height="12" fill="black" />
        <rect x="29" y="13" width="3" height="12" fill="black" />
        <rect x="34" y="13" width="6" height="12" fill="black" />
        <rect x="42" y="13" width="2" height="12" fill="black" />
        <rect x="46" y="13" width="4" height="12" fill="black" />
        <rect x="52" y="13" width="3" height="12" fill="black" />
        <rect x="57" y="13" width="6" height="12" fill="black" />
        <rect x="65" y="13" width="2" height="12" fill="black" />
        <rect x="69" y="13" width="5" height="12" fill="black" />
        <rect x="76" y="13" width="3" height="12" fill="black" />
        <rect x="81" y="13" width="4" height="12" fill="black" />
        <rect x="87" y="13" width="2" height="12" fill="black" />
        <rect x="91" y="13" width="6" height="12" fill="black" />
        <rect x="99" y="13" width="3" height="12" fill="black" />
        <rect x="104" y="13" width="5" height="12" fill="black" />
        <rect x="111" y="13" width="2" height="12" fill="black" />
        <rect x="115" y="13" width="4" height="12" fill="black" />
        <rect x="121" y="13" width="3" height="12" fill="black" />
        <rect x="126" y="13" width="6" height="12" fill="black" />
        <rect x="134" y="13" width="2" height="12" fill="black" />
        <rect x="138" y="13" width="5" height="12" fill="black" />
        <rect x="145" y="13" width="3" height="12" fill="black" />
        <rect x="150" y="13" width="4" height="12" fill="black" />
        <rect x="156" y="13" width="2" height="12" fill="black" />
        <rect x="160" y="13" width="7" height="12" fill="black" />
        <rect x="169" y="13" width="2" height="12" fill="black" />
        <rect x="173" y="13" width="4" height="12" fill="black" />
        <rect x="179" y="13" width="3" height="12" fill="black" />
        <rect x="184" y="13" width="5" height="12" fill="black" />
        <rect x="191" y="13" width="2" height="12" fill="black" />
        <rect x="195" y="13" width="6" height="12" fill="black" />
        <rect x="203" y="13" width="3" height="12" fill="black" />
        <rect x="208" y="13" width="4" height="12" fill="black" />
        <rect x="214" y="13" width="2" height="12" fill="black" />
        <rect x="218" y="13" width="5" height="12" fill="black" />
        <rect x="225" y="13" width="3" height="12" fill="black" />
        <rect x="230" y="13" width="6" height="12" fill="black" />
        <rect x="238" y="13" width="2" height="12" fill="black" />
        <rect x="242" y="13" width="4" height="12" fill="black" />
        <rect x="248" y="13" width="3" height="12" fill="black" />
        <rect x="253" y="13" width="5" height="12" fill="black" />
        <rect x="260" y="13" width="2" height="12" fill="black" />
        <rect x="264" y="13" width="6" height="12" fill="black" />
        <rect x="272" y="13" width="3" height="12" fill="black" />
        <rect x="277" y="13" width="4" height="12" fill="black" />
        <rect x="283" y="13" width="2" height="12" fill="black" />
        <rect x="287" y="13" width="5" height="12" fill="black" />
        <rect x="294" y="13" width="3" height="12" fill="black" />
        <rect x="299" y="13" width="6" height="12" fill="black" />
        <rect x="307" y="13" width="2" height="12" fill="black" />
        <rect x="311" y="13" width="4" height="12" fill="black" />
        <rect x="317" y="13" width="3" height="12" fill="black" />
        <rect x="322" y="13" width="3" height="12" fill="black" />

        {/* Row 3 */}
        <rect x="18" y="26" width="3" height="12" fill="black" />
        <rect x="23" y="26" width="4" height="12" fill="black" />
        <rect x="29" y="26" width="2" height="12" fill="black" />
        <rect x="33" y="26" width="5" height="12" fill="black" />
        <rect x="40" y="26" width="3" height="12" fill="black" />
        <rect x="45" y="26" width="6" height="12" fill="black" />
        <rect x="53" y="26" width="2" height="12" fill="black" />
        <rect x="57" y="26" width="4" height="12" fill="black" />
        <rect x="63" y="26" width="3" height="12" fill="black" />
        <rect x="68" y="26" width="7" height="12" fill="black" />
        <rect x="77" y="26" width="2" height="12" fill="black" />
        <rect x="81" y="26" width="5" height="12" fill="black" />
        <rect x="88" y="26" width="3" height="12" fill="black" />
        <rect x="93" y="26" width="4" height="12" fill="black" />
        <rect x="99" y="26" width="2" height="12" fill="black" />
        <rect x="103" y="26" width="6" height="12" fill="black" />
        <rect x="111" y="26" width="3" height="12" fill="black" />
        <rect x="116" y="26" width="4" height="12" fill="black" />
        <rect x="122" y="26" width="2" height="12" fill="black" />
        <rect x="126" y="26" width="5" height="12" fill="black" />
        <rect x="133" y="26" width="3" height="12" fill="black" />
        <rect x="138" y="26" width="6" height="12" fill="black" />
        <rect x="146" y="26" width="2" height="12" fill="black" />
        <rect x="150" y="26" width="4" height="12" fill="black" />
        <rect x="156" y="26" width="3" height="12" fill="black" />
        <rect x="161" y="26" width="5" height="12" fill="black" />
        <rect x="168" y="26" width="2" height="12" fill="black" />
        <rect x="172" y="26" width="6" height="12" fill="black" />
        <rect x="180" y="26" width="3" height="12" fill="black" />
        <rect x="185" y="26" width="4" height="12" fill="black" />
        <rect x="191" y="26" width="2" height="12" fill="black" />
        <rect x="195" y="26" width="5" height="12" fill="black" />
        <rect x="202" y="26" width="3" height="12" fill="black" />
        <rect x="207" y="26" width="7" height="12" fill="black" />
        <rect x="216" y="26" width="2" height="12" fill="black" />
        <rect x="220" y="26" width="4" height="12" fill="black" />
        <rect x="226" y="26" width="3" height="12" fill="black" />
        <rect x="231" y="26" width="5" height="12" fill="black" />
        <rect x="238" y="26" width="2" height="12" fill="black" />
        <rect x="242" y="26" width="6" height="12" fill="black" />
        <rect x="250" y="26" width="3" height="12" fill="black" />
        <rect x="255" y="26" width="4" height="12" fill="black" />
        <rect x="261" y="26" width="2" height="12" fill="black" />
        <rect x="265" y="26" width="5" height="12" fill="black" />
        <rect x="272" y="26" width="3" height="12" fill="black" />
        <rect x="277" y="26" width="6" height="12" fill="black" />
        <rect x="285" y="26" width="2" height="12" fill="black" />
        <rect x="289" y="26" width="4" height="12" fill="black" />
        <rect x="295" y="26" width="3" height="12" fill="black" />
        <rect x="300" y="26" width="5" height="12" fill="black" />
        <rect x="307" y="26" width="2" height="12" fill="black" />
        <rect x="311" y="26" width="6" height="12" fill="black" />
        <rect x="319" y="26" width="2" height="12" fill="black" />
        <rect x="323" y="26" width="2" height="12" fill="black" />

        {/* Stop Pattern (Solid bar + narrow bars) */}
        <rect x="326.5" y="0" width="1.5" height="38" fill="black" />
        <rect x="330" y="0" width="3" height="38" fill="black" />
        <rect x="335" y="0" width="1.5" height="38" fill="black" />
        <rect x="338" y="0" width="2" height="38" fill="black" />
      </svg>
    </div>
  );
};
