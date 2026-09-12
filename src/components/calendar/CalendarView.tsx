import React, { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Bell, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Gift,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import {
  getStoredBirthdays,
  saveBirthday,
  deleteBirthday,
  onBirthdaysChange,
  UpcomingBirthday
} from "@/lib/birthdays";

interface CalendarViewProps {
  onCreateForContact: (name: string, date: string, rel: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ onCreateForContact }) => {
  const [contacts, setContacts] = useState<UpcomingBirthday[]>([]);

  const [newName, setNewName] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newRel, setNewRel] = useState("Best Friend");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    setContacts(getStoredBirthdays());
    const unsubscribe = onBirthdaysChange(() => {
      setContacts(getStoredBirthdays());
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newDate) return;

    const parsedDate = new Date(newDate);
    const monthName = parsedDate.toLocaleDateString("en-US", { month: "long" });
    const day = parsedDate.getDate();
    const formatted = `${monthName.slice(0, 3)} ${day < 10 ? `0${day}` : day}`;

    saveBirthday({
      name: newName.trim(),
      rawDate: newDate,
      date: formatted,
      month: monthName,
      day: day,
      rel: newRel,
      reminder: "3 days before",
    });

    setNewName("");
    setNewDate("");
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    deleteBirthday(id);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 text-left animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8DFFA] dark:border-[#282038]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#211A30] dark:text-[#F9F7FD]">
            Birthday Calendar
          </h1>
          <p className="text-xs sm:text-sm text-[#736886] dark:text-[#A89EC0] mt-1">
            Keep track of upcoming birthdays and schedule celebrations in advance.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setShowAddModal(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Birthday
        </Button>
      </div>

      {/* Browser Cache Notice */}
      <div className="p-4 rounded-3xl bg-[#F5F0FE] dark:bg-[#241A3A] border border-[#E0D2FA] dark:border-[#382856] flex items-start gap-3">
        <span className="text-base shrink-0 mt-0.5">ℹ️</span>
        <div className="text-xs text-[#6A5A87] dark:text-[#C7BAFA] space-y-0.5 leading-relaxed">
          <p className="font-semibold text-[#211A30] dark:text-[#F9F7FD]">
            Local Browser Storage Notice
          </p>
          <p>
            Your upcoming birthdays are stored privately inside this browser&apos;s local storage. Please note: if you clear your browser cache, cookies, or site data, these saved dates will be cleaned.
          </p>
        </div>
      </div>

      {/* Contacts List Grid */}
      {contacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="p-5 rounded-3xl bg-white dark:bg-[#1E182A] border border-[#E8DFFA] dark:border-[#282038] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#F1EBFD] dark:bg-[#261F36] flex items-center justify-center text-xl">
                    {contact.avatar || "🎂"}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#211A30] dark:text-[#F9F7FD]">
                      {contact.name}
                    </h3>
                    <span className="text-xs text-[#736886] dark:text-[#A89EC0]">
                      {contact.rel}
                    </span>
                  </div>
                </div>

                <Badge variant={contact.daysLeft <= 7 ? "warning" : "purple"}>
                  {contact.daysLeft === 0 ? "Today! 🎉" : `in ${contact.daysLeft} days`}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-xs text-[#736886] dark:text-[#A89EC0] pt-2 border-t border-[#E8DFFA] dark:border-[#282038]/60">
                <div className="flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-[#7659E4]" />
                  <span className="font-medium text-[#211A30] dark:text-[#F7F5FC]">{contact.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onCreateForContact(contact.name, contact.date, contact.rel)}
                    className="text-[11px] h-7 px-3"
                  >
                    Create Verse
                  </Button>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="p-1.5 rounded-lg text-[#736886] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Remove contact"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-white dark:bg-[#1E182A] border border-[#E8DFFA] dark:border-[#282038] text-center space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-[#EFEAFB] dark:bg-[#261F36] text-[#7659E4] dark:text-[#C7BAFA] flex items-center justify-center mx-auto text-2xl">
            <CalendarIcon className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[#211A30] dark:text-[#F7F5FC]">
              No upcoming birthdays yet
            </h2>
            <p className="text-xs text-[#736886] dark:text-[#A89EC0] leading-relaxed">
              Add your friends, family members, or colleagues to keep track of their special days and receive celebration countdowns.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowAddModal(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Your First Birthday
          </Button>
        </div>
      )}

      {/* Add Birthday Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Upcoming Birthday"
        description="Add a friend or family member to your celebration calendar."
        maxWidth="sm"
      >
        <form onSubmit={handleAdd} className="space-y-4 pt-2">
          <Input
            label="Name *"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Maya"
            required
            autoFocus
          />

          <Input
            label="Birthday Date *"
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            required
          />

          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold text-[#736886] dark:text-[#A89EC0]">
              Relationship
            </label>
            <select
              value={newRel}
              onChange={(e) => setNewRel(e.target.value)}
              className="w-full rounded-2xl bg-white dark:bg-[#1E182A] text-[#211A30] dark:text-[#F9F7FD] border border-[#E8DFFA] dark:border-[#282038] px-4 py-2.5 text-sm outline-none focus:border-[#7659E4]"
            >
              <option value="Best Friend">Best Friend 🌸</option>
              <option value="Partner">Partner 💖</option>
              <option value="Sister">Sister 🎀</option>
              <option value="Brother">Brother ⚡</option>
              <option value="Mother">Mother 💐</option>
              <option value="Father">Father 👑</option>
              <option value="Colleague">Colleague 💼</option>
              <option value="Friend">Friend 🎉</option>
              <option value="Other">Other 🎂</option>
            </select>
          </div>

          <div className="p-3 rounded-2xl bg-[#F5F0FE] dark:bg-[#241A3A] border border-[#E0D2FA] dark:border-[#382856] text-[11px] text-[#6A5A87] dark:text-[#C7BAFA] leading-relaxed">
            💾 <strong>Browser Local Storage:</strong> Stored locally in this browser. Clearing cache or site data will remove your birthdays.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              Save to Calendar
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

