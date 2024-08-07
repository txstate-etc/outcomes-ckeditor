import TablePropertyCommand from './BaseTablePropertyCommand'

export default class TableBorderCommand extends TablePropertyCommand {
  constructor(editor) {
    super(editor, 'border')
  }
}
