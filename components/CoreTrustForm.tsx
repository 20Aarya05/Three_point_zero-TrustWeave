import React, { useState, useEffect } from 'react';
import { TrustAssessmentState, EvidenceFile } from '../types';

interface Props {
  data: TrustAssessmentState;
  onUpdate: (u: Partial<TrustAssessmentState>) => void;
  onNext: () => void;
}

const CoreTrustForm: React.FC<Props> = ({ data, onUpdate, onNext }) => {
  const [fileProgress, setFileProgress] = useState(0);

  useEffect(() => {
    const totalMonths = data.evidence.reduce((sum, f) => sum + f.months, 0);
    setFileProgress(Math.min(totalMonths, 6));
  }, [data.evidence]);

  const handleMobileChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    onUpdate({ mobile: { ...data.mobile, [e.target.name]: e.target.value } });
  };

  const handleUtilityChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    onUpdate({ utility: { ...data.utility, [e.target.name]: e.target.value } });
  };

  const handleCommunityChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    onUpdate({ community: { ...data.community, [e.target.name]: e.target.value } });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Fix: Explicitly type 'f' as 'File' to resolve "Property 'name' does not exist on type 'unknown'" errors
      const newFiles: EvidenceFile[] = Array.from(files).map((f: File) => ({
        name: f.name,
        type: f.type,
        months: 1 // Assume each file covers 1 month for demo
      }));
      onUpdate({ evidence: [...data.evidence, ...newFiles] });
    }
  };

  const isComplete = 
    data.mobile.simDuration && 
    data.utility.onTimePayment && 
    data.community.groupParticipation && 
    fileProgress >= 6;

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <div>
        <h3 className="text-2xl font-bold text-slate-900">Core Trust Profile</h3>
        <p className="text-slate-500 text-sm">Demonstrate real, observable financial behavior.</p>
      </div>

      <div className="space-y-6">
        {/* Section A: Mobile Stability */}
        <section className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">📱</span>
            <h4 className="font-bold text-slate-800">Mobile Stability</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">SIM Duration</label>
              <select name="simDuration" onChange={handleMobileChange} className="w-full p-2 rounded-lg border-slate-200 text-sm">
                <option value="">Select...</option>
                <option value="<6m">Less than 6 months</option>
                <option value="6m-1y">6 months - 1 year</option>
                <option value="1y-3y">1 - 3 years</option>
                <option value="3y+">3+ years</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Recharge Regularity</label>
              <select name="rechargeRegularity" onChange={handleMobileChange} className="w-full p-2 rounded-lg border-slate-200 text-sm">
                <option value="">Select...</option>
                <option value="monthly">Every month</option>
                <option value="quarterly">Quarterly</option>
                <option value="irregular">Irregular</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Usage Consistency</label>
              <select name="usageConsistency" onChange={handleMobileChange} className="w-full p-2 rounded-lg border-slate-200 text-sm">
                <option value="">Select...</option>
                <option value="stable">Stable pattern</option>
                <option value="fluctuating">Fluctuating</option>
              </select>
            </div>
          </div>
        </section>

        {/* Section B: Utility Discipline */}
        <section className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">💡</span>
            <h4 className="font-bold text-slate-800">Utility Payment Discipline</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">On-time Behavior</label>
              <select name="onTimePayment" onChange={handleUtilityChange} className="w-full p-2 rounded-lg border-slate-200 text-sm">
                <option value="">Select...</option>
                <option value="always">Always on time</option>
                <option value="mostly">Mostly on time</option>
                <option value="late">Often late</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Delay Frequency</label>
              <select name="delayFrequency" onChange={handleUtilityChange} className="w-full p-2 rounded-lg border-slate-200 text-sm">
                <option value="">Select...</option>
                <option value="rare">Rarely</option>
                <option value="occasional">Occasionally</option>
                <option value="frequent">Frequently</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Bill Predictability</label>
              <select name="billPredictability" onChange={handleUtilityChange} className="w-full p-2 rounded-lg border-slate-200 text-sm">
                <option value="">Select...</option>
                <option value="consistent">Consistent amounts</option>
                <option value="variable">Highly variable</option>
              </select>
            </div>
          </div>
        </section>

        {/* Section C: Community Reliability */}
        <section className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🧑‍🤝‍🧑</span>
            <h4 className="font-bold text-slate-800">Community Reliability</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Group Participation</label>
              <select name="groupParticipation" onChange={handleCommunityChange} className="w-full p-2 rounded-lg border-slate-200 text-sm">
                <option value="">Select...</option>
                <option value="active">Active member</option>
                <option value="passive">Passive</option>
                <option value="none">None</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Shared Resp.</label>
              <select name="sharedResponsibility" onChange={handleCommunityChange} className="w-full p-2 rounded-lg border-slate-200 text-sm">
                <option value="">Select...</option>
                <option value="high">Handles group funds</option>
                <option value="medium">Helps occasionally</option>
                <option value="low">No responsibility</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Dispute History</label>
              <select name="disputeHistory" onChange={handleCommunityChange} className="w-full p-2 rounded-lg border-slate-200 text-sm">
                <option value="">Select...</option>
                <option value="clear">Clear record</option>
                <option value="minor">Minor disputes</option>
              </select>
            </div>
          </div>
        </section>

        {/* Section D: Supporting Evidence (MANDATORY) */}
        <section className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🧾</span>
              <h4 className="font-bold text-indigo-900">Upload Supporting Evidence</h4>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${fileProgress >= 6 ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'}`}>
              {fileProgress} of 6 months
            </span>
          </div>
          
          <p className="text-xs text-indigo-700 font-medium">Upload utility bills, GPay receipts, or rent proofs covering at least 6 months.</p>
          
          <div className="relative border-2 border-dashed border-indigo-200 rounded-xl p-4 text-center hover:bg-indigo-100/50 transition-colors">
            <input 
              type="file" 
              multiple 
              onChange={handleFileUpload} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            />
            <div className="text-indigo-600 text-sm font-semibold">
              {data.evidence.length > 0 ? `${data.evidence.length} files added` : 'Click to select or drag & drop'}
            </div>
          </div>

          <p className="text-[10px] text-slate-400 italic">
            "Documents are used to validate consistency, not individual transactions."
          </p>

          <div className="flex flex-wrap gap-2">
            {data.evidence.map((f, idx) => (
              <div key={idx} className="bg-white px-2 py-1 rounded border border-slate-200 text-[10px] flex items-center gap-1">
                <span>📄</span> {f.name}
              </div>
            ))}
          </div>
        </section>
      </div>

      <button 
        disabled={!isComplete}
        onClick={onNext}
        className={`w-full py-4 rounded-2xl font-bold transition-all ${
          isComplete 
            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100' 
            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
        }`}
      >
        Continue Assessment
      </button>
    </div>
  );
};

export default CoreTrustForm;