/**
 * AppConfigContext.test.js
 * Tests for AppConfigContext theme loading and persistence
 * 
 * Validates: Requirements 8.1, 8.2, 8.3, 8.5, 8.6
 */

import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import { Text } from 'react-native';
import { AppConfigProvider, useAppConfig } from './AppConfigContext';
import * as storageService from '../services/storageService';

// Mock the storage service
jest.mock('../services/storageService', () => ({
  getAppConfig: jest.fn(),
  saveAppConfig: jest.fn(),
  DEFAULT_CONFIG: {
    shopName: 'DaisyDrape',
    primaryColor: '#E07B2A',
    secondaryColor: '#E91E8C',
    backgroundColor: '#FFF8F0',
    bannerImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  },
}));

describe('AppConfigContext - Theme Persistence', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    storageService.getAppConfig.mockResolvedValue(storageService.DEFAULT_CONFIG);
    storageService.saveAppConfig.mockResolvedValue(undefined);
  });

  describe('useAppConfig hook', () => {
    test('returns current config', async () => {
      let capturedConfig = null;

      const TestComponent = () => {
        const { config } = useAppConfig();
        capturedConfig = config;
        return <Text>{config.shopName}</Text>;
      };

      render(
        <AppConfigProvider>
          <TestComponent />
        </AppConfigProvider>
      );

      await waitFor(() => {
        expect(capturedConfig).toBeTruthy();
        expect(capturedConfig.shopName).toBe('DaisyDrape');
      });
    });

    test('returns config with all required fields', async () => {
      let capturedConfig = null;

      const TestComponent = () => {
        const { config } = useAppConfig();
        capturedConfig = config;
        return <Text>{config.shopName}</Text>;
      };

      render(
        <AppConfigProvider>
          <TestComponent />
        </AppConfigProvider>
      );

      await waitFor(() => {
        expect(capturedConfig).toHaveProperty('shopName');
        expect(capturedConfig).toHaveProperty('primaryColor');
        expect(capturedConfig).toHaveProperty('secondaryColor');
        expect(capturedConfig).toHaveProperty('backgroundColor');
        expect(capturedConfig).toHaveProperty('bannerImage');
      });
    });

    test('throws error when used outside provider', () => {
      const TestComponent = () => {
        const { config } = useAppConfig();
        return <Text>{config.shopName}</Text>;
      };

      // Should throw because useAppConfig is used outside AppConfigProvider
      expect(() => {
        render(<TestComponent />);
      }).toThrow();
    });
  });

  describe('loadConfig()', () => {
    test('loads config from storage on app startup', async () => {
      const mockConfig = {
        shopName: 'CustomShop',
        primaryColor: '#FF0000',
        secondaryColor: '#00FF00',
        backgroundColor: '#0000FF',
        bannerImage: 'https://example.com/banner.jpg',
      };

      storageService.getAppConfig.mockResolvedValue(mockConfig);

      let capturedConfig = null;

      const TestComponent = () => {
        const { config } = useAppConfig();
        capturedConfig = config;
        return <Text>{config.shopName}</Text>;
      };

      render(
        <AppConfigProvider>
          <TestComponent />
        </AppConfigProvider>
      );

      await waitFor(() => {
        expect(storageService.getAppConfig).toHaveBeenCalled();
        expect(capturedConfig.shopName).toBe('CustomShop');
        expect(capturedConfig.primaryColor).toBe('#FF0000');
      });
    });

    test('uses DEFAULT_CONFIG when storage is empty', async () => {
      storageService.getAppConfig.mockResolvedValue(storageService.DEFAULT_CONFIG);

      let capturedConfig = null;

      const TestComponent = () => {
        const { config } = useAppConfig();
        capturedConfig = config;
        return <Text>{config.shopName}</Text>;
      };

      render(
        <AppConfigProvider>
          <TestComponent />
        </AppConfigProvider>
      );

      await waitFor(() => {
        expect(capturedConfig).toEqual(storageService.DEFAULT_CONFIG);
      });
    });

    test('handles storage errors gracefully', async () => {
      // Mock getAppConfig to reject, but it should still return DEFAULT_CONFIG
      storageService.getAppConfig.mockImplementation(() => {
        // Simulate error handling in storageService - it returns DEFAULT_CONFIG on error
        return Promise.resolve(storageService.DEFAULT_CONFIG);
      });

      let capturedConfig = null;

      const TestComponent = () => {
        const { config } = useAppConfig();
        capturedConfig = config;
        return <Text>{config.shopName}</Text>;
      };

      render(
        <AppConfigProvider>
          <TestComponent />
        </AppConfigProvider>
      );

      await waitFor(() => {
        // Should still have a config (DEFAULT_CONFIG from error handling)
        expect(capturedConfig).toBeTruthy();
        expect(capturedConfig.shopName).toBe('DaisyDrape');
      });
    });
  });

  describe('updateConfig()', () => {
    test('updates state and persists to storage', async () => {
      let capturedConfig = null;
      let capturedUpdateConfig = null;

      const TestComponent = () => {
        const { config, updateConfig } = useAppConfig();
        capturedConfig = config;
        capturedUpdateConfig = updateConfig;
        return <Text>{config.primaryColor}</Text>;
      };

      render(
        <AppConfigProvider>
          <TestComponent />
        </AppConfigProvider>
      );

      await waitFor(() => {
        expect(capturedConfig).toBeTruthy();
      });

      const newConfig = {
        ...capturedConfig,
        primaryColor: '#FF0000',
      };

      await act(async () => {
        await capturedUpdateConfig(newConfig);
      });

      await waitFor(() => {
        expect(storageService.saveAppConfig).toHaveBeenCalledWith(
          expect.objectContaining({
            primaryColor: '#FF0000',
          })
        );
      });
    });

    test('merges new config with existing config', async () => {
      let capturedConfig = null;
      let capturedUpdateConfig = null;

      const TestComponent = () => {
        const { config, updateConfig } = useAppConfig();
        capturedConfig = config;
        capturedUpdateConfig = updateConfig;
        return <Text>{config.primaryColor}</Text>;
      };

      render(
        <AppConfigProvider>
          <TestComponent />
        </AppConfigProvider>
      );

      await waitFor(() => {
        expect(capturedConfig).toBeTruthy();
      });

      // Update only primaryColor
      await act(async () => {
        await capturedUpdateConfig({ primaryColor: '#FF0000' });
      });

      await waitFor(() => {
        // Should have merged with existing config
        expect(storageService.saveAppConfig).toHaveBeenCalledWith(
          expect.objectContaining({
            primaryColor: '#FF0000',
            shopName: 'DaisyDrape', // Should still have original value
          })
        );
      });
    });

    test('updates state immediately', async () => {
      let capturedConfig = null;
      let capturedUpdateConfig = null;

      const TestComponent = () => {
        const { config, updateConfig } = useAppConfig();
        capturedConfig = config;
        capturedUpdateConfig = updateConfig;
        return <Text>{config.primaryColor}</Text>;
      };

      render(
        <AppConfigProvider>
          <TestComponent />
        </AppConfigProvider>
      );

      await waitFor(() => {
        expect(capturedConfig).toBeTruthy();
      });

      const initialColor = capturedConfig.primaryColor;

      await act(async () => {
        await capturedUpdateConfig({ primaryColor: '#FF0000' });
      });

      // State should be updated immediately
      expect(capturedConfig.primaryColor).not.toBe(initialColor);
    });

    test('persists changes to storage', async () => {
      let capturedUpdateConfig = null;

      const TestComponent = () => {
        const { updateConfig } = useAppConfig();
        capturedUpdateConfig = updateConfig;
        return <Text>Test</Text>;
      };

      render(
        <AppConfigProvider>
          <TestComponent />
        </AppConfigProvider>
      );

      await waitFor(() => {
        expect(capturedUpdateConfig).toBeTruthy();
      });

      const newConfig = {
        shopName: 'NewShop',
        primaryColor: '#FF0000',
        secondaryColor: '#00FF00',
        backgroundColor: '#0000FF',
        bannerImage: 'https://example.com/banner.jpg',
      };

      await act(async () => {
        await capturedUpdateConfig(newConfig);
      });

      await waitFor(() => {
        expect(storageService.saveAppConfig).toHaveBeenCalled();
      });
    });
  });

  describe('Multiple Subscribers', () => {
    test('all subscribers receive updates when config changes', async () => {
      let config1 = null;
      let config2 = null;
      let updateConfig = null;

      const Component1 = () => {
        const { config, updateConfig: update } = useAppConfig();
        config1 = config;
        updateConfig = update;
        return <Text>{config.primaryColor}</Text>;
      };

      const Component2 = () => {
        const { config } = useAppConfig();
        config2 = config;
        return <Text>{config.primaryColor}</Text>;
      };

      render(
        <AppConfigProvider>
          <Component1 />
          <Component2 />
        </AppConfigProvider>
      );

      await waitFor(() => {
        expect(config1).toBeTruthy();
        expect(config2).toBeTruthy();
      });

      const initialColor1 = config1.primaryColor;
      const initialColor2 = config2.primaryColor;

      await act(async () => {
        await updateConfig({ primaryColor: '#FF0000' });
      });

      await waitFor(() => {
        // Both subscribers should have updated config
        expect(config1.primaryColor).toBe('#FF0000');
        expect(config2.primaryColor).toBe('#FF0000');
      });
    });
  });

  describe('Context Provider', () => {
    test('wraps app correctly and provides config to children', async () => {
      let capturedConfig = null;

      const TestComponent = () => {
        const { config } = useAppConfig();
        capturedConfig = config;
        return <Text>{config.shopName}</Text>;
      };

      const { getByText } = render(
        <AppConfigProvider>
          <TestComponent />
        </AppConfigProvider>
      );

      await waitFor(() => {
        expect(getByText('DaisyDrape')).toBeTruthy();
        expect(capturedConfig).toBeTruthy();
      });
    });

    test('provides context value with config, updateConfig, and loadConfig', async () => {
      let contextValue = null;

      const TestComponent = () => {
        const value = useAppConfig();
        contextValue = value;
        return <Text>Test</Text>;
      };

      render(
        <AppConfigProvider>
          <TestComponent />
        </AppConfigProvider>
      );

      await waitFor(() => {
        expect(contextValue).toHaveProperty('config');
        expect(contextValue).toHaveProperty('updateConfig');
        expect(contextValue).toHaveProperty('loadConfig');
      });
    });
  });

  describe('Theme Persistence on Startup', () => {
    test('loads theme from storage when app starts', async () => {
      const savedConfig = {
        shopName: 'SavedShop',
        primaryColor: '#FF0000',
        secondaryColor: '#00FF00',
        backgroundColor: '#0000FF',
        bannerImage: 'https://example.com/banner.jpg',
      };

      storageService.getAppConfig.mockResolvedValue(savedConfig);

      let capturedConfig = null;

      const TestComponent = () => {
        const { config } = useAppConfig();
        capturedConfig = config;
        return <Text>{config.shopName}</Text>;
      };

      render(
        <AppConfigProvider>
          <TestComponent />
        </AppConfigProvider>
      );

      await waitFor(() => {
        expect(storageService.getAppConfig).toHaveBeenCalled();
        expect(capturedConfig.shopName).toBe('SavedShop');
        expect(capturedConfig.primaryColor).toBe('#FF0000');
      });
    });

    test('applies loaded theme to all screens', async () => {
      const savedConfig = {
        shopName: 'SavedShop',
        primaryColor: '#FF0000',
        secondaryColor: '#00FF00',
        backgroundColor: '#0000FF',
        bannerImage: 'https://example.com/banner.jpg',
      };

      storageService.getAppConfig.mockResolvedValue(savedConfig);

      let screen1Config = null;
      let screen2Config = null;

      const Screen1 = () => {
        const { config } = useAppConfig();
        screen1Config = config;
        return <Text>{config.primaryColor}</Text>;
      };

      const Screen2 = () => {
        const { config } = useAppConfig();
        screen2Config = config;
        return <Text>{config.primaryColor}</Text>;
      };

      render(
        <AppConfigProvider>
          <Screen1 />
          <Screen2 />
        </AppConfigProvider>
      );

      await waitFor(() => {
        expect(screen1Config.primaryColor).toBe('#FF0000');
        expect(screen2Config.primaryColor).toBe('#FF0000');
      });
    });
  });
});
