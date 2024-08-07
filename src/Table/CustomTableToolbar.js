import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import { createDropdown, SwitchButtonView, addListToDropdown, Model } from 'ckeditor5/src/ui'
import { Collection } from 'ckeditor5/src/utils'
import tableColumnIcon from '../icons/table-column.svg'
import tableRowIcon from '../icons/table-row.svg'

export default class CustomTableToolbar extends Plugin {
  init () {
    // Initialize your plugin here.
    // The editor instance which loaded this plugin.
    const editor = this.editor
    const contentLanguageDirection = editor.locale.contentLanguageDirection;
		const isContentLtr = contentLanguageDirection === 'ltr';
    const t = editor.t

    editor.ui.componentFactory.add( 'customTableColumn', locale => {
			const options = [
				{
					type: 'button',
					model: {
						commandName: isContentLtr ? 'insertTableColumnLeft' : 'insertTableColumnRight',
						label: t( 'Insert column left' )
					}
				},
				{
					type: 'button',
					model: {
						commandName: isContentLtr ? 'insertTableColumnRight' : 'insertTableColumnLeft',
						label: t( 'Insert column right' )
					}
				},
				{
					type: 'button',
					model: {
						commandName: 'removeTableColumn',
						label: t( 'Delete column' )
					}
				},
				{
					type: 'button',
					model: {
						commandName: 'selectTableColumn',
						label: t( 'Select column' )
					}
				}
			];

			return this._prepareDropdown( t( 'Column' ), tableColumnIcon, options, locale );
		} );

		editor.ui.componentFactory.add( 'customTableRow', locale => {
			const options = [
				{
					type: 'button',
					model: {
						commandName: 'insertTableRowAbove',
						label: t( 'Insert row above' )
					}
				},
				{
					type: 'button',
					model: {
						commandName: 'insertTableRowBelow',
						label: t( 'Insert row below' )
					}
				},
				{
					type: 'button',
					model: {
						commandName: 'removeTableRow',
						label: t( 'Delete row' )
					}
				},
				{
					type: 'button',
					model: {
						commandName: 'selectTableRow',
						label: t( 'Select row' )
					}
				}
			];

			return this._prepareDropdown( t( 'Row' ), tableRowIcon, options, locale );
		} );
  }

  _prepareDropdown( label, icon, options, locale ) {
		const editor = this.editor;
		const dropdownView = createDropdown( locale );
		const commands = this._fillDropdownWithListOptions( dropdownView, options );

		// Decorate dropdown's button.
		dropdownView.buttonView.set( {
			label,
			icon,
			tooltip: true
		} );

		// Make dropdown button disabled when all options are disabled.
		dropdownView.bind( 'isEnabled' ).toMany( commands, 'isEnabled', ( ...areEnabled ) => {
			return areEnabled.some( isEnabled => isEnabled );
		} );

		this.listenTo( dropdownView, 'execute', evt => {
			editor.execute( evt.source.commandName );

			// Toggling a switch button view should not move the focus to the editable.
			if ( !( evt.source instanceof SwitchButtonView ) ) {
				editor.editing.view.focus();
			}
		} );

		return dropdownView;
	}

  _fillDropdownWithListOptions( dropdownView, options ) {
		const editor = this.editor;
		const commands = [];
		const itemDefinitions = new Collection();

		for ( const option of options ) {
			addListOption( option, editor, commands, itemDefinitions );
		}

		addListToDropdown( dropdownView, itemDefinitions );

		return commands;
	}

}


function addListOption( option, editor, commands, itemDefinitions ) {
  const model = option.model = new Model( option.model );
  const { commandName, bindIsOn } = option.model;

  if ( option.type === 'button' || option.type === 'switchbutton' ) {
    const command = editor.commands.get( commandName );

    commands.push( command );

    model.set( { commandName } );

    model.bind( 'isEnabled' ).to( command );

    if ( bindIsOn ) {
      model.bind( 'isOn' ).to( command, 'value' );
    }
  }

  model.set( {
    withText: true
  } );

  itemDefinitions.add( option );
}
