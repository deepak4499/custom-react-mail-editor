import React, { useMemo, useCallback } from 'react';
import { Stack, ToolsPanel, useActiveTab, ActiveTabKeys, DesktopEmailPreview, MobileEmailPreview, EditEmailPreview, IconFont, TabPane, Tabs, useEditorProps } from 'easy-email-editor';
import { createPortal } from 'react-dom';
// import './index.scss';
// import '@/assets/font/iconfont.css';
import { EventManager, EventType } from './EventManager';

(window as any).global = window; // react-codemirror

export const EmailEditor = () => {
  const { height: containerHeight } = useEditorProps();
  const { setActiveTab, activeTab } = useActiveTab();

  const fixedContainer = useMemo(() => {
    return createPortal(<div id='FIXED_CONTAINER_ID' />, document.body);
  }, []);

  const onBeforeChangeTab = useCallback((currentTab: any, nextTab: any) => {
    return EventManager.exec(EventType.ACTIVE_TAB_CHANGE, { currentTab, nextTab });
  }, []);

  const onChangeTab = useCallback((nextTab: string) => {
    setActiveTab(nextTab as any);
  }, [setActiveTab]);

  return useMemo(
    () => (
      <div
        id='easy-email-editor'
        style={{
          display: 'flex',
          flex: '1',
          overflow: 'hidden',
          justifyContent: 'center',
          minWidth: 640,
          height: containerHeight,
        }}
      >
        {/* <Tabs
          activeTab={activeTab}
          onBeforeChange={onBeforeChangeTab}
          onChange={onChangeTab}
          style={{ height: '100%', width: '100%' }}
        >
          <TabPane
            style={{ height: 'calc(100% - 50px)' }}
            tab={(
              <Stack spacing='tight'>
                <IconFont iconName='icon-editor' />
              </Stack>
            )}
            key={ActiveTabKeys.EDIT}
          >
            <EditEmailPreview />
          </TabPane>
          <TabPane
            style={{ height: 'calc(100% - 50px)' }}
            tab={(
              <Stack spacing='tight'>
                <IconFont iconName='icon-desktop' />
              </Stack>
            )}
            key={ActiveTabKeys.PC}
          >
            <DesktopEmailPreview />
          </TabPane>
          <TabPane
            style={{ height: 'calc(100% - 50px)' }}
            tab={(
              <Stack spacing='tight'>
                <IconFont iconName='icon-mobile' />
              </Stack>
            )}
            key={ActiveTabKeys.MOBILE}
          >
            <MobileEmailPreview />
          </TabPane>
        </Tabs> */}
        <div style={{ height: '100%', width: '100%' }}>
          <div style={{ height: 'calc(100% - 50px)' }}>
            <EditEmailPreview />
          </div>
        </div>
        <>{fixedContainer}</>
      </div>
    ),
    [activeTab, containerHeight, fixedContainer, onBeforeChangeTab, onChangeTab]
  );
};
