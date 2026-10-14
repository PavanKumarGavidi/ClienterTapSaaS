import { useState } from 'react';
import { Calculator, FileText, Clock, DollarSign, Download, Copy } from 'lucide-react';

// Free Tools - Invoice Generator, GST Calculator, Rate Calculator, Time Converter
export function FreeToolsPage() {
  const [activeTool, setActiveTool] = useState<'invoice' | 'gst' | 'rate' | 'time'>('invoice');

  return (
    <div className="min-h-screen bg-canvas">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-ink mb-4">Free Tools</h1>
          <p className="text-ink-muted text-lg">Professional tools to help you run your business better</p>
        </div>

        {/* Tool Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'invoice', label: 'Invoice Generator', icon: FileText },
            { id: 'gst', label: 'GST Calculator', icon: Calculator },
            { id: 'rate', label: 'Rate Calculator', icon: DollarSign },
            { id: 'time', label: 'Time Converter', icon: Clock },
          ].map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTool === tool.id
                  ? 'bg-primary-600 text-white shadow-ember'
                  : 'bg-surface border border-line text-ink-muted hover:bg-canvas'
              }`}
            >
              <tool.icon size={18} />
              {tool.label}
            </button>
          ))}
        </div>

        {/* Tool Content */}
        <div className="bg-surface rounded-2xl border border-line p-8 shadow-soft">
          {activeTool === 'invoice' && <InvoiceGenerator />}
          {activeTool === 'gst' && <GSTCalculator />}
          {activeTool === 'rate' && <RateCalculator />}
          {activeTool === 'time' && <TimeConverter />}
        </div>
      </div>
    </div>
  );
}

