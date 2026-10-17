import React from 'react';
import AppShell from '../../src/components/app/AppShell';
import type { ProbeDefinition } from './definition';
// dev/probes/windowCorners.probe.tsx

const WindowCornersProbe = () => (
    <AppShell
        appStyle={{}}
        isElectronWindow
        hideFullscreenButton
        usesCustomWindowChrome={false}
        useCustomWindowRadius
        showTransparentWindowBorder={false}
        isPlayerView={false}
        isTitlebarRevealed={false}
        alwaysShowMainWindowTitlebar={false}
        isMainWindowClickThroughEnabled={false}
        showMainWindowClickThroughToggle={false}
        onToggleMainWindowClickThrough={() => {}}
        isDaylight={false}
        audioElement={null}
    >
        <div data-testid="window-content">Window corner regression probe</div>
    </AppShell>
);

export default {
    id: 'windowCorners',
    title: 'Desktop window corners',
    description: 'The real app shell with a test-controlled Electron window bridge.',
    Component: WindowCornersProbe,
} satisfies ProbeDefinition;
