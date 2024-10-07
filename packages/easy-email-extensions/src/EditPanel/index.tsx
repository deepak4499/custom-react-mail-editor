import { Layout, Tabs } from '@arco-design/web-react';
import { useEditorProps } from 'easy-email-editor';
import React from 'react';
import { Blocks } from './Blocks';
import { FullHeightOverlayScrollbars } from '@extensions/components/FullHeightOverlayScrollbars';
import styles from './index.module.scss';
import { ConfigurationDrawer } from './ConfigurationDrawer';
import { useExtensionProps } from '@extensions/components/Providers/ExtensionProvider';

const TabPane = Tabs.TabPane;

export function EditPanel() {
  const { height } = useEditorProps();
  const { compact = true } = useExtensionProps();

  return (
    <Layout.Sider
      className={styles.blocksPanel}
      style={{ paddingRight: 0, minWidth: 360 }}
      // collapsed={collapsed}
      collapsible
      trigger={null}
      breakpoint='xl'
      collapsedWidth={60}
      width={360}
    >
      <div style={{ height: '60px', borderBottom: '1px solid #eee', padding: '8px' }}>
        <div style={{ backgroundColor: '#ebebf5', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '10px', height: '100%' }}>
          <div style={{ padding: '5px 15px', borderRadius: '8px', backgroundColor: '#fff' }}>
            <img src="/public/svgs/icon-content-group.svg" width={14} style={{ marginRight: '7px', verticalAlign: 'text-top', marginTop: '1px' }} />
            Content
          </div>
        </div>
      </div>
      <FullHeightOverlayScrollbars height={`calc(${height} - 60px)`}>
        <Blocks />
      </FullHeightOverlayScrollbars>
      {/* <Tabs
        defaultActiveTab='2'
        style={{ width: '100%', padding: 0 }}
        renderTabHeader={(_, DefaultHeader) => (
          <div className={styles.largeTabsHeader}>
            <DefaultHeader />
          </div>
        )}
      >
        <TabPane
          key='2'
          title={t('Content')}
        >
          <FullHeightOverlayScrollbars height={`calc(${height} - 60px)`}>
            <Blocks />
          </FullHeightOverlayScrollbars>
        </TabPane>
      </Tabs> */}
      {!compact && (
        <ConfigurationDrawer
          height={height}
          compact={Boolean(compact)}
        />
      )}
    </Layout.Sider>
  );
}
