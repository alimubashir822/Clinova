"use client";

import { useState } from "react";
import Link from "next/link";
import { Patient } from "@/lib/db";
import { Search, UserPlus, FileText, Mic, Calendar, User, Phone } from "lucide-react";

interface PatientListClientProps {
  initialPatients: Patient[];
}

export default function PatientListClient({ initialPatients }: PatientListClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>(initialPatients);

  // Search filter
  const filteredPatients = patients.filter((p) => {
    const term = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      (p.medicalHistory && p.medicalHistory.toLowerCase().includes(term)) ||
      p.gender.toLowerCase().includes(term)
    );
  });

  // Calculate age helper
  const calculateAge = (dobString: string) => {
    const birthDate = new Date(dobString);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div className="space-y-6">
      
      {/* Filters & Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patients by name, history, or condition..."
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border/80 focus:border-accent rounded-xl text-sm focus:outline-none transition"
          />
        </div>

        {/* Create Patient (Simulation alert only for UX polish) */}
        <button
          onClick={() => {
            const name = prompt("Enter patient name:");
            if (!name) return;
            const gender = prompt("Enter gender (Male/Female):", "Male");
            const dob = prompt("Enter DOB (YYYY-MM-DD):", "1985-05-15");
            const history = prompt("Enter medical history summary:", "No chronic diseases.");
            
            if (name && dob) {
              const newP: Patient = {
                id: `patient-${Math.random().toString(36).substr(2, 9)}`,
                name,
                gender: gender || "Other",
                dob: new Date(dob).toISOString(),
                medicalHistory: history || "None",
                doctorId: "doctor-sarah",
                createdAt: new Date().toISOString()
              };
              setPatients([newP, ...patients]);
            }
          }}
          className="flex items-center gap-2 bg-accent text-accent-foreground font-semibold px-4 rounded-xl transition text-xs shadow-md shadow-accent/25 w-full sm:w-auto justify-center h-11"
        >
          <UserPlus className="w-4 h-4" />
          Add New Patient
        </button>

      </div>

      {/* Patients Grid */}
      {filteredPatients.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground space-y-3">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto text-muted-foreground/60">
            <User className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-sm">No patients found</h4>
          <p className="text-xs text-muted-foreground/80 max-w-xs mx-auto">
            Try adjusting your search filters or click 'Add New Patient' to register a new file.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => {
            const age = calculateAge(patient.dob);
            
            return (
              <div 
                key={patient.id} 
                className="bg-card border border-border rounded-2xl p-6 space-y-4 hover:border-accent/40 transition flex flex-col justify-between shadow-sm relative group"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-2 h-full rounded-l-2xl bg-accent/20 group-hover:bg-accent transition-colors"></div>

                <div className="space-y-3 pl-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-base tracking-tight hover:text-accent transition">
                        <Link href={`/doctor/patients/${patient.id}`}>
                          {patient.name}
                        </Link>
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {patient.gender} • Age {age}
                      </p>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono bg-secondary px-2 py-0.5 rounded border border-border/40">
                      ID: {patient.id.substr(0, 8)}
                    </span>
                  </div>

                  {/* Medical History */}
                  <div className="space-y-1 bg-secondary/30 p-3 rounded-xl border border-border/50">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Active Medical History
                    </span>
                    <p className="text-xs text-foreground line-clamp-2 leading-relaxed">
                      {patient.medicalHistory || "No previous history logged."}
                    </p>
                  </div>

                  {/* Contacts */}
                  <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-accent/70" />
                      {patient.phone || "No phone logged"}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-accent/70" />
                      Born: {new Date(patient.dob).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Card footer shortcuts */}
                <div className="flex gap-2 pt-2 pl-2">
                  <Link
                    href={`/doctor/patients/${patient.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-secondary hover:bg-border text-xs font-semibold rounded-xl border border-border transition h-11"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Timeline
                  </Link>

                  <Link
                    href={`/doctor/scribe`}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-accent/10 hover:bg-accent/25 text-accent text-xs font-semibold rounded-xl border border-accent/20 transition h-11"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    Start Scribe
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
