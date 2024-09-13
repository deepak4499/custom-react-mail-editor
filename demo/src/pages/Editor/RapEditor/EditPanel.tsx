import { useEditorProps, useBlock } from 'easy-email-editor';
import React, { useState, useEffect } from 'react';
import Tab from './Tab';
import './App.scss';
import { AttributePanel } from './AttributePanel';
import PropertiesPanel from './PropertiesPanel';

const Blocks = React.lazy(() =>
  import('./Blocks').then(mod => ({ default: mod.Blocks }))
);
// const FullHeightOverlayScrollbars = React.lazy(() =>
//   import('./FullHeightOverlayScrollbars').then(mod => ({ default: mod.FullHeightOverlayScrollbars }))
// );

export function EditPanel() {
  const { values, focusBlock } = useBlock();
  const { height } = useEditorProps();

  const [activeTab, setActiveTab] = useState(0);

  const model = {
    template_name: 'Default',
    from_address_id: '',
    cc_mail_ids: '',
    bcc_mail_ids: ''
  };

  useEffect(() => {
    if (focusBlock?.type === 'page') {
      setActiveTab(2);
    } else if (focusBlock) {
      setActiveTab(0);
    }
  }, [focusBlock]);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const tabs = [
    { label: 'Attributes' },
    { label: 'Content' },
    { label: 'Properties' }
  ];

  return (
    <div style={{ paddingRight: 0, minWidth: 360, width: 60 }}>
      <div className="tabs">
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
            onClick={() =>
              handleTabClick(index)
            }
            isActive={index === activeTab}
          />
        ))}
      </div>
      <div className="tab-content">
        {activeTab === 0 && (
          <AttributePanel />
        )}
        {activeTab === 1 && (
          <Blocks />
        )}
        {activeTab === 2 && (
          <PropertiesPanel formDataSet={model} />
        )}
      </div>
    </div>
  );
}
