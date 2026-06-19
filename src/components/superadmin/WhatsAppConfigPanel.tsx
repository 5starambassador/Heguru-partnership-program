'use client'

import { useState, useEffect } from 'react'
import { Save, RefreshCcw, Check, X, AlertTriangle, ToggleLeft, ToggleRight, MessageSquare, Plus, Info, Trash2, Edit2, ShieldCheck, Loader2 as LoaderIcon } from 'lucide-react'
import { toast } from 'sonner'
import { getWhatsAppConfigs, updateWhatsAppConfig, createWhatsAppConfig, seedDefaultConfigs, deleteWhatsAppConfig, WhatsAppConfigData } from '@/app/whatsapp-config-actions'
import { getWhatsAppAnalytics, WhatsAppAnalytics } from '@/app/automation-actions'
import { generateWhatsAppLogReport } from '@/app/report-actions'
import dynamic from 'next/dynamic'
import { WhatsAppLogTable } from './WhatsAppLogTable'
import RuleBuilderPanel from './RuleBuilderPanel'
import { RolePermissions } from '@/types'

const AutomationInsights = dynamic(() => import('@/components/superadmin/AutomationInsights'), { 
    ssr: false, 
    loading: () => <div className="h-48 animate-pulse bg-white rounded-xl mb-8" /> 
})

const PermissionsMatrix = dynamic(() => import('@/components/superadmin/PermissionsMatrix').then(m => m.PermissionsMatrix), { 
    ssr: false, 
    loading: () => <div className="h-96 w-full animate-pulse bg-gray-150 rounded-md" /> 
})

