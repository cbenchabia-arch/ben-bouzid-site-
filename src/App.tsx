import React, { useState, useEffect } from 'react';
import { 
  Zone, 
  Institution, 
  Teacher, 
  InspectionEvaluation, 
  PeriodicReport, 
  ScheduledVisit 
} from './types';
import { storage, InspectorProfile } from './data/storage';
import { Header } from './components/Header';
import { DashboardView } from './views/DashboardView';
import { InstitutionsView } from './views/InstitutionsView';
import { TeachersView } from './views/TeachersView';
import { EvaluationSystemView } from './views/EvaluationSystemView';
import { PeriodicReportsView } from './views/PeriodicReportsView';
import { ScheduleView } from './views/ScheduleView';
import { PrintableInspectionCard } from './components/PrintableInspectionCard';
import { PrintableInstitutionReport } from './components/PrintableInstitutionReport';
import { EvaluationModal } from './components/EvaluationModal';
import { InstitutionModal } from './components/InstitutionModal';
import { TeacherModal } from './components/TeacherModal';
import { ScheduleModal } from './components/ScheduleModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const [inspector, setInspector] = useState<InspectorProfile>(() => storage.getInspectorProfile());
  const [zones, setZones] = useState<Zone[]>(() => storage.getZones());
  const [institutions, setInstitutions] = useState<Institution[]>(() => storage.getInstitutions());
  const [teachers, setTeachers] = useState<Teacher[]>(() => storage.getTeachers());
  const [evaluations, setEvaluations] = useState<InspectionEvaluation[]>(() => storage.getEvaluations());
  const [schedule, setSchedule] = useState<ScheduledVisit[]>(() => storage.getSchedule());
  const [reports, setReports] = useState<PeriodicReport[]>(() => storage.getReports());

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'institutions' | 'teachers' | 'evaluation' | 'reports' | 'schedule'
  >('dashboard');

  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>('all');

  // Modals state
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [evaluationTargetTeacher, setEvaluationTargetTeacher] = useState<Teacher | undefined>(undefined);
  const [editingEvaluation, setEditingEvaluation] = useState<InspectionEvaluation | undefined>(undefined);

  const [isInstitutionModalOpen, setIsInstitutionModalOpen] = useState(false);
  const [editingInstitution, setEditingInstitution] = useState<Institution | null>(null);
  const [selectedInstitutionDrawerId, setSelectedInstitutionDrawerId] = useState<string | null>(null);

  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState<ScheduledVisit | null>(null);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Printable overlays
  const [viewingEvaluationId, setViewingEvaluationId] = useState<string | null>(null);
  const [viewingReport, setViewingReport] = useState<PeriodicReport | null>(null);

  // Sync to storage on state changes
  const reloadDataFromStorage = () => {
    setInspector(storage.getInspectorProfile());
    setZones(storage.getZones());
    setInstitutions(storage.getInstitutions());
    setTeachers(storage.getTeachers());
    setEvaluations(storage.getEvaluations());
    setSchedule(storage.getSchedule());
    setReports(storage.getReports());
  };

  // Evaluation Handlers
  const handleStartNewEvaluation = (teacherId?: string) => {
    const t = teacherId ? teachers.find((tch) => tch.id === teacherId) : teachers[0];
    setEvaluationTargetTeacher(t);
    setEditingEvaluation(undefined);
    setIsEvaluationModalOpen(true);
  };

  const handleEditEvaluation = (evalItem: InspectionEvaluation) => {
    const t = teachers.find((tch) => tch.id === evalItem.teacherId);
    setEvaluationTargetTeacher(t);
    setEditingEvaluation(evalItem);
    setIsEvaluationModalOpen(true);
  };

  const handleSaveEvaluation = (evalItem: InspectionEvaluation) => {
    let updatedEvals: InspectionEvaluation[];
    const exists = evaluations.some((e) => e.id === evalItem.id);
    if (exists) {
      updatedEvals = evaluations.map((e) => (e.id === evalItem.id ? evalItem : e));
    } else {
      updatedEvals = [evalItem, ...evaluations];
    }
    setEvaluations(updatedEvals);
    storage.saveEvaluations(updatedEvals);

    // Update teacher's last score and status
    const updatedTeachers = teachers.map((t) => {
      if (t.id === evalItem.teacherId) {
        return {
          ...t,
          lastScore: evalItem.totalScore,
          lastInspectionDate: evalItem.date,
          inspectionStatus: (evalItem.inspectionType === 'تفتيش تثبيت' ? 'مفتش هذا الفصل' : 'مفتش هذا الفصل') as any,
          isTenured: evalItem.decision.includes('تثبيت') ? true : t.isTenured,
        };
      }
      return t;
    });
    setTeachers(updatedTeachers);
    storage.saveTeachers(updatedTeachers);

    // Update any pending scheduled visit for this teacher to completed
    const updatedSchedule = schedule.map((v) => {
      if (v.teacherId === evalItem.teacherId && v.status === 'مبرمجة') {
        return { ...v, status: 'تمت بنجاح' as const };
      }
      return v;
    });
    setSchedule(updatedSchedule);
    storage.saveSchedule(updatedSchedule);

    setIsEvaluationModalOpen(false);
    // Show printable sheet immediately so the inspector can print it
    setViewingEvaluationId(evalItem.id);
  };

  const handleDeleteEvaluation = (evalId: string) => {
    const updated = evaluations.filter((e) => e.id !== evalId);
    setEvaluations(updated);
    storage.saveEvaluations(updated);
  };

  // Institution Handlers
  const handleSaveInstitution = (inst: Institution) => {
    let updated: Institution[];
    if (institutions.some((i) => i.id === inst.id)) {
      updated = institutions.map((i) => (i.id === inst.id ? inst : i));
    } else {
      updated = [...institutions, inst];
    }
    setInstitutions(updated);
    storage.saveInstitutions(updated);
    setIsInstitutionModalOpen(false);
    setEditingInstitution(null);
  };

  const handleDeleteInstitution = (instId: string) => {
    const updated = institutions.filter((i) => i.id !== instId);
    setInstitutions(updated);
    storage.saveInstitutions(updated);
  };

  // Teacher Handlers
  const handleSaveTeacher = (teacher: Teacher) => {
    let updated: Teacher[];
    if (teachers.some((t) => t.id === teacher.id)) {
      updated = teachers.map((t) => (t.id === teacher.id ? teacher : t));
    } else {
      updated = [...teachers, teacher];
    }
    setTeachers(updated);
    storage.saveTeachers(updated);
    setIsTeacherModalOpen(false);
    setEditingTeacher(null);
  };

  const handleDeleteTeacher = (teacherId: string) => {
    const updated = teachers.filter((t) => t.id !== teacherId);
    setTeachers(updated);
    storage.saveTeachers(updated);
  };

  // Schedule Handlers
  const handleSaveVisit = (visit: ScheduledVisit) => {
    let updated: ScheduledVisit[];
    if (schedule.some((v) => v.id === visit.id)) {
      updated = schedule.map((v) => (v.id === visit.id ? visit : v));
    } else {
      updated = [visit, ...schedule];
    }
    setSchedule(updated);
    storage.saveSchedule(updated);
    setIsScheduleModalOpen(false);
    setEditingVisit(null);
  };

  const handleDeleteVisit = (visitId: string) => {
    const updated = schedule.filter((v) => v.id !== visitId);
    setSchedule(updated);
    storage.saveSchedule(updated);
  };

  const handleUpdateVisitStatus = (visitId: string, status: ScheduledVisit['status']) => {
    const updated = schedule.map((v) => (v.id === visitId ? { ...v, status } : v));
    setSchedule(updated);
    storage.saveSchedule(updated);
  };

  // Reports Handlers
  const handleSaveReport = (rep: PeriodicReport) => {
    let updated: PeriodicReport[];
    if (reports.some((r) => r.id === rep.id)) {
      updated = reports.map((r) => (r.id === rep.id ? rep : r));
    } else {
      updated = [rep, ...reports];
    }
    setReports(updated);
    storage.saveReports(updated);
    setViewingReport(rep);
  };

  const handleDeleteReport = (reportId: string) => {
    const updated = reports.filter((r) => r.id !== reportId);
    setReports(updated);
    storage.saveReports(updated);
  };

  const handleGenerateInstitutionReport = (instId: string) => {
    const inst = institutions.find((i) => i.id === instId);
    if (!inst) return;

    // Check if an existing report for this institution exists
    const existing = reports.find((r) => r.targetId === instId);
    if (existing) {
      setViewingReport(existing);
    } else {
      // Auto-generate fresh periodic report
      const instTeachers = teachers.filter((t) => t.institutionId === instId);
      const evaluated = instTeachers.filter((t) => t.lastScore > 0);
      const scores = evaluated.map((t) => t.lastScore);
      const avg = scores.length > 0 ? Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)) : 16.5;

      const newReport: PeriodicReport = {
        id: `rep-${inst.id}-${Date.now()}`,
        title: `التقرير التفتيشي الدوري الشامل لمدرسة ${inst.name} الابتدائية`,
        reportType: 'دوري للمدرسة الابتدائية',
        targetType: 'مؤسسة',
        targetId: inst.id,
        academicPeriod: 'الفصل الأول - الموسم الدراسي 2025/2026',
        date: new Date().toISOString().split('T')[0],
        curriculumProgressPercent: 95,
        averageDistrictScore: avg,
        teachersEvaluated: evaluated.length || 1,
        totalTeachersInTarget: instTeachers.length || 1,
        generalObservations: `بناءً على المعاينات الصفية الدورية والزيارات التفقدية المنجزة بمدرسة ${inst.name} الابتدائية، يسجل المفتش بن بوزيد التزاماً عالياً بتدرج التعلمات للطور الابتدائي، وتحكماً جيداً للمتعلمين في آليات القراءة والكتابة باللغة العربية.`,
        strengthsAnalysis: [
          'تنفيذ تدرجات التعلمات ومذكرات منهاج الجيل الثاني للابتدائي بدقة.',
          'تفعيل حصص فهم المنطوق والتعبير الشفوي واستعمال السندات البصرية.',
          'العناية الملحوظة بكراريس القسم والتصحيح الإملائي الفوري للأطفال.'
        ],
        weaknessesAnalysis: [
          'الحاجة إلى مزيد من تكثيف حصص المعالجة البيداغوجية الأسبوعية لذوي الصعوبات القرائية.',
          'ضرورة تدريب التلاميذ على الكتابة بخط النسخ وفق المعايير والقواعد السليمة.'
        ],
        pedagogicalDirectives: [
          'المواظبة على استعمال الألواح الفردية والبطاقات الخاطفة لتثبيت الحروف والمفردات.',
          'تشجيع الأطفال على المطالعة الحرة في ركن القراءة الصفي وتلخيص القصص.'
        ],
        administrativeRecommendations: [
          'توفير الوسائل الإيضاحية ومجسمات الحروف والأرقام لقاعات الطور الأول.',
          'تهيئة فضاء للمطالعة المدرسية وتشجيع مسابقات الخط والإلقاء بالابتدائي.'
        ]
      };

      const updated = [newReport, ...reports];
      setReports(updated);
      storage.saveReports(updated);
      setViewingReport(newReport);
    }
  };

  const activeInspectionForView = viewingEvaluationId
    ? evaluations.find((e) => e.id === viewingEvaluationId)
    : undefined;
  const activeTeacherForView = activeInspectionForView
    ? teachers.find((t) => t.id === activeInspectionForView.teacherId)
    : undefined;
  const activeInstitutionForView = activeInspectionForView
    ? institutions.find((i) => i.id === activeInspectionForView.institutionId)
    : undefined;
  const activeZoneForView = activeInstitutionForView
    ? zones.find((z) => z.id === activeInstitutionForView.zoneId)
    : undefined;

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 flex flex-col selection:bg-emerald-700 selection:text-white">
      
      {/* Official Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        inspector={inspector}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        selectedZoneFilter={selectedZoneFilter}
        setSelectedZoneFilter={setSelectedZoneFilter}
        zones={zones}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            zones={zones}
            institutions={institutions}
            teachers={teachers}
            evaluations={evaluations}
            schedule={schedule}
            inspector={inspector}
            selectedZoneFilter={selectedZoneFilter}
            setSelectedZoneFilter={setSelectedZoneFilter}
            onNavigateToTab={setActiveTab}
            onViewEvaluationCard={(evalId) => setViewingEvaluationId(evalId)}
            onStartNewEvaluation={handleStartNewEvaluation}
            onViewInstitutionDetails={(instId) => {
              setSelectedInstitutionDrawerId(instId);
              setActiveTab('institutions');
            }}
          />
        )}

        {activeTab === 'institutions' && (
          <InstitutionsView
            institutions={institutions}
            zones={zones}
            teachers={teachers}
            selectedZoneFilter={selectedZoneFilter}
            setSelectedZoneFilter={setSelectedZoneFilter}
            onAddInstitution={() => {
              setEditingInstitution(null);
              setIsInstitutionModalOpen(true);
            }}
            onEditInstitution={(inst) => {
              setEditingInstitution(inst);
              setIsInstitutionModalOpen(true);
            }}
            onDeleteInstitution={handleDeleteInstitution}
            onOpenNewTeacher={(instId) => {
              setEditingTeacher(null);
              setIsTeacherModalOpen(true);
            }}
            onStartTeacherEvaluation={handleStartNewEvaluation}
            onGenerateInstitutionReport={handleGenerateInstitutionReport}
            selectedInstitutionId={selectedInstitutionDrawerId}
            setSelectedInstitutionId={setSelectedInstitutionDrawerId}
          />
        )}

        {activeTab === 'teachers' && (
          <TeachersView
            teachers={teachers}
            institutions={institutions}
            zones={zones}
            evaluations={evaluations}
            selectedZoneFilter={selectedZoneFilter}
            setSelectedZoneFilter={setSelectedZoneFilter}
            onAddTeacher={() => {
              setEditingTeacher(null);
              setIsTeacherModalOpen(true);
            }}
            onEditTeacher={(teacher) => {
              setEditingTeacher(teacher);
              setIsTeacherModalOpen(true);
            }}
            onDeleteTeacher={handleDeleteTeacher}
            onStartEvaluation={handleStartNewEvaluation}
            onViewEvaluation={(evalId) => setViewingEvaluationId(evalId)}
            onScheduleVisit={(teacherId) => {
              const v: ScheduledVisit = {
                id: `vis-${Date.now()}`,
                teacherId,
                institutionId: teachers.find((t) => t.id === teacherId)?.institutionId || institutions[0].id,
                zoneId: teachers.find((t) => t.id === teacherId)?.zoneId || zones[0].id,
                plannedDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
                timeSlot: '08:00 - 10:00',
                visitType: 'تفتيش ترقية',
                purpose: 'معاينة بيداغوجية ميدانية',
                status: 'مبرمجة',
              };
              setEditingVisit(v);
              setIsScheduleModalOpen(true);
            }}
          />
        )}

        {activeTab === 'evaluation' && (
          <EvaluationSystemView
            evaluations={evaluations}
            teachers={teachers}
            institutions={institutions}
            zones={zones}
            selectedZoneFilter={selectedZoneFilter}
            setSelectedZoneFilter={setSelectedZoneFilter}
            onStartNewEvaluation={handleStartNewEvaluation}
            onViewEvaluation={(evalId) => setViewingEvaluationId(evalId)}
            onEditEvaluation={handleEditEvaluation}
            onDeleteEvaluation={handleDeleteEvaluation}
          />
        )}

        {activeTab === 'reports' && (
          <PeriodicReportsView
            reports={reports}
            institutions={institutions}
            teachers={teachers}
            zones={zones}
            inspector={inspector}
            onSaveReport={handleSaveReport}
            onDeleteReport={handleDeleteReport}
            onViewPrintableReport={(rep) => setViewingReport(rep)}
          />
        )}

        {activeTab === 'schedule' && (
          <ScheduleView
            schedule={schedule}
            teachers={teachers}
            institutions={institutions}
            zones={zones}
            selectedZoneFilter={selectedZoneFilter}
            setSelectedZoneFilter={setSelectedZoneFilter}
            onAddVisit={() => {
              setEditingVisit(null);
              setIsScheduleModalOpen(true);
            }}
            onEditVisit={(visit) => {
              setEditingVisit(visit);
              setIsScheduleModalOpen(true);
            }}
            onDeleteVisit={handleDeleteVisit}
            onStartEvaluationFromVisit={handleStartNewEvaluation}
            onUpdateVisitStatus={handleUpdateVisitStatus}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print bg-white border-t border-stone-200 py-4 px-6 text-xs text-stone-500 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span>منظومة مفتشية اللغة العربية وآدابها</span>
            <span className="mx-2">·</span>
            <span>{inspector.districtName}</span>
          </div>
          <div className="text-stone-400">
            نظام التفتيش البيداغوجي والتقييم الإلكتروني للمؤسسات والأساتذة © {new Date().getFullYear()}
          </div>
        </div>
      </footer>

      {/* Modals & Printable Views */}
      {isEvaluationModalOpen && (
        <EvaluationModal
          teacher={evaluationTargetTeacher}
          teachers={teachers}
          institutions={institutions}
          inspector={inspector}
          initialEvaluation={editingEvaluation}
          onSave={handleSaveEvaluation}
          onClose={() => {
            setIsEvaluationModalOpen(false);
            setEditingEvaluation(undefined);
          }}
        />
      )}

      {isInstitutionModalOpen && (
        <InstitutionModal
          institution={editingInstitution}
          zones={zones}
          onSave={handleSaveInstitution}
          onClose={() => {
            setIsInstitutionModalOpen(false);
            setEditingInstitution(null);
          }}
        />
      )}

      {isTeacherModalOpen && (
        <TeacherModal
          teacher={editingTeacher}
          institutions={institutions}
          zones={zones}
          onSave={handleSaveTeacher}
          onClose={() => {
            setIsTeacherModalOpen(false);
            setEditingTeacher(null);
          }}
        />
      )}

      {isScheduleModalOpen && (
        <ScheduleModal
          visit={editingVisit}
          teachers={teachers}
          institutions={institutions}
          onSave={handleSaveVisit}
          onClose={() => {
            setIsScheduleModalOpen(false);
            setEditingVisit(null);
          }}
        />
      )}

      {isSettingsModalOpen && (
        <SettingsModal
          inspector={inspector}
          onSaveInspector={(p) => {
            setInspector(p);
            storage.saveInspectorProfile(p);
          }}
          onDataReload={reloadDataFromStorage}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      )}

      {/* Printable Official Inspection Card Overlay */}
      {activeInspectionForView && (
        <PrintableInspectionCard
          evaluation={activeInspectionForView}
          teacher={activeTeacherForView}
          institution={activeInstitutionForView}
          zone={activeZoneForView}
          inspector={inspector}
          onClose={() => setViewingEvaluationId(null)}
        />
      )}

      {/* Printable Institution Periodic Report Overlay */}
      {viewingReport && (
        <PrintableInstitutionReport
          report={viewingReport}
          institution={institutions.find((i) => i.id === viewingReport.targetId)}
          teachers={
            viewingReport.targetId === 'all'
              ? teachers
              : teachers.filter((t) => t.institutionId === viewingReport.targetId)
          }
          zone={
            viewingReport.targetId !== 'all'
              ? zones.find((z) => z.id === institutions.find((i) => i.id === viewingReport.targetId)?.zoneId)
              : undefined
          }
          inspector={inspector}
          onClose={() => setViewingReport(null)}
        />
      )}

    </div>
  );
}
