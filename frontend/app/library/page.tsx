"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { StatusChip } from "@/components/StatusChip";
import { Search, Download, Upload, FileText, CheckCircle, Tag, X } from "lucide-react";

interface NoteResource {
  id: string;
  title: string;
  subject: string;
  tags: string[];
  fileUrl: string;
  verified: boolean;
  author: string;
  downloads: number;
}

const INITIAL_RESOURCES: NoteResource[] = [
  {
    id: "res_01",
    title: "Database Management Systems (DBMS) Comprehensive Semester Notes",
    subject: "Computer Science",
    tags: ["sql", "dbms", "normalization", "indexing", "transactions"],
    fileUrl: "https://storage.supabase.co/notes/dbms_core.pdf",
    verified: true,
    author: "Divya Nair (Year 4)",
    downloads: 142,
  },
  {
    id: "res_02",
    title: "Machine Learning & Deep Learning Formula Reference Sheet",
    subject: "Artificial Intelligence",
    tags: ["ml", "pytorch", "scikit-learn", "deep learning", "neural nets"],
    fileUrl: "https://storage.supabase.co/notes/ml_formulas.pdf",
    verified: true,
    author: "Ananya Roy (Year 3 Mentor)",
    downloads: 289,
  },
  {
    id: "res_03",
    title: "Data Structures & Algorithms Placement Handbook in C++",
    subject: "Placements",
    tags: ["dsa", "c++", "competitive programming", "trees", "dp"],
    fileUrl: "https://storage.supabase.co/notes/dsa_handbook.pdf",
    verified: true,
    author: "Lavanya Sundaram (Year 3 Mentor)",
    downloads: 512,
  },
  {
    id: "res_04",
    title: "Modern React & Next.js App Router Architecture Guide",
    subject: "Web Development",
    tags: ["react", "next.js", "tailwind", "typescript", "frontend"],
    fileUrl: "https://storage.supabase.co/notes/nextjs_arch.pdf",
    verified: true,
    author: "Harsha Vardhan (Year 3)",
    downloads: 176,
  },
  {
    id: "res_05",
    title: "LLM Engineering & RAG Implementation Cheatsheet",
    subject: "Artificial Intelligence",
    tags: ["nlp", "llm", "langchain", "rag", "ai agents"],
    fileUrl: "https://storage.supabase.co/notes/rag_cheatsheet.pdf",
    verified: true,
    author: "Nisha Gupta (Year 4 Mentor)",
    downloads: 324,
  },
  {
    id: "res_06",
    title: "Computer Vision with OpenCV: Filter to Feature Extraction",
    subject: "Computer Science",
    tags: ["computer vision", "opencv", "python", "medical imaging"],
    fileUrl: "https://storage.supabase.co/notes/opencv_guide.pdf",
    verified: true,
    author: "Meera Iyer (Year 3 Mentor)",
    downloads: 98,
  },
  {
    id: "res_07",
    title: "FastAPI & Docker Microservices Production Blueprint",
    subject: "Backend Development",
    tags: ["fastapi", "docker", "python", "rest api", "devops"],
    fileUrl: "https://storage.supabase.co/notes/fastapi_docker.pdf",
    verified: true,
    author: "Vikram Singh (Year 2)",
    downloads: 165,
  },
  {
    id: "res_08",
    title: "Cybersecurity CTF Starter Pack: Networking & Web Exploits",
    subject: "Cybersecurity",
    tags: ["cybersecurity", "linux", "networking", "ctf", "security"],
    fileUrl: "https://storage.supabase.co/notes/ctf_starter.pdf",
    verified: true,
    author: "Deepak Joshi (Year 3 Mentor)",
    downloads: 210,
  },
];

const SUBJECTS = [
  "All",
  "Computer Science",
  "Artificial Intelligence",
  "Web Development",
  "Backend Development",
  "Placements",
  "Cybersecurity",
];

