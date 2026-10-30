import React, { createContext, useContext, useState, useEffect } from 'react';
import { SelectedAreaMetrics, KnownZone } from '../types';
import { queryAreaMetrics, fetchKnownZones } from '../services/api';

interface AreaContextType {
  selectedArea: SelectedAreaMetrics | null;
  loading: boolean;
  knownZones: KnownZone[];
  selectZone: (zoneId: string) => Promise<void>;
  selectBbox: (bbox: number[]) => Promise<void>;
  resetToFullWatershed: () => Promise<void>;
}

const AreaContext = createContext<AreaContextType | undefined>(undefined);

export const AreaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedArea, setSelectedArea] = useState<SelectedAreaMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [knownZones, setKnownZones] = useState<KnownZone[]>([]);

  // Load initial full watershed metrics & zones
  useEffect(() => {
    let isMounted = true;
    async function loadInitial() {
      try {
        setLoading(true);
        const [zones, defaultArea] = await Promise.all([
          fetchKnownZones().catch(() => []),
          queryAreaMetrics({ zoneId: 'entire_watershed' })
        ]);
        if (isMounted) {
          setKnownZones(zones);
          setSelectedArea(defaultArea);
        }
      } catch (err) {
        console.error('Failed to load initial area metrics:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadInitial();
    return () => { isMounted = false; };
  }, []);

  const selectZone = async (zoneId: string) => {
    try {
      setLoading(true);
      const data = await queryAreaMetrics({ zoneId });
      setSelectedArea({ ...data, zone_id: zoneId });
    } catch (err) {
      console.error('Error selecting zone:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectBbox = async (bbox: number[]) => {
    try {
      setLoading(true);
      const data = await queryAreaMetrics({ bbox });
      setSelectedArea({ ...data, bbox, zone_id: 'custom_bbox' });
    } catch (err) {
      console.error('Error querying bbox area:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetToFullWatershed = async () => {
    await selectZone('entire_watershed');
  };

  return (
    <AreaContext.Provider
      value={{
        selectedArea,
        loading,
        knownZones,
        selectZone,
        selectBbox,
        resetToFullWatershed,
      }}
    >
      {children}
    </AreaContext.Provider>
  );
};

export const useArea = () => {
  const context = useContext(AreaContext);
  if (!context) {
    throw new Error('useArea must be used within an AreaProvider');
  }
  return context;
};
