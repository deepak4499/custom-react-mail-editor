import { Layout, Tabs } from '@arco-design/web-react';
import { useEditorProps } from 'easy-email-editor';
import React from 'react';
import { BlockLayer } from 'easy-email-extensions';
import styles from './index.module.scss';
import { useExtensionProps } from './ExtensionProvider';

const Blocks = React.lazy(() =>
  import('./Blocks').then(mod => ({ default: mod.Blocks }))
);
const FullHeightOverlayScrollbars = React.lazy(() =>
  import('./FullHeightOverlayScrollbars').then(mod => ({ default: mod.FullHeightOverlayScrollbars }))
);
const ConfigurationDrawer = React.lazy(() =>
  import('./ConfigurationDrawer').then(mod => ({ default: mod.ConfigurationDrawer }))
);

const TabPane = Tabs.TabPane;

export function EditPanel({
  showSourceCode,
  jsonReadOnly,
  mjmlReadOnly,
}: {
  showSourceCode: boolean;
  jsonReadOnly: boolean;
  mjmlReadOnly: boolean;
}) {
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
      <Tabs
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
          title={t('Block')}
        >
          <FullHeightOverlayScrollbars height={`calc(${height} - 60px)`}>
            <Blocks />
          </FullHeightOverlayScrollbars>
        </TabPane>

        <TabPane
          key='1'
          title={t('Layer')}
        >
          <FullHeightOverlayScrollbars height={`calc(${height} - 60px)`}>
            <div style={{ padding: 20 }}>
              <BlockLayer />
            </div>
          </FullHeightOverlayScrollbars>
        </TabPane>
      </Tabs>
      {!compact && (
        <ConfigurationDrawer
          height={height}
          showSourceCode={showSourceCode}
          compact={Boolean(compact)}
          jsonReadOnly={jsonReadOnly}
          mjmlReadOnly={mjmlReadOnly}
        />
      )}
    </Layout.Sider>
  );
}
