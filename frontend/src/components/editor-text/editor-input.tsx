import {
    ContentEditableEvent,
    createButton,
    Editor,
    EditorProvider,
    Toolbar,
} from 'react-simple-wysiwyg'
import './editor-input.scss'
import { sanitizeText, sanitizeUrl } from '../../utils/sanitizers.ts';

type EditorInputProps = {
    value: string
    onChange: (value: string) => void
}

export default function EditorInput({ onChange, value }: EditorInputProps) {
    function handleChangeElement(e: ContentEditableEvent) {
        onChange(sanitizeText(e.target.value, true))
    }

    const BtnLinkCustom = createButton(
        'Вставить ссылку',
        '🔗',
        ({ $selection }) => {
            if ($selection?.nodeName === 'A') {
                document.execCommand('unlink')
            } else {
                // eslint-disable-next-line no-alert
                document.execCommand(
                    'createLink',
                    false,
                    sanitizeUrl(prompt('URL', '')) || undefined
                )
            }
        }
    )

    return (
        <div className='customEditor'>
            <EditorProvider>
                <Editor value={value} onChange={handleChangeElement}>
                    <Toolbar>
                        <span className='rsw-link-title'>
                            Вставить ссылку <BtnLinkCustom />
                        </span>
                    </Toolbar>
                </Editor>
            </EditorProvider>
        </div>
    )
}
