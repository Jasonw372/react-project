import classnames from 'classnames'
import React, {useState, useRef, useEffect, MouseEventHandler, useContext} from 'react'

import styles from './index.module.scss'
import {message, Popconfirm} from "antd";
import {PlaygroundContext} from "../../PlaygroundContext.tsx";

export interface FileNameItemProps {
  value: string
  activated: boolean,
  readonly: boolean,
  onClick: () => void,
  onEditComplete: (name: string) => void,
  creating: boolean,
  onRemove: () => void,
}

export const FileNameItem: React.FC<FileNameItemProps> = (props) => {
  const {
    value,
    activated = false,
    creating,
    readonly,
    onClick,
    onEditComplete,
    onRemove,
  } = props
  const {files, checkName} = useContext(PlaygroundContext)
  const [name, setName] = useState(value)
  const [editing, setEditing] = useState(creating)
  const inputRef = useRef<HTMLInputElement>(null)
  const oldName = useRef(value)
  const handleDoubleClick = () => {
    setEditing(true)
    setTimeout(() => {
      inputRef?.current?.focus()
    }, 0)
  }

  const handleInputBlur = () => {
    if (checkName(name, oldName.current)) {
      message.error("文件重名，请重试")
      return
    }
    setEditing(false)
    oldName.current = name
    onEditComplete(name)
  }

  useEffect(() => {
    if (creating) {
      inputRef?.current?.focus()
    }
  }, [creating]);

  return (
    <div
      className={classnames(styles['tab-item'], activated ? styles.actived : null)}
      onClick={onClick}
    >
      {
        editing ? (
          <input
            ref={inputRef}
            className={styles['tabs-item-input']}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleInputBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleInputBlur()
              }
            }
            }
          />
        ) : (
          <>
            <span onDoubleClick={!readonly ? handleDoubleClick : () => {
            }}>{name}</span>
            {
              !readonly ? (
                <Popconfirm
                  title="确认删除该文件吗？"
                  okText="确定"
                  cancelText="取消"
                  onConfirm={(e) => {
                    e?.stopPropagation();
                    onRemove()
                  }}
                >
            <span style={{marginLeft: 5, display: 'flex'}}>
                <svg width='12' height='12' viewBox='0 0 24 24'>
                    <line stroke='#999' x1='18' y1='6' x2='6' y2='18'></line>
                    <line stroke='#999' x1='6' y1='6' x2='18' y2='18'></line>
                </svg>
            </span>
                </Popconfirm>
              ) : null
            }
          </>
        )
      }
    </div>
  )
}
