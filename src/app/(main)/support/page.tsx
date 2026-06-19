'use client'

import { useState, useEffect } from 'react'
import { Plus, MessageSquare, Clock, AlertCircle, CheckCircle2, X, Send, Tag, Calendar, Loader2, Star, ChevronLeft } from 'lucide-react'
import { createTicket, getUserTickets, rateSupportTicket } from '@/app/ticket-actions'
import { TicketChatModal } from '@/components/support/ticket-chat-modal'
import { toast } from 'sonner'
import { PageAnimate, PageItem } from '@/components/PageAnimate'
import Link from 'next/link'

export default function SupportPage() {
    const [tickets, setTickets] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showNewTicket, setShowNewTicket] = useState(false)
    const [selectedTicket, setSelectedTicket] = useState<any>(null)
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')
    const [category, setCategory] = useState('Technical Issue')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const loadTickets = async () => {
        const res = await getUserTickets()
        if (res.success) {
            setTickets(res.tickets)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        loadTickets()
    }, [])

    const handleSubmit = async () => {
        if (!subject.trim() || !message.trim()) {
            toast.error('Please fill in all fields')
            return
        }

        setIsSubmitting(true)
        const result = await createTicket({ subject, message, category })
        setIsSubmitting(false)

        if (result.success) {
            setShowNewTicket(false)
            setSubject('')
            setMessage('')
            setCategory('Technical Issue')
            loadTickets()
            toast.success('Ticket submitted successfully!')
        } else {
            toast.error(result.error || 'Failed to submit ticket')
        }
    }

    const openCount = tickets.filter(t => t.status === 'Open').length
    const inProgressCount = tickets.filter(t => t.status === 'In-Progress').length
    const resolvedCount = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length

    const getStatusClasses = (status: string) => {
        switch (status) {
            case 'Open': return 'bg-blue-50 text-blue-700 border-blue-200'
            case 'In-Progress': return 'bg-amber-50 text-amber-700 border-amber-200'
            case 'Resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
            case 'Closed': return 'bg-slate-50 text-slate-600 border-slate-200'
            default: return 'bg-slate-50 text-slate-600 border-slate-200'
        }
    }

    const getPriorityClasses = (priority: string) => {
        switch (priority) {
            case 'High': return 'bg-rose-50 text-rose-700 border border-rose-200'
            case 'Urgent': return 'bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-sm'
            case 'Medium': return 'bg-amber-50 text-amber-700 border border-amber-200'
            case 'Low': return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            default: return 'bg-slate-50 text-slate-600 border-slate-200'
        }
    }

    return (
        <div className="relative w-full font-[family-name:var(--font-outfit)]">
            <PageAnimate className="max-w-4xl mx-auto flex flex-col gap-8 pb-32 relative z-10">
                
                {/* Header */}
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-slate-100 hover:border-gray-300 transition-colors shadow-sm shrink-0">
                            <ChevronLeft size={20} className="text-slate-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[var(--deep-black)] uppercase italic font-heading">
                                Support Desk
                            </h1>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">
                                Resolution Concierge & Assistance
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowNewTicket(true)}
                        className="flex items-center justify-center gap-2 h-11 px-6 bg-gradient-to-br from-[var(--primary-orange)] to-orange-600 hover:from-orange-500 hover:to-orange-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-sm hover:shadow active:scale-95 transition-all font-heading shrink-0"
                    >
                        <Plus size={14} strokeWidth={3} /> Open Ticket
                    </button>
                </header>

                {/* Unified Stats Cards */}
                <PageItem className="grid grid-cols-3 gap-4">
                    {/* Open */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow relative overflow-hidden transition-all duration-300 flex flex-col items-center justify-center">
                        <div className="absolute top-0 left-0 w-full h-[2.5px] bg-blue-500" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Open</span>
                        <p className="text-2xl font-black text-slate-800 tracking-tighter font-heading">{openCount}</p>
                    </div>

                    {/* In-Progress */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow relative overflow-hidden transition-all duration-300 flex flex-col items-center justify-center">
                        <div className="absolute top-0 left-0 w-full h-[2.5px] bg-amber-500" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Active</span>
                        <p className="text-2xl font-black text-slate-800 tracking-tighter font-heading">{inProgressCount}</p>
                    </div>

                    {/* Resolved */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow relative overflow-hidden transition-all duration-300 flex flex-col items-center justify-center">
                        <div className="absolute top-0 left-0 w-full h-[2.5px] bg-emerald-500" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Done</span>
                        <p className="text-2xl font-black text-slate-800 tracking-tighter font-heading">{resolvedCount}</p>
                    </div>
                </PageItem>

                {/* Tickets List */}
                <PageItem className="bg-white border border-gray-200 p-6 md:p-8 rounded-xl shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[var(--primary-orange)]/20 to-transparent opacity-40" />
                    
                    <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
                        <div>
                            <h2 className="text-lg font-black text-slate-800 tracking-tight uppercase font-heading">Support Queue</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Active Tickets</p>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-16 text-slate-400 flex items-center justify-center gap-2">
                            <Loader2 size={20} className="animate-spin text-[var(--primary-orange)]" />
                            <span className="text-sm font-medium">Loading tickets...</span>
                        </div>
                    ) : tickets.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-4 border border-gray-200 text-slate-400 shadow-sm">
                                <MessageSquare size={24} />
                            </div>
                            <h3 className="text-base font-black text-slate-800 uppercase mb-1 font-heading">No active tickets</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Our team is standing by to help</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {tickets.map((ticket) => {
                                const statusClasses = getStatusClasses(ticket.status)
                                const priorityClasses = getPriorityClasses(ticket.priority)
                                const isResolved = ticket.status === 'Resolved' || ticket.status === 'Closed'
                                const hasRated = !!ticket.rating

                                return (
                                    <div key={ticket.id} className="space-y-3">
                                        <div
                                            onClick={() => setSelectedTicket(ticket)}
                                            className="p-5 bg-white hover:bg-slate-50/50 border border-gray-200 hover:border-gray-300 rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer group active:scale-[0.99] relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[var(--primary-orange)]/10 to-transparent opacity-30" />
                                            
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-base font-bold text-slate-800 mb-1 group-hover:text-[var(--primary-orange)] transition-colors font-heading truncate">{ticket.subject}</h3>
                                                    <p className="text-xs text-slate-500 line-clamp-2">
                                                        {ticket.messages && ticket.messages.length > 0
                                                            ? ticket.messages[ticket.messages.length - 1].message
                                                            : ticket.message}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span
                                                        className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] ${priorityClasses}`}
                                                    >
                                                        {ticket.priority}
                                                    </span>
                                                    <span
                                                        className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border ${statusClasses}`}
                                                    >
                                                        {ticket.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-400 mt-4 pt-4 border-t border-slate-100 font-bold uppercase tracking-wider">
                                                <span className="flex items-center gap-1.5">
                                                    <Tag size={12} className="text-slate-400" />
                                                    {ticket.category}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar size={12} className="text-slate-400" />
                                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                                </span>
                                                {isResolved && hasRated && (
                                                    <span className="flex items-center gap-1.5 text-emerald-600 font-extrabold font-heading">
                                                        <Star size={12} fill="currentColor" />
                                                        Rated {ticket.rating}/5
                                                    </span>
                                                )}
                                                {ticket.messages && ticket.messages.length > 0 && (
                                                    <span className="ml-auto flex items-center gap-1.5 text-[var(--primary-orange)] font-extrabold font-heading">
                                                        <MessageSquare size={12} />
                                                        {ticket.messages.length} replies
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {isResolved && !hasRated && (
                                            <CSATRatingCard ticketId={ticket.id} />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </PageItem>

                {/* New Ticket Modal - Light Theme */}
                {showNewTicket && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-white w-full max-w-lg rounded-xl border border-gray-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                            <div className="bg-gradient-to-br from-[var(--primary-orange)] to-orange-600 p-6 flex justify-between items-center text-white">
                                <div>
                                    <h2 className="text-lg font-black uppercase tracking-tight font-heading">Raise Support Ticket</h2>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1">Personal concierge assistance</p>
                                </div>
                                <button
                                    onClick={() => setShowNewTicket(false)}
                                    className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white"
                                    aria-label="Close Ticket Modal"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="p-6 flex flex-col gap-5">
                                <div>
                                    <label htmlFor="ticket-category" className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 font-heading">Category</label>
                                    <select
                                        id="ticket-category"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-[var(--primary-orange)] outline-none text-slate-800 placeholder:text-slate-400 text-sm font-medium shadow-sm transition-all"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        aria-label="Select Ticket Category"
                                    >
                                        <option className="text-slate-800 bg-white">Technical Issue</option>
                                        <option className="text-slate-800 bg-white">Benefit Discrepancy</option>
                                        <option className="text-slate-800 bg-white">Referral Not Showing</option>
                                        <option className="text-slate-800 bg-white">Profile Update Request</option>
                                        <option className="text-slate-800 bg-white">Fee / Payment Query</option>
                                        <option className="text-slate-800 bg-white">Ambassador Program Help</option>
                                        <option className="text-slate-800 bg-white">Login / Account Issue</option>
                                        <option className="text-slate-800 bg-white">General Inquiry</option>
                                        <option className="text-slate-800 bg-white">Feedback & Suggestions</option>
                                        <option className="text-slate-800 bg-white">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 font-heading">Subject</label>
                                    <input
                                        type="text"
                                        placeholder="Executive summary of the issue"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-[var(--primary-orange)] outline-none text-slate-800 placeholder:text-slate-400 text-sm font-medium shadow-sm transition-all"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 font-heading">Message</label>
                                    <textarea
                                        placeholder="Detail your request here..."
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-[var(--primary-orange)] outline-none text-slate-800 placeholder:text-slate-400 text-sm font-medium shadow-sm transition-all min-h-[120px] resize-none"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    ></textarea>
                                </div>
                                <div className="flex gap-3 mt-2">
                                    <button
                                        onClick={() => setShowNewTicket(false)}
                                        disabled={isSubmitting}
                                        className="flex-1 py-3 px-4 rounded-xl border border-gray-300 font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all font-heading"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="flex-1 py-3 px-4 bg-gradient-to-br from-[var(--primary-orange)] to-orange-600 hover:from-orange-500 hover:to-orange-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:shadow transition-all disabled:opacity-50 border border-orange-500/20 font-heading"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <Loader2 size={12} className="animate-spin" />
                                                <span>Sending...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-2">
                                                <Send size={12} />
                                                <span>Submit Ticket</span>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Chat Modal */}
                {selectedTicket && (
                    <TicketChatModal
                        ticket={selectedTicket}
                        currentUserType="User"
                        currentUserId={0} // Passed as 0, backend uses auth context if needed, or this is just for display logic in modal
                        onClose={() => {
                            setSelectedTicket(null)
                            loadTickets()
                        }}
                    />
                )}
            </PageAnimate>
        </div>
    )
}

function CSATRatingCard({ ticketId }: { ticketId: number }) {
    const [rating, setRating] = useState(0)
    const [hover, setHover] = useState(0)
    const [feedback, setFeedback] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleRate = async () => {
        if (rating === 0 || isSubmitting) return
        setIsSubmitting(true)
        const res = await rateSupportTicket(ticketId, rating, feedback)
        if (res.success) {
            setSuccess(true)
            toast.success('Thank you for your feedback!')
        } else {
            toast.error(res.error || 'Failed to submit rating')
        }
        setIsSubmitting(false)
    }

    if (success) return null

    return (
        <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl animate-in slide-in-from-top-2 duration-300 shadow-sm mt-3">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-emerald-800 uppercase tracking-widest mb-0.5 font-heading">Rate your experience</h4>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">How was the resolution of this case?</p>
                </div>
                <div className="flex flex-col items-center md:items-end gap-3 shrink-0 w-full md:w-auto">
                    <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                                onClick={() => setRating(star)}
                                className="transition-all hover:scale-125 active:scale-95"
                                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                            >
                                <Star
                                    size={20}
                                    className={`${(hover || rating) >= star ? 'text-amber-500 fill-amber-500' : 'text-emerald-200'}`}
                                />
                            </button>
                        ))}
                    </div>
                    {rating > 0 && (
                        <div className="flex gap-2 w-full animate-in fade-in duration-300 mt-1">
                            <input
                                placeholder="Any feedback? (optional)"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="bg-white border border-emerald-300 focus:border-emerald-500 rounded-xl px-4 py-2 text-[10px] font-bold text-slate-700 outline-none flex-1 min-w-[150px]"
                            />
                            <button
                                onClick={handleRate}
                                disabled={isSubmitting}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all font-heading"
                            >
                                {isSubmitting ? '...' : 'Send'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

