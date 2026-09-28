import React, { useState, useEffect } from 'react';
import { Staff } from '../types/index.ts';
import { Mail, Phone, Calendar, Clock, Star } from 'lucide-react';

interface TeamPageProps {
  onOpenBooking: () => void;
}

export const TeamPage: React.FC<TeamPageProps> = ({ onOpenBooking }) => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/staff')
      .then((r) => r.json())
      .then((data) => setStaffList(data.staff || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] text-[#9D8159] font-medium">
          Atelier Masters
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#1A1918] font-light">
          Meet Our Specialists
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
          Each master artisan at LUMIÈRE brings decades of international runway experience, dermatological certification, and a passionate dedication to precision.
        </p>
      </div>

      {/* Staff Grid */}
      {loading ? (
        <div className="py-24 text-center text-xs text-stone-400">Loading specialist profiles...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {staffList.map((member) => (
            <div
              key={member.id}
              className="bg-white border border-[#EFEBE4] rounded overflow-hidden flex flex-col group hover:shadow-md hover:border-[#DFD7CB] transition-all"
            >
              <div className="relative h-80 overflow-hidden bg-stone-100">
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-3 left-3 bg-[#1A1918]/80 backdrop-blur-sm px-3 py-1 text-[11px] uppercase tracking-wider text-[#FAF8F5] rounded">
                  {member.title}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-2xl text-[#1A1918] font-normal">{member.name}</h3>
                  <p className="text-xs text-stone-600 font-light leading-relaxed mt-2.5">
                    {member.bio}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EFEBE4] space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-500 font-light">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>{member.hoursStart} – {member.hoursEnd}</span>
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>{member.daysAvailable.map((d) => dayNames[d]).join(', ')}</span>
                    </span>
                  </div>

                  <button
                    onClick={onOpenBooking}
                    className="w-full py-2.5 bg-[#1A1918] hover:bg-[#362B28] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold rounded transition-colors text-center"
                  >
                    Reserve with {member.name.split(' ')[0]}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
