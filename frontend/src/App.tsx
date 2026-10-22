import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Server,
  Database,
  RefreshCw,
  Layers,
  ShieldCheck,
  ShoppingBag,
  ExternalLink,
  Clock,
  Sparkles,
  Search,
  ShoppingCart,
  User as UserIcon,
  MapPin,
  ChevronRight,
  Code2,
} from 'lucide-react';
import { healthService } from './services/healthService';
import { HealthData, ReadyData } from './types/api';
import { Button } from './components/common/Button';
import { Input } from './components/common/Input';
import { Alert } from './components/common/Alert';
import { Modal } from './components/common/Modal';

export const App: React.FC = () => {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [ready, setReady] = useState<ReadyData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'components' | 'roadmap'>('overview');

  // Input demonstration state
  const [sampleInput, setSampleInput] = useState('');
  const [sampleErrorInput, setSampleErrorInput] = useState('');

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    const start = performance.now();
    try {
      const [healthData, readyData] = await Promise.all([
        healthService.getHealth(),
        healthService.getReady(),
      ]);
      const end = performance.now();
      setLatency(Math.round(end - start));
      setHealth(healthData);
      setReady(readyData);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to connect to backend server';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900 font-sans selection:bg-[#febd69] selection:text-gray-900">
      {/* 1. Amazon-Inspired Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#131921] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center gap-2 group">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#febd69] to-[#f3a847] flex items-center justify-center font-black text-gray-950 text-xl tracking-tighter shadow-sm">
                  A
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-xl tracking-tight text-white leading-none">
                    Aventra<span className="text-[#febd69]">.</span>
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">
                    Marketplace
                  </span>
                </div>
              </a>

              {/* Delivery location simulator */}
              <div className="hidden lg:flex items-center gap-1.5 pl-4 text-xs text-gray-300 hover:text-white cursor-pointer transition-colors border border-transparent hover:border-gray-700 py-1.5 px-2 rounded">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div className="leading-tight">
                  <span className="block text-[11px] text-gray-400">Deliver to</span>
                  <span className="font-bold text-white">United States</span>
                </div>
              </div>
            </div>

            {/* Search Bar Simulation */}
            <div className="flex-1 max-w-2xl hidden md:flex items-center">
              <div className="relative w-full flex items-center rounded-md overflow-hidden bg-white shadow-inner focus-within:ring-2 focus-within:ring-[#febd69]">
                <button
                  type="button"
                  className="bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 px-3 py-2.5 border-r border-gray-300 font-medium shrink-0 flex items-center gap-1"
                >
                  All
                </button>
                <input
                  type="text"
                  placeholder="Search Aventra (Module 05 preview...)"
                  className="w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                  disabled
                />
                <button
                  type="button"
                  className="bg-[#febd69] hover:bg-[#f3a847] text-gray-950 px-4 py-2.5 transition-colors shrink-0"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Account & Cart Quick Actions */}
            <div className="flex items-center gap-4 text-xs">
              <div className="hidden sm:flex flex-col leading-tight cursor-pointer hover:text-[#febd69] transition-colors py-1 px-2 rounded border border-transparent hover:border-gray-700">
                <span className="text-[11px] text-gray-300">Hello, Sign In</span>
                <span className="font-bold text-white flex items-center gap-1">
                  Account & Lists
                  <UserIcon className="w-3.5 h-3.5 text-gray-400" />
                </span>
              </div>

              <div className="flex items-center gap-1.5 font-bold cursor-pointer hover:text-[#febd69] transition-colors py-1.5 px-2.5 rounded border border-transparent hover:border-gray-700">
                <div className="relative">
                  <ShoppingCart className="w-6 h-6 text-white" />
                  <span className="absolute -top-1.5 -right-1 bg-[#febd69] text-gray-950 text-[10px] font-black rounded-full h-4 w-4 flex items-center justify-center">
                    0
                  </span>
                </div>
                <span className="hidden sm:inline">Cart</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-header Navigation Bar */}
        <div className="bg-[#232f3e] border-t border-gray-800 text-xs text-gray-200 px-4 sm:px-6 lg:px-8 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6 overflow-x-auto py-0.5">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-1.5 py-1 px-2 rounded font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-gray-800 text-[#febd69] font-bold'
                    : 'hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                System Health & Foundation
              </button>
              <button
                onClick={() => setActiveTab('components')}
                className={`flex items-center gap-1.5 py-1 px-2 rounded font-medium transition-colors ${
                  activeTab === 'components'
                    ? 'bg-gray-800 text-[#febd69] font-bold'
                    : 'hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                UI Design Tokens & Components
              </button>
              <button
                onClick={() => setActiveTab('roadmap')}
                className={`flex items-center gap-1.5 py-1 px-2 rounded font-medium transition-colors ${
                  activeTab === 'roadmap'
                    ? 'bg-gray-800 text-[#febd69] font-bold'
                    : 'hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                Architecture & Roadmap
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-2 text-[11px] text-gray-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Module 01: Full-Stack Project Foundation Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* TAB 1: OVERVIEW & SYSTEM HEALTH */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Hero Notification Banner */}
            <div className="bg-gradient-to-r from-[#131921] via-[#232f3e] to-[#131921] text-white rounded-xl p-6 shadow-md border border-gray-700/60 relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-8">
                <ShoppingBag className="w-64 h-64 text-[#febd69]" />
              </div>
              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#febd69]/20 text-[#febd69] text-xs font-semibold mb-3 border border-[#febd69]/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Module 01 Verified — Full-Stack Project Foundation</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Aventra Marketplace Engine Online
                </h1>
                <p className="mt-2 text-sm text-gray-300 leading-relaxed">
                  Enterprise-grade Amazon-inspired multi-vendor e-commerce platform. Built with a
                  Node.js/Express modular monolith backend, PostgreSQL data engine with Prisma ORM, Vite/React
                  storefront, and production-ready security layers.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Button
                    variant="amber"
                    size="sm"
                    onClick={fetchStatus}
                    isLoading={loading}
                    leftIcon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
                  >
                    Run Live Connectivity Test
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                    onClick={() => setShowJsonModal(true)}
                    leftIcon={<Code2 className="w-4 h-4" />}
                  >
                    View Diagnostic JSON
                  </Button>
                  <a
                    href="http://localhost:5000/api/v1/health"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#febd69] hover:underline font-medium ml-2"
                  >
                    Direct Backend Endpoint <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Connection Error Alert (if any) */}
            {error && (
              <Alert
                type="error"
                title="Backend Connectivity Error"
                onDismiss={() => setError(null)}
              >
                Could not reach the Aventra API backend at <code className="bg-red-100 px-1 rounded">http://localhost:5000/api/v1</code>.
                Make sure the backend server is running via <code className="bg-red-100 px-1 rounded font-mono">npm run dev:server</code>.
                <div className="mt-2 text-xs font-mono bg-red-100/70 p-2 rounded text-red-900">
                  {error}
                </div>
              </Alert>
            )}

            {/* Diagnostic Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Express Server Health Card */}
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Server className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-gray-900">Express API Server</h3>
                        <p className="text-xs text-gray-500 font-mono">GET /api/v1/health</p>
                      </div>
                    </div>
                    {health?.status === 'UP' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" /> UP
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                        <AlertTriangle className="w-3.5 h-3.5" /> OFFLINE
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-xs divide-y divide-gray-100">
                    <div className="flex justify-between py-1.5 text-gray-600">
                      <span>Server Port:</span>
                      <span className="font-semibold text-gray-900">5000</span>
                    </div>
                    <div className="flex justify-between py-1.5 text-gray-600">
                      <span>Environment:</span>
                      <span className="font-mono uppercase font-semibold text-gray-900">
                        {health?.environment || 'development'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 text-gray-600">
                      <span>Server Uptime:</span>
                      <span className="font-mono text-gray-900">
                        {health?.uptimeSeconds !== undefined ? `${health.uptimeSeconds}s` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 text-gray-600">
                      <span>Roundtrip Latency:</span>
                      <span className="font-mono font-bold text-emerald-600">
                        {latency !== null ? `${latency} ms` : 'calculating...'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-400 flex items-center justify-between">
                  <span>Version: {health?.version || '1.0.0'}</span>
                  <span className="font-mono text-[10px]">CORS, Helmet, RateLimit Active</span>
                </div>
              </div>

              {/* Database Connection Card */}
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Database className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-gray-900">PostgreSQL Database</h3>
                        <p className="text-xs text-gray-500 font-mono">GET /api/v1/ready</p>
                      </div>
                    </div>
                    {ready?.database === 'CONNECTED' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" /> CONNECTED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                        <AlertTriangle className="w-3.5 h-3.5" /> {ready?.database || 'CONNECTING'}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-xs divide-y divide-gray-100">
                    <div className="flex justify-between py-1.5 text-gray-600">
                      <span>Database Name:</span>
                      <span className="font-mono font-semibold text-gray-900">
                        {ready?.databaseName || 'aventra_dev'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 text-gray-600">
                      <span>Dialect / ORM:</span>
                      <span className="font-mono text-gray-900">
                        {ready?.dialect || 'PostgreSQL'} / Prisma 6.x
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 text-gray-600">
                      <span>Port & Engine:</span>
                      <span className="font-mono text-gray-900">localhost:5432 (Rust Engine)</span>
                    </div>
                    <div className="flex justify-between py-1.5 text-gray-600">
                      <span>Models Configured:</span>
                      <span className="font-semibold text-gray-900">14 Relational Models Ready</span>
                    </div>
                    <div className="flex justify-between py-1.5 text-gray-600">
                      <span>Readiness Status:</span>
                      <span
                        className={`font-semibold ${
                          ready?.status === 'READY' ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
                        {ready?.status || 'INITIALIZING'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-400 flex items-center justify-between">
                  <span>Prisma ORM & PostgreSQL</span>
                  <span className="font-mono text-[10px]">ACID Transactions & Strict Schemas</span>
                </div>
              </div>

              {/* Architecture & Security Guard Card */}
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-gray-900">Security & Middleware</h3>
                        <p className="text-xs text-gray-500">Protection Benchmark</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                      SECURED
                    </span>
                  </div>

                  <div className="space-y-2 text-xs divide-y divide-gray-100">
                    <div className="flex justify-between py-1.5 text-gray-600">
                      <span>CORS Protection:</span>
                      <span className="font-semibold text-gray-900">Restricted Origin Allowlist</span>
                    </div>
                    <div className="flex justify-between py-1.5 text-gray-600">
                      <span>HTTP Headers:</span>
                      <span className="font-semibold text-gray-900">Helmet 8.0 Suite</span>
                    </div>
                    <div className="flex justify-between py-1.5 text-gray-600">
                      <span>DDoS Rate Limiting:</span>
                      <span className="font-semibold text-gray-900">1000 req / 15m window</span>
                    </div>
                    <div className="flex justify-between py-1.5 text-gray-600">
                      <span>Error Handling:</span>
                      <span className="font-semibold text-gray-900">RFC 7807 Standardized</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-400 flex items-center justify-between">
                  <span>Cookie Security</span>
                  <span className="font-mono text-[10px]">HttpOnly, SameSite=Lax</span>
                </div>
              </div>
            </div>

            {/* Next Steps Prompt */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-600 tracking-wide uppercase">
                  Ready For Next Step
                </span>
                <h3 className="text-base font-bold text-gray-900">
                  Module 02: Responsive Retail Storefront UI
                </h3>
                <p className="text-xs text-gray-500 max-w-2xl">
                  With the backend API, MongoDB connectivity, and React/Tailwind base in place, we
                  are ready to construct the complete Amazon-style retail storefront: mega navigation,
                  hero deals carousel, category showcases, responsive product cards, and footer.
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                className="shrink-0"
                onClick={() => setActiveTab('roadmap')}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Review Roadmap
              </Button>
            </div>
          </div>
        )}

        {/* TAB 2: UI DESIGN SYSTEM & REUSABLE COMPONENTS */}
        {activeTab === 'components' && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-8">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Reusable Component Library</h2>
              <p className="text-xs text-gray-500 mt-1">
                Foundational UI elements created for Aventra Marketplace adhering to Amazon retail
                design conventions with Tailwind CSS and TypeScript.
              </p>
            </div>

            {/* Button Component Showcase */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                1. Buttons (Variants & Sizes)
              </h3>
              <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <Button variant="amber" size="md">
                  Amber (Add to Cart)
                </Button>
                <Button variant="primary" size="md">
                  Primary Dark (Buy Now)
                </Button>
                <Button variant="secondary" size="md">
                  Secondary Gray
                </Button>
                <Button variant="outline" size="md">
                  Outline White
                </Button>
                <Button variant="danger" size="md">
                  Danger Action
                </Button>
                <Button variant="ghost" size="md">
                  Ghost Flat
                </Button>
                <Button variant="amber" size="md" isLoading>
                  Loading State
                </Button>
              </div>
            </div>

            {/* Form Input Component Showcase */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                2. Input Fields & Validations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <Input
                  label="Product Search or SKU"
                  placeholder="e.g. Sony WH-1000XM5 Headphones"
                  value={sampleInput}
                  onChange={(e) => setSampleInput(e.target.value)}
                  helperText="Search indexed MongoDB catalogue products"
                />
                <Input
                  label="Customer Email Address"
                  placeholder="john.doe@example.com"
                  value={sampleErrorInput}
                  onChange={(e) => setSampleErrorInput(e.target.value)}
                  error={
                    sampleErrorInput && !sampleErrorInput.includes('@')
                      ? 'Please enter a valid email address'
                      : undefined
                  }
                  helperText="Type without @ to preview validation error state"
                />
              </div>
            </div>

            {/* Alert Component Showcase */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                3. Notification Alerts
              </h3>
              <div className="space-y-3">
                <Alert type="success" title="Order Placed Successfully">
                  Your order #AV-82910 has been confirmed and scheduled for express dispatch.
                </Alert>
                <Alert type="info" title="Prime Delivery Available">
                  Free next-day delivery eligible on orders containing qualifying items.
                </Alert>
                <Alert type="warning" title="Limited Stock Remaining">
                  Only 2 units remaining in stock. Order soon to reserve inventory.
                </Alert>
                <Alert type="error" title="Payment Authorization Failed">
                  The transaction was declined by the issuing bank. Please retry or choose another payment method.
                </Alert>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: IMPLEMENTATION ROADMAP */}
        {activeTab === 'roadmap' && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Aventra Implementation Roadmap</h2>
              <p className="text-xs text-gray-500 mt-1">
                17-Module systematic progression tracker based on `docs/IMPLEMENTATION_ROADMAP.md`.
              </p>
            </div>

            <div className="space-y-4">
              {/* Module 00 */}
              <div className="flex items-start gap-4 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  00
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-gray-900">
                      Module 00: Project Analysis & Master Architecture
                    </h4>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-800">
                      COMPLETED
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Requirements formulation, 17 MongoDB collection schemas, REST API specs, ERD
                    diagrams, and modular monolith architecture established in `/docs`.
                  </p>
                </div>
              </div>

              {/* Module 01 */}
              <div className="flex items-start gap-4 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  01
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-gray-900">
                      Module 01: Full-Stack Project Foundation
                    </h4>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-800">
                      COMPLETED
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Vite/React TypeScript client scaffolded with Tailwind CSS, Express backend with
                    security middleware (Helmet, CORS, Rate Limiting), PostgreSQL (Prisma ORM) connection, and unified
                    error handling.
                  </p>
                </div>
              </div>

              {/* Module 02 */}
              <div className="flex items-start gap-4 p-4 rounded-lg bg-amber-50 border border-amber-300">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  02
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-gray-900">
                      Module 02: Responsive Retail Storefront UI
                    </h4>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                      NEXT UP
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Full Amazon-inspired storefront layout: multi-level header, category mega nav,
                    deals hero carousel, category showcase grids, responsive product cards, and footer.
                  </p>
                </div>
              </div>

              {/* Modules 03-16 preview list */}
              {[
                {
                  id: '03',
                  name: 'Authentication & Customer Accounts',
                  desc: 'JWT cookies, Argon2id hashing, customer profile & address book CRUD',
                },
                {
                  id: '04',
                  name: 'Product Catalogue & Product Details',
                  desc: 'Hierarchical categories, multi-variant options, detailed PDP gallery',
                },
                {
                  id: '05',
                  name: 'Search, Filters, Sorting & Pagination',
                  desc: 'MongoDB text indexing, faceted filtering, debounced autocomplete search',
                },
                {
                  id: '06',
                  name: 'Persistent Cart & Wishlist',
                  desc: 'Guest cart merge on login, stock validation, and backend subtotal recalculation',
                },
                {
                  id: '07-09',
                  name: 'Checkout, Payments & Order Tracking',
                  desc: 'TTL stock reservation, payment sandbox, immutable snapshots & timeline tracking',
                },
                {
                  id: '10-14',
                  name: 'Admin Dashboard, Multi-Vendor Marketplace & Customer Support',
                  desc: 'Vendor isolation, review moderation, returns workflow, analytics and promotions',
                },
                {
                  id: '15-16',
                  name: 'Testing, Security Hardening & Production Deployment',
                  desc: 'End-to-end integration tests, load profiling, Dockerization and cloud deploy',
                },
              ].map((m) => (
                <div
                  key={m.id}
                  className="flex items-start gap-4 p-3 rounded-lg bg-gray-50 border border-gray-200 opacity-75"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {m.id}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-xs text-gray-800">{m.name}</h5>
                    <p className="text-[11px] text-gray-500 mt-0.5">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Diagnostic JSON Modal */}
      <Modal
        isOpen={showJsonModal}
        onClose={() => setShowJsonModal(false)}
        title="Live Diagnostic Health JSON"
        description="Responses from /api/v1/health and /api/v1/ready"
        size="lg"
      >
        <div className="space-y-4 font-mono text-xs">
          <div>
            <span className="text-gray-500 font-semibold block mb-1">Health Check Payload:</span>
            <pre className="bg-gray-900 text-emerald-400 p-3 rounded-lg overflow-x-auto text-[11px]">
              {JSON.stringify(health, null, 2) || '// No data loaded'}
            </pre>
          </div>
          <div>
            <span className="text-gray-500 font-semibold block mb-1">Readiness Payload:</span>
            <pre className="bg-gray-900 text-emerald-400 p-3 rounded-lg overflow-x-auto text-[11px]">
              {JSON.stringify(ready, null, 2) || '// No data loaded'}
            </pre>
          </div>
        </div>
      </Modal>

      {/* Footer */}
      <footer className="bg-[#131921] text-gray-400 text-xs border-t border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">Aventra Marketplace</span>
            <span>&copy; {new Date().getFullYear()} Aventra, Inc. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <span>Node.js v24</span>
            <span>&bull;</span>
            <span>TypeScript 5.7</span>
            <span>&bull;</span>
            <span>PostgreSQL 16+</span>
            <span>&bull;</span>
            <span>React 18 + Vite</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
