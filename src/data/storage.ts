import {
  Zone,
  Institution,
  Teacher,
  InspectionEvaluation,
  PeriodicReport,
  ScheduledVisit,
} from '../types';
import {
  INITIAL_ZONES,
  INITIAL_INSTITUTIONS,
  INITIAL_TEACHERS,
  INITIAL_EVALUATIONS,
  INITIAL_SCHEDULED_VISITS,
  INITIAL_PERIODIC_REPORTS,
} from './mockData';

const STORAGE_KEYS = {
  ZONES: 'arabic_inspectorate_zones_primary_v2',
  INSTITUTIONS: 'arabic_inspectorate_institutions_primary_v2',
  TEACHERS: 'arabic_inspectorate_teachers_primary_v2',
  EVALUATIONS: 'arabic_inspectorate_evaluations_primary_v2',
  SCHEDULE: 'arabic_inspectorate_schedule_primary_v2',
  REPORTS: 'arabic_inspectorate_reports_primary_v2',
  INSPECTOR_INFO: 'arabic_inspectorate_info_primary_v2',
};

export interface InspectorProfile {
  name: string;
  title: string;
  districtName: string;
  academicYear: string;
  directorate: string;
  phone: string;
  email: string;
}

export const DEFAULT_INSPECTOR: InspectorProfile = {
  name: 'أ. بن بوزيد',
  title: 'مفتش التعليم الابتدائي لمادة اللغة العربية',
  districtName: 'مقاطعة التعليم الابتدائي للغة العربية - المقاطعة التفتيشية',
  academicYear: '2025 / 2026',
  directorate: 'مديرية التربية الوطنية - مصلحة التمدرس والامتحانات (الطور الابتدائي)',
  phone: '0555-12-34-56',
  email: 'inspecteur.benbouzid@education.gov.dz',
};

export const storage = {
  getInspectorProfile(): InspectorProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INSPECTOR_INFO);
      return data ? JSON.parse(data) : DEFAULT_INSPECTOR;
    } catch {
      return DEFAULT_INSPECTOR;
    }
  },

  saveInspectorProfile(profile: InspectorProfile) {
    localStorage.setItem(STORAGE_KEYS.INSPECTOR_INFO, JSON.stringify(profile));
  },

  getZones(): Zone[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ZONES);
      return data ? JSON.parse(data) : INITIAL_ZONES;
    } catch {
      return INITIAL_ZONES;
    }
  },

  saveZones(zones: Zone[]) {
    localStorage.setItem(STORAGE_KEYS.ZONES, JSON.stringify(zones));
  },

  getInstitutions(): Institution[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INSTITUTIONS);
      return data ? JSON.parse(data) : INITIAL_INSTITUTIONS;
    } catch {
      return INITIAL_INSTITUTIONS;
    }
  },

  saveInstitutions(institutions: Institution[]) {
    localStorage.setItem(STORAGE_KEYS.INSTITUTIONS, JSON.stringify(institutions));
  },

  getTeachers(): Teacher[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEACHERS);
      return data ? JSON.parse(data) : INITIAL_TEACHERS;
    } catch {
      return INITIAL_TEACHERS;
    }
  },

  saveTeachers(teachers: Teacher[]) {
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
  },

  getEvaluations(): InspectionEvaluation[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EVALUATIONS);
      return data ? JSON.parse(data) : INITIAL_EVALUATIONS;
    } catch {
      return INITIAL_EVALUATIONS;
    }
  },

  saveEvaluations(evaluations: InspectionEvaluation[]) {
    localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(evaluations));
  },

  getSchedule(): ScheduledVisit[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
      return data ? JSON.parse(data) : INITIAL_SCHEDULED_VISITS;
    } catch {
      return INITIAL_SCHEDULED_VISITS;
    }
  },

  saveSchedule(schedule: ScheduledVisit[]) {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule));
  },

  getReports(): PeriodicReport[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
      return data ? JSON.parse(data) : INITIAL_PERIODIC_REPORTS;
    } catch {
      return INITIAL_PERIODIC_REPORTS;
    }
  },

  saveReports(reports: PeriodicReport[]) {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  },

  resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.ZONES);
    localStorage.removeItem(STORAGE_KEYS.INSTITUTIONS);
    localStorage.removeItem(STORAGE_KEYS.TEACHERS);
    localStorage.removeItem(STORAGE_KEYS.EVALUATIONS);
    localStorage.removeItem(STORAGE_KEYS.SCHEDULE);
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
    localStorage.removeItem(STORAGE_KEYS.INSPECTOR_INFO);
  },

  exportBackup(): string {
    return JSON.stringify({
      version: '1.0',
      timestamp: new Date().toISOString(),
      inspector: this.getInspectorProfile(),
      zones: this.getZones(),
      institutions: this.getInstitutions(),
      teachers: this.getTeachers(),
      evaluations: this.getEvaluations(),
      schedule: this.getSchedule(),
      reports: this.getReports(),
    }, null, 2);
  },

  importBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.zones && parsed.institutions && parsed.teachers) {
        if (parsed.inspector) this.saveInspectorProfile(parsed.inspector);
        if (parsed.zones) this.saveZones(parsed.zones);
        if (parsed.institutions) this.saveInstitutions(parsed.institutions);
        if (parsed.teachers) this.saveTeachers(parsed.teachers);
        if (parsed.evaluations) this.saveEvaluations(parsed.evaluations);
        if (parsed.schedule) this.saveSchedule(parsed.schedule);
        if (parsed.reports) this.saveReports(parsed.reports);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
};
