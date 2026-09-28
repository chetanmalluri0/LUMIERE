import React, { useState, useEffect } from 'react';
import { NotificationTemplate } from '../../types/index.ts';
import { X, Mail, MessageSquare, Copy, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext.tsx';

interface EmailTemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmailTemplatePreviewModal: React.FC<EmailTemplatePreviewModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { showToast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate>('NEW_BOOKING');
  const [previewData, setPreviewData] = useState<{
    subject: string;
    html: string;
    whatsappText: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const templates: { id: NotificationTemplate; label: string }[] = [
    { id: 'NEW_BOOKING', label: '1. New Booking Received' },
    { id: 'BOOKING_CONFIRMED', label: '2. Booking Confirmed' },
    { id: 'BOOKING_CANCELLED', label: '3. Booking Cancelled' },
    { id: 'BOOKING_RESCHEDULED', label: '4. Booking Rescheduled' },
    { id: 'APPOINTMENT_REMINDER', label: '5. Appointment Reminder' },
  ];

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    fetch('/api/admin/email-preview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('lumiere_token')}`,
      },
      body: JSON.stringify({ template: selectedTemplate }),
    })
      .then((r) => r.json())
      .then((data) => {
        setPreviewData(data);
      })
      .catch((err) => {
        showToast('Failed to load preview: ' + err.message, 'error');
      })
      .finally(() => setLoading(false));
  }, [isOpen, selectedTemplate, showToast]);

  if (!isOpen) return null;

  const copyWhatsApp = () => {
    if (!previewData?.whatsappText) return;
    navigator.clipboard.writeText(previewData.whatsappText);
    setCopied(true);
    showToast('WhatsApp message template copied to clipboard.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1A1918]/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF8F5] border border-[#EFEBE4] w-full max-w-4xl rounded shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EFEBE4] bg-[#F5F2EB] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Mail className="w-5 h-5 text-[#C5A880]" />
            <div>
              <h3 className="font-serif text-lg text-[#1A1918]">Atelier Notification & Email Suite</h3>
              <p className="text-[11px] text-stone-500 font-light">
                Branded HTML templates dispatched automatically on lifecycle events.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-[#1A1918] p-1.5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Template Selector Tabs */}
        <div className="px-6 py-2.5 bg-[#FAF8F5] border-b border-[#EFEBE4] flex items-center gap-2 overflow-x-auto text-xs">
          {templates.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => setSelectedTemplate(tpl.id)}
              className={`px-3 py-1.5 rounded transition-all whitespace-nowrap ${
                selectedTemplate === tpl.id
                  ? 'bg-[#1A1918] text-[#FAF8F5] font-medium shadow-sm'
                  : 'text-stone-600 hover:text-[#1A1918] hover:bg-[#EFEBE4]'
              }`}
            >
              {tpl.label}
            </button>
          ))}
        </div>

        {/* Body Preview */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Email Preview (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-600">
              <span className="font-medium text-stone-900">HTML Email Output</span>
              <span className="text-[11px] text-stone-500">
                Subject: <strong className="text-stone-800">{previewData?.subject}</strong>
              </span>
            </div>

            <div className="border border-[#EFEBE4] rounded bg-white overflow-hidden shadow-inner h-[460px]">
              {loading ? (
                <div className="h-full flex items-center justify-center text-xs text-stone-400">
                  Generating email render...
                </div>
              ) : previewData?.html ? (
                <iframe
                  title="Email Preview"
                  srcDoc={previewData.html}
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-stone-400">
                  No preview available
                </div>
              )}
            </div>
          </div>

          {/* WhatsApp Text Preview (1 col) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-600">
              <span className="font-medium text-stone-900 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                <span>WhatsApp Format</span>
              </span>
              <button
                onClick={copyWhatsApp}
                className="text-[11px] text-[#C5A880] hover:text-[#1A1918] flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="p-4 bg-[#EFEFEF] border border-stone-200 rounded font-mono text-xs text-stone-800 whitespace-pre-wrap leading-relaxed h-[460px] overflow-y-auto shadow-inner">
              {previewData?.whatsappText || 'Loading WhatsApp template...'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#EFEBE4] bg-[#F5F2EB] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1A1918] text-[#FAF8F5] text-xs uppercase tracking-wider rounded font-medium hover:bg-[#362B28] transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
