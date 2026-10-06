import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Project, ProjectStatus } from '../../types';
import {
  FolderGit2,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Wrench,
  FileCheck,
  CreditCard,
  IndianRupee,
  Users,
  ChevronRight,
  X,
  Camera,
  Layers
} from 'lucide-react';

interface SolarProjectManagementViewProps {
  onOpenNewProject: () => void;
  onOpenPaymentModal?: (project: Project) => void;
}

const PROJECT_STAGES: ProjectStatus[] = [
  'Site Survey',
  'Quotation',
  'Order Confirmed',
  'Advance Payment',
  'Installation Scheduled',
  'Installation in Progress',
  'Quality Inspection',
  'Net Metering Application',
  'Commissioning & Handover',
  'Completed'
];

export const SolarProjectManagementView: React.FC<SolarProjectManagementViewProps> = ({
  onOpenNewProject,
  onOpenPaymentModal
}) => {
  const { projects, updateProjectStatus, updateProject, allUsers } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = projects.filter(p => {
    const nameMatch = (p.projectName || p.projectId || p.customerName || '').toLowerCase().includes(search.toLowerCase());
    const customerMatch = (p.customerName || '').toLowerCase().includes(search.toLowerCase());
    const idMatch = p.id.toLowerCase().includes(search.toLowerCase());
    const matchesSearch = nameMatch || customerMatch || idMatch;
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStageIndex = (status: ProjectStatus) => {
    const idx = PROJECT_STAGES.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div id="projects-view" className="p-4 space-y-4 text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white">Solar Project EPC Execution</h2>
          <p className="text-[11px] text-slate-400">
            {projects.length} Total Projects ({projects.filter(p => p.status !== 'Completed').length} Active)
          </p>
        </div>
        <button
          onClick={onOpenNewProject}
          className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow"
        >
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search by project name or customer..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
        />
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            statusFilter === 'ALL'
              ? 'bg-emerald-500 text-slate-950'
              : 'bg-slate-900 border border-slate-800 text-slate-300'
          }`}
        >
          All Projects ({projects.length})
        </button>
        {PROJECT_STAGES.slice(2).map(stage => {
          const count = projects.filter(p => p.status === stage).length;
          if (count === 0 && statusFilter !== stage) return null;
          return (
            <button
              key={stage}
              onClick={() => setStatusFilter(stage)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === stage
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-900 border border-slate-800 text-slate-300'
              }`}
            >
              {stage} ({count})
            </button>
          );
        })}
      </div>

      {/* Projects List */}
      <div className="space-y-3">
        {filteredProjects.map(project => {
          const currentStageIndex = getStageIndex(project.status);
          const progressPercent = Math.round(((currentStageIndex + 1) / PROJECT_STAGES.length) * 100);

          return (
            <div
              key={project.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3 shadow-sm"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400">{project.projectId || project.id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {project.systemCapacityKW || project.systemCapacity} kW
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-0.5">{project.projectName || `${project.customerName} Solar Project`}</h3>
                  <p className="text-[11px] text-slate-400">{project.customerName}</p>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    project.status === 'Completed'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                  }`}
                >
                  {project.status}
                </span>
              </div>

              {/* Visual Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Stage {currentStageIndex + 1} of {PROJECT_STAGES.length}: {project.status}</span>
                  <span className="font-bold text-emerald-400">{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Financial Snapshot */}
              <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs">
                <div>
                  <span className="text-[9px] text-slate-400 block">Total</span>
                  <span className="font-bold text-white">₹{project.finalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block">Received</span>
                  <span className="font-bold text-emerald-400">₹{(project.receivedAmount || project.advanceReceived || 0).toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block">Pending</span>
                  <span className="font-bold text-rose-400">₹{project.pendingAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Quick Card Controls */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="text-[11px] text-slate-400 truncate">
                  Team: <strong className="text-slate-200">{project.assignedInstallationLead || 'Field Team'}</strong>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {project.pendingAmount > 0 && onOpenPaymentModal && (
                    <button
                      onClick={() => onOpenPaymentModal(project)}
                      className="px-2 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold"
                    >
                      + Payment
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold"
                  >
                    Details & Timeline
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project 360 Detail & Timeline Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 text-xs text-slate-300 space-y-4">
            <div className="flex items-start justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                  {selectedProject.projectId || selectedProject.id}
                </span>
                <h3 className="text-base font-black text-white">{selectedProject.projectName || `${selectedProject.customerName} Solar Project`}</h3>
                <p className="text-[11px] text-slate-400">{selectedProject.customerName}</p>
              </div>
              <button onClick={() => setSelectedProject(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Advance Status Workflow Selector */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <label className="block text-[11px] font-bold text-emerald-400 uppercase">
                Update Project EPC Stage:
              </label>
              <select
                value={selectedProject.status}
                onChange={e => {
                  const newStatus = e.target.value as ProjectStatus;
                  updateProjectStatus(selectedProject.id, newStatus);
                  setSelectedProject({ ...selectedProject, status: newStatus });
                }}
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold"
              >
                {PROJECT_STAGES.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>

            {/* Equipment Bill of Materials (BOM) */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
              <h4 className="font-bold text-white text-[11px] uppercase tracking-wider">
                Installed Equipment Specs
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>Panels: <strong className="text-white">{selectedProject.panelBrand || selectedProject.panel || 'Mono PERC Tier-1'} ({selectedProject.panelQuantity || 12} pcs)</strong></div>
                <div>Inverter: <strong className="text-white">{selectedProject.inverterBrand || selectedProject.inverter || 'Growatt On-Grid'}</strong></div>
                <div>Structure: <strong className="text-white">{selectedProject.structureType || selectedProject.structure || 'Elevated HDG'}</strong></div>
                <div>Commissioning: <strong className="text-white">{selectedProject.commissioningDate || selectedProject.installationDate || 'Scheduled'}</strong></div>
              </div>
            </div>

            {/* Financial Ledger */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <div>
                <span className="text-[10px] text-slate-400">Total Contract</span>
                <div className="text-sm font-bold text-white">₹{selectedProject.finalAmount.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Advance Paid</span>
                <div className="text-sm font-bold text-emerald-400">₹{(selectedProject.receivedAmount || selectedProject.advanceReceived || 0).toLocaleString('en-IN')}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Balance Pending</span>
                <div className="text-sm font-bold text-rose-400">₹{selectedProject.pendingAmount.toLocaleString('en-IN')}</div>
              </div>
            </div>

            {/* Stage Timeline */}
            <div>
              <h4 className="font-bold text-white text-[11px] uppercase tracking-wider mb-2">
                Project Milestone Timeline
              </h4>
              <div className="space-y-1.5 pl-2 border-l-2 border-slate-800">
                {PROJECT_STAGES.map((st, i) => {
                  const isCurrent = st === selectedProject.status;
                  const isPast = getStageIndex(selectedProject.status) >= i;
                  return (
                    <div key={st} className="flex items-center gap-2 pl-3 py-1 relative">
                      <div
                        className={`w-2.5 h-2.5 rounded-full absolute -left-[18px] ${
                          isPast ? 'bg-emerald-400 ring-4 ring-emerald-400/20' : 'bg-slate-700'
                        }`}
                      />
                      <span className={`text-[11px] ${isCurrent ? 'font-bold text-emerald-400' : isPast ? 'text-white' : 'text-slate-500'}`}>
                        {st}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