export default function LibraryPage() {
  const [resources, setResources] = useState<NoteResource[]>(INITIAL_RESOURCES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadSubject, setUploadSubject] = useState("Computer Science");
  const [uploadTags, setUploadTags] = useState("");
  const [uploadedSuccess, setUploadedSuccess] = useState(false);

  const filteredResources = resources.filter((res) => {
    const matchesSubject = selectedSubject === "All" || res.subject === selectedSubject;
    const matchesSearch =
      !searchQuery ||
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      res.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    const newRes: NoteResource = {
      id: "res_" + Math.random().toString(36).substring(7),
      title: uploadTitle.trim(),
      subject: uploadSubject,
      tags: uploadTags.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean),
      fileUrl: "https://storage.supabase.co/notes/uploaded_doc.pdf",
      verified: true,
      author: "You (Campus Contributor)",
      downloads: 1,
    };

    setResources([newRes, ...resources]);
    setUploadedSuccess(true);
    setTimeout(() => {
      setUploadedSuccess(false);
      setUploadModalOpen(false);
      setUploadTitle("");
      setUploadTags("");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-6 py-12 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-[#2563eb] uppercase tracking-widest mb-1 font-semibold">
              Verified Academic Knowledge Bank
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Notes &amp; Study Library
            </h1>
            <p className="font-mono text-xs text-slate-500 mt-1">
              Curated lecture notes, cheat sheets, and placement problem sets verified by senior mentors.
            </p>
          </div>

          <button
            onClick={() => setUploadModalOpen(true)}
            className="btn-square px-4 py-2.5 text-xs text-white bg-slate-900 hover:bg-slate-800 self-start sm:self-auto"
          >
            <Upload className="w-4 h-4 text-white" />
            <span>Upload Resource</span>
          </button>
        </div>

        {/* Search & Subject Filters */}
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes by subject, keyword, tag (e.g. 'dbms', 'pytorch', 'dsa')..."
              className="w-full bg-white border border-slate-300 pl-11 pr-4 py-3 font-mono text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2563eb] shadow-sm"
            />
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
          </div>

          {/* Subject Pills */}
          <div className="flex flex-wrap gap-2">
            {SUBJECTS.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1 font-mono text-xs border transition-colors ${
                  selectedSubject === sub
                    ? "bg-slate-900 text-white border-slate-900 font-semibold"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Resource Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="card-dark bg-white border border-slate-200 p-6 sm:p-7 flex flex-col justify-between space-y-5 hover:border-slate-300 transition-colors shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] px-2 py-0.5 bg-blue-50 border border-blue-200 text-[#2563eb] font-semibold">
                    {res.subject}
                  </span>
                  {res.verified && (
                    <StatusChip status="PASS" label="SENIOR VERIFIED" />
                  )}
                </div>

                <h3 className="text-lg font-semibold text-slate-900 leading-snug tracking-[-0.3px]">
                  {res.title}
                </h3>

                <p className="font-mono text-xs text-slate-500">
                  Uploaded by {res.author} &bull; {res.downloads} downloads
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {res.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-slate-100 text-[11px] font-mono text-slate-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="font-mono text-xs text-slate-500">PDF Document</span>
                <a
                  href={res.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-square px-3.5 py-1.5 text-xs text-white bg-slate-900 hover:bg-slate-800"
                >
                  <Download className="w-3.5 h-3.5 text-white" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="card-dark bg-white border border-slate-200 p-12 text-center font-mono text-xs text-slate-500 shadow-sm">
            No resources found matching &ldquo;{searchQuery}&rdquo;. Try another search term.
          </div>
        )}
      </main>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="card-dark bg-white border border-slate-200 max-w-lg w-full p-8 space-y-6 relative shadow-xl">
            <button
              onClick={() => setUploadModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Contribute Course Notes
              </h2>
              <p className="font-mono text-xs text-slate-500 mt-1">
                Share study materials with peers. Verified by student mentors.
              </p>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-slate-500 uppercase tracking-wider mb-1.5 font-medium">
                  Resource Title
                </label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Operating Systems Concurrency Notes"
                  className="w-full bg-white border border-slate-300 p-2.5 font-mono text-xs text-slate-900 focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-500 uppercase tracking-wider mb-1.5 font-medium">
                  Subject Domain
                </label>
                <select
                  value={uploadSubject}
                  onChange={(e) => setUploadSubject(e.target.value)}
                  className="w-full bg-white border border-slate-300 p-2.5 font-mono text-xs text-slate-900 focus:outline-none focus:border-[#2563eb]"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Backend Development">Backend Development</option>
                  <option value="Placements">Placements</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-500 uppercase tracking-wider mb-1.5 font-medium">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={uploadTags}
                  onChange={(e) => setUploadTags(e.target.value)}
                  placeholder="os, semaphores, deadlock, memory"
                  className="w-full bg-white border border-slate-300 p-2.5 font-mono text-xs text-slate-900 focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div className="p-4 bg-slate-50 border border-dashed border-slate-300 text-center font-mono text-xs text-slate-500">
                <span>Click or drag and drop PDF file (Max 25MB)</span>
              </div>

              {uploadedSuccess ? (
                <div className="p-3 bg-emerald-50 border border-emerald-500 text-emerald-700 font-mono text-xs text-center font-semibold">
                  Resource successfully uploaded to campus library!
                </div>
              ) : (
                <button
                  type="submit"
                  className="btn-square w-full py-2.5 text-xs text-white bg-slate-900 hover:bg-slate-800"
                >
                  <span>Submit for Peer Verification</span>
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

