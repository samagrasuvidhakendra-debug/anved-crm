import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppGuideArticle, UserRole } from '../../types';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  EyeOff,
  MoveUp,
  MoveDown,
  Layers,
  X
} from 'lucide-react';

export const AdminGuideManagerView: React.FC = () => {
  const { guides, addGuide, updateGuide, deleteGuide } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGuide, setEditingGuide] = useState<AppGuideArticle | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'CRM',
    description: '',
    steps: ['', '', ''],
    targetRoles: ['All'],
    status: 'Published' as 'Published' | 'Draft'
  });

  const handleSaveGuide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setFormError('Please fill out title and description.');
      return;
    }

    setFormError(null);
    const cleanSteps = formData.steps.filter(s => s.trim().length > 0);

    if (editingGuide) {
      updateGuide(editingGuide.id, {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        steps: cleanSteps,
        targetRoles: formData.targetRoles,
        status: formData.status
      });
      setEditingGuide(null);
    } else {
      addGuide({
        title: formData.title,
        category: formData.category,
        description: formData.description,
        steps: cleanSteps,
        targetRoles: formData.targetRoles,
        order: guides.length + 1,
        status: formData.status
      });
    }

    setShowAddModal(false);
    setFormData({
      title: '',
      category: 'CRM',
      description: '',
      steps: ['', '', ''],
      targetRoles: ['All'],
      status: 'Published'
    });
  };

  const startEdit = (guide: AppGuideArticle) => {
    setEditingGuide(guide);
    setFormData({
      title: guide.title,
      category: guide.category,
      description: guide.description,
      steps: guide.steps.length > 0 ? [...guide.steps] : ['', ''],
      targetRoles: guide.targetRoles || ['All'],
      status: guide.status
    });
    setShowAddModal(true);
  };

  return (
    <div id="admin-guide-manager-view" className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-400" /> Interactive App Guide CMS
          </h1>
          <p className="text-xs text-slate-400">
            Publish interactive on-boarding guides, workflows, and SOP articles for mobile app users
          </p>
        </div>
        <button
          onClick={() => {
            setEditingGuide(null);
            setFormData({
              title: '',
              category: 'CRM',
              description: '',
              steps: ['', '', ''],
              targetRoles: ['All'],
              status: 'Published'
            });
            setShowAddModal(true);
          }}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow"
        >
          <Plus className="w-4 h-4" /> Add New Guide
        </button>
      </div>

      {/* Guides Grid */}
      <div className="space-y-3">
        {guides.map((guide, index) => (
          <div
            key={guide.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
                  {guide.category}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    guide.status === 'Published'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {guide.status}
                </span>
                <span className="text-[10px] text-slate-400">
                  Target: {(guide.targetRoles || ['All']).join(', ')}
                </span>
              </div>
              <h3 className="text-base font-bold text-white">{guide.title}</h3>
              <p className="text-xs text-slate-400">{guide.description}</p>
              <div className="text-[11px] text-slate-500 pt-1">
                {guide.steps.length} ordered interactive steps
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() =>
                  updateGuide(guide.id, {
                    status: guide.status === 'Published' ? 'Draft' : 'Published'
                  })
                }
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1"
              >
                {guide.status === 'Published' ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-slate-400" /> Unpublish
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Publish
                  </>
                )}
              </button>

              <button
                onClick={() => startEdit(guide)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400"
                title="Edit Guide"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (confirm(`Delete guide "${guide.title}"?`)) {
                    deleteGuide(guide.id);
                  }
                }}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400"
                title="Delete Guide"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                {editingGuide ? 'Edit Guide Article' : 'Create New Guide Article'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-2.5 mb-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveGuide} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Guide Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How to create an accurate solar quotation"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="CRM">CRM & Leads</option>
                    <option value="Quotations">Quotations</option>
                    <option value="Projects">Projects & Installation</option>
                    <option value="Payments">Payments</option>
                    <option value="AI Assistant">AI Assistant</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Summary Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="What will the user learn?"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-slate-300 font-medium">Ordered Steps</label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, steps: [...formData.steps, ''] })}
                    className="text-amber-400 hover:text-amber-300 text-[11px] font-bold"
                  >
                    + Add Step
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.steps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-5 text-slate-500 font-mono text-center">{idx + 1}.</span>
                      <input
                        type="text"
                        placeholder={`Step ${idx + 1} instruction...`}
                        value={step}
                        onChange={e => {
                          const newSteps = [...formData.steps];
                          newSteps[idx] = e.target.value;
                          setFormData({ ...formData, steps: newSteps });
                        }}
                        className="flex-1 p-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                      />
                      {formData.steps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newSteps = formData.steps.filter((_, i) => i !== idx);
                            setFormData({ ...formData, steps: newSteps });
                          }}
                          className="text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow"
                >
                  Save Guide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
