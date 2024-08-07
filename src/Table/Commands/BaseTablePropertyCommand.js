import { Command } from 'ckeditor5/src/core'
import { getSelectionAffectedTable } from '../../utils/helpers'

export default class TablePropertyCommand extends Command {
  constructor(editor, attributeName) {
    super(editor)

    this.attributeName = attributeName
  }

  refresh () {
    const model = this.editor.model
    const table = getSelectionAffectedTable(model.document.selection)
    const value = this._getAttribute(table)

    this.isEnabled = true
    this.value = value
  }

  execute( options = {} ) {
    const { value, batch, oldValue } = options
    const model = this.editor.model
    const table = getSelectionAffectedTable(model.document.selection)

    const attribute = this._getAttribute(table)
    const attributes = attribute ? attribute.trim().split(' ') : []

    if (attributes.includes(value)) return
    
    const oldIndex = attributes.indexOf(oldValue)
    
    if (oldIndex > -1) attributes.splice(oldIndex, 1)

    model.enqueueChange( batch, writer => {
        writer.setAttribute(this.attributeName, [...attributes, value].join(' '), table)
    })
  }

  _getAttribute (table) {
    if (!table) return
    return table.getAttribute(this.attributeName)
  }
}
