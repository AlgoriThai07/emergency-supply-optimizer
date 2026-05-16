import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import CentralCommandMap from './components/stitch/CentralCommandMap';
import HospitalInventoryDashboard from './components/stitch/HospitalInventoryDashboard';
import SupplyMatchmakerRouting from './components/stitch/SupplyMatchmakerRouting';
import RegionalReadinessOverview from './components/stitch/RegionalReadinessOverview';
import NurseInputPage from './components/stitch/NurseInputPage';
import MapViewer from './components/MapViewer';

const RoleSelection = ({ onSelectRole }) => (
  <div className="flex flex-col items-center justify-center h-screen bg-surface-bright">
    <div className="text-center mb-12">
      <h1 className="text-5xl font-bold text-primary mb-4 tracking-tight">Beacon</h1>
      <p className="text-on-surface-variant text-lg">Select your role to continue</p>
    </div>
    
    <div className="flex flex-col md:flex-row gap-6">
      <button 
        onClick={() => onSelectRole('nurse')}
        className="w-64 h-64 bg-white border border-outline-variant rounded-3xl shadow-sm hover:shadow-xl hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-4 group"
      >
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-4xl">medical_services</span>
        </div>
        <div className="text-xl font-bold text-on-surface">Nurse Station</div>
        <div className="text-sm text-on-surface-variant px-6 text-center">Rapid inventory updates & voice commands</div>
      </button>

      <button 
        onClick={() => onSelectRole('dispatcher')}
        className="w-64 h-64 bg-white border border-outline-variant rounded-3xl shadow-sm hover:shadow-xl hover:border-indigo-500/50 transition-all flex flex-col items-center justify-center gap-4 group"
      >
        <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-4xl">map</span>
        </div>
        <div className="text-xl font-bold text-on-surface">Dispatcher</div>
        <div className="text-sm text-on-surface-variant px-6 text-center">Command map & regional logistics</div>
      </button>
    </div>
  </div>
);

function App() {
  const [userRole, setUserRole] = useState(null); // 'nurse', 'dispatcher', or null
  const [activeScreen, setActiveScreen] = useState('map');
  const [showSandboxMap, setShowSandboxMap] = useState(false);

  const handleLogout = () => {
    setUserRole(null);
    setActiveScreen('map');
    setShowSandboxMap(false);
  };

  if (!userRole) {
    return <RoleSelection onSelectRole={setUserRole} />;
  }

  if (showSandboxMap) {
    return (
      <div style={{ position: 'relative' }}>
        <button 
          onClick={() => setShowSandboxMap(false)}
          style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 999, padding: '10px 15px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ← Back to Main Dashboard
        </button>
        <MapViewer />
      </div>
    );
  }

  const renderDispatcherScreen = () => {
    switch (activeScreen) {
      case 'map':
        return <CentralCommandMap isEmbedded />;
      case 'inventory':
        return <HospitalInventoryDashboard isEmbedded />;
      case 'matchmaker':
        return <SupplyMatchmakerRouting isEmbedded />;
      case 'readiness':
        return <RegionalReadinessOverview isEmbedded />;
      default:
        return <CentralCommandMap isEmbedded />;
    }
  };

  if (userRole === 'nurse') {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-background text-on-surface">
        <TopBar userRole={userRole} onLogout={handleLogout} />
        <main className="flex-1 overflow-hidden relative bg-surface-bright">
          <NurseInputPage isEmbedded />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-on-surface">
      <TopBar userRole={userRole} onLogout={handleLogout} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeScreen={activeScreen} onScreenChange={setActiveScreen} />
        <main className="flex-1 overflow-hidden relative bg-surface-bright">
          <button 
            onClick={() => setShowSandboxMap(true)}
            style={{ position: 'absolute', bottom: '15px', right: '15px', zIndex: 99, padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            🛠️ Open Sandbox Map
          </button>
          {renderDispatcherScreen()}
        </main>
      </div>
    </div>
  );
}

export default App;