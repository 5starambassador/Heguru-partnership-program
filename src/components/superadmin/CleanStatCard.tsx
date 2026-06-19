'use client'

import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface CleanStatCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    iconColor: string
    change?: {
        value: number
        isIncrease: boolean
    }
    subtext: string | React.ReactNode
}

export function CleanStatCard({ title, value, icon: Icon, iconColor, change, subtext }: CleanStatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-white rounded-xl p-5 border border-gray-200 border-t-2 border-t-blue-600 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
        >
            <div className="flex justify-between items-start mb-5">
                <div className={`w-10 h-10 rounded-md ${iconColor} flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}>
                    <Icon size={20} strokeWidth={2} />
                </div>
                {change && (
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wide ${change.isIncrease ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                        {change.isIncrease ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {change.value.toFixed(1)}%
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{title}</p>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                    {value}
                </h3>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="text-[11px] font-medium text-gray-500 min-h-[18px]">
                    {subtext}
                </div>
            </div>
        </motion.div>
    )
}