// Invoice Generator
function InvoiceGenerator() {
  const [invoice, setInvoice] = useState({
    invoiceNumber: 'INV-001',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    fromName: '',
    fromEmail: '',
    fromAddress: '',
    fromGstin: '',
    toName: '',
    toEmail: '',
    toAddress: '',
    toGstin: '',
    items: [{ description: '', quantity: 1, rate: 0, hsnCode: '' }],
    notes: '',
    bankDetails: '',
    currency: 'INR'
  });

  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [...invoice.items, { description: '', quantity: 1, rate: 0, hsnCode: '' }]
    });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const items = [...invoice.items];
    items[index] = { ...items[index], [field]: value };
    setInvoice({ ...invoice, items });
  };

  const removeItem = (index: number) => {
    setInvoice({ ...invoice, items: invoice.items.filter((_, i) => i !== index) });
  };

  const calculateSubtotal = () => {
    return invoice.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const calculateGST = () => {
    return calculateSubtotal() * 0.18; // 18% GST
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateGST();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: invoice.currency,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-ink mb-6">Invoice Generator</h2>
      <p className="text-ink-muted mb-6">Create professional GST-compliant invoices in seconds</p>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-ink mb-3">From (Your Details)</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Your Name / Company"
              value={invoice.fromName}
              onChange={e => setInvoice({...invoice, fromName: e.target.value})}
              className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-ink text-sm"
            />
            <input
              type="email"
              placeholder="Email"
              value={invoice.fromEmail}
              onChange={e => setInvoice({...invoice, fromEmail: e.target.value})}
              className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-ink text-sm"
            />
            <textarea
              placeholder="Address"
              value={invoice.fromAddress}
              onChange={e => setInvoice({...invoice, fromAddress: e.target.value})}
              className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-ink text-sm resize-none"
              rows={2}
            />
            <input
              type="text"
              placeholder="GSTIN (optional)"
              value={invoice.fromGstin}
              onChange={e => setInvoice({...invoice, fromGstin: e.target.value})}
              className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-ink text-sm"
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ink mb-3">To (Client Details)</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Client Name / Company"
              value={invoice.toName}
              onChange={e => setInvoice({...invoice, toName: e.target.value})}
              className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-ink text-sm"
            />
            <input
              type="email"
              placeholder="Email"
              value={invoice.toEmail}
              onChange={e => setInvoice({...invoice, toEmail: e.target.value})}
              className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-ink text-sm"
            />
            <textarea
              placeholder="Address"
              value={invoice.toAddress}
              onChange={e => setInvoice({...invoice, toAddress: e.target.value})}
              className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-ink text-sm resize-none"
              rows={2}
            />
            <input
              type="text"
              placeholder="GSTIN (optional)"
              value={invoice.toGstin}
              onChange={e => setInvoice({...invoice, toGstin: e.target.value})}
              className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-ink text-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Invoice Number</label>
          <input
            type="text"
            value={invoice.invoiceNumber}
            onChange={e => setInvoice({...invoice, invoiceNumber: e.target.value})}
            className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-ink text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Invoice Date</label>
          <input
            type="date"
            value={invoice.date}
            onChange={e => setInvoice({...invoice, date: e.target.value})}
            className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-ink text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Due Date</label>
          <input
            type="date"
            value={invoice.dueDate}
            onChange={e => setInvoice({...invoice, dueDate: e.target.value})}
            className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-ink text-sm"
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-ink mb-3">Items</h3>
        <div className="space-y-3">
          {invoice.items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-5">
                <input
                  type="text"
                  placeholder="Description"
                  value={item.description}
                  onChange={e => updateItem(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-ink text-sm"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={e => updateItem(index, 'quantity', Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-ink text-sm"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  placeholder="Rate"
                  value={item.rate}
                  onChange={e => updateItem(index, 'rate', Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-ink text-sm"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="text"
                  placeholder="HSN"
                  value={item.hsnCode}
                  onChange={e => updateItem(index, 'hsnCode', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-ink text-sm"
                />
              </div>
              <div className="col-span-1">
                <button
                  onClick={() => removeItem(index)}
                  className="w-full px-3 py-2 rounded-xl border border-red-200 text-red-600 text-sm hover:bg-red-50"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={addItem}
            className="text-sm text-primary-600 font-medium hover:underline"
          >
            + Add item
          </button>
        </div>
      </div>

      <div className="bg-canvas rounded-xl p-6 mb-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-ink-muted">Subtotal</span>
            <span className="text-ink font-medium">{formatCurrency(calculateSubtotal())}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-ink-muted">GST (18%)</span>
            <span className="text-ink font-medium">{formatCurrency(calculateGST())}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-line">
            <span className="text-ink">Total</span>
            <span className="text-primary-600">{formatCurrency(calculateTotal())}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-ember flex items-center justify-center gap-2">
          <Download size={18} />
          Download PDF
        </button>
        <button className="px-6 py-3 border border-line rounded-xl text-ink font-medium hover:bg-canvas flex items-center justify-center gap-2">
          <Copy size={18} />
          Copy
        </button>
      </div>
    </div>
  );
}

// GST Calculator
function GSTCalculator() {
  const [amount, setAmount] = useState(10000);
  const [gstRate, setGstRate] = useState(18);
  const [mode, setMode] = useState<'exclusive' | 'inclusive'>('exclusive');

  const calculateGST = () => {
    if (mode === 'exclusive') {
      const gst = amount * (gstRate / 100);
      return {
        baseAmount: amount,
        gstAmount: gst,
        totalAmount: amount + gst,
        cgst: gst / 2,
        sgst: gst / 2
      };
    } else {
      const baseAmount = amount / (1 + gstRate / 100);
      const gstAmount = amount - baseAmount;
      return {
        baseAmount,
        gstAmount,
        totalAmount: amount,
        cgst: gstAmount / 2,
        sgst: gstAmount / 2
      };
    }
  };

  const result = calculateGST();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-ink mb-6">GST Calculator</h2>
      <p className="text-ink-muted mb-6">Calculate GST amounts with CGST/SGST breakdown</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Calculation Mode</label>
            <div className="flex gap-2">
              <button
                onClick={() => setMode('exclusive')}
                className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${
                  mode === 'exclusive'
                    ? 'bg-primary-600 text-white'
                    : 'bg-canvas border border-line text-ink-muted'
                }`}
              >
                GST Exclusive
              </button>
              <button
                onClick={() => setMode('inclusive')}
                className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${
                  mode === 'inclusive'
                    ? 'bg-primary-600 text-white'
                    : 'bg-canvas border border-line text-ink-muted'
                }`}
              >
                GST Inclusive
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">
              {mode === 'exclusive' ? 'Base Amount (excl. GST)' : 'Total Amount (incl. GST)'}
            </label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-line bg-canvas text-ink text-lg font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">GST Rate</label>
            <div className="flex gap-2">
              {[5, 12, 18, 28].map(rate => (
                <button
                  key={rate}
                  onClick={() => setGstRate(rate)}
                  className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${
                    gstRate === rate
                      ? 'bg-primary-600 text-white'
                      : 'bg-canvas border border-line text-ink-muted'
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-canvas rounded-xl p-6">
          <h3 className="text-sm font-semibold text-ink mb-4">Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-ink-muted">Base Amount</span>
              <span className="text-ink font-medium">{formatCurrency(result.baseAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-muted">CGST ({gstRate / 2}%)</span>
              <span className="text-ink font-medium">{formatCurrency(result.cgst)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-muted">SGST ({gstRate / 2}%)</span>
              <span className="text-ink font-medium">{formatCurrency(result.sgst)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-muted">Total GST ({gstRate}%)</span>
              <span className="text-ink font-medium">{formatCurrency(result.gstAmount)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-3 border-t border-line">
              <span className="text-ink">Total Amount</span>
              <span className="text-primary-600">{formatCurrency(result.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Rate Calculator
function RateCalculator() {
  const [desiredIncome, setDesiredIncome] = useState(1200000);
  const [billableHours, setBillableHours] = useState(1000);
  const [workingDays, setWorkingDays] = useState(250);
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [overhead, setOverhead] = useState(20);

  const calculateRate = () => {
    const totalHours = workingDays * hoursPerDay;
    const effectiveBillableHours = totalHours * (billableHours / totalHours);
    const totalCost = desiredIncome * (1 + overhead / 100);
    const hourlyRate = totalCost / effectiveBillableHours;
    const dailyRate = hourlyRate * hoursPerDay;
    const monthlyRate = dailyRate * (workingDays / 12);

    return { hourlyRate, dailyRate, monthlyRate };
  };

  const result = calculateRate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-ink mb-6">Freelance Rate Calculator</h2>
      <p className="text-ink-muted mb-6">Calculate your ideal hourly, daily, and monthly rates</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Desired Annual Income (₹)</label>
            <input
              type="number"
              value={desiredIncome}
              onChange={e => setDesiredIncome(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-line bg-canvas text-ink text-lg font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">Working Days per Year</label>
            <input
              type="number"
              value={workingDays}
              onChange={e => setWorkingDays(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-line bg-canvas text-ink"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">Hours per Day</label>
            <input
              type="number"
              value={hoursPerDay}
              onChange={e => setHoursPerDay(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-line bg-canvas text-ink"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">Billable Hours per Year</label>
            <input
              type="number"
              value={billableHours}
              onChange={e => setBillableHours(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-line bg-canvas text-ink"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">Overhead Percentage (%)</label>
            <input
              type="number"
              value={overhead}
              onChange={e => setOverhead(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-line bg-canvas text-ink"
            />
            <p className="text-xs text-ink-muted mt-1">Software, taxes, insurance, etc.</p>
          </div>
        </div>

        <div className="bg-canvas rounded-xl p-6">
          <h3 className="text-sm font-semibold text-ink mb-4">Your Rates</h3>
          <div className="space-y-4">
            <div className="bg-surface rounded-xl p-4 border border-line">
              <div className="text-xs text-ink-muted mb-1">Hourly Rate</div>
              <div className="text-3xl font-bold text-primary-600">{formatCurrency(result.hourlyRate)}</div>
            </div>
            <div className="bg-surface rounded-xl p-4 border border-line">
              <div className="text-xs text-ink-muted mb-1">Daily Rate</div>
              <div className="text-3xl font-bold text-primary-600">{formatCurrency(result.dailyRate)}</div>
            </div>
            <div className="bg-surface rounded-xl p-4 border border-line">
              <div className="text-xs text-ink-muted mb-1">Monthly Rate</div>
              <div className="text-3xl font-bold text-primary-600">{formatCurrency(result.monthlyRate)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Time Converter
function TimeConverter() {
  const [time, setTime] = useState('14:30');
  const [fromZone, setFromZone] = useState('Asia/Kolkata');
  const [toZone, setToZone] = useState('America/New_York');

  const zones = [
    { value: 'Asia/Kolkata', label: 'India (IST)' },
    { value: 'America/New_York', label: 'New York (EST)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (PST)' },
    { value: 'Europe/London', label: 'London (GMT)' },
    { value: 'Europe/Paris', label: 'Paris (CET)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
  ];

  const convertTime = () => {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    
    const fromTime = new Date(date.toLocaleString('en-US', { timeZone: fromZone }));
    const toTime = new Date(fromTime.toLocaleString('en-US', { timeZone: toZone }));
    
    const diff = toTime.getTime() - fromTime.getTime();
    const diffHours = diff / (1000 * 60 * 60);
    
    return {
      convertedTime: toTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false,
        timeZone: toZone
      }),
      diffHours: Math.round(diffHours)
    };
  };

  const result = convertTime();

  return (
    <div>
      <h2 className="text-2xl font-bold text-ink mb-6">Time Zone Converter</h2>
      <p className="text-ink-muted mb-6">Convert time between different time zones</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Time</label>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-line bg-canvas text-ink text-lg font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">From Time Zone</label>
            <select
              value={fromZone}
              onChange={e => setFromZone(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-line bg-canvas text-ink"
            >
              {zones.map(zone => (
                <option key={zone.value} value={zone.value}>{zone.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">To Time Zone</label>
            <select
              value={toZone}
              onChange={e => setToZone(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-line bg-canvas text-ink"
            >
              {zones.map(zone => (
                <option key={zone.value} value={zone.value}>{zone.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-canvas rounded-xl p-6">
          <h3 className="text-sm font-semibold text-ink mb-4">Converted Time</h3>
          <div className="text-center">
            <div className="text-5xl font-bold text-primary-600 mb-2">{result.convertedTime}</div>
            <div className="text-sm text-ink-muted">
              {result.diffHours > 0 ? '+' : ''}{result.diffHours} hours from {zones.find(z => z.value === fromZone)?.label}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
