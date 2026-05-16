import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import CentralCommandMap from './components/stitch/CentralCommandMap';
import HospitalInventoryDashboard from './components/stitch/HospitalInventoryDashboard';
import SupplyMatchmakerRouting from './components/stitch/SupplyMatchmakerRouting';
import RegionalReadinessOverview from './components/stitch/RegionalReadinessOverview';
import NurseInputPage from './components/stitch/NurseInputPage';

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

  const handleLogout = () => {
    setUserRole(null);
    setActiveScreen('map');
  };

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

  if (!userRole) {
    return <RoleSelection onSelectRole={setUserRole} />;
  }

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
          {renderDispatcherScreen()}
        </main>
      </div>
    </div>
  );
}

export default App;
