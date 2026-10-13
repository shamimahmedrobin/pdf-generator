'use client';

import React from 'react';
import { DocumentData } from '@/types/pdf';
import { QrCode, CheckCircle2, ShieldCheck, Award } from 'lucide-react';

interface PdfPaperPreviewProps {
  data: DocumentData;
  scale?: number;
}

export const PdfPaperPreview: React.FC<PdfPaperPreviewProps> = ({ data, scale = 1 }) => {
  const primaryColor = data.primaryColor || '#0284c7';

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        transition: 'transform 0.15s ease'
      }}
      className="transition-transform duration-200"
    >
      {/* A4 Container: 794px x 1123px standard A4 proportions */}
      <div
        id="pdf-render-area"
        className="w-[794px] min-h-[1123px] bg-white text-slate-800 p-12 relative flex flex-col justify-between shadow-2xl mx-auto selection:bg-slate-200 overflow-hidden"
        style={{
          fontFamily: data.fontFamily || 'Hind Siliguri, sans-serif'
        }}
      >
        {/* Decorative Top Accent Bar */}
        <div
          className="absolute top-0 left-0 right-0 h-3"
          style={{ backgroundColor: primaryColor }}
        />

        {/* Optional Watermark */}
        {data.showWatermark && data.watermarkText && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0 overflow-hidden">
            <span
              className="text-7xl font-extrabold uppercase tracking-widest select-none rotate-[-30deg] opacity-[0.06] text-slate-900"
              style={{ letterSpacing: '0.25em' }}
            >
              {data.watermarkText}
            </span>
          </div>
        )}

        {/* Top Header Section */}
        <div className="relative z-10">
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div className="max-w-[460px]">
              {data.orgLogoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.orgLogoUrl}
                  alt={data.orgName}
                  className="h-14 object-contain mb-2"
                />
              ) : (
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {data.orgName ? data.orgName.charAt(0) : 'দ'}
                  </div>
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">
                      {data.orgName || 'প্রতিষ্ঠানের নাম'}
                    </h1>
                    {data.orgTagline && (
                      <p className="text-xs text-slate-500 font-medium">
                        {data.orgTagline}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="text-xs text-slate-500 space-y-0.5 mt-1 leading-relaxed">
                {data.orgAddress && <p>{data.orgAddress}</p>}
                <div className="flex items-center gap-3">
                  {data.orgPhone && <span>ফোন: {data.orgPhone}</span>}
                  {data.orgEmail && <span>ইমেইল: {data.orgEmail}</span>}
                </div>
              </div>
            </div>

            {/* Document Title & Reference Metadata */}
            <div className="text-right flex flex-col items-end">
              <span
                className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded text-white inline-block mb-3"
                style={{ backgroundColor: primaryColor }}
              >
                {data.title || 'ডকুমেন্ট'}
              </span>
              
              <div className="text-xs space-y-1 text-slate-600 font-mono">
                <div>
                  <span className="text-slate-400">নং: </span>
                  <span className="font-semibold text-slate-800">{data.docNumber || 'DOC-001'}</span>
                </div>
                <div>
                  <span className="text-slate-400">তারিখ: </span>
                  <span className="font-semibold text-slate-800">{data.docDate}</span>
                </div>
                {data.dueDate && (
                  <div>
                    <span className="text-slate-400">মেয়াদ: </span>
                    <span className="font-semibold text-slate-800">{data.dueDate}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recipient / Client Details */}
          {data.templateType !== 'cv' && (
            <div className="mt-6 p-4 rounded-lg bg-slate-50/80 border border-slate-200/80 flex justify-between items-start text-xs">
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  প্রাপক / বিল প্রাপকের বিবরণ:
                </p>
                <p className="text-sm font-bold text-slate-900">{data.recipientName || 'নাম প্রদান করা হয়নি'}</p>
                {data.recipientDesignation && (
                  <p className="text-slate-600">{data.recipientDesignation}</p>
                )}
                {data.recipientOrg && (
                  <p className="text-slate-600 font-medium">{data.recipientOrg}</p>
                )}
                {data.recipientAddress && (
                  <p className="text-slate-500 mt-0.5">{data.recipientAddress}</p>
                )}
              </div>
              <div className="text-right text-slate-600 space-y-0.5">
                {data.recipientPhone && <p>মোবাইল: {data.recipientPhone}</p>}
                {data.recipientEmail && <p>ইমেইল: {data.recipientEmail}</p>}
                {data.candidateRollOrId && (
                  <p className="font-semibold text-slate-800">{data.candidateRollOrId}</p>
                )}
              </div>
            </div>
          )}

          {/* Body Content for Certificate or Memo */}
          {(data.templateType === 'certificate' || data.templateType === 'memo') && (
            <div className="mt-8 space-y-6">
              {data.memoSubject && (
                <div className="border-b border-slate-200 pb-2">
                  <p className="text-sm font-bold text-slate-900">
                    বিষয়: <span className="underline underline-offset-4">{data.memoSubject}</span>
                  </p>
                </div>
              )}

              {data.templateType === 'certificate' && (
                <div className="text-center my-4">
                  <h2
                    className="text-2xl font-bold tracking-wide uppercase inline-block pb-1 border-b-2"
                    style={{ borderColor: primaryColor, color: primaryColor }}
                  >
                    প্রত্যয়ন পত্র
                  </h2>
                </div>
              )}

              <div className="text-sm leading-relaxed text-slate-700 whitespace-pre-line text-justify space-y-4">
                {data.bodyContent || 'মূল বিবরণ এখানে প্রদর্শিত হবে।'}
              </div>
            </div>
          )}

          {/* CV / Resume Layout */}
          {data.templateType === 'cv' && (
            <div className="mt-6 space-y-6 text-xs">
              {data.careerSummary && (
                <section>
                  <h3
                    className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2"
                    style={{ borderColor: primaryColor, color: primaryColor }}
                  >
                    ক্যারিয়ার সারসংক্ষেপ (Summary)
                  </h3>
                  <p className="text-slate-700 leading-relaxed text-sm">{data.careerSummary}</p>
                </section>
              )}

              {data.experiences && data.experiences.length > 0 && (
                <section>
                  <h3
                    className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b-2"
                    style={{ borderColor: primaryColor, color: primaryColor }}
                  >
                    কর্ম অভিজ্ঞতা (Work Experience)
                  </h3>
                  <div className="space-y-3">
                    {data.experiences.map((exp) => (
                      <div key={exp.id} className="border-l-2 pl-3 border-slate-200">
                        <div className="flex justify-between items-baseline">
                          <h4 className="font-bold text-slate-900 text-sm">{exp.role}</h4>
                          <span className="text-[11px] font-mono text-slate-500">{exp.duration}</span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium">{exp.company}</p>
                        <p className="text-xs text-slate-600 mt-1">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {data.education && data.education.length > 0 && (
                <section>
                  <h3
                    className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b-2"
                    style={{ borderColor: primaryColor, color: primaryColor }}
                  >
                    শিক্ষাগত যোগ্যতা (Education)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {data.education.map((edu) => (
                      <div key={edu.id} className="p-2.5 rounded bg-slate-50 border border-slate-200">
                        <p className="font-bold text-slate-900 text-xs">{edu.degree}</p>
                        <p className="text-slate-600 text-[11px]">{edu.institution}</p>
                        <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                          <span>পাসের সন: {edu.year}</span>
                          <span className="font-semibold">{edu.result}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {data.skills && data.skills.length > 0 && (
                <section>
                  <h3
                    className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2"
                    style={{ borderColor: primaryColor, color: primaryColor }}
                  >
                    দক্ষতা ও পারদর্শিতা (Key Skills)
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {data.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* Items Table for Invoice & Receipt */}
          {(data.templateType === 'invoice' || data.templateType === 'receipt') && (
            <div className="mt-8">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-y border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 px-3 w-12 text-center">ক্রম</th>
                    <th className="py-2.5 px-3">বিবরণ / সেবার নাম</th>
                    <th className="py-2.5 px-3 w-20 text-center">পরিমাণ</th>
                    <th className="py-2.5 px-3 w-28 text-right">দর ({data.currency})</th>
                    <th className="py-2.5 px-3 w-32 text-right">মোট ({data.currency})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {data.items && data.items.length > 0 ? (
                    data.items.map((item, index) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3 text-center font-mono text-slate-400">
                          {index + 1}
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-900">
                          {item.description || 'আইটেম বিবরণ'}
                        </td>
                        <td className="py-3 px-3 text-center font-mono">
                          {item.quantity}
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums">
                          {Number(item.unitPrice).toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-semibold text-slate-900 tabular-nums">
                          {Number(item.total).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-slate-400">
                        কোনো আইটেম যোগ করা হয়নি
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Totals Calculation Box */}
              <div className="mt-4 flex justify-between items-start pt-4 border-t border-slate-200">
                <div className="max-w-[380px] text-xs space-y-2">
                  {data.amountInWords && (
                    <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                      <span className="font-semibold text-slate-700">কথায়: </span>
                      <span className="text-slate-800 font-medium">{data.amountInWords}</span>
                    </div>
                  )}

                  {data.paymentMethod && (
                    <div className="text-slate-600 text-xs">
                      <span className="font-semibold">পরিশোধের মাধ্যম: </span>
                      <span>{data.paymentMethod}</span>
                      {data.transactionId && <span> (ট্রানজেকশন: {data.transactionId})</span>}
                    </div>
                  )}
                </div>

                <div className="w-64 text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between text-slate-600">
                    <span>মোট উপ-যোগফল:</span>
                    <span className="tabular-nums font-medium">
                      {data.currency} {Number(data.subtotal || 0).toLocaleString()}
                    </span>
                  </div>
                  {data.discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>ছাড় / ডিসকাউন্ট:</span>
                      <span className="tabular-nums">- {data.currency} {Number(data.discount).toLocaleString()}</span>
                    </div>
                  )}
                  {data.taxAmount > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>ভ্যাট/ট্যাক্স ({data.taxPercent}%):</span>
                      <span className="tabular-nums">+ {data.currency} {Number(data.taxAmount).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-300">
                    <span>সর্বমোট প্রদেয়:</span>
                    <span className="tabular-nums" style={{ color: primaryColor }}>
                      {data.currency} {Number((data.subtotal - data.discount + data.taxAmount) || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-700 pt-1">
                    <span>পরিশোধিত অর্থ:</span>
                    <span className="tabular-nums font-semibold text-emerald-600">
                      {data.currency} {Number(data.paidAmount || 0).toLocaleString()}
                    </span>
                  </div>
                  {data.dueAmount > 0 && (
                    <div className="flex justify-between text-rose-600 font-semibold">
                      <span>বকেয়া পরিমাণ:</span>
                      <span className="tabular-nums">
                        {data.currency} {Number(data.dueAmount).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Custom Fields (If generated from custom uploaded demo) */}
          {data.customFields && data.customFields.length > 0 && (
            <div className="mt-6 p-4 rounded bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                কাস্টম ফিল্ড ও অতিরিক্ত তথ্য
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {data.customFields.map((field) => (
                  <div key={field.id} className="border-b border-slate-200 pb-1">
                    <span className="text-slate-500 font-medium">{field.label}: </span>
                    <span className="text-slate-900 font-semibold">{field.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes & Terms */}
          {(data.notes || data.terms) && (
            <div className="mt-8 pt-4 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
              {data.notes && (
                <p>
                  <span className="font-semibold text-slate-600">বিশেষ দ্রষ্টব্য: </span>
                  {data.notes}
                </p>
              )}
              {data.terms && (
                <p>
                  <span className="font-semibold text-slate-600">শর্তাবলী: </span>
                  {data.terms}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Bottom Section: QR Verification, Official Rubber Stamp, and Authorized Signature */}
        <div className="relative z-10 pt-8 mt-6 border-t border-slate-200 flex justify-between items-end">
          {/* QR Code Verification badge */}
          <div className="flex items-center gap-3">
            {data.showQrCode ? (
              <div className="p-1.5 bg-slate-50 border border-slate-200 rounded flex items-center justify-center">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
            ) : null}
            <div className="text-[10px] text-slate-400 max-w-[200px] leading-tight font-mono">
              <p className="font-semibold text-slate-600 uppercase">Verifiable PDF</p>
              <p>ID: {data.docNumber || 'DOC-2026'}</p>
              <p>তারিখ: {data.docDate}</p>
            </div>
          </div>

          {/* Rubber Stamp (PAID / APPROVED / VERIFIED) */}
          {data.showPaidStamp && (
            <div className="select-none pointer-events-none transform -rotate-12 border-2 border-emerald-600 rounded px-3 py-1 flex items-center gap-1.5 text-emerald-700 bg-emerald-50/50">
              {data.paidStampStatus === 'PAID' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-extrabold text-xs tracking-wider">পরিশোধিত · PAID</span>
                </>
              ) : data.paidStampStatus === 'APPROVED' ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span className="font-extrabold text-xs tracking-wider text-indigo-700">অনুমোদিত · APPROVED</span>
                </>
              ) : (
                <>
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span className="font-extrabold text-xs tracking-wider">যাচাইকৃত · VERIFIED</span>
                </>
              )}
            </div>
          )}

          {/* Authorized Signature Box */}
          <div className="text-center min-w-[180px]">
            {data.signatureUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.signatureUrl}
                alt="Signature"
                className="h-10 mx-auto object-contain mb-1"
              />
            ) : (
              <div className="h-10 flex items-center justify-center text-slate-300 font-serif italic text-sm">
                (স্বাক্ষরিত)
              </div>
            )}
            <div className="border-t border-slate-400 pt-1">
              <p className="text-xs font-bold text-slate-900">
                {data.signatoryName || 'অনুমোদিত স্বাক্ষরকারী'}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                {data.signatoryTitle || 'কর্তৃপক্ষ'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Credit & Page Number */}
        <div className="text-center pt-4 text-[10px] text-slate-400 font-mono">
          <span>সহজ পিডিএফ স্টুডিও · পৃষ্ঠা ১ / ১ · {data.docDate}</span>
        </div>
      </div>
    </div>
  );
};
