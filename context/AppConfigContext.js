import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAppConfig, saveAppConfig, DEFAULT_CONFIG } from '../services/storageService';

const AppConfigContext = createContext(DEFAULT_CONFIG);

export const useAppConfig = () => useContext(AppConfigContext);

export const AppConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  const loadConfig = useCallback(async () => {
    const saved = await getAppConfig();
    setConfig(saved);
  }, []);

  useEffect(() => { loadConfig(); }, []);

  const updateConfig = useCallback(async (newConfig) => {
    const merged = { ...config, ...newConfig };
    setConfig(merged);
    await saveAppConfig(merged);
  }, [config]);

  return (
    <AppConfigContext.Provider value={{ config, updateConfig, loadConfig }}>
      {children}
    </AppConfigContext.Provider>
  );
};
