'use client';

import React from 'react';
import { ActiveOption, FormDataState, NidDataState, ProffDataState } from '@/types/single-page-types';
import { QrCode, CheckCircle2, User, Award } from 'lucide-react';
import { toBanglaNumber, cleanSubjectPrefix } from '@/lib/utils';
import {
  BangladeshEmblem,
  WatermarkEmblem,
  IssuingAuthoritySignature,
  Pdf417NidBarcode,
  RealPdf417Barcode
} from './NidCardAssets';

interface SinglePagePaperPreviewProps {
  activeOption: ActiveOption;
  formData: FormDataState;
  nidData: NidDataState;
  proffData: ProffDataState;
  useSutonnyFont?: boolean;
  selectedFont?: string;
}

export const SinglePagePaperPreview: React.FC<SinglePagePaperPreviewProps> = ({
  activeOption,
  formData,
  nidData,
  proffData,
  useSutonnyFont = true,
  selectedFont = 'sutonny'
}) => {
  // Pure Bengali Unicode text rendering without ASCII scrambling
  const t = (val: string | undefined | null): string => {
    return val || '';
  };

  const getFontFamily = () => {
    const font = selectedFont || (useSutonnyFont ? 'sutonny' : 'hind');
    switch (font) {
      case 'sutonny':
      case 'nikosh':
        return "'Nikosh', 'SutonnyMJ', 'Kalpurush', 'SolaimanLipi', 'Hind Siliguri', sans-serif";
      case 'kalpurush':
        return "'Kalpurush', 'SolaimanLipi', 'Hind Siliguri', sans-serif";
      case 'solaiman':
        return "'SolaimanLipi', 'Hind Siliguri', sans-serif";
      case 'hind':
      default:
        return "'Hind Siliguri', sans-serif";
    }
  };

  const fontFamilyStyle = getFontFamily();

  return (
    <div
      id="pdf-render-area"
      className={`w-[794px] min-h-[1123px] bg-white text-slate-900 pt-[52px] px-[50px] pb-[42px] relative flex flex-col shadow-xl mx-auto selection:bg-slate-200 ${
        activeOption === 'Proff' ? 'justify-between' : 'justify-start'
      }`}
      style={{
        fontFamily: fontFamilyStyle,
        lineHeight: '1.45',
        fontSynthesis: 'weight style'
      }}
    >
      {/* ================= OPTION 1: FORM (EXACT 1:1 REPLICA OF FORM-2 NID AMENDMENT APPLICATION) ================= */}
      {activeOption === 'Form' && (
        <div className="w-full text-[11px] text-black leading-normal">
          <div>
            {/* Header */}
            <div className="text-center space-y-0.5 mb-2">
              <h1 className="text-[12.5px] font-normal leading-tight">{t('ফরম-২')}</h1>
              <p className="text-[11px] font-normal leading-tight">{t('[প্রবিধান ৪ দ্রষ্টব্য]')}</p>
              <h2 className="text-[12.5px] font-normal underline underline-offset-4 mt-0.5 leading-tight">
                {t('জাতীয় পরিচয়পত্র বা তথ্য-উপাত্ত সংশোধনের আবেদন')}
              </h2>
            </div>

            {/* Serial Number */}
            <div className="flex justify-end items-end my-1 text-[11px]">
              <span className="font-normal mr-2">{t('ক্রমিক নম্বর')} :</span>
              <div className="w-[200px] border-b border-dotted border-black flex items-end">
                <span className="px-1 tracking-wider tabular-nums font-normal">
                  {formData.serialNo || 'NIDCA5002923842'}
                </span>
              </div>
            </div>

            {/* Section 1: Applicant particulars */}
            <div className="space-y-1 mt-2 text-[11px]">
              <p className="font-normal">{t('১। জাতীয় পরিচয়পত্রধারীর-')}</p>
              <div className="pl-6 space-y-1">
                <div className="flex items-end">
                  <span className="w-52 shrink-0">{t('(ক) নাম')}</span>
                  <span className="mr-2">:</span>
                  <div className="flex-1 border-b border-dotted border-black flex items-end min-h-[17px]">
                    <span className="px-1 font-semibold">{t(formData.applicantName || 'মোঃ রবিউল্লাহ')}</span>
                  </div>
                </div>
                <div className="flex items-end">
                  <span className="w-52 shrink-0">{t('(খ) জাতীয় পরিচিতি নম্বর (NID)')}</span>
                  <span className="mr-2">:</span>
                  <div className="flex-1 border-b border-dotted border-black flex items-end min-h-[17px]">
                    <span className="px-1 font-semibold tabular-nums">{formData.applicantNid || '8732934032'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Guardian particulars */}
            <div className="space-y-1 mt-2.5 text-[11px]">
              <p className="font-normal leading-snug">
                {t('২। আঠারো বৎসরের কম বয়স্ক/আদালত কর্তৃক অপ্রকৃতিস্থ ঘোষিত জাতীয় পরিচয়পত্রধারীর ক্ষেত্রে, আইনানুগ অভিভাবকের-')}
              </p>
              <div className="pl-6 space-y-1">
                <div className="flex items-end">
                  <span className="w-52 shrink-0">{t('(ক) নাম')}</span>
                  <span className="mr-2">:</span>
                  <div className="flex-1 border-b border-dotted border-black h-[17px] flex items-end">
                    <span className="px-1 font-semibold">{t(formData.guardianName || '')}</span>
                  </div>
                </div>
                <div className="flex items-end">
                  <span className="w-52 shrink-0">{t('(খ) জাতীয় পরিচিতি নম্বর (NID)')}</span>
                  <span className="mr-2">:</span>
                  <div className="flex-1 border-b border-dotted border-black h-[17px] flex items-end">
                    <span className="px-1 font-semibold tabular-nums">{formData.guardianNid || ''}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Corrections Table */}
            <div className="mt-3 text-[11px]">
              <p className="font-normal leading-snug mb-1.5">
                {t('৩। জাতীয় পরিচয়পত্র বা সংরক্ষিত তথ্য-উপাত্তে যে তথ্য সংশোধন করিতে হইবে (অপ্রয়োজনীয় অংশ কাটিয়া দিন):')}
              </p>

              <table className="w-full border-collapse border border-black text-[10.5px]">
                <thead>
                  <tr className="border-b border-black text-center font-normal">
                    <th className="border-r border-black py-1.5 px-2 w-[145px] font-normal align-middle">
                      {t('বিষয়')}
                    </th>
                    <th className="border-r border-black py-1.5 px-2 w-[190px] font-normal align-middle leading-tight">
                      <div>
                        <span className="underline underline-offset-2">{t('বর্তমানে জাতীয় পরিচয়পত্র বা')}</span>
                      </div>
                      <div>
                        <span className="underline underline-offset-2">{t('সংরক্ষিত তথ্য উপাত্তে')}</span>
                      </div>
                      <div>
                        <span className="underline underline-offset-2">{t('বিদ্যমান তথ্য')}</span>
                      </div>
                    </th>
                    <th className="border-r border-black py-1.5 px-2 w-[190px] font-normal align-middle leading-tight">
                      <span className="underline underline-offset-2">{t('চাহিত সংশোধিত তথ্য')}</span>
                    </th>
                    <th className="py-1.5 px-2 w-[170px] font-normal align-middle leading-tight">
                      <span className="underline underline-offset-2">{t('সংযুক্ত দলিলাদি/মন্তব্য')}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    let serialCounter = 0;
                    return formData.corrections && formData.corrections.length > 0 ? (
                      formData.corrections.map((row, index) => {
                        const hasCorrectionData = Boolean(
                          (row.currentData && row.currentData.trim() !== '') ||
                          (row.correctedData && row.correctedData.trim() !== '')
                        );

                        const cleanSubject = cleanSubjectPrefix(row.subject || '');

                        let displaySubject = '';
                        if (hasCorrectionData) {
                          serialCounter += 1;
                          const bnNum = toBanglaNumber(serialCounter);
                          displaySubject = cleanSubject ? `(${bnNum}) ${cleanSubject}` : `(${bnNum})`;
                        } else {
                          // No current or corrected data: DO NOT add serial number
                          displaySubject = cleanSubject;
                        }

                        return (
                          <tr key={row.id || index} className="border-b border-black h-[25px]">
                            <td className="border-r border-black px-2 text-left font-semibold align-middle">
                              {displaySubject ? t(displaySubject) : ''}
                            </td>
                            <td className="border-r border-black px-2 text-left font-semibold align-middle tabular-nums">
                              {row.currentData ? t(row.currentData) : ''}
                            </td>
                            <td className="border-r border-black px-2 text-left font-semibold align-middle tabular-nums">
                              {row.correctedData ? t(row.correctedData) : ''}
                            </td>
                            <td className="px-2 text-left text-[10px] font-semibold align-middle">
                              {row.attachment ? t(row.attachment) : ''}
                            </td>
                          </tr>
                        );
                      })
                    ) : null;
                  })()}
                </tbody>
              </table>
            </div>

            {/* Section 4, 5, 6: Fees & Attached Documents */}
            <div className="mt-2.5 space-y-1 text-[11px]">
              <div>
                <span className="font-normal">
                  {t('৪। জমাকৃত ফি এর পরিমাণ (১১ এর উপ-প্রবিধান (১) এর ক্রমিক নং ১ বা, প্রযোজ্য ক্ষেত্রে, ২ এ উল্লিখিত ফি অনুসারে)')} :{' '}
                </span>
                <span className="font-semibold tabular-nums">
                  {formData.feeAmount ? t(formData.feeAmount) : ''}
                </span>
              </div>

              <div>
                <span className="font-normal">
                  {t('৫। প্রযোজ্য ক্ষেত্রে ফি জমা দানের রশিদ')} :{' '}
                </span>
                <span className="font-semibold tabular-nums">
                  {formData.feeReceiptNo ? t(formData.feeReceiptNo) : ''}
                </span>
              </div>

              <div>
                <span className="font-normal">
                  {t('৬। আবেদনপত্রের সহিত সংযুক্ত দলিলাদির বিবরণ')} :{' '}
                </span>
                <span className="font-semibold">
                  {formData.attachedDocsSummary ? t(formData.attachedDocsSummary) : ''}
                </span>
              </div>
            </div>

            {/* Signature Blocks */}
            <div className="mt-6 grid grid-cols-2 gap-10 text-[10.5px]">
              {/* Guardian Signature (Left) */}
              <div className="space-y-1">
                <div className="border-t border-dashed border-gray-400 pt-1 mb-1 font-normal w-56">
                  {t('আইনানুগ অভিভাবকের স্বাক্ষর/টিপসহি (প্রযোজ্য ক্ষেত্রে)')}
                </div>
                <div>
                  <span>{t('নাম')} : </span>
                  <span className="font-semibold">{formData.guardianName ? t(formData.guardianName) : ''}</span>
                </div>
                <div>
                  <span>{t('ঠিকানা')} : </span>
                  <span className="font-semibold">{formData.guardianAddress ? t(formData.guardianAddress) : ''}</span>
                </div>
                <div>
                  <span>{t('মোবাইল নম্বর')} : </span>
                  <span className="font-semibold tabular-nums">{formData.guardianMobile || ''}</span>
                </div>
                <div>
                  <span>{t('ই-মেইল (যদি থাকে)')} : </span>
                  <span className="font-semibold">{formData.guardianEmail || ''}</span>
                </div>
              </div>

              {/* Applicant Signature (Right) */}
              <div className="space-y-1">
                <div className="border-t border-dashed border-gray-400 pt-1 mb-1 font-normal w-56">
                  {t('আবেদনকারীর স্বাক্ষর/টিপসহি')}
                </div>
                <div>
                  <span>{t('নাম')} : </span>
                </div>
                <div>
                  <span>{t('ঠিকানা')} : </span>
                  <span className="font-semibold">{formData.applicantAddress ? t(formData.applicantAddress) : ''}</span>
                </div>
                <div>
                  <span>{t('মোবাইল নম্বর')} : </span>
                  <span className="font-semibold tabular-nums">{formData.applicantMobile || ''}</span>
                </div>
                <div>
                  <span>{t('ই-মেইল (যদি থাকে)')} : </span>
                  <span className="font-semibold">{formData.applicantEmail || ''}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= PART - B (RECEIPT) ================= */}
          <div className="mt-4 pt-3 border-t border-dashed border-gray-400">
            {/* Receipt Header */}
            <div className="text-center space-y-0.5 mb-1.5">
              <h3 className="text-[12px] font-normal leading-tight">{t('অংশ - খ (ফরম-২)')}</h3>
              <h4 className="text-[12px] font-normal underline underline-offset-4 leading-tight">
                {t('জাতীয় পরিচয়পত্র প্রদানের রশিদ')}
              </h4>
              <p className="text-[10px] font-normal leading-tight">{t('[প্রবিধান ৪ (৪) (খ) দ্রষ্টব্য]')}</p>
            </div>

            {/* Receipt Serial Number */}
            <div className="flex justify-end items-end mb-2 text-[10.5px]">
              <span className="font-normal mr-2">{t('ক্রমিক নম্বর')} :</span>
              <div className="w-[200px] border-b border-dotted border-black h-[16px] flex items-end">
                <span className="px-1 tracking-wider tabular-nums font-normal">
                  {formData.receiptSerialNo || formData.serialNo || ''}
                </span>
              </div>
            </div>

            {/* Receipt Content items */}
            <div className="space-y-1 text-[10.5px]">
              <div className="flex items-center">
                <span className="w-[340px] shrink-0">{t('(১) আবেদনকারীর নাম এবং জাতীয় পরিচিতি নম্বর')}</span>
                <span className="mr-2">:</span>
              </div>

              <div className="flex items-start">
                <div className="w-[340px] shrink-0">
                  <div>{t('(২) প্রযোজ্য ক্ষেত্রে, আইনানুগ অভিভাবকের নাম এবং জাতীয়')}</div>
                  <div className="pl-4">{t('পরিচিতি নম্বর')}</div>
                </div>
                <span className="mr-2">:</span>
                <span className="font-semibold">
                  {formData.receiptGuardianName ? t(formData.receiptGuardianName) : ''}
                </span>
              </div>

              <div className="flex items-center">
                <span className="w-[340px] shrink-0">{t('(৩) আবেদনের তারিখ')}</span>
                <span className="mr-2">:</span>
                <span className="tabular-nums font-semibold">
                  {formData.receiptAppDate ? t(formData.receiptAppDate) : (formData.applicationDate ? t(formData.applicationDate) : '')}
                </span>
              </div>

              <div className="flex items-center">
                <span className="w-[340px] shrink-0">
                  {t('(৪) পরবর্তী যোগাযোগের তারিখ/জাতীয় পরিচয়পত্র প্রদানের তারিখ')}
                </span>
                <span className="mr-2">:</span>
                <span className="tabular-nums font-semibold">
                  {formData.receiptDeliveryDate ? t(formData.receiptDeliveryDate) : (formData.deliveryDate ? t(formData.deliveryDate) : '')}
                </span>
              </div>
            </div>

            {/* Bottom Seals */}
            <div className="mt-8 flex justify-between items-end text-[10.5px] px-6">
              <div className="text-center w-36">
                <span className="font-normal">{t('(সিলমোহর)')}</span>
              </div>

              <div className="text-center w-64">
                <div className="border-t border-dashed border-gray-400 pt-1">
                  <p className="font-normal">{t('দায়িত্বপ্রাপ্ত কর্মকর্তার স্বাক্ষর')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= OPTION 2: NID (EXACT 1:1 MATCH TO USER SCREENSHOT) ================= */}
      {activeOption === 'Nid' && (
        <div className="w-full pt-2">
          <div className="flex justify-center items-start gap-3.5">
            {/* CARD 1: FRONT SIDE — laid out 1:1 from the official card PDF
                (frame 242.6x153.9pt at 1.4096 px/pt = 342x217px; every element
                is absolutely positioned at its measured place/size/color) */}
            <div className="w-[342px] h-[217px] border-[1.5px] border-black bg-white shrink-0 shadow-sm relative overflow-hidden">
              {/* Header: emblem + centered title block beside it */}
              <BangladeshEmblem className="absolute left-[6px] top-[10px] w-[39px] h-[39px]" />
              <div className="absolute left-[46px] right-[2px] top-0 h-[67px]">
                <div className="absolute top-[6px] left-0 right-0 text-center font-nikosh font-bold text-[21px] leading-none text-black">
                  {t('গণপ্রজাতন্ত্রী বাংলাদেশ সরকার')}
                </div>
                <div className="absolute top-[30px] left-0 right-0 text-center font-nid-english text-[12px] leading-none text-[#007700]">
                  Government of the People&apos;s Republic of Bangladesh
                </div>
                <div className="absolute top-[44px] left-0 right-0 flex items-baseline justify-center leading-none">
                  <span className="font-nid-english text-[10.5px] text-[#ff0000] shrink-0 whitespace-nowrap">National ID Card</span>
                  <span className="mx-[3px] text-[14px] text-black shrink-0">/</span>
                  <span className="font-nikosh text-[14px] text-black shrink-0 whitespace-nowrap">{t('জাতীয় পরিচয় পত্র')}</span>
                </div>
              </div>
              <div className="absolute top-[67px] left-0 right-0 border-t-[1.5px] border-black" />

              {/* Photo — the official card has no border or line around it */}
              <div className="absolute left-[8px] top-[75px] w-[63px] h-[85px] overflow-hidden flex items-center justify-center">
                {nidData.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={nidData.photoUrl}
                    alt="NID Photo"
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <User className="w-8 h-8 text-slate-300" />
                )}
              </div>
              {/* Holder signature under the photo */}
              <div className="absolute left-[12px] top-[162px] w-[59px] h-[28px] flex items-center justify-center overflow-hidden">
                {nidData.signatureUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={nidData.signatureUrl}
                    alt="Signature"
                    className="max-w-full max-h-full object-contain"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <span className="font-nikosh italic font-bold text-[15px] text-black leading-none">
                    {t(nidData.nameBangla?.split(/\s+/).pop() || 'নাহিদ')}
                  </span>
                )}
              </div>

              {/* Golden watermark behind the particulars (official position/size) */}
              <div className="absolute left-[79px] top-[68px] w-[261px] h-[144px] pointer-events-none select-none">
                <WatermarkEmblem
                  className="w-full h-full"
                  style={{ opacity: nidData.watermarkOpacity ?? 0.5 }}
                />
              </div>

              {/* Particulars — label and value x-positions measured per row */}
              <div className="absolute left-[86px] top-[74px] font-nikosh text-[17.5px] leading-none text-black">নাম:</div>
              <div className="absolute left-[129px] top-[74px] font-nikosh font-bold text-[17.5px] leading-none text-black whitespace-nowrap">
                {t(nidData.nameBangla || 'মোঃ তাওহীদুল ইসলাম নাহিদ')}
              </div>

              <div className="absolute left-[86px] top-[105px] font-nid-english text-[11.5px] leading-none text-black">Name:</div>
              <div className="absolute left-[129px] top-[105px] font-nid-english font-bold text-[12.5px] leading-none text-black whitespace-nowrap">
                {nidData.nameEnglish || 'MD TAWHIDUL ISLAM NAHID'}
              </div>

              <div className="absolute left-[86px] top-[124px] font-nikosh text-[15px] leading-none text-black">পিতা:</div>
              <div className="absolute left-[129px] top-[124px] font-nikosh font-semibold text-[15px] leading-none text-black whitespace-nowrap">
                {t(nidData.fatherName || 'মোঃ নুরুল মুত্তাকিন')}
              </div>

              <div className="absolute left-[86px] top-[147px] font-nikosh text-[15px] leading-none text-black">মাতা:</div>
              <div className="absolute left-[129px] top-[147px] font-nikosh font-semibold text-[15px] leading-none text-black whitespace-nowrap">
                {t(nidData.motherName || 'রেশমা আক্তার')}
              </div>

              <div className="absolute left-[85px] top-[171px] font-nid-english text-[12.5px] leading-none text-black">Date of Birth:</div>
              <div className="absolute left-[163px] top-[171px] font-nid-english text-[12.5px] leading-none text-[#ff0000] whitespace-nowrap">
                {nidData.dob || '12 Sep 2006'}
              </div>

              <div className="absolute left-[85px] top-[190px] font-nid-english text-[12.5px] leading-none text-black">ID NO:</div>
              <div className="absolute left-[127px] top-[190px] font-nid-english font-bold text-[12.5px] leading-none text-[#ff0000] whitespace-nowrap">
                {nidData.nidNumber || '1533151575'}
              </div>
            </div>

            {/* CARD 2: BACK SIDE */}
            <div className="w-[342px] h-[217px] border-[1.5px] border-black bg-white flex flex-col justify-between shrink-0 shadow-sm relative overflow-hidden">
              <div className="flex flex-col justify-between h-full font-nikosh">
                {/* Section 1: Property Notice */}
                <div className="px-2 py-1 text-left text-[7.5px] leading-tight text-black border-b border-black font-normal">
                  <div>{t('এই কার্ডটি গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের সম্পত্তি। কার্ডটি ব্যবহারকারী ব্যতীত অন্য')}</div>
                  <div>{t('কোথাও পাওয়া গেলে নিকটস্থ পোস্ট অফিসে জমা দেবার জন্য অনুরোধ করা হলো।')}</div>
                </div>

                {/* Section 2: Address */}
                <div className="px-2 py-1 text-[8px] leading-snug text-black border-b border-black text-left">
                  <div className="flex items-start">
                    <span className="font-bold shrink-0 mr-1">{t('ঠিকানা')}:</span>
                    <span className="font-normal">
                      {t(
                        nidData.address ||
                          'গ্রাম/রাস্তা: নয়া শুকদেবপুর, দামোধরপুর, ডাকঘর: জয়নগর বাজার - ৩০০০, জামালগঞ্জ, সুনামগঞ্জ'
                      )}
                    </span>
                  </div>
                </div>

                {/* Section 3: Blood Group, Place of Birth, Mudron */}
                <div className="px-2 py-0.5 text-[8px] text-black border-b border-black flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <span className="font-normal">{t('রক্তের গ্রুপ')}</span>
                    <span className="font-nid-english font-normal">/Blood Group:</span>
                    <span className="font-nid-english font-bold text-[#dc2626]">{nidData.bloodGroup || 'A+'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-normal">{t('জন্মস্থান')}:</span>
                    <span className="font-normal">{t(nidData.birthPlace || 'সুনামগঞ্জ')}</span>
                  </div>
                  <div className="bg-black text-white text-[7.5px] font-bold px-1.5 py-0.5 leading-none">
                    {t('মুদ্রণ: ০১')}
                  </div>
                </div>

                {/* Section 4: Authority Signature & Issue Date */}
                <div className="px-2.5 py-1 flex justify-between items-end">
                  <IssuingAuthoritySignature />

                  <div className="text-[8px] text-black mb-1 font-normal">
                    <span>{t('প্রদানের তারিখ')}: </span>
                    <span className="tabular-nums font-semibold tracking-wide">{t(nidData.issueDate || '০৪/১০/২০২৩')}</span>
                  </div>
                </div>

                {/* Section 5: PDF417 2D Barcode (real one when a code is given) */}
                <div className="px-1.5 pb-1.5 pt-0.5">
                  {nidData.barcodeData?.trim() ? (
                    <RealPdf417Barcode text={nidData.barcodeData.trim()} className="w-full h-[34px]" />
                  ) : (
                    <Pdf417NidBarcode className="w-full h-[34px]" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= OPTION 3: PROFF ================= */}
      {activeOption === 'Proff' && (
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="border-b-2 border-indigo-900 pb-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Award className="w-6 h-6 text-indigo-700" />
                <h1 className="text-xl font-bold text-indigo-950 tracking-tight">
                  {t(proffData.instituteName || 'প্রতিষ্ঠানের নাম')}
                </h1>
              </div>
              <p className="text-xs text-slate-600">{t(proffData.instituteAddress)}</p>
              {proffData.institutePhone && (
                <p className="text-[11px] text-slate-500">{t('যোগাযোগ')}: {proffData.institutePhone}</p>
              )}

              <div className="flex justify-between items-center text-xs text-slate-700 mt-4 pt-2 border-t border-slate-200">
                <span>{t('স্মারক নং')}: {proffData.refNo || 'REF-2026/01'}</span>
                <span>{t('তারিখ')}: {t(proffData.date)}</span>
              </div>
            </div>

            <div className="mt-6 mb-4">
              <p className="text-sm font-bold text-slate-900 bg-slate-50 p-2.5 rounded border border-slate-200">
                {t('বিষয়')}: <span className="underline underline-offset-4">{t(proffData.subject)}</span>
              </p>
            </div>

            <div className="text-center my-6">
              <h2 className="text-2xl font-bold tracking-widest uppercase text-indigo-900 border-b-2 border-indigo-900 inline-block pb-1">
                {t('প্রত্যয়ন পত্র')}
              </h2>
              <p className="text-[11px] font-mono text-slate-500 mt-1">
                TO WHOM IT MAY CONCERN
              </p>
            </div>

            <div className="p-3.5 bg-slate-50/80 border border-slate-200 rounded text-xs space-y-1 mb-6">
              <p>
                <span className="font-semibold text-slate-700">{t('নাম')}: </span>
                <span className="font-bold text-slate-900">{t(proffData.personName)}</span>
              </p>
              <div className="flex gap-6">
                <p>
                  <span className="font-semibold text-slate-700">{t('পিতা')}: </span>
                  <span className="font-bold text-slate-900">{t(proffData.relationFather)}</span>
                </p>
                <p>
                  <span className="font-semibold text-slate-700">{t('মাতা')}: </span>
                  <span className="font-bold text-slate-900">{t(proffData.relationMother)}</span>
                </p>
              </div>
              <p>
                <span className="font-semibold text-slate-700">{t('ঠিকানা')}: </span>
                <span className="font-bold text-slate-900">{t(proffData.address)}</span>
              </p>
            </div>

            <div className="text-sm leading-relaxed text-slate-800 text-justify whitespace-pre-line space-y-4 px-1">
              {t(proffData.proofStatement)}
            </div>
          </div>

          <div className="pt-8 mt-6 border-t border-slate-300 flex justify-between items-end">
            <div className="transform -rotate-6 border-2 border-indigo-700 rounded-lg p-2.5 text-center text-indigo-800 bg-indigo-50/50 max-w-[200px]">
              <CheckCircle2 className="w-5 h-5 mx-auto text-indigo-700 mb-0.5" />
              <p className="text-[10px] font-bold uppercase tracking-wider">
                {t(proffData.sealText || 'যাচাইকৃত ও অনুমোদিত')}
              </p>
              <p className="text-[8px] font-mono mt-0.5">VERIFIED PROOF</p>
            </div>

            <div className="flex items-center gap-2 text-left">
              <QrCode className="w-12 h-12 text-slate-700" />
              <div className="text-[9px] text-slate-500 space-y-0.5">
                <p className="font-bold text-slate-600">{t('অনলাইন যাচাইযোগ্য')}</p>
                <p>{t('স্মারক')}: {proffData.refNo}</p>
                <p>{t(proffData.date)}</p>
              </div>
            </div>

            <div className="text-center w-52">
              <div className="h-10 flex items-center justify-center text-slate-400 italic text-xs font-serif">
                ({t('স্বাক্ষরিত')})
              </div>
              <div className="border-t border-slate-600 pt-1 text-xs">
                <p className="font-bold text-slate-900">{t(proffData.authorityName)}</p>
                <p className="text-[10px] text-slate-600 font-medium">{t(proffData.authorityDesignation)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
