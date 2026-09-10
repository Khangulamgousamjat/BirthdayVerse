import React, { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Bell, 
  Sparkles, 
  Check, 
  Trash2, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  Gift
} from "lucide-react";

interface CalendarViewProps {
  onCreateForContact: (name: string, date: string, rel: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ onCreateForContact }) => {
  const [contacts, setContacts] = useState([
    { id: "1", name: "Aanya", date: "Sep 20", month: "September", day: 20, rel: "Best Friend", daysLeft: 10, reminder: "7 days & 1 day" },
    { id: "2", name: "Rahul", date: "Oct 02", month: "October", day: 2, rel: "Brother", daysLeft: 22, reminder: "3 days" },
    { id: "3", name: "Priya", date: "Nov 14", month: "November", day: 14, rel: "Partner", daysLeft: 65, reminder: "1 day" },
    { id: "4", name: "Arjun", date: "Nov 27", month: "November", day: 27, rel: "Colleague", daysLeft: 78, reminder: "Day of" },
    { id: "5", name: "Sneha", date: "Dec 15", month: "December", day: 15, rel: "Sister", daysLeft: 96, reminder: "7 days" },
  ]);

  const [newName, setNewName] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newRel, setNewRel] = useState("Friend");
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newDate) return;

    const parsedDate = new Date(newDate);
    const monthName = parsedDate.toLocaleDateString("en-US", { month: "long" });
    const day = parsedDate.getDate();
    const formatted = `${monthName.slice(0, 3)} ${day < 10 ? `0${day}` : day}`;

    const newContact = {
      id: Date.now().toString(),
      name: newName,
      date: formatted,
      month: monthName,
      day: day,
      rel: newRel,
      daysLeft: 30,
      reminder: "3 days before",
    };

    setContacts([...contacts, newContact]);
    setNewName("");
    setNewDate("");
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EDE7F6] dark:border-[#251B35]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE7F6] dark:bg-[#251B35] text-[#7952D6] dark:text-[#9D6BFF] text-xs font-bold mb-2">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Smart Birthday Calendar</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC]">
            Upcoming Birthdays & Reminders
          </h1>
          <p className="text-xs sm:text-sm text-[#746B80] dark:text-[#B8AEC5] mt-1">
            Keep track of special dates and prepare surprise verses well in advance.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bv-gradient-btn px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add Birthday</span>
        </button>
      </div>

      {/* Add Birthday Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#1D162A] rounded-3xl p-6 border border-[#EDE7F6] dark:border-[#2A203C] shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-[#241B35] dark:text-[#F7F3FC]">
              Add Someone's Birthday
            </h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#241B35] dark:text-[#F7F3FC]">Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aanya"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#F8F6FC] dark:bg-[#171122] border border-[#EDE7F6] dark:border-[#2A203C] text-[#241B35] dark:text-[#F7F3FC] focus:outline-none focus:ring-2 focus:ring-[#9D6BFF]/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#241B35] dark:text-[#F7F3FC]">Date</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8F6FC] dark:bg-[#171122] border border-[#EDE7F6] dark:border-[#2A203C] text-[#241B35] dark:text-[#F7F3FC] focus:outline-none focus:ring-2 focus:ring-[#9D6BFF]/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#241B35] dark:text-[#F7F3FC]">Relationship</label>
                  <select
                    value={newRel}
                    onChange={(e) => setNewRel(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8F6FC] dark:bg-[#171122] border border-[#EDE7F6] dark:border-[#2A203C] text-[#241B35] dark:text-[#F7F3FC]"
                  >
                    <option value="Friend">Friend</option>
                    <option value="Best Friend">Best Friend</option>
                    <option value="Partner">Partner</option>
                    <option value="Sister">Sister</option>
                    <option value="Brother">Brother</option>
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Colleague">Colleague</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#746B80] dark:text-[#B8AEC5] hover:bg-gray-100 dark:hover:bg-[#251B35] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bv-gradient-btn px-5 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Save Birthday
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Birthday Contacts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="p-5 rounded-3xl bg-white dark:bg-[#1D162A] border border-[#EDE7F6] dark:border-[#2A203C] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#9D6BFF] to-[#F47FB5] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {contact.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#241B35] dark:text-[#F7F3FC]">
                      {contact.name}
                    </h3>
                    <p className="text-[10px] text-[#746B80] dark:text-[#B8AEC5]">
                      {contact.rel}
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-[#EDE7F6] dark:bg-[#251B35] text-[#7952D6] dark:text-[#9D6BFF] text-[11px] font-bold">
                  {contact.daysLeft} days
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-[#746B80] dark:text-[#B8AEC5] my-3 p-3 rounded-2xl bg-[#F8F6FC] dark:bg-[#171122]">
                <div className="flex items-center justify-between">
                  <span>Birthday Date:</span>
                  <span className="font-bold text-[#241B35] dark:text-[#F7F3FC]">{contact.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Bell className="w-3 h-3 text-[#9D6BFF]" />
                    <span>Reminder:</span>
                  </span>
                  <span className="font-medium text-[#7952D6] dark:text-[#9D6BFF]">{contact.reminder}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#EDE7F6] dark:border-[#251B35] flex items-center justify-between">
              <button
                onClick={() => onCreateForContact(contact.name, contact.date, contact.rel)}
                className="bv-gradient-btn px-4 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Create Verse</span>
              </button>

              <button
                onClick={() => handleDelete(contact.id)}
                className="p-2 rounded-xl text-[#746B80] dark:text-[#B8AEC5] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