export default function WhatsAppConfigPanel() {
    const [configs, setConfigs] = useState<WhatsAppConfigData[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'config' | 'logs' | 'rules'>('config')
    const [stats, setStats] = useState<WhatsAppAnalytics | null>(null)
    const [loadingStats, setLoadingStats] = useState(false)
    const [saving, setSaving] = useState<number | null>(null)
    const [showAddForm, setShowAddForm] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [newConfig, setNewConfig] = useState({ eventKey: '', templateName: '', templateBody: '', description: '', requiredVariablesCount: 2 })

    const fetchStats = async () => {
        setLoadingStats(true)
        try {
            const data = await getWhatsAppAnalytics(30)
            setStats(data)
        } catch (err) {
            console.error('Failed to load automation stats')
        } finally {
            setLoadingStats(false)
        }
    }

    const fetchConfigs = async () => {
        setLoading(true)
        const data = await getWhatsAppConfigs()
        if (data.length === 0) {
            // If no configs, offer to seed
            setConfigs([])
        } else {
            setConfigs(data)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchConfigs()
        fetchStats()
    }, [])

    const handleUpdate = async (id: number, templateName: string, templateBody: string | null, description: string, reqVars: number, isEnabled: boolean) => {
        setSaving(id)
        const res = await updateWhatsAppConfig(id, { templateName, templateBody, description, requiredVariablesCount: reqVars, isEnabled })
        if (res.success) {
            toast.success('Configuration updated')
            setConfigs(configs.map(c => c.id === id ? { ...c, templateName, templateBody, description, requiredVariablesCount: reqVars, isEnabled } : c))
        } else {
            toast.error('Failed to update')
        }
        setSaving(null)
    }

    const handleSeed = async () => {
        setLoading(true)
        const res = await seedDefaultConfigs()
        if (res.success) {
            toast.success('Default configurations seeded')
            await fetchConfigs()
        } else {
            toast.error('Failed to seed defaults')
        }
        setLoading(false)
    }

    const handleCreate = async () => {
        if (!newConfig.eventKey || !newConfig.templateName) {
            toast.error('Event Key and Template Name are required')
            return
        }
        setIsCreating(true)
        const res = await createWhatsAppConfig({ ...newConfig, isEnabled: true })
        if (res.success) {
            toast.success('Mapping created successfully')
            setNewConfig({ eventKey: '', templateName: '', templateBody: '', description: '', requiredVariablesCount: 2 })
            setShowAddForm(false)
            await fetchConfigs()
        } else {
            toast.error(res.error || 'Failed to create')
        }
        setIsCreating(false)
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this mapping? This action cannot be undone.')) return
        const res = await deleteWhatsAppConfig(id)
        if (res.success) {
            toast.success('Mapping deleted successfully')
            setConfigs(configs.filter(c => c.id !== id))
        } else {
            toast.error(res.error || 'Failed to delete')
        }
    }

    const handleExport = async () => {
        const promise = (async () => {
            const res = await generateWhatsAppLogReport()
            if (!res.success) throw new Error(res.error)
            if (res.csv && res.filename) {
                const blob = new Blob([res.csv], { type: 'text/csv' })
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = res.filename
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)
                document.body.removeChild(a)
            }
            return 'Logs exported successfully'
        })()

        toast.promise(promise, {
            loading: 'Generating export...',
            success: (s) => s,
            error: 'Export failed'
        })
    }

    if (loading) {
        return (
            <div className="bg-white rounded-xl p-12 border border-gray-200 shadow-sm flex flex-col items-center justify-center space-y-4">
                <RefreshCcw className="h-8 w-8 text-blue-600 animate-spin" />
                <p className="text-gray-500 font-medium">Loading Automation Settings...</p>
            </div>
        )
    }

    if (configs.length === 0) {
        return (
            <div className="bg-white rounded-xl p-12 border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center space-y-6">
                <div className="bg-amber-50 p-4 rounded-full">
                    <AlertTriangle className="h-10 w-10 text-amber-500" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-800">No Configurations Found</h3>
                    <p className="text-gray-500 max-w-md mx-auto mt-2">
                        It looks like the automation engine hasn't been initialized with default event mappings yet.
                    </p>
                </div>
                <button
                    onClick={handleSeed}
                    className="bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition-all shadow-sm flex items-center gap-2"
                >
                    <RefreshCcw className="h-5 w-5" />
                    Initialize Default Mappings
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header and Tabs */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-2">
                <div>
                    <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3 uppercase tracking-tight">
                        <div className="p-2 bg-blue-600 text-white rounded-md transition-transform">
                            <MessageSquare className="h-6 w-6" />
                        </div>
                        Automation Center
                    </h2>
                    <p className="text-xs text-gray-400 font-semibold mt-1 max-w-md uppercase tracking-wider">
                        Manage system-wide triggers and monitor delivery health in real-time.
                    </p>
                </div>

                <div className="flex bg-white p-1.5 rounded-md border border-gray-200 self-start shadow-sm">
                    <button
                        onClick={() => setActiveTab('config')}
                        className={`px-6 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${activeTab === 'config' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Mapping Config
                    </button>
                    <button
                        onClick={() => setActiveTab('rules')}
                        className={`px-6 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${activeTab === 'rules' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Smart Rules Builder
                    </button>
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`px-6 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${activeTab === 'logs' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Activity Logs
                    </button>
                </div>
            </div>

            {activeTab === 'rules' ? (
                <RuleBuilderPanel />
            ) : activeTab === 'logs' ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {/* Insights move here */}
                    {stats && <AutomationInsights data={stats} />}
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">Live Message Feed</h3>
                            <button 
                                onClick={handleExport}
                                className="px-4 py-2 bg-gray-900 text-white text-[10px] font-semibold uppercase tracking-[0.2em] rounded-md hover:bg-black transition-all shadow-sm flex items-center gap-2"
                            >
                                <Save className="h-3.5 w-3.5" />
                                Export Full Log
                            </button>
                        </div>
                        <WhatsAppLogTable defaultType="AUTOMATION" />
                    </div>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <div className="flex flex-col">
                            <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">Event Mappings</h3>
                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Map internal events to MSG91 templates</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowAddForm(!showAddForm)}
                                className={`px-4 py-2 rounded-md font-semibold text-[10px] uppercase tracking-wider transition-all flex items-center gap-2 ${showAddForm ? 'bg-gray-100 text-gray-600' : 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'}`}
                            >
                                {showAddForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                                {showAddForm ? 'Cancel' : 'New Mapping'}
                            </button>
                            <button
                                onClick={handleSeed}
                                className="p-2.5 text-amber-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-all"
                                title="Force Sync System Templates (Code to DB)"
                            >
                                <RefreshCcw className="h-4 w-4" />
                            </button>
                            <button
                                onClick={fetchConfigs}
                                className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                                title="Refresh List"
                            >
                                <RefreshCcw className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

            {/* Add New Mapping Form */}
            {showAddForm && (
                <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-6 mb-8 mt-2 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label htmlFor="wa-new-event-key" className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Event Key</label>
                            <input
                                id="wa-new-event-key"
                                type="text"
                                value={newConfig.eventKey}
                                onChange={(e) => setNewConfig({ ...newConfig, eventKey: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500 text-blue-600 uppercase"
                                placeholder="E.G. NEW_OFFER_ALERT"
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="wa-new-template-name" className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">MSG91 Template Name</label>
                            <input
                                id="wa-new-template-name"
                                type="text"
                                value={newConfig.templateName}
                                onChange={(e) => setNewConfig({ ...newConfig, templateName: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. discount_v1"
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="wa-new-description" className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Short Description</label>
                            <input
                                id="wa-new-description"
                                type="text"
                                value={newConfig.description}
                                onChange={(e) => setNewConfig({ ...newConfig, description: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500"
                                placeholder="Used for..."
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="wa-new-var-count" className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Variable Count</label>
                            <input
                                id="wa-new-var-count"
                                type="number"
                                value={newConfig.requiredVariablesCount}
                                onChange={(e) => setNewConfig({ ...newConfig, requiredVariablesCount: parseInt(e.target.value) || 0 })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                                min="0"
                            />
                        </div>
                        <div className="md:col-span-3 space-y-1">
                            <label htmlFor="wa-new-template-body" className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Marketing Branding (Template Body)</label>
                            <textarea
                                id="wa-new-template-body"
                                value={newConfig.templateBody}
                                onChange={(e) => setNewConfig({ ...newConfig, templateBody: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none"
                                placeholder="Paste your WhatsApp template sentences here to enable 100% audit transparency..."
                            />
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button
                            disabled={isCreating}
                            onClick={handleCreate}
                            className="bg-blue-600 text-white px-6 py-2.5 rounded-md font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50 shadow-sm"
                        >
                            {isCreating ? <LoaderIcon className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                            Create Mapping
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {configs.map((config) => (
                    <ConfigCard
                        key={config.id}
                        config={config}
                        onSave={(tpl, body, desc, vars, en) => handleUpdate(config.id, tpl, body, desc, vars, en)}
                        onDelete={() => handleDelete(config.id)}
                        isSaving={saving === config.id}
                    />
                ))}
            </div>

                    <div className="bg-blue-50 rounded-md p-4 border border-blue-100 flex items-start gap-3 mt-8">
                        <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <p className="text-sm text-blue-700 leading-relaxed">
                            <span className="font-semibold">Crucial:</span> Ensure the Template Names match exactly with your approved templates in MSG91.
                            Changes here take effect instantly across all automated services.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

function ConfigCard({ config, onSave, onDelete, isSaving }: {
    config: WhatsAppConfigData,
    onSave: (tpl: string, body: string | null, desc: string, numVars: number, en: boolean) => void,
    onDelete: () => void,
    isSaving: boolean
}) {
    const [isEditing, setIsEditing] = useState(false)
    const [template, setTemplate] = useState(config.templateName)
    const [templateBody, setTemplateBody] = useState(config.templateBody || '')
    const [description, setDescription] = useState(config.description || '')
    const [reqVars, setReqVars] = useState(config.requiredVariablesCount || 0)
    const [enabled, setEnabled] = useState(config.isEnabled)
    const hasChanges = template !== config.templateName || templateBody !== (config.templateBody || '') || enabled !== config.isEnabled || description !== (config.description || '') || reqVars !== config.requiredVariablesCount

    const handleSave = () => {
        onSave(template, templateBody, description, reqVars, enabled)
        setIsEditing(false)
    }

    const handleCancel = () => {
        setTemplate(config.templateName)
        setTemplateBody(config.templateBody || '')
        setDescription(config.description || '')
        setReqVars(config.requiredVariablesCount)
        setEnabled(config.isEnabled)
        setIsEditing(false)
    }

    return (
        <div className={`bg-white rounded-xl p-5 border transition-all ${config.isEnabled ? 'border-gray-200 shadow-sm' : 'border-gray-200 opacity-75 grayscale-[0.5]'}`}>
            <div className="flex items-start justify-between mb-4">
                <div className="space-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-650 bg-blue-50 px-2 py-0.5 rounded-md">
                        {config.eventKey.replace(/_/g, ' ')}
                    </span>
                    <h4 className="font-bold text-gray-850">{config.description || 'System Event'}</h4>
                </div>
                <div className="flex items-center gap-1.5">
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                            title="Edit Mapping"
                        >
                            <Edit2 className="h-4 w-4" />
                        </button>
                    )}
                    <button
                        onClick={onDelete}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                        title="Delete Mapping"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                    {(!isEditing ? config.isEnabled : enabled) ? (
                        <button
                            onClick={() => {
                                if (!isEditing) {
                                    onSave(config.templateName, config.templateBody || '', config.description || '', config.requiredVariablesCount, false)
                                } else {
                                    setEnabled(false)
                                }
                            }}
                            className="transition-colors p-1 text-emerald-500"
                            aria-label="Disable mapping"
                        >
                            <ToggleRight className="h-8 w-8" />
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                if (!isEditing) {
                                    onSave(config.templateName, config.templateBody || '', config.description || '', config.requiredVariablesCount, true)
                                } else {
                                    setEnabled(true)
                                }
                            }}
                            className="transition-colors p-1 text-gray-300"
                            aria-label="Enable mapping"
                        >
                            <ToggleLeft className="h-8 w-8" />
                        </button>
                    )}

                </div>
            </div>

            {isEditing ? (
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="space-y-1">
                        <label htmlFor={`tpl-name-${config.id}`} className="text-xs font-semibold text-gray-400 ml-1">MSG91 Template Name</label>
                        <textarea
                            id={`tpl-name-${config.id}`}
                            value={template}
                            onChange={(e) => setTemplate(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-blue-500 transition-all text-gray-700 min-h-[50px] resize-none"
                            placeholder="e.g. welcome_v1"
                        />
                    </div>
                    
                    <div className="space-y-1">
                        <label htmlFor={`tpl-desc-${config.id}`} className="text-xs font-semibold text-gray-400 ml-1">Short Description</label>
                        <input
                            id={`tpl-desc-${config.id}`}
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-blue-500 transition-all text-gray-700"
                            placeholder="e.g. Sent when user signs up"
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor={`tpl-body-${config.id}`} className="text-xs font-semibold text-gray-400 ml-1">Marketing Branding (Template Body)</label>
                        <textarea
                            id={`tpl-body-${config.id}`}
                            value={templateBody}
                            onChange={(e) => setTemplateBody(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-blue-500 transition-all text-gray-700 min-h-[100px] resize-none"
                            placeholder="Paste your WhatsApp template sentences here..."
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex-1 space-y-1">
                            <label htmlFor={`tpl-vars-${config.id}`} className="text-xs font-semibold text-gray-400 ml-1"># Variables</label>
                            <input
                                id={`tpl-vars-${config.id}`}
                                type="number"
                                value={reqVars}
                                onChange={(e) => setReqVars(Number(e.target.value))}
                                className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-500 transition-all text-gray-700"
                                min="0" max="10"
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-205">
                        <button
                            disabled={isSaving && hasChanges}
                            onClick={hasChanges ? handleSave : () => setIsEditing(false)}
                            className="px-4 py-1.5 bg-blue-600 text-white font-semibold text-xs rounded-md hover:bg-blue-700 shadow-sm flex items-center gap-1.5"
                        >
                            {isSaving && hasChanges ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                            {hasChanges ? 'Save Changes' : 'Done'}
                        </button>
                        <button
                            disabled={isSaving && hasChanges}
                            onClick={handleCancel}
                            className="p-1.5 bg-gray-150 text-gray-500 rounded-md hover:bg-gray-250"
                            aria-label="Cancel editing"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-gray-50 rounded-md p-3 border border-gray-200 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-semibold">Template Name</span>
                        <code className="text-xs font-semibold text-gray-700 bg-white px-2 py-0.5 rounded shadow-sm border border-gray-200">
                            {config.templateName}
                        </code>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-semibold">Required Variables</span>
                        <span className="text-xs font-semibold text-gray-650">
                            {config.requiredVariablesCount}
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}

function Loader2({ className }: { className?: string }) {
    return <RefreshCcw className={className} />
}
