import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import template from '@demo/store/template';
import { useAppSelector } from '@demo/hooks/useAppSelector';
import { useLoading } from '@demo/hooks/useLoading';
import { useQuery } from '@demo/hooks/useQuery';
import { useHistory } from 'react-router-dom';
import { cloneDeep, set } from 'lodash';
import { Loading } from '@demo/components/loading';
import mjml from 'mjml-browser';
import services from '@demo/services';
import { Liquid } from 'liquidjs';
import { saveAs } from 'file-saver';
import {
  ToolsPanel,
  EmailEditor,
  EmailEditorProvider,
  EmailEditorProviderProps,
  IEmailTemplate
} from 'easy-email-editor';
import './App.scss';

import closeIconImg from './assets/close-icon.svg';

import { Stack } from '@demo/components/Stack';
import { pushEvent } from '@demo/utils/pushEvent';
import { UserStorage } from '@demo/utils/user-storage';

import { AdvancedType, IBlockData, JsonToMjml } from 'easy-email-core';
import { ExtensionProps, StandardLayout } from 'easy-email-extensions';

import { AutoSaveAndRestoreEmail } from '@demo/components/AutoSaveAndRestoreEmail';

import 'easy-email-editor/lib/style.css';
import 'easy-email-extensions/lib/style.css';
import blueTheme from '@arco-themes/react-easy-email-theme/css/arco.css?inline';
import { testMergeTags } from './testMergeTags';
import { useMergeTagsModal } from './components/useMergeTagsModal';

const defaultCategories: ExtensionProps['categories'] = [
  {
    label: 'Content',
    active: true,
    blocks: [
      {
        type: AdvancedType.TEXT,
      },
      {
        type: AdvancedType.IMAGE,
        payload: { attributes: { padding: '0px 0px 0px 0px' } },
      },
      {
        type: AdvancedType.BUTTON,
      },
      {
        type: AdvancedType.SOCIAL,
      },
      {
        type: AdvancedType.DIVIDER,
      },
      {
        type: AdvancedType.SPACER,
      },
      {
        type: AdvancedType.HERO,
      },
      {
        type: AdvancedType.WRAPPER,
      },
    ],
  },
  {
    label: 'Layout',
    active: true,
    displayType: 'column',
    blocks: [
      {
        title: '2 columns',
        payload: [
          ['50%', '50%'],
          ['33%', '67%'],
          ['67%', '33%'],
          ['25%', '75%'],
          ['75%', '25%'],
        ],
      },
      {
        title: '3 columns',
        payload: [
          ['33.33%', '33.33%', '33.33%'],
          ['25%', '25%', '50%'],
          ['50%', '25%', '25%'],
        ],
      },
      {
        title: '4 columns',
        payload: [['25%', '25%', '25%', '25%']],
      },
    ],
  }
];

const fontList = [
  'Arial',
  'Tahoma',
  'Verdana',
  'Times New Roman',
  'Courier New',
  'Georgia',
  'Lato',
  'Montserrat',
].map(item => ({ value: item, label: item }));

export default function Editor() {
  const dispatch = useDispatch();
  const history = useHistory();
  const templateData = useAppSelector('template');

  const { id, userId } = useQuery();
  const loading = useLoading(template.loadings.fetchById);
  const { mergeTags, setMergeTags } = useMergeTagsModal(testMergeTags);

  useEffect(() => {
    if (id) {
      if (!userId) {
        UserStorage.getAccount().then(account => {
          dispatch(template.actions.fetchById({ id: +id, userId: account.user_id }));
        });
      } else {
        dispatch(template.actions.fetchById({ id: +id, userId: +userId }));
      }
    } else {
      dispatch(template.actions.fetchDefaultTemplate(undefined));
    }

    return () => {
      dispatch(template.actions.set(null));
    };
  }, [dispatch, id, userId]);

  const onUploadImage = async (blob: Blob) => {
    return services.common.uploadByQiniu(blob);
  };

  const onChangeMergeTag = useCallback((path: string, val: any) => {
    setMergeTags(old => {
      const newObj = cloneDeep(old);
      set(newObj, path, val);
      return newObj;
    });
  }, []);


  const onExportMJML = (values: IEmailTemplate) => {
    const mjmlString = JsonToMjml({
      data: values.content,
      mode: 'production',
      context: values.content,
      dataSource: mergeTags,
    });

    pushEvent({ event: 'MJMLExport', payload: { values, mergeTags } });
    navigator.clipboard.writeText(mjmlString);
    saveAs(new Blob([mjmlString], { type: 'text/mjml' }), 'easy-email.mjml');
  };

  const onExportHTML = (values: IEmailTemplate) => {
    const mjmlString = JsonToMjml({
      data: values.content,
      mode: 'production',
      context: values.content,
      dataSource: mergeTags,
    });

    const html = mjml(mjmlString, {}).html;

    pushEvent({ event: 'HTMLExport', payload: { values, mergeTags } });
    navigator.clipboard.writeText(html);
    saveAs(new Blob([html], { type: 'text/html' }), 'easy-email.html');
  };


  const initialValues: IEmailTemplate | null = useMemo(() => {
    if (!templateData) return null;
    const sourceData = cloneDeep(templateData.content) as IBlockData;
    return {
      ...templateData,
      content: sourceData, // replace standard block
    };
  }, [templateData]);

  const onSubmit = useCallback(
    async (values: IEmailTemplate) => {
      console.log(values);
    },
    [dispatch, history, id, initialValues],
  );

  const onBeforePreview: EmailEditorProviderProps['onBeforePreview'] = useCallback(
    (html: string, mergeTags) => {
      const engine = new Liquid();
      const tpl = engine.parse(html);
      return engine.renderSync(tpl, mergeTags);
    },
    [],
  );

  if (!templateData && loading) {
    return (
      <Loading loading={loading}>
        <div style={{ height: '100vh' }} />
      </Loading>
    );
  }

  if (!initialValues) return null;

  return (
    <div>
      <div>
        <style>{blueTheme}</style>
        <EmailEditorProvider
          key={id}
          height={'calc(100vh - 72px)'}
          data={initialValues}
          onUploadImage={onUploadImage}
          fontList={fontList}
          onSubmit={onSubmit}
          onChangeMergeTag={onChangeMergeTag}
          autoComplete
          dashed={false}
          mergeTags={mergeTags}
          mergeTagGenerate={tag => `{{${tag}}}`}
          onBeforePreview={onBeforePreview}
        >
          {({ values }, { submit, restart }) => {
            return (
              <>
                <div
                  className="page-header"
                  style={{ background: 'var(--color-bg-2)' }}
                >
                  <div className="d-flex">
                    <h2>Invoice Notification</h2>
                  </div>
                  <Stack alignment='center'>
                    <ToolsPanel />
                    <div
                      className="btn-primary"
                      key='Export MJML'
                      onClick={() => onExportMJML(values)}
                    >
                      Export MJML
                    </div>
                    <div
                      className="btn-primary"
                      key='Export HTML'
                      onClick={() => onExportHTML(values)}
                    >
                      Export HTML
                    </div>
                    <div onClick={() => history.push('/')}>
                      <img src={closeIconImg} alt="Back" height="15" width="15" style={{ verticalAlign: 'middle', cursor: 'pointer' }} />
                    </div>
                  </Stack>
                </div>

                <StandardLayout categories={defaultCategories}>
                  <EmailEditor />
                </StandardLayout>
                <AutoSaveAndRestoreEmail />
              </>
            );
          }}
        </EmailEditorProvider>
      </div>
    </div>
  );
}