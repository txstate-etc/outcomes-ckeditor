import { Command } from 'ckeditor5/src/core'
import { updateNumericAttribute } from '@ckeditor/ckeditor5-table/src/utils/common'
import { getHorizontallyOverlappingCells, getVerticallyOverlappingCells, splitHorizontally, splitVertically } from '@ckeditor/ckeditor5-table/src/utils/structure'
import { getSelectionAffectedTable } from '../../utils/helpers'

 export default class TableHeaderCommand extends Command {
  constructor(editor, defaultValue) {
    super(editor, 'class', defaultValue);
  }

  refresh () {
    const model = this.editor.model
    const table = getSelectionAffectedTable(model.document.selection)

    if (!table) return

    const row = table.getAttribute('headingRows')
    const column = table.getAttribute('headingColumns')

    this.isEnabled = true

    if (row && column) this.value = 'both'
    else if (row) this.value = 'row'
    else if (column) this.value = 'column'
    else this.value = 'none'
  }

   execute(options = {}) {
     if (options.value === this.value) {
       return
     }

     const { value, batch } = options

     this.value = value
 
     const model = this.editor.model
     const table = getSelectionAffectedTable(model.document.selection)
 
     const headingColumnsToSet = ['both', 'column'].includes(value) ? 1 : 0
     const headingRowsToSet = ['both', 'row'].includes(value) ? 1 : 0
     const currentHeadingRows = table.getAttribute( 'headingRows' ) || 0
 
     model.enqueueChange(batch, writer => {
       if (headingColumnsToSet) {
         // Changing heading columns requires to check if any of a heading cell is overlapping horizontally the table head.
         // Any table cell that has a colspan attribute > 1 will not exceed the table head so we need to fix it in columns before.
         const horizontalOverlappingCells = getHorizontallyOverlappingCells( table, headingColumnsToSet )
 
         for (const { cell, column } of horizontalOverlappingCells) {
           splitVertically(cell, column, headingColumnsToSet, writer)
         }
       }

       if (headingRowsToSet) {
        // Changing heading rows requires to check if any of a heading cell is overlapping vertically the table head.
				// Any table cell that has a rowspan attribute > 1 will not exceed the table head so we need to fix it in rows below.
				const startRow = headingRowsToSet > currentHeadingRows ? currentHeadingRows : 0
				const overlappingCells = getVerticallyOverlappingCells(table, headingRowsToSet, startRow)

				for ( const { cell } of overlappingCells ) {
					splitHorizontally(cell, headingRowsToSet, writer)
				}
       }
 
       updateNumericAttribute( 'headingColumns', headingColumnsToSet, table, writer, 0 )
       updateNumericAttribute( 'headingRows', headingRowsToSet, table, writer, 0 )
     })
   }
 }
 