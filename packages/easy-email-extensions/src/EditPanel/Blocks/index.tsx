import { Typography } from '@arco-design/web-react';
import { BlockManager, IBlockData } from 'easy-email-core';
import { BlockAvatarWrapper, IconFont } from 'easy-email-editor';
import React from 'react';
import { getIconNameByBlockType } from '@extensions/utils/getIconNameByBlockType';
import styles from './index.module.scss';
import { useExtensionProps } from '@extensions/components/Providers/ExtensionProvider';

export function Blocks() {
  const { categories } = useExtensionProps();

  return (
    <div
      style={{ paddingBottom: 30, minHeight: '100%' }}
    >
      {categories.map((cat) => {
        return (
          <div
            style={{ display: 'flex', flexFlow: 'row wrap', alignItems: 'flex-start', padding: '20px 0px 0px' }}
          >
            {cat.blocks.map((item, index) => {
              return <BlockItem key={index} {...(item as any)} />;
            })}
          </div>
        );
      })}
    </div>
  );
}

function BlockItem({
  type,
  payload,
  title,
  filterType,
}: {
  type: string;
  payload?: Partial<IBlockData>;
  title?: string;
  filterType: string | undefined;
}) {
  const block = BlockManager.getBlockByType(type);

  return (
    <div className={styles.blockItem}>
      <BlockAvatarWrapper type={type} payload={payload}>
        <div className={styles.blockItemContainer}>
          <IconFont
            style={{ fontSize: 20 }}
            iconName={getIconNameByBlockType(type)}
          />
          <Typography.Text style={{ marginTop: 5 }}>
            {title || block?.name}
          </Typography.Text>
        </div>
      </BlockAvatarWrapper>
    </div>
  );
}
