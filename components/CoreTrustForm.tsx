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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, category: 'mobile' | 'utility' | 'community') => {
    const files = e.target.files;
    if (files) {
      // Fix: Explicitly type 'f' as 'File' to resolve "Property 'name' does not exist on type 'unknown'" errors
      const newFiles: EvidenceFile[] = Array.from(files).map((f: File) => ({
        name: f.name,
        type: category, // Use the category parameter
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
          
          {/* Mobile Evidence Upload */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-blue-700 uppercase">Mobile Evidence</label>
              <span className="text-xs text-blue-600">
                {data.evidence.filter(f => f.type === 'mobile').length} files
              </span>
            </div>
            <div className="relative border-2 border-dashed border-blue-200 rounded-lg p-3 text-center hover:bg-blue-100/50 transition-colors">
              <input 
                type="file" 
                multiple 
                onChange={(e) => handleFileUpload(e, 'mobile')} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
              <div className="text-blue-600 text-xs font-medium">
                Upload mobile bills, recharge receipts
              </div>
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
          
          {/* Utility Evidence Upload */}
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-yellow-700 uppercase">Utility Evidence</label>
              <span className="text-xs text-yellow-600">
                {data.evidence.filter(f => f.type === 'utility').length} files
              </span>
            </div>
            <div className="relative border-2 border-dashed border-yellow-200 rounded-lg p-3 text-center hover:bg-yellow-100/50 transition-colors">
              <input 
                type="file" 
                multiple 
                onChange={(e) => handleFileUpload(e, 'utility')} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
              <div className="text-yellow-600 text-xs font-medium">
                Upload electricity, water, gas bills
              </div>
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
          
          {/* Community Evidence Upload */}
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-green-700 uppercase">Community Evidence</label>
              <span className="text-xs text-green-600">
                {data.evidence.filter(f => f.type === 'community').length} files
              </span>
            </div>
            <div className="relative border-2 border-dashed border-green-200 rounded-lg p-3 text-center hover:bg-green-100/50 transition-colors">
              <input 
                type="file" 
                multiple 
                onChange={(e) => handleFileUpload(e, 'community')} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
              <div className="text-green-600 text-xs font-medium">
                Upload group receipts, community proofs
              </div>
            </div>
          </div>
        </section>

        {/* Summary Section */}
        <section className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">📊</span>
              <h4 className="font-bold text-indigo-900">Evidence Summary</h4>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${fileProgress >= 6 ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'}`}>
              {fileProgress} of 6 months
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-700">
                {data.evidence.filter(f => f.type === 'mobile').length}
              </div>
              <div className="text-xs text-blue-600">Mobile Files</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="text-lg font-bold text-yellow-700">
                {data.evidence.filter(f => f.type === 'utility').length}
              </div>
              <div className="text-xs text-yellow-600">Utility Files</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-700">
                {data.evidence.filter(f => f.type === 'community').length}
              </div>
              <div className="text-xs text-green-600">Community Files</div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 italic text-center">
            "Documents validate behavioral patterns across all three trust areas."
          </p>
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