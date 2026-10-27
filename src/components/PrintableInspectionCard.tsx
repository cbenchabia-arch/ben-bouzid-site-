import React from 'react';
import { InspectionEvaluation, Teacher, Institution, Zone } from '../types';
import { InspectorProfile } from '../data/storage';
import { Printer, X, Download, Award, CheckCircle2 } from 'lucide-react';

interface PrintableInspectionCardProps {
  evaluation: InspectionEvaluation;
  teacher?: Teacher;
  institution?: Institution;
  zone?: Zone;
  inspector: InspectorProfile;
  onClose: () => void;
}

export const PrintableInspectionCard: React.FC<PrintableInspectionCardProps> = ({
  evaluation,
  teacher,
  institution,
  zone,
  inspector,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      {/* Container */}
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-stone-300">
        
        {/* Modal Controls Toolbar (Hidden on print) */}
        <div className="no-print bg-stone-100 border-b border-stone-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-800" />
            <h2 className="font-bold text-stone-800 text-sm md:text-base">
              معاينة بطاقة التفتيش البيداغوجي الرسمية (جاهزة للطباعة A4)
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة المستند الرسمي</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Printable Document Body */}
        <div className="p-8 overflow-y-auto bg-white font-sans text-stone-900 print:p-0 print:m-0" id="official-inspection-sheet">
          
          {/* Header of the Official Document */}
          <div className="border-b-2 border-stone-900 pb-4 mb-6">
            <div className="text-center space-y-1 mb-4">
              <h1 className="text-base font-bold font-serif text-stone-900">الجمهورية الجزائرية الديمقراطية الشعبية</h1>
              <h2 className="text-sm font-semibold text-stone-800">وزارة التربية الوطنية</h2>
              <div className="flex justify-between items-center text-xs text-stone-700 px-4 pt-1 font-medium">
                <div>{inspector.directorate}</div>
                <div>السنة الدراسية: <span className="tabular-nums font-bold">{evaluation.academicYear}</span></div>
                <div>{inspector.districtName}</div>
              </div>
            </div>

            <div className="bg-stone-100 py-2.5 px-4 rounded border border-stone-300 text-center">
              <h3 className="text-lg font-bold font-serif text-emerald-950">
                بطاقة زيارة وتفتيش بيداغوجي لمادة اللغة العربية (مرحلة التعليم الابتدائي)
              </h3>
              <div className="text-xs text-stone-600 mt-1 flex justify-center items-center gap-4">
                <span>طبيعة الزيارة: <strong>{evaluation.inspectionType}</strong></span>
                <span>·</span>
                <span>الجهة الإدارية: <strong>{zone?.name || 'غير محدد'}</strong></span>
                <span>·</span>
                <span>تاريخ الإجراء: <strong className="tabular-nums">{evaluation.date}</strong></span>
              </div>
            </div>
          </div>

          {/* Teacher and Institution Identity Section */}
          <div className="grid grid-cols-2 gap-4 text-xs mb-6 border border-stone-300 p-3.5 bg-stone-50/50 rounded">
            <div className="space-y-1.5 border-l border-stone-200 pl-3">
              <div><span className="text-stone-500">الأستاذ(ة):</span> <strong className="text-sm text-stone-900">{teacher?.fullName || 'غير محدد'}</strong></div>
              <div><span className="text-stone-500">الرتبة التربوية:</span> <strong className="text-stone-800">{teacher?.rank} ({teacher?.isTenured ? 'مرسم' : 'متربص'})</strong></div>
              <div><span className="text-stone-500">المؤهل العلمي / الشهادة:</span> <span className="text-stone-800">{teacher?.graduationDegree}</span></div>
              <div><span className="text-stone-500">تاريخ التوظيف:</span> <span className="tabular-nums">{teacher?.recruitmentDate}</span> | الدرجة: <strong className="tabular-nums">{teacher?.echelon}</strong></div>
            </div>

            <div className="space-y-1.5 pr-2">
              <div><span className="text-stone-500">المؤسسة التعليمية:</span> <strong className="text-sm text-stone-900">{institution?.name || 'غير محدد'}</strong></div>
              <div><span className="text-stone-500">الفرع والدرس المشاهد:</span> <strong className="text-stone-800">{evaluation.subjectBranch} - {evaluation.lessonTopic}</strong></div>
              <div><span className="text-stone-500">الفوج التربوي:</span> <span className="text-stone-800">{evaluation.classroomLevel}</span> | الحضور: <strong className="tabular-nums">{evaluation.presentStudents} / {evaluation.totalStudents}</strong></div>
              <div><span className="text-stone-500">المفتش القائم بالزيارة:</span> <span className="text-stone-800 font-semibold">{evaluation.inspectorName}</span></div>
            </div>
          </div>

          {/* Detailed Criteria Axes Grid */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-stone-800 mb-2 border-b border-stone-300 pb-1">
              شبكة المعايير والمؤشرات البيداغوجية المعتمدة (السلم التنقيطي الرسمي)
            </h4>

            <div className="space-y-4">
              {evaluation.axes.map((axis, aIdx) => {
                const axisTotal = axis.criteria.reduce((sum, c) => sum + (c.currentScore || 0), 0);
                return (
                  <div key={axis.id} className="border border-stone-300 rounded overflow-hidden">
                    <div className="bg-stone-100 px-3 py-1.5 flex justify-between items-center text-xs font-bold text-stone-800 border-b border-stone-300">
                      <span>{axis.title}</span>
                      <span className="text-emerald-900 tabular-nums">
                        {axisTotal.toFixed(2)} / {axis.maxScore} ن
                      </span>
                    </div>
                    <table className="w-full text-xs text-right border-collapse">
                      <thead>
                        <tr className="bg-stone-50 text-stone-600 border-b border-stone-200">
                          <th className="py-1 px-3 font-semibold">المؤشر البيداغوجي</th>
                          <th className="py-1 px-3 font-semibold w-20 text-center">الحد الأقصى</th>
                          <th className="py-1 px-3 font-semibold w-20 text-center">النقطة الممنوحة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200">
                        {axis.criteria.map((criterion) => (
                          <tr key={criterion.id} className="hover:bg-stone-50/50">
                            <td className="py-1.5 px-3">
                              <div className="font-medium text-stone-800">{criterion.title}</div>
                              {criterion.description && (
                                <div className="text-[10px] text-stone-500">{criterion.description}</div>
                              )}
                            </td>
                            <td className="py-1.5 px-3 text-center tabular-nums text-stone-600">
                              {criterion.maxScore}
                            </td>
                            <td className="py-1.5 px-3 text-center tabular-nums font-bold text-emerald-800">
                              {criterion.currentScore?.toFixed(2) ?? '0.00'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Overall Score Box */}
          <div className="mb-6 p-4 rounded-lg bg-emerald-50 border-2 border-emerald-700 flex items-center justify-between">
            <div>
              <div className="text-xs text-emerald-800 font-semibold">الدرجة التفتيشية الإجمالية الممنوحة:</div>
              <div className="text-sm font-bold text-emerald-950 mt-0.5">
                التقدير العام: <span className="underline decoration-emerald-600">{evaluation.appreciation}</span>
              </div>
            </div>
            <div className="text-left">
              <span className="text-3xl font-extrabold text-emerald-900 font-mono tabular-nums">
                {evaluation.totalScore.toFixed(2)}
              </span>
              <span className="text-emerald-800 text-sm font-bold mr-1">/ 20</span>
            </div>
          </div>

          {/* Observations and Qualitative Feedback */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-6">
            <div className="border border-stone-300 p-3 rounded">
              <h5 className="font-bold text-emerald-900 mb-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                نقاط القوة والإيجابيات المرصودة:
              </h5>
              <p className="text-stone-700 leading-relaxed whitespace-pre-line text-[11px]">
                {evaluation.strengths || 'لم تسجل ملاحظات إضافية.'}
              </p>
            </div>

            <div className="border border-stone-300 p-3 rounded">
              <h5 className="font-bold text-amber-900 mb-1">
                مجالات التحسين والنقائص الواجب تداركها:
              </h5>
              <p className="text-stone-700 leading-relaxed whitespace-pre-line text-[11px]">
                {evaluation.improvements || 'أداء متوازن دون نقائص جوهرية.'}
              </p>
            </div>
          </div>

          {/* Recommendations and Inspector's Final Decision */}
          <div className="border border-stone-300 p-3.5 rounded text-xs space-y-2 mb-8 bg-stone-50/30">
            <div>
              <span className="font-bold text-stone-900">التوجيهات والتوصيات البيداغوجية الملزمة:</span>
              <p className="text-stone-700 mt-1 leading-relaxed text-[11px]">
                {evaluation.recommendations}
              </p>
            </div>
            <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-900">قرار المفتش: </span>
                <strong className="text-emerald-900 text-sm mr-1">{evaluation.decision}</strong>
              </div>
              <div className="text-stone-500 text-[10px]">
                حرر في: <span className="tabular-nums font-semibold text-stone-700">{evaluation.date}</span>
              </div>
            </div>
          </div>

          {/* Signatures and Official Stamp Zone */}
          <div className="grid grid-cols-3 gap-6 pt-4 text-center text-xs border-t-2 border-dashed border-stone-300 print:pt-6">
            <div className="space-y-12">
              <div className="font-semibold text-stone-800">توقيع أستاذ(ة) التعليم الابتدائي (اطلع عليه)</div>
              <div className="text-[10px] text-stone-400">التاريخ: .....................</div>
            </div>
            <div className="space-y-12">
              <div className="font-semibold text-stone-800">تأشيرة مدير(ة) المدرسة الابتدائية والختم</div>
              <div className="text-[10px] text-stone-400">التاريخ: .....................</div>
            </div>
            <div className="space-y-12">
              <div className="font-bold text-emerald-950">ختم وتوقيع مفتش التعليم الابتدائي</div>
              <div className="text-xs text-stone-800 font-serif font-bold">{inspector.name}</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
