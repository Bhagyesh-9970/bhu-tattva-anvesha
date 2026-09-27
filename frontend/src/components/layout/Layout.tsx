import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { HealthStatus, Watershed } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
  health?: HealthStatus;
  activeWatershed?: Watershed;
}

export const Layout: React.FC<LayoutProps> = ({ children, health, activeWatershed }) => {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-scientific-950">
      <Header health={health} activeWatershed={activeWatershed} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 bg-scientific-950">
          {children}
        </main>
      </div>
    </div>
  );
};
