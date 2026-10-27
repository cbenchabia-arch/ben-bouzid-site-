import React, { useState } from 'react';
import { InspectionEvaluation, Teacher, Institution, Zone } from '../types';
import { 
  ClipboardCheck, 
  Plus, 
  Search, 
  Printer, 
  Eye, 
  Award, 
  BookOpen, 
  Calendar, 
  Trash2, 
  TrendingUp,
  FileCheck
} from 'lucide-react';

interface EvaluationSystemViewProps {
  evaluations: InspectionEvaluation[];
  teachers: Teacher[];
  institutions: Institution[];
  zones: Zone[];
  selectedZoneFilter: string;
  setSelectedZoneFilter: (zone: string) => void;
  onStartNewEvaluation: (teacherId?: string) => void;
  onViewEvaluation: (evalId: string) => void;
  onEditEvaluation: (evaluation: InspectionEvaluation) => void;
  onDeleteEvaluation: (evalId: string) => void;
}

export const EvaluationSystemView: React.FC<EvaluationSystemViewProps> = ({
  evaluations,
  teachers,
  institutions,
  zones,
  selectedZoneFilter,
  setSelectedZoneFilter,
  onStartNewEvaluation,
  onViewEvaluation,
  onEditEvaluation,
  onDeleteEvaluation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');

  const filteredEvaluations = evaluations.filter((e) => {
    const tch = teachers.find((t) => t.id === e.teacherId);
    const inst = institutions.find((i) => i.id === e.institutionId);

    const matchesZone = selectedZoneFilter === 'all' || e.zoneId === selectedZoneFilter;
    const matchesType = typeFilter === 'all' || e.inspectionType === typeFilter;
    const matchesBranch = branchFilter === 'all' || e.subjectBranch === branchFilter;
    const matchesSearch = 
      (tch?.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inst?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.lessonTopic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.decision.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesZone && matchesType && matchesBranch && matchesSearch;
  });

  const scores = evaluations.map((e) => e.totalScore);
  const avgDistrictScore = scores.length > 0 
    ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) 
    : '---';

  const excellentCount = scores.filter((s) => s >= 18).length;
  const veryGoodCount = scores.filter((s) => s >= 16 && s < 18).length;
  const goodCount = scores.filter((s) => s >= 14 && s < 16).length;
  const acceptableCount = scores.filter((s) => s < 14).length;

  return (
    <div className="space-y-6">
      
      {/* Top Header & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-emerald-800" />
            نظام التقييم الإلكتروني وبطاقات التفتيش
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            سجل شبكات التقييم المعتمدة، احتساب النقط التربوية من 20، وصياغة التوجيهات وقرارات التثبيت والترقية.
          </p>
        </div>

        <button
          onClick={() => onStartNewEvaluation()}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold shadow-xs transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>إجراء تفتيش بيداغوجي جديد</span>
        </button>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-2xs">
          <div className="text-stone-500 text-xs mb-1">إجمالي بطاقات التفتيش</div>
          <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {evaluations.length}
          </div>
          <div className="text-[10px] text-stone-400 mt-1">بطاقة معتمدة وموثقة</div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-2xs">
          <div className="text-stone-500 text-xs mb-1">المعدل العام للتقييم</div>
          <div className="text-2xl font-bold font-mono text-emerald-900 tabular-nums">
            {avgDistrictScore}
            <span className="text-xs text-stone-500 font-sans mr-1">/ 20</span>
          </div>
          <div className="text-[10px] text-emerald-800 font-medium mt-1">أداء بيداغوجي متميز</div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-2xs">
          <div className="text-stone-500 text-xs mb-1">تثبيت الأساتذة الجدد</div>
          <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {evaluations.filter((e) => e.inspectionType === 'تفتيش تثبيت').length}
          </div>
          <div className="text-[10px] text-stone-400 mt-1">تقارير تثبيت وترسيم</div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-2xs">
          <div className="text-stone-500 text-xs mb-1">توزيع التقديرات</div>
          <div className="text-xs font-semibold text-stone-800 flex items-center gap-2 mt-1">
            <span className="text-emerald-800">ممتاز ({excellentCount})</span>
            <span>·</span>
            <span className="text-blue-800">جيد جداً ({veryGoodCount})</span>
            <span>·</span>
            <span className="text-amber-800">مقبول ({acceptableCount})</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالأستاذ، المؤسسة، عنوان الدرس..."
              className="w-full bg-stone-50 border border-stone-300 rounded-lg py-2 pr-9 pl-3 text-stone-800 focus:bg-white focus:ring-1 focus:ring-emerald-700 focus:outline-none"
            />
          </div>

          <div>
            <select
              value={selectedZoneFilter}
              onChange={(e) => setSelectedZoneFilter(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg py-2 px-3 text-stone-800 font-medium focus:bg-white focus:ring-1 focus:ring-emerald-700 focus:outline-none cursor-pointer"
            >
              <option value="all">كافة الجهات التفتيشية</option>
              {zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg py-2 px-3 text-stone-800 font-medium focus:bg-white focus:ring-1 focus:ring-emerald-700 focus:outline-none cursor-pointer"
            >
              <option value="all">كافة أنواع الزيارات</option>
              <option value="تفتيش تثبيت">تفتيش تثبيت</option>
              <option value="تفتيش ترقية دورية">تفتيش ترقية دورية</option>
              <option value="زيارة توجيهية استطلاعية">زيارة توجيهية استطلاعية</option>
              <option value="زيارة متابعة خاصة">زيارة متابعة خاصة</option>
            </select>
          </div>

          <div>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg py-2 px-3 text-stone-800 font-medium focus:bg-white focus:ring-1 focus:ring-emerald-700 focus:outline-none cursor-pointer"
            >
              <option value="all">كافة ميادين اللغة بالابتدائي</option>
              <option value="فهم المنطوق والتعبير الشفوي">فهم المنطوق والتعبير الشفوي</option>
              <option value="القراءة والمطالعة الموجهة">القراءة والمطالعة الموجهة</option>
              <option value="الظواهر النحوية والصرفية">الظواهر النحوية والصرفية</option>
              <option value="الإملاء والظواهر الإملائية">الإملاء والظواهر الإملائية</option>
              <option value="التعبير والإنتاج الكتابي">التعبير والإنتاج الكتابي</option>
              <option value="المحفوظات والأناشيد">المحفوظات والأناشيد</option>
              <option value="الخط والتطبيقات اللغوية">الخط والتطبيقات اللغوية</option>
            </select>
          </div>

        </div>
      </div>

      {/* Evaluations Table */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-xs text-right border-collapse">
          <thead>
            <tr className="bg-stone-50 text-stone-700 border-b border-stone-200">
              <th className="py-3 px-4 font-semibold">الأستاذ والمؤسسة</th>
              <th className="py-3 px-4 font-semibold">نوع التفتيش والفرع</th>
              <th className="py-3 px-4 font-semibold">عنوان الدرس المشاهد</th>
              <th className="py-3 px-4 font-semibold text-center">الدرجة الممنوحة</th>
              <th className="py-3 px-4 font-semibold">التقدير والقرار</th>
              <th className="py-3 px-4 font-semibold text-center">تاريخ الإجراء</th>
              <th className="py-3 px-4 font-semibold text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredEvaluations.map((evalItem) => {
              const tch = teachers.find((t) => t.id === evalItem.teacherId);
              const inst = institutions.find((i) => i.id === evalItem.institutionId);

              return (
                <tr key={evalItem.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-stone-900">{tch?.fullName || 'أستاذ'}</div>
                    <div className="text-[10px] text-stone-500">{inst?.name}</div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-medium text-emerald-950 block">{evalItem.inspectionType}</span>
                    <span className="text-[11px] text-stone-500">{evalItem.subjectBranch}</span>
                  </td>

                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-medium text-stone-800 line-clamp-1">{evalItem.lessonTopic}</div>
                    <div className="text-[10px] text-stone-500">الفوج: {evalItem.classroomLevel}</div>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <div className="font-extrabold font-mono text-base text-emerald-900 tabular-nums">
                      {evalItem.totalScore.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-stone-400">/ 20</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-stone-800 text-[11px] line-clamp-1">
                      {evalItem.appreciation.split('-')[0]}
                    </div>
                    <div className="text-[10px] text-emerald-800 font-medium">
                      {evalItem.decision}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center tabular-nums font-mono text-stone-600">
                    {evalItem.date}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onViewEvaluation(evalItem.id)}
                        className="p-1.5 text-emerald-800 hover:bg-emerald-50 rounded-md transition-colors"
                        title="معاينة وطباعة بطاقة التفتيش الرسمية"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditEvaluation(evalItem)}
                        className="p-1.5 text-stone-600 hover:bg-stone-100 rounded-md transition-colors"
                        title="تعديل التقييم"
                      >
                        <ClipboardCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('هل أنت متأكد من حذف بطاقة التفتيش هذه؟')) {
                            onDeleteEvaluation(evalItem.id);
                          }
                        }}
                        className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                        title="حذف البطاقة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredEvaluations.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-stone-500">
                  لا توجد بطاقات تقييم تطابق المعايير المختارة. انقر على "إجراء تفتيش بيداغوجي جديد".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
